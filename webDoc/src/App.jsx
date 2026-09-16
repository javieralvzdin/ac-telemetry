import { Routes, Route, Navigate } from 'react-router-dom';
import LightPillar from './components/background/LightPillar.jsx';
import Header from './components/layout/Header.jsx';
import Home from './pages/Home/Home.jsx';
import { flattenNav } from './data/nav.js';
import { LanguageProvider } from './i18n/LanguageContext.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <div className="app-background app-background--center" aria-hidden="true">
        <LightPillar
          topColor="#B91C1C"
          bottomColor="#000000"
          intensity={0.6}
          glowAmount={0.003}
          rotationSpeed={0.15}
          interactive={false}
          quality="high"
        />
      </div>
      <div className="app-background app-background--left" aria-hidden="true">
        <LightPillar
          topColor="#B91C1C"
          bottomColor="#000000"
          intensity={0.5}
          glowAmount={0.003}
          rotationSpeed={0.11}
          pillarWidth={2.2}
          interactive={false}
          quality="medium"
        />
      </div>
      <div className="app-background app-background--right" aria-hidden="true">
        <LightPillar
          topColor="#B91C1C"
          bottomColor="#000000"
          intensity={0.5}
          glowAmount={0.003}
          rotationSpeed={0.19}
          pillarWidth={2.2}
          interactive={false}
          quality="medium"
        />
      </div>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Navigate to={`/docs/${flattenNav()[0].slug}`} replace />} />
          <Route path="/docs/:slug" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </LanguageProvider>
  );
}
