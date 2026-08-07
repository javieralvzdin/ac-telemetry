import ctypes
import os
import time
import influxdb_client
from influxdb_client.client.write_api import WriteOptions

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

# === CONFIGURACIÓN INFLUXDB ===
url = "http://localhost:8086"
token = "3TcYCntssTwY3BXCEzKv8A82DuHwnKdZd_jD_flOmUtjxekL3RmjF_jAgbm3C33s_cw1P1Qcy-M5AZtuD2p_7Q=="  
org = "motorsport"
bucket = "assetto_corsa"

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
# EMPAQUETAMOS 60 DATOS POR ENVIO (1s A 60Hz)
write_api = client.write_api(write_options=WriteOptions(batch_size=60, flush_interval=1000))
# REVISAR POR AQUI 
# === INICIO C DLL ===
dll_path = os.path.abspath("ac_telemetry.dll")
ac_lib = ctypes.CDLL(dll_path)
ac_lib.update_telemetry.argtypes = [ctypes.POINTER(CarTelemetry)]
ac_lib.update_telemetry.restype = ctypes.c_int
ac_lib.init_telemetry()
data = CarTelemetry()

os.system('cls')
print("=== ASSETTO CORSA INFLUXDB PIPELINE ===")
print("Press Ctrl+C to stop.\n")

try:
    waiting = True
    print("Waiting for Assetto Corsa connection...", end="", flush=True)
    
    while True:
        status = ac_lib.update_telemetry(ctypes.byref(data))
        
        if status == 1:
            if waiting:
                print("\r[OK] Connection established! Recording telemetry to InfluxDB...\n")
                waiting = False
                
            gas_pct = data.gas * 100
            brake_pct = data.brake * 100
            
            # 1. SACAMOS POR PANTALLA LOS DATOS
            dashboard = (
                f"\rGear: {data.gear - 1:2d} | "
                f"RPM: {data.engineRPM:5.0f} | "
                f"Speed: {data.speed_kmh:5.1f} km/h | "
                f"Gas: {gas_pct:3.0f}% | "
                f"Brake: {brake_pct:3.0f}% | "
                f"Steer: {data.steer:5.2f} "
            )
            print(dashboard, end="", flush=True)
            
            # 2. COMUNICACIÓN CON LA BASE DE DATOS
            point = (
                influxdb_client.Point("vehicle_dynamics")
                .tag("session", "live")
                .field("gear", data.gear - 1)
                .field("rpm", float(data.engineRPM))
                .field("speed_kmh", float(data.speed_kmh))
                .field("gas_pct", float(gas_pct))
                .field("brake_pct", float(brake_pct))
                .field("steer_angle", float(data.steer)) # NOMBRE CAMBIADO POR PROBLEMAS CON GRAFANA
                .field("g_vertical", float(data.accG_vertical))
                .field("g_horizontal", float(data.accG_horizontal))
                .field("g_frontal", float(data.accG_frontal))
            )
            
            # 3. DATOS AL BUFFER DE ENVIO
            write_api.write(bucket=bucket, org=org, record=point)
        
        time.sleep(0.01)
        
except KeyboardInterrupt:
    print("\n\n[PYTHON] Flushing remaining data to DB...")
    write_api.flush() # VACIAMOS LO QUE QUEDA EN LA RAM
    write_api.close()
    client.close()
    ac_lib.close_telemetry()
    print("[PYTHON] Stream stopped cleanly.")
