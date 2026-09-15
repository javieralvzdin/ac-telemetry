import { Link } from 'react-router-dom';

export default function Architecture() {
  return (
    <>
      <h1>System Architecture</h1>
      <p>The system consists of three main layers:</p>
      <ol>
        <li>
          <strong>Data acquisition (C)</strong> — a compiled library (<code>ac_telemetry.dll</code>) communicates via
          Assetto Corsa's UDP telemetry protocol to extract raw telemetry from the game. See{' '}
          <Link to="/docs/hardware-bridge">Hardware Bridge</Link>.
        </li>
        <li>
          <strong>Processing (Python)</strong> — the <code>dashboard.py</code> script acts as a bridge. It uses the{' '}
          <code>ctypes</code> library to interact with the C DLL, processes variables (RPM, gears, steering wheel,
          etc.), and injects them into the database. See <Link to="/docs/data-pipeline">Data Pipeline</Link>.
        </li>
        <li>
          <strong>Storage and visualization (Docker)</strong> — InfluxDB 2.7 stores data in time series with high
          write frequency, and Grafana reads from InfluxDB and displays it on a pre-configured dashboard. See{' '}
          <Link to="/docs/storage-visualization">Storage &amp; Visualization</Link>.
        </li>
      </ol>
      <p className="docs-layout__pending">
        [contenido pendiente: diagrama de arquitectura del PDF, si existe uno]
      </p>
    </>
  );
}
