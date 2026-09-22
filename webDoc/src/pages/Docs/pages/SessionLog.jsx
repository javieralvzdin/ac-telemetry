import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import './SessionLog.css';

export default function SessionLog() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <div className="session-log">
        <p className="session-log__eyebrow">Circuit de Barcelona-Catalunya · Porsche 911 RSR (2017)</p>
        <h1>Registro de sesión</h1>
        <p className="session-log__quote">
          Un pipeline de telemetría en tiempo real para Assetto Corsa. Un lector de memoria compartida a medida
          captura los datos de volante, acelerador, freno, RPM y marcha a alta frecuencia y los envía a InfluxDB
          para visualizarlos en Grafana. Este registro documenta una única sesión en el Circuit de
          Barcelona-Catalunya, comparando una vuelta de calentamiento con una vuelta rápida posterior en un Porsche
          911 RSR (2017).
        </p>

        <h2>Resumen de canales</h2>
        <p className="session-log__quote">
          Tres canales registrados en paralelo durante toda la vuelta: velocidad con la traza de acelerador y freno,
          ángulo de volante, y RPM del motor junto con la marcha activa. Los puntos de cambio se ajustan con
          precisión al límite de RPM, pasando de 1ª marcha a la salida de boxes hasta 6ª en la recta trasera.
        </p>
        <figure className="session-log__figure">
          <img
            src="/docs-assets/session-log/channel-overview.png"
            alt="Panel de Grafana: velocidad/pedales, ángulo de volante, RPM/marcha"
          />
        </figure>

        <h2>Dos vueltas, una línea</h2>
        <p className="session-log__caption">// Velocidad – Freno/Acelerador //</p>
        <p>
          Las mismas curvas, dos estados distintos del coche: entradas prudentes en una vuelta en frío, compromiso
          total una vez que los neumáticos están en temperatura.
        </p>
        <figure className="session-log__figure">
          <img
            src="/docs-assets/session-log/two-laps-speed.png"
            alt="Comparación de velocidad entre la vuelta de calentamiento y la vuelta rápida"
          />
        </figure>
        <p className="session-log__quote">
          La velocidad punta antes de la primera zona de frenada sube de 180 km/h a 210 km/h, y la velocidad mínima
          en curva pasa de la banda de 55–75 km/h a 70–95 km/h: una vuelta más rápida construida en ambos extremos
          de la zona de frenada, no solo en la recta.
        </p>

        <p className="session-log__quote">
          El ángulo de volante se profundiza bajo carga. El pico de entrada sube de 63° en la vuelta de
          calentamiento a 108° en la misma T5 en la vuelta rápida, un giro más tardío y más brusco que compensa la
          velocidad extra llevada al vértice.
        </p>
        <figure className="session-log__figure">
          <img
            src="/docs-assets/session-log/two-laps-steering.png"
            alt="Comparación del ángulo de volante entre la vuelta de calentamiento y la vuelta rápida"
          />
        </figure>

        <h2>Dónde ocurre</h2>
        <p className="session-log__quote">
          Cinco cambios de dirección, de T1 a T5, definen el sector técnico central de la vuelta. Al superponer
          las trazas de volante y velocidad sobre el mapa del circuito, T5 destaca como la entrada más exigente de
          la sesión: el giro de 108° de la vuelta rápida, que coincide con el punto de frenada más profundo de la
          traza de velocidad. El trazado completo tiene 16 curvas numeradas, con la entrada y salida de boxes
          marcadas a ambos lados de la línea de meta.
        </p>
        <figure className="session-log__figure">
          <img
            src="/docs-assets/session-log/where-it-happens.png"
            alt="Superposición de velocidad, volante y mapa del circuito mostrando las curvas T1 a T5"
          />
        </figure>

        <h2>Del simulador a la pantalla</h2>
        <p>Cuatro etapas convierten la física en bruto del simulador en los gráficos de estas páginas.</p>
        <ol className="session-log__pipeline">
          <li>
            <span className="session-log__pipeline-stage">Assetto Corsa</span>
            <span className="session-log__pipeline-role">Memoria compartida</span>
            <p>
              El simulador expone el estado de física y gráficos a través de memoria compartida de Windows en cada
              fotograma.
            </p>
          </li>
          <li>
            <span className="session-log__pipeline-stage">ac_telemetry.dll</span>
            <span className="session-log__pipeline-role">Lector a medida</span>
            <p>
              Un módulo nativo lee los bloques de memoria compartida y extrae los canales usados en este informe:
              velocidad, acelerador, freno, ángulo de volante, RPM y marcha.
            </p>
          </li>
          <li>
            <span className="session-log__pipeline-stage">InfluxDB</span>
            <span className="session-log__pipeline-role">Almacén de series temporales</span>
            <p>
              Las muestras extraídas se escriben como puntos de series temporales, indexadas por sesión y vuelta
              para consultas posteriores.
            </p>
          </li>
          <li>
            <span className="session-log__pipeline-stage">Grafana</span>
            <span className="session-log__pipeline-role">Visualización</span>
            <p>
              Los paneles consultan InfluxDB directamente para renderizar los gráficos mostrados a lo largo de este
              documento.
            </p>
          </li>
        </ol>

        <p className="session-log__quote">
          Construir este pipeline de principio a fin, desde leer offsets en bruto de memoria compartida hasta dar
          forma a consultas de InfluxDB convertidas en paneles legibles de Grafana, supuso trabajar en toda la pila
          de un sistema de datos en tiempo real, no solo en la superficie. Obligó a mirar de cerca las frecuencias
          de muestreo, los tipos de datos, y cómo un pequeño error de ingesta se convierte silenciosamente en un
          gráfico engañoso tres pasos más adelante. Convertir el ángulo de volante, la entrada de pedales y las RPM
          en una historia legible, en lugar de un muro de números, fue tanto un problema de diseño como técnico. Lo
          que empezó como una forma de ver los datos de una vuelta se convirtió en práctica real con almacenamiento
          de series temporales, creación de dashboards, y depuración de un pipeline en vivo bajo condiciones reales
          y caóticas.
        </p>

        <p className="session-log__copyright">
          © 2026 Javier Álvarez Diñeiro · Todos los derechos reservados. Este proyecto, incluyendo su código
          fuente, el pipeline de telemetría y los datos, es propiedad del autor. Ninguna parte puede reproducirse,
          distribuirse o reutilizarse sin permiso por escrito.
        </p>
      </div>
    );
  }

  return (
    <div className="session-log">
      <p className="session-log__eyebrow">Circuit de Barcelona-Catalunya · Porsche 911 RSR (2017)</p>
      <h1>Session Log</h1>
      <p className="session-log__quote">
        A real-time telemetry pipeline for Assetto Corsa. A custom shared-memory reader captures steering,
        throttle, brake, RPM and gear data at high frequency and streams it into InfluxDB for visualization in
        Grafana. This log documents a single session at Circuit de Barcelona-Catalunya, comparing a warm-up lap
        against a subsequent hotlap in a Porsche 911 RSR (2017).
      </p>

      <h2>Channel Overview</h2>
      <p className="session-log__quote">
        Three channels recorded in parallel throughout the lap: speed with throttle and brake trace, steering
        angle, and engine RPM plotted against the active gear. Shift points track cleanly against the RPM
        ceiling, running from 1st gear at pit exit through 6th on the back straight.
      </p>
      <figure className="session-log__figure">
        <img src="/docs-assets/session-log/channel-overview.png" alt="Grafana dashboard: speed/pedals, steering angle, RPM/gear" />
      </figure>

      <h2>Two Laps, One Line</h2>
      <p className="session-log__caption">// Speed – Brake/Throttle //</p>
      <p>
        Same corners, two different states of the car: cautious inputs on a cold lap, full commitment once the
        tires are in.
      </p>
      <figure className="session-log__figure">
        <img src="/docs-assets/session-log/two-laps-speed.png" alt="Speed comparison between warm-up lap and hotlap" />
      </figure>
      <p className="session-log__quote">
        Top speed before the first braking zone rises from 180 km/h to 210 km/h, and minimum corner speed lifts
        from the 55–75 km/h band to 70–95 km/h: a faster lap built at both ends of the braking zone, not just
        on the straight.
      </p>

      <p className="session-log__quote">
        Steering lock deepens under load. Peak input climbs from 63° on the warm-up lap to 108° at the same T5
        on the hotlap, a later, harder turn-in compensating for the extra speed carried into the apex.
      </p>
      <figure className="session-log__figure">
        <img src="/docs-assets/session-log/two-laps-steering.png" alt="Steering angle comparison between warm-up lap and hotlap" />
      </figure>

      <h2>Where It Happens</h2>
      <p className="session-log__quote">
        Five direction changes, T1 through T5, define the technical middle sector of the lap. Overlaying the
        steering and speed traces on the track map pinpoints T5 as the session's sharpest input: the 108° lock
        from the hotlap, matched to the deepest braking event on the speed trace. The full layout runs 16
        numbered corners, with pit entry and exit marked either side of the start/finish line.
      </p>
      <figure className="session-log__figure">
        <img src="/docs-assets/session-log/where-it-happens.png" alt="Speed, steering and track map overlay showing corners T1 to T5" />
      </figure>

      <h2>From Sim to Screen</h2>
      <p>Four stages turn raw simulator physics into the charts on these pages.</p>
      <ol className="session-log__pipeline">
        <li>
          <span className="session-log__pipeline-stage">Assetto Corsa</span>
          <span className="session-log__pipeline-role">Shared memory</span>
          <p>The simulator exposes physics and graphics state through Windows shared memory on every frame.</p>
        </li>
        <li>
          <span className="session-log__pipeline-stage">ac_telemetry.dll</span>
          <span className="session-log__pipeline-role">Custom reader</span>
          <p>
            A native module reads the shared memory blocks and extracts the channels used in this report: speed,
            throttle, brake, steering angle, RPM and gear.
          </p>
        </li>
        <li>
          <span className="session-log__pipeline-stage">InfluxDB</span>
          <span className="session-log__pipeline-role">Time-series store</span>
          <p>Extracted samples are written as time-series points, indexed by session and lap for later queries.</p>
        </li>
        <li>
          <span className="session-log__pipeline-stage">Grafana</span>
          <span className="session-log__pipeline-role">Visualization</span>
          <p>Dashboards query InfluxDB directly to render the panels shown throughout this document.</p>
        </li>
      </ol>

      <p className="session-log__quote">
        Building this pipeline end-to-end, from reading raw shared-memory offsets to shaping InfluxDB queries
        into readable Grafana panels, meant working across the full stack of a real-time data system, not just
        its surface. It forced a closer look at sampling rates, data types, and how a small ingestion error
        quietly turns into a misleading chart three steps downstream. Turning steering angle, pedal input, and
        RPM into a readable story, rather than a wall of numbers, was as much a design problem as a technical
        one. What started as a way to watch lap data became hands-on practice with time-series storage,
        dashboarding, and debugging a live pipeline under real, messy conditions.
      </p>

      <p className="session-log__copyright">
        © 2026 Javier Álvarez Diñeiro · All rights reserved. This project, including its source code, telemetry
        pipeline, and data, is the property of the author. No part of it may be reproduced, distributed, or
        reused without written permission.
      </p>
    </div>
  );
}
