import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { flattenNav } from '../../data/nav.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useT } from '../../i18n/strings.js';
import './SearchBox.css';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = useT();
  const index = useMemo(
    () =>
      new Fuse(
        flattenNav().map((page) => ({ slug: page.slug, title: page.title[lang], description: page.description[lang] })),
        { keys: ['title', 'description'], threshold: 0.35 }
      ),
    [lang]
  );
  const results = useMemo(() => (query.trim() ? index.search(query).map((r) => r.item) : []), [index, query]);

  return (
    <div className="doc-search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAriaLabel}
        className="doc-search__input"
      />
      {results.length > 0 && (
        <ul className="doc-search__results">
          {results.map((page) => (
            <li key={page.slug}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/docs/${page.slug}`);
                  setQuery('');
                }}
              >
                {page.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
