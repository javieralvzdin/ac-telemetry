import { Link } from 'react-router-dom';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';

export default function HardwareBridge() {
  const { lang } = useLanguage();

  if (lang === 'es') {
    return (
      <>
        <h1>Puente de hardware (C / UDP)</h1>
        <p>
          <code>ac_telemetry.dll</code> es una librería compilada en C que lee el protocolo de telemetría UDP de
          Assetto Corsa directamente desde el motor de físicas del simulador.
        </p>
        <p>
          Se distribuye precompilada y versionada en el repositorio, así que no hace falta un compilador de C para
          ejecutarla. Solo funciona en Windows, ya que habla con la interfaz UDP local de Assetto Corsa.
        </p>
        <p>
          La capa de Python (<code>dashboard.py</code>) carga esta DLL mediante la librería <code>ctypes</code> de
          Python en lugar de hablar UDP directamente; ver{' '}
          <Link to="/docs/data-pipeline">Pipeline de datos</Link> para ver cómo funciona ese relevo.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Hardware Bridge (C / UDP)</h1>
      <p>
        <code>ac_telemetry.dll</code> is a compiled C library that reads Assetto Corsa's UDP telemetry protocol
        directly from the simulator's physics engine.
      </p>
      <p>
        It ships precompiled and committed in the repository, so no C compiler is required to run it. It only
        works on Windows, since it talks to Assetto Corsa's local UDP interface.
      </p>
      <p>
        The Python layer (<code>dashboard.py</code>) loads this DLL via Python's <code>ctypes</code> library rather
        than talking UDP itself; see <Link to="/docs/data-pipeline">Data Pipeline</Link> for how that hand-off
        works.
      </p>
    </>
  );
}
