import { Link } from 'react-router-dom';

export default function HardwareBridge() {
  return (
    <>
      <h1>Hardware Bridge (C / UDP)</h1>
      <p>
        <code>ac_telemetry.dll</code> is a compiled C library that reads Assetto Corsa's UDP telemetry protocol
        directly from the simulator's physics engine.
      </p>
      <p>
        It ships precompiled and committed in the repository, so no C compiler is required to run it — it only
        works on Windows, since it talks to Assetto Corsa's local UDP interface.
      </p>
      <p>
        The Python layer (<code>dashboard.py</code>) loads this DLL via Python's <code>ctypes</code> library rather
        than talking UDP itself; see <Link to="/docs/data-pipeline">Data Pipeline</Link> for how that hand-off
        works.
      </p>
      <p className="docs-layout__pending">
        [contenido pendiente: detalle del protocolo UDP y de las variables expuestas por el DLL]
      </p>
    </>
  );
}
