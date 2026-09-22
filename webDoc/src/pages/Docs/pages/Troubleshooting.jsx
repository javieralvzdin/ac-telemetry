import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function Troubleshooting() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Solución de problemas</h1>
        <ul>
          <li>
            <strong>Grafana muestra "No data":</strong> comprueba que el script de Python está corriendo, que
            estás en el coche en Assetto Corsa, y que el rango de tiempo de Grafana (arriba a la derecha) está en
            "Last 5 minutes" con auto-refresh activado.
          </li>
          <li>
            <strong>
              "Port already allocated" al ejecutar <code>docker compose</code>:
            </strong>{' '}
            para y borra los contenedores antiguos de InfluxDB/Grafana desde Docker Desktop antes de lanzar unos
            nuevos.
          </li>
          <li>
            <strong>
              <code>dashboard.py</code> se cierra al instante
            </strong>{' '}
            porque faltan <code>INFLUXDB_TOKEN</code> / <code>INFLUXDB_ORG</code> / <code>INFLUXDB_BUCKET</code>: te
            saltaste <code>cp .env.example .env</code> y rellenarlo.
          </li>
          <li>
            <strong>
              <code>python dashboard.py</code> falla al cargar <code>ac_telemetry.dll</code>:
            </strong>{' '}
            ejecútalo desde la raíz del repositorio (el script busca la DLL junto a sí mismo), y asegúrate de
            estar en Windows.
          </li>
          <li>
            <strong>El nombre de sesión en Grafana parece un id aleatorio</strong> en vez de{' '}
            <code>&lt;circuito&gt;_&lt;coche&gt;_...</code>: pulsaste Intro sin escribir nada cuando se te pidió.
            Vuelve a ejecutar <code>dashboard.py</code> y rellena circuito/coche.
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      <h1>Troubleshooting</h1>
      <ul>
        <li>
          <strong>Grafana shows "No data":</strong> make sure the Python script is running, that you're in the car
          in Assetto Corsa, and that Grafana's time range (top right) is set to "Last 5 minutes" with auto-refresh
          enabled.
        </li>
        <li>
          <strong>"Port already allocated" when running <code>docker compose</code>:</strong> stop and delete old
          InfluxDB/Grafana containers from Docker Desktop before launching new ones.
        </li>
        <li>
          <strong><code>dashboard.py</code> exits immediately</strong> because it's missing{' '}
          <code>INFLUXDB_TOKEN</code> / <code>INFLUXDB_ORG</code> / <code>INFLUXDB_BUCKET</code>: you skipped{' '}
          <code>cp .env.example .env</code> and filling it in.
        </li>
        <li>
          <strong><code>python dashboard.py</code> fails to load <code>ac_telemetry.dll</code>:</strong> run it
          from the repo root (the script resolves the DLL next to itself), and make sure you're on Windows.
        </li>
        <li>
          <strong>Session name in Grafana looks like a random id</strong> instead of{' '}
          <code>&lt;circuito&gt;_&lt;coche&gt;_...</code>: you pressed Enter without typing anything when
          prompted. Re-run <code>dashboard.py</code> and fill in circuit/car.
        </li>
      </ul>
    </>
  );
}
