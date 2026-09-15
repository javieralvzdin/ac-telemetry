import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { flattenNav } from '../../data/nav.js';
import './SearchBox.css';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const index = useMemo(
    () => new Fuse(flattenNav(), { keys: ['title', 'description'], threshold: 0.35 }),
    []
  );
  const results = useMemo(() => (query.trim() ? index.search(query).map((r) => r.item) : []), [index, query]);

  return (
    <div className="doc-search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs..."
        aria-label="Search documentation"
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
