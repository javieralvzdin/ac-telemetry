import './SessionLog.css';

export default function SessionLog() {
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
        Same corners, two different states of the car — cautious inputs on a cold lap, full commitment once the
        tires are in.
      </p>
      <figure className="session-log__figure">
        <img src="/docs-assets/session-log/two-laps-speed.png" alt="Speed comparison between warm-up lap and hotlap" />
      </figure>
      <p className="session-log__quote">
        Top speed before the first braking zone rises from 180 km/h to 210 km/h, and minimum corner speed lifts
        from the 55–75 km/h band to 70–95 km/h — a faster lap built at both ends of the braking zone, not just
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
        Five direction changes — T1 through T5 — define the technical middle sector of the lap. Overlaying the
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
