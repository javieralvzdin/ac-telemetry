import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function StorageVisualization() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Almacenamiento y visualización</h1>
        <ul>
          <li>
            <strong>InfluxDB 2.7</strong> almacena la telemetría en series temporales con alta frecuencia de
            escritura.
          </li>
          <li>
            <strong>Grafana</strong> lee de InfluxDB y lo muestra en un panel preconfigurado.
          </li>
        </ul>
        <p>
          Ambos se aprovisionan automáticamente con Docker Compose usando los valores de tu archivo{' '}
          <code>.env</code>, sin necesidad de configurar el panel a mano.
        </p>
        <p>
          El panel se puede ver de forma anónima (solo lectura) en <code>http://localhost:3000</code>, sin iniciar
          sesión solo para verlo. Para editar el panel o su configuración, inicia sesión con el{' '}
          <code>GRAFANA_ADMIN_USER</code> / <code>GRAFANA_ADMIN_PASSWORD</code> que pusiste en <code>.env</code>.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Storage &amp; Visualization</h1>
      <ul>
        <li>
          <strong>InfluxDB 2.7</strong> stores telemetry in time series with high write frequency.
        </li>
        <li>
          <strong>Grafana</strong> reads from InfluxDB and displays it on a pre-configured dashboard.
        </li>
      </ul>
      <p>
        Both are provisioned automatically by Docker Compose using the values from your <code>.env</code> file, with
        no manual dashboard setup needed.
      </p>
      <p>
        The dashboard is viewable anonymously (read-only) at <code>http://localhost:3000</code>, with no login
        required just to watch it. To edit the dashboard or its config, log in with the{' '}
        <code>GRAFANA_ADMIN_USER</code> / <code>GRAFANA_ADMIN_PASSWORD</code> you set in <code>.env</code>.
      </p>
    </>
  );
}
