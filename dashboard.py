import ctypes
import os
import time

class CarTelemetry(ctypes.Structure):
    _pack_ = 1  # Vital: Obliga a Python a empaquetar la memoria igual que C
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

dll_path = os.path.abspath("ac_telemetry.dll")
ac_lib = ctypes.CDLL(dll_path)

ac_lib.update_telemetry.argtypes = [ctypes.POINTER(CarTelemetry)]
ac_lib.update_telemetry.restype = ctypes.c_int

ac_lib.init_telemetry()
data = CarTelemetry()

os.system('cls')
print("=== ASSETTO CORSA ZERO-LATENCY TELEMETRY ===")
print("Press Ctrl+C to stop.\n")

try:
    waiting = True
    print("Waiting for Assetto Corsa connection...", end="", flush=True)
    
    while True:
        status = ac_lib.update_telemetry(ctypes.byref(data))
        
        if status == 1:
            if waiting:
                # Borramos el mensaje de espera al recibir el primer paquete
                print("\r[OK] Connection established! Streaming data...       \n")
                waiting = False
                
            gas_pct = data.gas * 100
            brake_pct = data.brake * 100
            
            dashboard = (
                f"\rGear: {data.gear - 1:2d} | "
                f"RPM: {data.engineRPM:5.0f} | "
                f"Speed: {data.speed_kmh:5.1f} km/h | "
                f"Gas: {gas_pct:3.0f}% | "
                f"Brake: {brake_pct:3.0f}% | "
                f"Steer: {data.steer:5.2f}    "
            )
            print(dashboard, end="", flush=True)
        
        time.sleep(0.01)
        
except KeyboardInterrupt:
    ac_lib.close_telemetry()
    print("\n\n[PYTHON] Stream stopped cleanly.")