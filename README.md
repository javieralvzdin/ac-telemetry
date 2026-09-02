# Assetto Corsa Real-Time Telemetry 🏎️📊

A real-time telemetry pipeline for Assetto Corsa. This project extracts data directly from the simulator's physics engine using C, processes it via Python, and visualizes it in real-time on a professional Grafana dashboard using InfluxDB as a time-series database.

The entire database and visualization environment is containerized with Docker to be completely "Plug & Play".

> ## ⭐ Quick Start (external users cloning this repo)
>
> Everything you need to go from `git clone` to a working dashboard on **your own PC**. This project only works locally — Assetto Corsa and this pipeline must run on the **same machine** (the C bridge talks to `127.0.0.1`, not a remote server).
>
> **Requirements:** Windows, Assetto Corsa, Docker Desktop, Python 3.x.
>
> ```
> git clone <this-repo-url>
> cd ac-telemetry
>
> # 1. Create your own secrets file (never commit .env)
> cp .env.example .env
> # -> open .env and set your own INFLUXDB_TOKEN / passwords (any random string works)
>
> # 2. Start InfluxDB + Grafana (auto-configured via the values in .env)
> docker compose up -d
>
> # 3. Install Python dependencies
> pip install -r requirements.txt
>
> # 4. Launch Assetto Corsa FIRST and get on track (see note below), THEN:
> python dashboard.py
> ```
>
> ⚠️ **Order matters:** start Assetto Corsa and be already driving (in the pits or on the circuit) *before* running `dashboard.py`. The script only asks the game for the circuit/car name once, right when it starts — if you launch it before the game has loaded a track, that name request goes nowhere and the session just gets a generic id instead of the real circuit/car name.
>
> Then open **http://localhost:3000** — the dashboard is viewable immediately, no Grafana login required.
>
> ⚠️ `ac_telemetry.dll` is already compiled and committed in this repo — no C compiler needed to run it. It only works on Windows.
>
> See [Installation and Usage](#-installation-and-usage) below for the detailed walkthrough and [Troubleshooting](#-common-troubleshooting) if something doesn't show up.

## 🏗️ Project Architecture

The system consists of 3 main layers:
1. Data Acquisition (C): A compiled library (ac_telemetry.dll) that communicates via Assetto Corsa's UDP telemetry protocol to extract raw telemetry from the game.
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

Follow these 5 simple steps to get your telemetry running in under 2 minutes:

### 1. Configure your secrets
Copy `.env.example` to `.env` and set your own values (InfluxDB token, InfluxDB/Grafana admin passwords). `.env` is git-ignored — never commit it.

cp .env.example .env

### 2. Stand up the infrastructure (Database and Grafana)
Open your terminal in the project's root folder (where the docker-compose.yml file is located) and run:

docker compose up -d

(This will download and start InfluxDB and Grafana in the background. Thanks to the "provisioning" system, the dashboard and database connection are configured automatically using the values from your `.env` file).

### 3. Install Python dependencies

pip install -r requirements.txt

### 4. Hit the track *before* launching the script
1. Open Assetto Corsa (or Content Manager) and enter a practice session or race.
2. Get in the car (pits or track) and wait until you're actually driving/loaded in — don't launch the script from the menus.

⚠️ **Do this before step 5, not after.** `dashboard.py` asks Assetto Corsa for the circuit and car name only once, right when it starts up. If the game hasn't loaded a track yet at that moment, that request is lost and the session in Grafana/InfluxDB gets a generic id instead of the real circuit/car name (telemetry itself still works either way — this only affects the session name).

### 5. Launch the data bridge
Once you're already on track, go back to your terminal and run the main script:

python dashboard.py

If everything goes well, you will see the data being sent in the console, and shortly after "Sesion identificada: circuito=... coche=..." confirming it picked up the track/car name.

## 📈 View Data in Grafana

1. Open your web browser and go to: http://localhost:3000
2. The dashboard is viewable anonymously (read-only) — no login needed to just watch it.
3. To edit the dashboard or config, log in with the `GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD` you set in `.env`.
4. In the left menu, go to Dashboards.
5. There you will see your telemetry dashboard ready and receiving data!

---

## 🔧 Common Troubleshooting
- Grafana shows "No data": Make sure the Python script is running, that you are in the car in Assetto Corsa, and that the Grafana time range (top right) is set to "Last 5 minutes" with "Auto-refresh" enabled.
- Port already allocated error when running docker compose: If you had old InfluxDB/Grafana containers running, stop and delete them from Docker Desktop before launching the new ones.
- `dashboard.py` exits immediately with a message about missing `INFLUXDB_TOKEN`/`INFLUXDB_ORG`/`INFLUXDB_BUCKET`: you forgot step 1 (`cp .env.example .env` and fill it in).
- `python dashboard.py` fails to load `ac_telemetry.dll`: run it from the repo root (the script resolves the DLL next to itself) and make sure you're on Windows — the DLL only works there.
- Session name in Grafana looks like a random id instead of `<circuito>_<coche>_...`: you started `dashboard.py` before Assetto Corsa had loaded onto the track. Stop the script (Ctrl+C), get back on track in AC, and start it again — telemetry itself wasn't affected, only the session name.

## 🛑 Shutting down the system
When you're done playing, simply close the Python console (Ctrl+C). 
To stop the containers and save PC resources, run:

docker compose down

(Don't worry, data and configurations are saved in local volumes and will not be lost for your next session).