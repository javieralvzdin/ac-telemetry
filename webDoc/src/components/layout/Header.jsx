import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        <span className="site-header__brand-text">AC Telemetry</span>
        <span className="site-header__logo-chip">
          <img src="/docs-assets/assetto-corsa-logo.png" alt="Assetto Corsa" className="site-header__logo" />
        </span>
      </Link>
    </header>
  );
}
