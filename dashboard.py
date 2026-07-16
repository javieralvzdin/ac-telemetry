import ctypes
import os

# Obtener la ruta absoluta de la DLL para evitar problemas de pathing
dll_path = os.path.abspath("ac_telemetry.dll")
print(f"[PYTHON] Loading library: {dll_path}")

try:
    # Cargar la librería compilada en C
    ac_lib = ctypes.CDLL(dll_path)
    print("[PYTHON] Library loaded successfully. Calling C function...\n")
    print("-" * 40)
    
    # Ejecutar la función init_telemetry del código C
    ac_lib.init_telemetry()
    
    print("-" * 40)
    print("[PYTHON] Execution finished.")
except Exception as e:
    print(f"[PYTHON] Error loading DLL: {e}")