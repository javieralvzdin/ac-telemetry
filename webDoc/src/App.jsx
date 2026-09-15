import { Routes, Route, Navigate } from 'react-router-dom';
import LightPillar from './components/background/LightPillar.jsx';
import Header from './components/layout/Header.jsx';
import Home from './pages/Home/Home.jsx';
import { flattenNav } from './data/nav.js';

export default function App() {
  return (
    <>
      <div className="app-background" aria-hidden="true">
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
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Navigate to={`/docs/${flattenNav()[0].slug}`} replace />} />
          <Route path="/docs/:slug" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
