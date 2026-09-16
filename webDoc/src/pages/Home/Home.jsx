import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import ScrollExpand from '../../components/effects/ScrollExpand.jsx';
import WarpImage from '../../components/effects/WarpImage.jsx';
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
  const docsSectionRef = useRef(null);
  const navigate = useNavigate();

  const goToSessionLog = (event) => {
    event.preventDefault();
    navigate('/docs/session-log');
    docsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="home">
      <a
        href="https://github.com/javieralvzdin/ac-telemetry"
        target="_blank"
        rel="noopener noreferrer"
        className="home__github-card"
      >
        <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        <span className="home__github-card-text">
          <span className="home__github-card-label">View source on GitHub</span>
          <span className="home__github-card-repo">javieralvzdin/ac-telemetry</span>
        </span>
      </a>

      <div className="home__stack-row">
        <span className="home__stack-badge-sm">
          <WarpImage src="/docs-assets/stack/react.png" alt="React" />
        </span>
        <span className="home__stack-badge-sm">
          <WarpImage src="/docs-assets/stack/threejs.png?v=3" alt="Three.js" />
        </span>
        <span className="home__stack-badge-sm">
          <WarpImage src="/docs-assets/stack/influxdb.png" alt="InfluxDB" />
        </span>
        <span className="home__stack-badge-sm">
          <WarpImage src="/docs-assets/stack/grafana.png?v=2" alt="Grafana" />
        </span>
      </div>

      <ScrollExpand
        src="/docs-assets/showroom.jpg"
        alt="Assetto Corsa showroom"
        scrollHint="Scroll"
        startHeight={94}
        endHeight={97}
        useWindowScroll
      >
        <div className="home__logo-card">
          <img src="/docs-assets/assetto-corsa-logo.png" alt="Assetto Corsa" className="home__logo" />
          <a href="/docs/session-log" className="home__session-cta" onClick={goToSessionLog}>
            <span className="pill-live-dot" aria-hidden="true" />
            View Session Log
          </a>
        </div>
      </ScrollExpand>

      <section className="docs-layout" ref={docsSectionRef}>
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
