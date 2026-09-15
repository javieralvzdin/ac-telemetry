export default function Installation() {
  return (
    <>
      <h1>Installation &amp; Usage</h1>
      <p>
        <strong>Requirements:</strong> Windows, Assetto Corsa, Docker Desktop, Python 3.x. This project only works
        locally — Assetto Corsa and this pipeline must run on the same machine.
      </p>
      <ol>
        <li>
          <strong>Configure your secrets</strong> — copy <code>.env.example</code> to <code>.env</code> and set
          your own values (InfluxDB token, InfluxDB/Grafana admin passwords). <code>.env</code> is git-ignored —
          never commit it.
        </li>
        <li>
          <strong>Stand up the infrastructure</strong> — from the project's root folder, run{' '}
          <code>docker compose up -d</code>. This downloads and starts InfluxDB and Grafana in the background,
          auto-configured from your <code>.env</code> values.
        </li>
        <li>
          <strong>Install Python dependencies</strong> — <code>pip install -r requirements.txt</code>.
        </li>
        <li>
          <strong>Hit the track</strong> — open Assetto Corsa (or Content Manager) and enter a practice session or
          race. You must be in the car for the game to start emitting telemetry.
        </li>
        <li>
          <strong>Launch the data bridge</strong> — run <code>python dashboard.py</code>. It will ask for{' '}
          <strong>circuito</strong> and <strong>coche</strong> (press Enter to skip either). If everything goes
          well, you'll see data being sent in the console.
        </li>
      </ol>
      <p>
        Then open <code>http://localhost:3000</code> to view the dashboard immediately — no Grafana login required.
      </p>
      <p>
        To shut down: close the Python console (Ctrl+C), then run <code>docker compose down</code> (data and
        configuration are preserved in local volumes).
      </p>
    </>
  );
}
