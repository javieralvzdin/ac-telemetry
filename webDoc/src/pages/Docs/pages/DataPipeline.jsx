import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function DataPipeline() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Pipeline de datos (Python)</h1>
        <p>
          <code>dashboard.py</code> es el puente entre la capa de telemetría en C y el almacenamiento. Usa la
          librería <code>ctypes</code> de Python para llamar a <code>ac_telemetry.dll</code>, lee variables como
          RPM, marcha y ángulo de volante, y las escribe en InfluxDB.
        </p>
        <p>
          Al lanzarlo, pide el <strong>circuito</strong> y el <strong>coche</strong> — escríbelos, o pulsa Intro
          para saltarlo y usar un id de sesión genérico. La telemetría UDP de Assetto Corsa no expone el nombre del
          circuito/coche en sí, así que este prompt es la única forma fiable de etiquetar una sesión en Grafana.
        </p>
        <p>
          Debes estar en el coche (en boxes o en pista) para que Assetto Corsa empiece a emitir telemetría — si no,
          el script no tiene nada que leer.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Data Pipeline (Python)</h1>
      <p>
        <code>dashboard.py</code> is the bridge between the C telemetry layer and storage. It uses Python's{' '}
        <code>ctypes</code> library to call into <code>ac_telemetry.dll</code>, reads variables like RPM, gear, and
        steering angle, and writes them into InfluxDB.
      </p>
      <p>
        When launched, it asks for <strong>circuit</strong> and <strong>car</strong> — type them in, or press Enter
        to skip and get a generic session id instead. Assetto Corsa's UDP telemetry doesn't expose the track/car
        name itself, so this prompt is the only reliable way to label a session in Grafana.
      </p>
      <p>
        You must be in the car (in the pits or on track) for Assetto Corsa to start emitting telemetry — otherwise
        the script has nothing to read.
      </p>
    </>
  );
}
