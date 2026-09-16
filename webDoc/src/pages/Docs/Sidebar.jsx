import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { nav } from '../../data/nav.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useT } from '../../i18n/strings.js';
import './Sidebar.css';

const EASE = 'power2.out';

export default function Sidebar() {
  const location = useLocation();
  const { lang } = useLanguage();
  const t = useT();
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  const flatPages = nav.flatMap((section) => section.pages);
  const activeIndex = flatPages.findIndex((page) => location.pathname === `/docs/${page.slug}`);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 6, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.9, ease: EASE, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 4), duration: 0.9, ease: EASE, overwrite: 'auto' }, 0);
        if (hoverLabel) tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.9, ease: EASE, overwrite: 'auto' }, 0);
        tlRefs.current[index] = tl;

        if (index === activeIndex) tl.progress(1);
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }
    return () => window.removeEventListener('resize', layout);
  }, [flatPages.length, activeIndex, lang]);

  const handleEnter = (i) => {
    if (i === activeIndex) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.55, ease: EASE, overwrite: 'auto' });
  };

  const handleLeave = (i) => {
    if (i === activeIndex) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.5, ease: EASE, overwrite: 'auto' });
  };

  let flatIndex = -1;

  return (
    <nav aria-label={t.docsNavAriaLabel} className="docs-sidebar">
      {nav.map((section) => (
        <div
          key={section.title.en}
          className={`docs-sidebar__section${section.featured ? ' docs-sidebar__section--featured' : ''}`}
        >
          <p className="docs-sidebar__title">{section.title[lang]}</p>
          <ul className="pill-list">
            {section.pages.map((page) => {
              flatIndex += 1;
              const index = flatIndex;
              const href = `/docs/${page.slug}`;
              const isActive = index === activeIndex;
              const label = page.title[lang];
              return (
                <li key={page.slug}>
                  <Link
                    to={href}
                    className={`pill${section.featured ? ' pill--featured' : ''}${isActive ? ' is-active' : ''}`}
                    onMouseEnter={() => handleEnter(index)}
                    onMouseLeave={() => handleLeave(index)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={(el) => {
                        circleRefs.current[index] = el;
                      }}
                    />
                    <span className="label-stack">
                      <span className="pill-label">
                        {section.featured ? <span className="pill-live-dot" aria-hidden="true" /> : null}
                        {label}
                      </span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
