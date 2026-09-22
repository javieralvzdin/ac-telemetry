import { Link } from 'react-router-dom';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function Architecture() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Arquitectura del sistema</h1>
        <p>El sistema consta de tres capas principales:</p>
        <ol>
          <li>
            <strong>Adquisición de datos (C):</strong> una librería compilada (<code>ac_telemetry.dll</code>) se
            comunica mediante el protocolo de telemetría UDP de Assetto Corsa para extraer la telemetría en bruto
            del juego. Ver <Link to="/docs/hardware-bridge">Puente de hardware</Link>.
          </li>
          <li>
            <strong>Procesamiento (Python):</strong> el script <code>dashboard.py</code> actúa de puente. Usa la
            librería <code>ctypes</code> para interactuar con la DLL en C, procesa variables (RPM, marchas, volante,
            etc.) y las inyecta en la base de datos. Ver{' '}
            <Link to="/docs/data-pipeline">Pipeline de datos</Link>.
          </li>
          <li>
            <strong>Almacenamiento y visualización (Docker):</strong> InfluxDB 2.7 almacena los datos en series
            temporales con alta frecuencia de escritura, y Grafana lee de InfluxDB y los muestra en un panel
            preconfigurado. Ver{' '}
            <Link to="/docs/storage-visualization">Almacenamiento y visualización</Link>.
          </li>
        </ol>
      </>
    );
  }

  return (
    <>
      <h1>System Architecture</h1>
      <p>The system consists of three main layers:</p>
      <ol>
        <li>
          <strong>Data acquisition (C):</strong> a compiled library (<code>ac_telemetry.dll</code>) communicates via
          Assetto Corsa's UDP telemetry protocol to extract raw telemetry from the game. See{' '}
          <Link to="/docs/hardware-bridge">Hardware Bridge</Link>.
        </li>
        <li>
          <strong>Processing (Python):</strong> the <code>dashboard.py</code> script acts as a bridge. It uses the{' '}
          <code>ctypes</code> library to interact with the C DLL, processes variables (RPM, gears, steering wheel,
          etc.), and injects them into the database. See <Link to="/docs/data-pipeline">Data Pipeline</Link>.
        </li>
        <li>
          <strong>Storage and visualization (Docker):</strong> InfluxDB 2.7 stores data in time series with high
          write frequency, and Grafana reads from InfluxDB and displays it on a pre-configured dashboard. See{' '}
          <Link to="/docs/storage-visualization">Storage &amp; Visualization</Link>.
        </li>
      </ol>
    </>
  );
}
