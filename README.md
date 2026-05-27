# Border Crossing Trade & Logistics Analytics Platform

A high-fidelity logistics dashboard monitoring port transit delays, commercial trade values, cargo throughput, and commodity distributions along key US-Mexico border crossings (Otay Mesa, Nogales, El Paso, Laredo, Brownsville).

This project uses a decoupled architecture consisting of a **Python FastAPI backend** and a **React/Next.js frontend**.

---

## 🛠️ Key Features

1. **Interactive Border Corridor Map**: A customized SVG vector layout representing the border corridor. Crossing points are color-coded by congestion level (Normal, Delayed, Congested) with glowing pulse animations and clickable info triggers.
2. **Crossing Comparison Engine**: An interactive side-by-side spec validator. Select any two ports from dropdown menus to compare throughput volumes, cargo values, wait delays, and commodity shares in real time.
3. **7-Day Transit Trends**: A dual-axis line graph mapping commercial truck flow volume against average transit delays over the last 7 days.
4. **Global Commodity Flows**: Horizontal progress charts tracking total monetary trade flows by commodity sector (Electronics, Automotive, Machinery, Agriculture, Textiles).
5. **Real-time Delay Stack**: A ranked sidebar panel showing crossings ordered by congestion levels for quick logistics routing decisions.

---

## 🏗️ Project Architecture

```
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # REST API endpoints & logistics dataset parser
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Python Virtual Environment
│
└── frontend/                 # Next.js React Frontend (Turbopack)
    ├── src/
    │   ├── app/              # Layout, CSS, and page routing
    │   └── components/       # Map, Compare, Commodity, and Trend charts
    ├── __tests__/e2e/        # Jest + Selenium E2E testing suite
    └── package.json          # Node scripts and dependencies
```

---

## 🚀 Getting Started

### 1. Run the Backend Server

Navigate to the `backend/` directory:
```bash
cd backend
```

Activate the virtual environment:
- **Windows**:
  ```powershell
  .\venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

Start the FastAPI development server:
```bash
python -m uvicorn main:app --port 5000 --host 127.0.0.1 --reload
```
The API documentation will be available at `http://127.0.0.1:5000/docs` and data endpoint at `http://127.0.0.1:5000/api/data`.

---

### 2. Run the Frontend Server

Navigate to the `frontend/` directory:
```bash
cd ../frontend
```

Start the Next.js development server:
```bash
npx next dev -p 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the interactive dashboard.

---

## 🧪 Running End-to-End Tests

The frontend is configured with **Jest** and **Selenium WebDriver** for automated browser validation. Tests run inside headless Google Chrome.

With both the backend (port 5000) and frontend (port 3000) running:
```bash
cd frontend
npm run test:e2e
```
This script will launch the E2E suite, perform title assertions, verify map and SVG components, and check chart container load states.
