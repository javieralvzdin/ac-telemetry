import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function Installation() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Instalación y uso</h1>
        <p>
          <strong>Requisitos:</strong> Windows, Assetto Corsa, Docker Desktop, Python 3.x. Este proyecto solo
          funciona en local, así que Assetto Corsa y este pipeline deben ejecutarse en la misma máquina.
        </p>
        <ol>
          <li>
            <strong>Configura tus secretos:</strong> copia <code>.env.example</code> a <code>.env</code> y pon tus
            propios valores (token de InfluxDB, contraseñas de administrador de InfluxDB/Grafana).{' '}
            <code>.env</code> está en el <code>.gitignore</code>, así que nunca lo subas al repositorio.
          </li>
          <li>
            <strong>Levanta la infraestructura:</strong> desde la carpeta raíz del proyecto, ejecuta{' '}
            <code>docker compose up -d</code>. Esto descarga e inicia InfluxDB y Grafana en segundo plano,
            autoconfigurados con tus valores de <code>.env</code>.
          </li>
          <li>
            <strong>Instala las dependencias de Python:</strong> <code>pip install -r requirements.txt</code>.
          </li>
          <li>
            <strong>Sal a pista:</strong> abre Assetto Corsa (o Content Manager) y entra en una sesión de práctica
            o carrera. Debes estar en el coche para que el juego empiece a emitir telemetría.
          </li>
          <li>
            <strong>Lanza el puente de datos:</strong> ejecuta <code>python dashboard.py</code>. Pedirá{' '}
            <strong>circuito</strong> y <strong>coche</strong> (pulsa Intro para saltar cualquiera de los dos). Si
            todo va bien, verás los datos enviándose en la consola.
          </li>
        </ol>
        <p>
          Después abre <code>http://localhost:3000</code> para ver el panel al instante, sin necesidad de iniciar
          sesión en Grafana.
        </p>
        <p>
          Para apagarlo todo: cierra la consola de Python (Ctrl+C) y luego ejecuta{' '}
          <code>docker compose down</code> (los datos y la configuración se conservan en los volúmenes locales).
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Installation &amp; Usage</h1>
      <p>
        <strong>Requirements:</strong> Windows, Assetto Corsa, Docker Desktop, Python 3.x. This project only works
        locally, so Assetto Corsa and this pipeline must run on the same machine.
      </p>
      <ol>
        <li>
          <strong>Configure your secrets:</strong> copy <code>.env.example</code> to <code>.env</code> and set
          your own values (InfluxDB token, InfluxDB/Grafana admin passwords). <code>.env</code> is git-ignored,
          so never commit it.
        </li>
        <li>
          <strong>Stand up the infrastructure:</strong> from the project's root folder, run{' '}
          <code>docker compose up -d</code>. This downloads and starts InfluxDB and Grafana in the background,
          auto-configured from your <code>.env</code> values.
        </li>
        <li>
          <strong>Install Python dependencies:</strong> <code>pip install -r requirements.txt</code>.
        </li>
        <li>
          <strong>Hit the track:</strong> open Assetto Corsa (or Content Manager) and enter a practice session or
          race. You must be in the car for the game to start emitting telemetry.
        </li>
        <li>
          <strong>Launch the data bridge:</strong> run <code>python dashboard.py</code>. It will ask for{' '}
          <strong>circuit</strong> and <strong>car</strong> (press Enter to skip either). If everything goes well,
          you'll see data being sent in the console.
        </li>
      </ol>
      <p>
        Then open <code>http://localhost:3000</code> to view the dashboard immediately, with no Grafana login required.
      </p>
      <p>
        To shut down: close the Python console (Ctrl+C), then run <code>docker compose down</code> (data and
        configuration are preserved in local volumes).
      </p>
    </>
  );
}
