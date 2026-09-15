export default function Troubleshooting() {
  return (
    <>
      <h1>Troubleshooting</h1>
      <ul>
        <li>
          <strong>Grafana shows "No data"</strong> — make sure the Python script is running, that you're in the car
          in Assetto Corsa, and that Grafana's time range (top right) is set to "Last 5 minutes" with auto-refresh
          enabled.
        </li>
        <li>
          <strong>"Port already allocated" when running <code>docker compose</code></strong> — stop and delete old
          InfluxDB/Grafana containers from Docker Desktop before launching new ones.
        </li>
        <li>
          <strong><code>dashboard.py</code> exits immediately</strong>, missing <code>INFLUXDB_TOKEN</code> /{' '}
          <code>INFLUXDB_ORG</code> / <code>INFLUXDB_BUCKET</code> — you skipped{' '}
          <code>cp .env.example .env</code> and filling it in.
        </li>
        <li>
          <strong><code>python dashboard.py</code> fails to load <code>ac_telemetry.dll</code></strong> — run it
          from the repo root (the script resolves the DLL next to itself), and make sure you're on Windows.
        </li>
        <li>
          <strong>Session name in Grafana looks like a random id</strong> instead of{' '}
          <code>&lt;circuito&gt;_&lt;coche&gt;_...</code> — you pressed Enter without typing anything when
          prompted. Re-run <code>dashboard.py</code> and fill in circuito/coche.
        </li>
      </ul>
    </>
  );
}
