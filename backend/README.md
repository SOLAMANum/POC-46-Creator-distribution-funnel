# Border Crossing Analytics Backend

This is the Python FastAPI backend service for the **Border Crossing & Trade Logistics Analytics Platform**. It serves real-time trade, delay, and commodity statistics via a structured REST API.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (version 0.136.3)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (version 0.48.0)
- **Auto-Reload Reloader**: WatchFiles (for fast local development file change detection)
- **CORS Middleware**: Native FastAPI CORS configured to support local dashboard requests from browser interfaces

---

## 🚀 Installation & Running

### 1. Prerequisites
Ensure you have Python 3.10+ installed on your local machine.

### 2. Activate Python Virtual Environment
- **Windows (PowerShell)**:
  ```powershell
  .\venv\Scripts\activate
  ```
- **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Requirements
Dependencies are listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 4. Start the API Server
Start Uvicorn with reload enabled:
```bash
python -m uvicorn main:app --port 5000 --host 127.0.0.1 --reload
```
The server will run on **`http://127.0.0.1:5000`**.

---

## 📊 API Endpoint Schema

### `GET /api/data`
Returns the complete dataset needed to populate the dashboard metrics, maps, comparisons, and charts.

#### Response Format (JSON)
```json
{
  "totals": {
    "tradeValue24h": "$492.6M",
    "totalTrucks24h": 24520,
    "avgCommercialDelay": "42 min",
    "activeCrossings": 5
  },
  "crossings": [
    {
      "id": "laredo",
      "name": "Laredo (World Trade Bridge)",
      "status": "Delayed",
      "commercialDelay": 75,
      "passengerDelay": 35,
      "throughput24h": 8450,
      "value24h": "$184.2M",
      "coords": { "x": 65, "y": 70 },
      "commodities": [
        { "name": "Automotive", "value": 40 },
        { "name": "Electronics", "value": 30 },
        { "name": "Machinery", "value": 20 },
        { "name": "Agriculture", "value": 10 }
      ]
    }
    // ... other crossings
  ],
  "globalCommodities": [
    { "name": "Electronics", "value": 185.0, "fill": "#3b82f6" }
    // ... global stats
  ],
  "historicalTrends": [
    { "day": "Mon", "throughput": 21500, "delay": 35 }
    // ... 7-day data
  ]
}
```
