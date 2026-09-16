export default function DataPipeline() {
  return (
    <>
      <h1>Data Pipeline (Python)</h1>
      <p>
        <code>dashboard.py</code> is the bridge between the C telemetry layer and storage. It uses Python's{' '}
        <code>ctypes</code> library to call into <code>ac_telemetry.dll</code>, reads variables like RPM, gear, and
        steering angle, and writes them into InfluxDB.
      </p>
      <p>
        When launched, it asks for <strong>circuito</strong> (circuit) and <strong>coche</strong> (car) — type them
        in, or press Enter to skip and get a generic session id instead. Assetto Corsa's UDP telemetry doesn't
        expose the track/car name itself, so this prompt is the only reliable way to label a session in Grafana.
      </p>
      <p>
        You must be in the car (in the pits or on track) for Assetto Corsa to start emitting telemetry — otherwise
        the script has nothing to read.
      </p>
    </>
  );
}
