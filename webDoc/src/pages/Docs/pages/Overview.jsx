import { Link } from 'react-router-dom';

export default function Overview() {
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
      <p className="docs-layout__pending">
        [contenido pendiente: ampliar con el detalle del PDF fuente cuando se extraiga]
      </p>
    </>
  );
}
