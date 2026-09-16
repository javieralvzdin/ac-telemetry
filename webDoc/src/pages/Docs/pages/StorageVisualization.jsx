export default function StorageVisualization() {
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
        Both are provisioned automatically by Docker Compose using the values from your <code>.env</code> file — no
        manual dashboard setup is needed.
      </p>
      <p>
        The dashboard is viewable anonymously (read-only) at <code>http://localhost:3000</code> — no login required
        just to watch it. To edit the dashboard or its config, log in with the{' '}
        <code>GRAFANA_ADMIN_USER</code> / <code>GRAFANA_ADMIN_PASSWORD</code> you set in <code>.env</code>.
      </p>
    </>
  );
}
