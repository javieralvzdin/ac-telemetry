# Assetto Corsa Real-Time Telemetry 🏎️📊

A real-time telemetry pipeline for Assetto Corsa. This project extracts data directly from the simulator's physics engine using C, processes it via Python, and visualizes it in real-time on a professional Grafana dashboard using InfluxDB as a time-series database.

The entire database and visualization environment is containerized with Docker to be completely "Plug & Play".

## 🏗️ Project Architecture

The system consists of 3 main layers:
1. Data Acquisition (C): A compiled library (ac_telemetry.dll) that communicates via UDP sockets / shared memory to extract raw telemetry from Assetto Corsa with zero latency.
2. Processing (Python): The dashboard.py script acts as a bridge. It uses the ctypes library to interact with the C DLL, processes variables (RPM, gears, steering wheel, etc.), and injects them into the database.
3. Storage and Visualization (Docker): 
   - InfluxDB 2.7: Stores data in time series with high write frequency.
   - Grafana: Reads data from InfluxDB and displays it on a pre-configured dashboard.

## ⚙️ Prerequisites

Before starting, make sure you have installed:
- Assetto Corsa (running on your PC).
- Python 3.x.
- Docker Desktop (or Docker Compose if you are on Linux).

## 🚀 Installation and Usage

Follow these 4 simple steps to get your telemetry running in under 2 minutes:

### 1. Stand up the infrastructure (Database and Grafana)
Open your terminal in the project's root folder (where the docker-compose.yml file is located) and run:

docker compose up -d

(This will download and start InfluxDB and Grafana in the background. Thanks to the "provisioning" system, the dashboard and database connection are configured automatically).

### 2. Install Python dependencies
Install the InfluxDB client for Python by running in the terminal:

pip install influxdb-client

### 3. Hit the track!
1. Open Assetto Corsa (or Content Manager) and enter a practice session or race.
2. Important: You must be in the car (in the pits or on the track) for the game to start emitting telemetry.

### 4. Launch the data bridge
Go back to your terminal and run the main script:

python dashboard.py

If everything goes well, you will see the data being sent in the console.

## 📈 View Data in Grafana

1. Open your web browser and go to: http://localhost:3000
2. Default username and password: admin / admin (you will be asked to change it upon first login, you can skip this).
3. In the left menu, go to Dashboards.
4. There you will see your telemetry dashboard ready and receiving data!

--- 
💡 COMMON TROUBLESHOOTING:
- Grafana shows "No data": Make sure the Python script is running, that you are in the car in Assetto Corsa, and that the Grafana time range (top right) is set to "Last 5 minutes" with "Auto-refresh" enabled.
- Port already allocated error when running docker compose: If you had old InfluxDB/Grafana containers running, stop and delete them from Docker Desktop before launching the new ones.

## 🛑 Shutting down the system
When you're done playing, simply close the Python console (Ctrl+C). 
To stop the containers and save PC resources, run:

docker compose down

(Don't worry, data and configurations are saved in local volumes and will not be lost for your next session).