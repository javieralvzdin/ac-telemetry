import FlexCarousel from './FlexCarousel.jsx';
import './PhotoCarousel.css';

const photoModules = import.meta.glob('/mediaPhotos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const pad = (value) => String(value).padStart(2, '0');

const humanize = (slug) =>
  slug
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => (/^[a-z]{1,3}$/i.test(word) && !/^(de|la|el)$/i.test(word) ? word.toUpperCase() : word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Assetto Corsa names screenshots "Screenshot_<car>_<track>_<d-m-y-h-m-s>", with the
// year counted from 1900 and Kunos content prefixed with "ks_".
const describe = (fileName) => {
  const name = fileName.replace(/\.[^.]+$/, '');
  const match = name.match(/^Screenshot_(?:ks_)?(.+?)_(?:ks_)?([a-z]+(?:_[a-z]+)*)_(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)$/i);
  if (!match) {
    const text = humanize(name);
    return { alt: text, title: text };
  }
  const [, car, track, day, month, year, hour, minute] = match;
  const carName = humanize(car);
  const trackName = humanize(track);
  const date = `${pad(day)}/${pad(month)}/${Number(year) + 1900} · ${pad(hour)}:${pad(minute)}`;
  return {
    alt: `${carName} · ${trackName} · ${date}`,
    title: `${carName} · ${trackName}`,
    subtitle: date,
  };
};

// Daylight shots; every other photo is dusk/night. Used to interleave both sets
// instead of showing all day photos first.
const DAY_PHOTOS = new Set([
  'Screenshot_ks_porsche_911_rsr_2017_ks_barcelona_3-9-126-12-47-25.jpg',
  'Screenshot_ks_porsche_911_rsr_2017_ks_barcelona_3-9-126-12-49-47.jpg',
  'Screenshot_ks_porsche_911_rsr_2017_ks_barcelona_3-9-126-12-49-59.jpg',
  'Screenshot_ks_porsche_911_rsr_2017_ks_barcelona_3-9-126-12-50-38.jpg',
  'Screenshot_ks_porsche_911_rsr_2017_ks_barcelona_3-9-126-12-52-28.jpg',
]);

// Spreads the smaller set evenly through the larger one, so neither repeats more than needed.
const interleave = (a, b) => {
  const [few, many] = a.length <= b.length ? [a, b] : [b, a];
  const total = few.length + many.length;
  const slots = new Set(few.map((_, i) => Math.round((i * total) / few.length)));
  let f = 0;
  let m = 0;
  return Array.from({ length: total }, (_, i) => (slots.has(i) ? few[f++] : many[m++]));
};

const sortedPaths = Object.keys(photoModules).sort();
const isDay = (path) => DAY_PHOTOS.has(path.split('/').pop());

const photos = interleave(sortedPaths.filter(isDay), sortedPaths.filter((path) => !isDay(path))).map((path) => ({
  src: photoModules[path],
  ...describe(path.split('/').pop()),
}));

export default function PhotoCarousel() {
  if (!photos.length) return null;

  return (
    <section className="photo-carousel" aria-label="Galería de capturas">
      <div className="photo-carousel__stage">
        <FlexCarousel
          items={photos}
          preset="liquid"
          intro="none"
          cardHeight={0.5}
          gap={12}
          squeeze={0.2}
          focusOnClick
          captions
        />
      </div>
    </section>
  );
}
