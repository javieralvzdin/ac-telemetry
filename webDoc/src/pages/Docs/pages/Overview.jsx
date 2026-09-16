import { Link } from 'react-router-dom';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function Overview() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Resumen</h1>
        <p>
          AC Telemetry es un pipeline de telemetría en tiempo real para Assetto Corsa. Extrae datos directamente del
          motor de físicas del simulador usando C, los procesa con Python y los visualiza en tiempo real en un panel
          profesional de Grafana usando InfluxDB como base de datos de series temporales.
        </p>
        <p>
          Todo el entorno de base de datos y visualización está en contenedores con Docker, así que está pensado
          para funcionar sin complicaciones una vez configurado.
        </p>
        <p>
          Este proyecto solo funciona en local: Assetto Corsa y el pipeline deben ejecutarse en la misma máquina, ya
          que el puente en C se comunica con <code>127.0.0.1</code>, no con un servidor remoto.
        </p>
        <p>Por dónde seguir:</p>
        <ul>
          <li>
            <Link to="/docs/architecture">Arquitectura del sistema</Link> — las tres capas que hacen que esto
            funcione.
          </li>
          <li>
            <Link to="/docs/installation">Instalación y uso</Link> — ponlo en marcha de principio a fin.
          </li>
          <li>
            <Link to="/docs/troubleshooting">Solución de problemas</Link> — arreglos para los problemas más
            comunes.
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      <h1>Overview</h1>
      <p>
        AC Telemetry is a real-time telemetry pipeline for Assetto Corsa. It extracts data directly from the
        simulator's physics engine using C, processes it via Python, and visualizes it in real time on a
        professional Grafana dashboard using InfluxDB as a time-series database.
      </p>
      <p>
        The entire database and visualization environment is containerized with Docker, so it's meant to be
        plug-and-play once configured.
      </p>
      <p>
        This project only works locally: Assetto Corsa and the pipeline must run on the same machine, since the C
        bridge talks to <code>127.0.0.1</code>, not a remote server.
      </p>
      <p>Where to go next:</p>
      <ul>
        <li>
          <Link to="/docs/architecture">System Architecture</Link> — the three layers that make this work.
        </li>
        <li>
          <Link to="/docs/installation">Installation &amp; Usage</Link> — get it running end to end.
        </li>
        <li>
          <Link to="/docs/troubleshooting">Troubleshooting</Link> — fixes for the most common issues.
        </li>
      </ul>
    </>
  );
}
