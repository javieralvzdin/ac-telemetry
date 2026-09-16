import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { useT } from '../../i18n/strings.js';
import './Header.css';

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
          🇬🇧
        </button>
        <button
          type="button"
          className={`site-header__lang-btn${lang === 'es' ? ' is-active' : ''}`}
          onClick={() => setLang('es')}
          aria-label="Español"
          aria-pressed={lang === 'es'}
        >
          🇪🇸
        </button>
      </div>
    </header>
  );
}
