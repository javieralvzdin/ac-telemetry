import ctypes
import logging
import os
import sys
import time
import uuid

import influxdb_client
from influxdb_client.client.write_api import WriteOptions
from influxdb_client.client.write.point import WritePrecision

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv es opcional; si no esta instalado, se usan variables de entorno del sistema.

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ac_telemetry")


class CarTelemetry(ctypes.Structure):
    _pack_ = 1
    _fields_ = [
        ("identifier", ctypes.c_int),
        ("size", ctypes.c_int),
        ("speed_kmh", ctypes.c_float),
        ("speed_mph", ctypes.c_float),
        ("speed_ms", ctypes.c_float),
        ("isAbsEnabled", ctypes.c_char),
        ("isAbsInAction", ctypes.c_char),
        ("isTcInAction", ctypes.c_char),
        ("isTcEnabled", ctypes.c_char),
        ("inPit", ctypes.c_char),
        ("engineLimiterOn", ctypes.c_char),
        ("padding", ctypes.c_char * 2),
        ("accG_vertical", ctypes.c_float),
        ("accG_horizontal", ctypes.c_float),
        ("accG_frontal", ctypes.c_float),
        ("lapTime", ctypes.c_int),
        ("lastLap", ctypes.c_int),
        ("bestLap", ctypes.c_int),
        ("lapCount", ctypes.c_int),
        ("gas", ctypes.c_float),
        ("brake", ctypes.c_float),
        ("clutch", ctypes.c_float),
        ("engineRPM", ctypes.c_float),
        ("steer", ctypes.c_float),
        ("gear", ctypes.c_int),
    ]


# === CONFIGURACION INFLUXDB (via variables de entorno / .env, nunca hardcodeadas) ===
url = os.environ.get("INFLUXDB_URL", "http://localhost:8086")
token = os.environ.get("INFLUXDB_TOKEN")
org = os.environ.get("INFLUXDB_ORG")
bucket = os.environ.get("INFLUXDB_BUCKET")

if not token or not org or not bucket:
    log.error(
        "Faltan variables de entorno (INFLUXDB_TOKEN / INFLUXDB_ORG / INFLUXDB_BUCKET). "
        "Copia .env.example a .env y rellena los valores antes de ejecutar este script."
    )
    sys.exit(1)

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)

# Callbacks para que los fallos de escritura (DB caida, red, etc.) sean visibles
# en vez de perderse silenciosamente dentro del hilo de batching del cliente.
def _on_write_success(conf, data):
    pass


def _on_write_error(conf, data, exception):
    log.error("Fallo al escribir en InfluxDB (%s): %s", conf, exception)


def _on_write_retry(conf, data, exception):
    log.warning("Reintentando escritura en InfluxDB (%s): %s", conf, exception)


# EMPAQUETAMOS 60 DATOS POR ENVIO (1s A 60Hz)
write_api = client.write_api(
    write_options=WriteOptions(batch_size=60, flush_interval=1000),
    success_callback=_on_write_success,
    error_callback=_on_write_error,
    retry_callback=_on_write_retry,
)

# === INICIO C DLL (se resuelve relativo a este script, no al directorio de trabajo actual) ===
dll_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ac_telemetry.dll")
ac_lib = ctypes.CDLL(dll_path)
ac_lib.update_telemetry.argtypes = [ctypes.POINTER(CarTelemetry)]
ac_lib.update_telemetry.restype = ctypes.c_int
ac_lib.init_telemetry.restype = ctypes.c_int
ac_lib.get_session_info.argtypes = [ctypes.c_wchar_p, ctypes.c_wchar_p]
ac_lib.get_session_info.restype = ctypes.c_int

if not ac_lib.init_telemetry():
    log.error("No se pudo inicializar el socket UDP hacia Assetto Corsa (init_telemetry devolvio 0).")
    sys.exit(1)

data = CarTelemetry()

# Id de sesion: agrupa todas las muestras de esta ejecucion del script en Grafana,
# evitando que se mezclen con las de otra sesion/dia distintos.
run_id = time.strftime("%Y%m%d-%H%M%S") + "-" + uuid.uuid4().hex[:6]
# Se completa con circuito/coche en cuanto Assetto Corsa responda el handshake
# (ver try_resolve_session_label). Hasta entonces se usa el run_id a secas.
session_id = run_id
session_resolved = False
_car_buf = ctypes.create_unicode_buffer(100)
_track_buf = ctypes.create_unicode_buffer(100)


def _clean_name(raw: str) -> str:
    return "".join(ch for ch in raw if ch.isprintable()).strip()


