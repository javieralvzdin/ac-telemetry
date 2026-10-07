import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useT } from '../../i18n/strings.js';
import './Header.css';

// Inline SVG flags: Windows doesn't render flag emojis (shows "GB"/"ES" instead).
function FlagGB() {
  return (
    <svg className="site-header__flag" viewBox="0 0 60 60" aria-hidden="true">
      <clipPath id="flag-gb-clip">
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath="url(#flag-gb-clip)">
        <rect x="-15" width="90" height="60" fill="#012169" />
        <path d="M-15 0 75 60M75 0-15 60" stroke="#fff" strokeWidth="12" />
        <path d="M-15 0 75 60M75 0-15 60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v60M-15 30h90" stroke="#fff" strokeWidth="20" />
        <path d="M30 0v60M-15 30h90" stroke="#C8102E" strokeWidth="12" />
      </g>
    </svg>
  );
}

function FlagES() {
  return (
    <svg className="site-header__flag" viewBox="0 0 60 60" aria-hidden="true">
      <clipPath id="flag-es-clip">
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath="url(#flag-es-clip)">
        <rect width="60" height="60" fill="#AA151B" />
        <rect y="15" width="60" height="30" fill="#F1BF00" />
      </g>
    </svg>
  );
}

export default function Header() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <header className="site-header">
      <span className="site-header__spacer" aria-hidden="true" />
      <Link to="/" className="site-header__brand">
        <span className="site-header__brand-text">{t.brand}</span>
        <span className="site-header__logo-chip">
          <img src="/docs-assets/assetto-corsa-logo.png" alt="Assetto Corsa" className="site-header__logo" />
        </span>
      </Link>
      <div className="site-header__lang" role="group" aria-label={t.langSwitchAriaLabel}>
        <button
          type="button"
          className={`site-header__lang-btn${lang === 'en' ? ' is-active' : ''}`}
          onClick={() => setLang('en')}
          aria-label="English"
          aria-pressed={lang === 'en'}
        >
          <FlagGB />
        </button>
        <button
          type="button"
          className={`site-header__lang-btn${lang === 'es' ? ' is-active' : ''}`}
          onClick={() => setLang('es')}
          aria-label="Español"
          aria-pressed={lang === 'es'}
        >
          <FlagES />
        </button>
      </div>
    </header>
  );
}
