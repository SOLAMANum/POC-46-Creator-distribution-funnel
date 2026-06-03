from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Border Crossing Trade & Logistics Analytics API",
        "endpoints": {
            "data": "/api/data",
            "docs": "/docs"
        }
    }

@app.get("/api/data")
def get_border_data():
    totals = {
        "tradeValue24h": "$492.6M",
        "totalTrucks24h": 24520,
        "avgCommercialDelay": "42 min",
        "activeCrossings": 5,
        "viewers": 24520,  # fallback for backward-compatibility or metric cards
        "builders": 42,
        "allocators": 5
    }

    crossings = [
        {
            "id": "laredo",
            "name": "Laredo (World Trade Bridge)",
            "status": "Delayed",
            "commercialDelay": 75,
            "passengerDelay": 35,
            "throughput24h": 8450,
            "value24h": "$184.2M",
            "trend": [6800, 7200, 7500, 8100, 8300, 8500, 8450],
            "coords": { "x": 65, "y": 70 },
            "commodities": [
                { "name": "Automotive", "value": 40 },
                { "name": "Electronics", "value": 30 },
                { "name": "Machinery", "value": 20 },
                { "name": "Agriculture", "value": 10 }
            ]
        },
        {
            "id": "elpaso",
            "name": "El Paso (Ysleta)",
            "status": "Normal",
            "commercialDelay": 20,
            "passengerDelay": 15,
            "throughput24h": 4820,
            "value24h": "$98.5M",
            "trend": [4500, 4600, 4700, 4650, 4800, 4750, 4820],
            "coords": { "x": 45, "y": 42 },
            "commodities": [
                { "name": "Electronics", "value": 45 },
                { "name": "Automotive", "value": 25 },
                { "name": "Machinery", "value": 15 },
                { "name": "Textiles", "value": 15 }
            ]
        },
        {
            "id": "otay",
            "name": "Otay Mesa (San Diego)",
            "status": "Congested",
            "commercialDelay": 110,
            "passengerDelay": 55,
            "throughput24h": 3950,
            "value24h": "$81.4M",
            "trend": [3500, 3600, 3850, 3900, 3700, 3800, 3950],
            "coords": { "x": 15, "y": 15 },
            "commodities": [
                { "name": "Electronics", "value": 55 },
                { "name": "Agriculture", "value": 20 },
                { "name": "Textiles", "value": 15 },
                { "name": "Automotive", "value": 10 }
            ]
        },
        {
            "id": "nogales",
            "name": "Nogales (Mariposa)",
            "status": "Normal",
            "commercialDelay": 15,
            "passengerDelay": 10,
            "throughput24h": 3150,
            "value24h": "$64.3M",
            "trend": [3000, 3050, 3100, 3120, 2900, 3000, 3150],
            "coords": { "x": 30, "y": 30 },
            "commodities": [
                { "name": "Agriculture", "value": 60 },
                { "name": "Automotive", "value": 15 },
                { "name": "Machinery", "value": 15 },
                { "name": "Electronics", "value": 10 }
            ]
        },
        {
            "id": "brownsville",
            "name": "Brownsville (Veterans)",
            "status": "Normal",
            "commercialDelay": 25,
            "passengerDelay": 20,
            "throughput24h": 4150,
            "value24h": "$64.2M",
            "trend": [3800, 3900, 4000, 4050, 4100, 4200, 4150],
            "coords": { "x": 75, "y": 85 },
            "commodities": [
                { "name": "Machinery", "value": 35 },
                { "name": "Agriculture", "value": 25 },
                { "name": "Automotive", "value": 20 },
                { "name": "Textiles", "value": 20 }
            ]
        }
    ]

    global_commodities = [
        { "name": "Electronics", "value": 185.0, "fill": "#3b82f6" },
        { "name": "Automotive", "value": 132.0, "fill": "#8b5cf6" },
        { "name": "Machinery", "value": 88.5, "fill": "#ec4899" },
        { "name": "Agriculture", "value": 54.2, "fill": "#10b981" },
        { "name": "Textiles", "value": 32.9, "fill": "#eab308" }
    ]

    historical_trends = [
        { "day": "Mon", "throughput": 21500, "delay": 35 },
        { "day": "Tue", "throughput": 22400, "delay": 38 },
        { "day": "Wed", "throughput": 23800, "delay": 42 },
        { "day": "Thu", "throughput": 24100, "delay": 45 },
        { "day": "Fri", "throughput": 24600, "delay": 41 },
        { "day": "Sat", "throughput": 23900, "delay": 39 },
        { "day": "Sun", "throughput": 24520, "delay": 42 }
    ]

    return {
        "totals": totals,
        "crossings": crossings,
        "globalCommodities": global_commodities,
        "historicalTrends": historical_trends
    }