def try_resolve_session_label():
    """Intenta leer circuito/coche del handshake de AC y renombrar la sesion.

    Best-effort: el layout de HandshakerResponse (wchar_t[100] por campo) es el
    protocolo UDP conocido de Assetto Corsa pero no se ha podido verificar byte
    a byte contra el juego real desde este entorno. Si el texto sale vacio o
    ilegible, se mantiene el run_id como session_id (no rompe nada, solo no
    queda "bonito").
    """
    global session_id, session_resolved
    if session_resolved:
        return
    if not ac_lib.get_session_info(_car_buf, _track_buf):
        return
    car = _clean_name(_car_buf.value)
    track = _clean_name(_track_buf.value)
    if car and track:
        session_id = f"{track}_{car}_{run_id}"
        session_resolved = True
        log.info("Sesion identificada: circuito=%r coche=%r", track, car)
    else:
        # Llego handshake pero sin texto usable: no reintentamos mas (el DLL ya
        # no vuelve a mandar has_session_info=0), nos quedamos con run_id.
        session_resolved = True
        log.warning("Handshake de AC recibido pero sin nombre de circuito/coche legible; usando %s", run_id)

# Reconexion con backoff si el socket empieza a devolver errores reales (-1) de forma persistente.
CONSECUTIVE_ERROR_LIMIT = 50
RECONNECT_BACKOFF_SECONDS = 2.0
consecutive_errors = 0

os.system("cls")
print("=== ASSETTO CORSA INFLUXDB PIPELINE ===")
print(f"Session: {session_id}")
print("Press Ctrl+C to stop.\n")

waiting = True
print("Waiting for Assetto Corsa connection...", end="", flush=True)

try:
    while True:
        status = ac_lib.update_telemetry(ctypes.byref(data))

        if status == 1:
            consecutive_errors = 0
            if waiting:
                print("\r[OK] Connection established! Recording telemetry to InfluxDB...\n")
                waiting = False

            if not session_resolved:
                try_resolve_session_label()

            gas_pct = data.gas * 100
            brake_pct = data.brake * 100

            # 1. SACAMOS POR PANTALLA LOS DATOS
            # data.gear ya sigue la convencion del struct: -1=R, 0=N, 1=1a, 2=2a...
            dashboard = (
                f"\rGear: {data.gear:2d} | "
                f"RPM: {data.engineRPM:5.0f} | "
                f"Speed: {data.speed_kmh:5.1f} km/h | "
                f"Gas(%): {gas_pct:3.0f}% | "
                f"Brake(%): {brake_pct:3.0f}% | "
                f"Steer: {data.steer:5.2f} "
            )
            print(dashboard, end="", flush=True)

            # 2. COMUNICACION CON LA BASE DE DATOS
            point = (
                influxdb_client.Point("vehicle_dynamics")
                .tag("session", session_id)
                .field("gear", data.gear)
                .field("rpm", float(data.engineRPM))
                .field("speed_kmh", float(data.speed_kmh))
                .field("gas_pct", float(gas_pct))
                .field("brake_pct", float(brake_pct))
                .field("steer_angle", float(data.steer))  # NOMBRE CAMBIADO POR PROBLEMAS CON GRAFANA
                .field("g_vertical", float(data.accG_vertical))
                .field("g_horizontal", float(data.accG_horizontal))
                .field("g_frontal", float(data.accG_frontal))
                .field("lap_time_ms", int(data.lapTime))
                .field("last_lap_ms", int(data.lastLap))
                .field("best_lap_ms", int(data.bestLap))
                .field("lap_count", int(data.lapCount))
                .field("in_pit", bool(data.inPit != b"\x00"))
                .time(time.time_ns(), WritePrecision.NS)
            )

            # 3. DATOS AL BUFFER DE ENVIO (los fallos se reportan via error_callback, no se pierden en silencio)
            try:
                write_api.write(bucket=bucket, org=org, record=point)
            except Exception:
                log.exception("Excepcion sincronica al encolar el punto para InfluxDB")

        elif status == -1:
            consecutive_errors += 1
            if consecutive_errors == 1:
                log.warning("Error de socket leyendo telemetria (WSAGetLastError != WOULDBLOCK).")
            if consecutive_errors >= CONSECUTIVE_ERROR_LIMIT:
                log.warning(
                    "Demasiados errores de socket seguidos (%d). Reintentando handshake con Assetto Corsa...",
                    consecutive_errors,
                )
                ac_lib.close_telemetry()
                time.sleep(RECONNECT_BACKOFF_SECONDS)
                if ac_lib.init_telemetry():
                    log.info("Handshake reenviado correctamente.")
                else:
                    log.error("No se pudo reabrir el socket. Se reintentara mas adelante.")
                consecutive_errors = 0
                waiting = True
                print("Waiting for Assetto Corsa connection...", end="", flush=True)
        # status == 0: sin datos nuevos todavia, no es un error.

        time.sleep(0.01)

except KeyboardInterrupt:
    print("\n\n[PYTHON] Stopping (Ctrl+C)...")
except Exception:
    log.exception("Error inesperado, cerrando limpiamente")
finally:
    print("[PYTHON] Flushing remaining data to DB...")
    try:
        write_api.flush()
        write_api.close()
        client.close()
    except Exception:
        log.exception("Error cerrando el cliente de InfluxDB")
    ac_lib.close_telemetry()
    print("[PYTHON] Stream stopped cleanly.")
