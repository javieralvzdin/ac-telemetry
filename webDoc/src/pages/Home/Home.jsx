import { Link, useParams } from 'react-router-dom';
import ScrollExpand from '../../components/effects/ScrollExpand.jsx';
import Sidebar from '../Docs/Sidebar.jsx';
import SearchBox from '../Docs/SearchBox.jsx';
import { flattenNav } from '../../data/nav.js';
import { docPages } from '../../data/docPages.js';
import './Home.css';

export default function Home() {
  const { slug } = useParams();
  const defaultSlug = flattenNav()[0].slug;
  const activeSlug = slug && docPages[slug] ? slug : defaultSlug;
  const ActivePage = docPages[activeSlug];

  return (
    <div className="home">
      <ScrollExpand
        src="/docs-assets/showroom.jpg"
        alt="Assetto Corsa showroom"
        title="Assetto Corsa Telemetry"
        scrollHint="Scroll"
        useWindowScroll
      >
        <div className="home__logo-card">
          <img src="/docs-assets/assetto-corsa-logo.png" alt="Assetto Corsa" className="home__logo" />
          <Link to="/docs/session-log" className="home__session-cta">
            <span className="pill-live-dot" aria-hidden="true" />
            View Session Log
          </Link>
        </div>
      </ScrollExpand>

      <section className="docs-layout">
        <aside className="docs-layout__sidebar">
          <SearchBox />
          <Sidebar />
        </aside>
        <article className="docs-layout__content">
          <ActivePage />
        </article>
      </section>
    </div>
  );
}
