import ctypes
import os
import time

class CarTelemetry(ctypes.Structure):
    _fields_ = [
        ("identifier", ctypes.c_int),
        ("size", ctypes.c_int),
        ("speed_kmh", ctypes.c_float),
        ("speed_mph", ctypes.c_float),
        ("speed_ms", ctypes.c_float),
    ]

dll_path = os.path.abspath("ac_telemetry.dll")
ac_lib = ctypes.CDLL(dll_path)

ac_lib.update_telemetry.argtypes = [ctypes.POINTER(CarTelemetry)]
# Le indicamos a Python que ahora la función C devuelve un número entero
ac_lib.update_telemetry.restype = ctypes.c_int

ac_lib.init_telemetry()
data = CarTelemetry()

os.system('cls')
print("=== ASSETTO CORSA ZERO-LATENCY TELEMETRY ===")
print("Press Ctrl+C to stop.\n")

try:
    while True:
        # Ahora C devuelve al instante: 1 (hay datos) o 0 (no hay datos)
        status = ac_lib.update_telemetry(ctypes.byref(data))
        
        if status == 1:
            print(f"\rSpeed: {data.speed_kmh:8.2f} km/h", end="", flush=True)
        
        # Este micro-descanso permite a Python escuchar tu Ctrl+C
        time.sleep(0.01)
        
except KeyboardInterrupt:
    ac_lib.close_telemetry()
    print("\n\n[PYTHON] Stream stopped cleanly.")