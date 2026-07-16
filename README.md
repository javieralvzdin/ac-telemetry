# Assetto Corsa Zero-Latency Telemetry Streamer

A high-performance telemetry extraction tool for Assetto Corsa. This project captures live telemetry data from the game's physics engine and streams it with zero latency to a terminal dashboard. 

It uses a hybrid architecture designed for raw speed: a **C core** handles the UDP networking and memory mapping, while a **Python wrapper** manages the data stream and UI.

## 🏗️ Architecture

To achieve zero-latency and high-frequency data extraction (60+ Hz), the system is split into two layers:

1. **The C Core (`ac_telemetry.c`):** * Uses Windows Sockets (`winsock2`) to open a **non-blocking UDP connection** to the Assetto Corsa local telemetry server (Port `9996`).
   * Handles the handshake and directly maps the incoming binary payload (`RTCarInfo` struct) into memory.
   * Compiled as a Dynamic Link Library (`.dll`).

2. **The Python UI (`dashboard.py`):** * Uses `ctypes` to bridge the gap with the C DLL, passing memory pointers (`byref`) so the C core can overwrite the telemetry struct directly in Python's memory space.
   * Displays the data stream in real-time in the terminal.

## ✨ Current Features

- [x] UDP Handshake initialization.
- [x] Non-blocking sockets (avoids thread locking and allows clean keyboard interrupts).
- [x] Direct binary-to-struct memory mapping.
- [x] Zero-latency terminal dashboard.
- [x] Live extraction of: **Speed (km/h, mph, m/s)**.

## 🚀 Quick Start

**Requirements:** Windows, GCC (MinGW), Python 3.x, and Assetto Corsa.

1. **Compile the DLL:**
   ```cmd
   gcc -shared -o ac_telemetry.dll ac_telemetry.c -lws2_32
   ```
2. **Run the Streamer:** Start an Assetto Corsa session, ensure you are sitting in the car, and run:
   ```cmd
   python dashboard.py
   ```
   *(Press `Ctrl+C` to stop the stream cleanly).*

## 🚧 Future Scope

- Map deeper memory addresses to extract RPM, Gear, and G-Forces.
- Implement a Time-Series Database (e.g., InfluxDB) to log lap telemetry.
- Build a web-based dashboard (React/Grafana) for post-session data analysis.