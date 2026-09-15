import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        <img src="/docs-assets/assetto-corsa-logo.png" alt="" className="site-header__logo" />
        AC Telemetry
      </Link>
      <nav className="site-header__nav">
        <Link to="/docs">Docs</Link>
      </nav>
    </header>
  );
}
