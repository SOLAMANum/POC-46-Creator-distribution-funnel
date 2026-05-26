from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/data")
def get_data():
    try:
        file_path = os.path.join(os.path.dirname(__file__), "creator-distribution-funnel-sample.csv")
        
        with open(file_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)  # Skip header
            
            total_impressions = 0
            total_watch_time = 0
            total_clicks = 0
            total_conversions = 0
            
            platform_totals = {}
            cohort_by_date = {}
            
            for row in reader:
                if len(row) < 10:
                    continue
                
                date = row[0]
                platform = row[2]
                audience = row[4]
                
                try:
                    impressions = int(row[5]) if row[5] else 0
                except ValueError:
                    impressions = 0
                    
                try:
                    watch_time = int(row[6]) if row[6] else 0
                except ValueError:
                    watch_time = 0
                    
                try:
                    clicks = int(row[8]) if row[8] else 0
                except ValueError:
                    clicks = 0
                    
                try:
                    conversions = int(row[9]) if row[9] else 0
                except ValueError:
                    conversions = 0
                    
                # Funnel
                total_impressions += impressions
                total_watch_time += watch_time
                total_clicks += clicks
                total_conversions += conversions
                
                # Platform Split
                platform_totals[platform] = platform_totals.get(platform, 0) + impressions
                
                # Cohort Trend
                if date not in cohort_by_date:
                    cohort_by_date[date] = {"date": date, "Viewers": 0, "Builders": 0, "Allocators": 0}
                    
                if audience == "Everyday viewers":
                    cohort_by_date[date]["Viewers"] += impressions
                elif audience == "Builders":
                    cohort_by_date[date]["Builders"] += impressions
                elif audience == "Allocators":
                    cohort_by_date[date]["Allocators"] += impressions
                    
        funnel_data = [
            {"stage": "Impressions", "count": total_impressions, "fill": "#3b82f6"},
            {"stage": "Watch Time (hrs)", "count": total_watch_time, "fill": "#8b5cf6"},
            {"stage": "Clicks (CTR)", "count": total_clicks, "fill": "#ec4899"},
            {"stage": "Conversions", "count": total_conversions, "fill": "#10b981"}
        ]
        
        platform_colors = {
            "YouTube": "#ef4444",
            "TikTok": "#06b6d4",
            "Instagram": "#d946ef",
            "X": "#1d4ed8",
            "LinkedIn": "#0284c7"
        }
        
        platform_data = [
            {"name": name, "value": count, "fill": platform_colors.get(name, "#64748b")}
            for name, count in platform_totals.items()
        ]
        
        # Sort dates
        sorted_dates = sorted(cohort_by_date.keys())
        cohort_data = [cohort_by_date[d] for d in sorted_dates]
        
        return {
            "funnelData": funnel_data,
            "platformData": platform_data,
            "cohortData": cohort_data,
            "totals": {
                "viewers": total_impressions,
                "builders": total_clicks,
                "allocators": total_conversions
            }
        }
    except Exception as e:
        print(e)
        return {"error": "Failed to process data"}
