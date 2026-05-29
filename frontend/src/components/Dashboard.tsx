"use client";

import { useEffect, useState } from "react";
import { BorderMap } from "./BorderMap";
import { CrossingCompare } from "./CrossingCompare";
import { CommodityFlows } from "./CommodityFlows";
import { HistoricalTrends } from "./HistoricalTrends";
import { 
  Filter, 
  MapPin, 
  Clock, 
  Truck, 
  TrendingUp, 
  Loader2, 
  ShieldAlert, 
  BadgeDollarSign, 
  Activity,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";

interface Crossing {
  id: string;
  name: string;
  status: string;
  commercialDelay: number;
  passengerDelay: number;
  throughput24h: number;
  value24h: string;
  trend: number[];
  coords: { x: number; y: number };
  commodities: { name: string; value: number }[];
}

interface DashboardData {
  totals: {
    tradeValue24h: string;
    totalTrucks24h: number;
    avgCommercialDelay: string;
    activeCrossings: number;
  };
  crossings: Crossing[];
  globalCommodities: any[];
  historicalTrends: any[];
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedId, setSelectedId] = useState<string>("laredo");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/data`)
      .then(res => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const selectedCrossing = data.crossings.find(c => c.id === selectedId) || data.crossings[0];

  // Helper for status classes
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "delayed":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "congested":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  // Helper for status background indicator dots
  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-emerald-500";
      case "delayed":
        return "bg-amber-500";
      case "congested":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format large truck count
  const formatNum = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-500 bg-clip-text text-transparent">
              Border Crossing Trade & Logistics Analytics
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Real-time monitor of port transit delays, commercial trade values, vehicle throughputs, 
              and commodity splits along key border crossings.
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm text-gray-300">
              <Filter size={16} />
              <span>Sectors: All Ports</span>
            </div>
          </div>
        </header>



        {/* 70/30 Layout Split */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content Area (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            
            {/* Interactive Border Map */}
            <BorderMap 
              crossings={data.crossings} 
              selectedId={selectedId} 
              onSelectCrossing={setSelectedId} 
            />

            {/* Crossing Compare Engine */}
            <CrossingCompare crossings={data.crossings} />

            {/* Global Commodity & Historical split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Commodity Flows */}
              <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl">
                <div>
                  <h2 className="text-lg font-semibold text-white">Global Commodity Flows</h2>
                  <p className="text-xs text-gray-400 mt-1">Aggregated monetary trade volume split by commodity type.</p>
                </div>
                <CommodityFlows data={data.globalCommodities} />
              </div>

              {/* Historical Trends */}
              <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl">
                <div>
                  <h2 className="text-lg font-semibold text-white">7-Day Transit Trends</h2>
                  <p className="text-xs text-gray-400 mt-1">Historical correlation between flow throughput and average wait delays.</p>
                </div>
                <HistoricalTrends data={data.historicalTrends} />
              </div>

            </div>
          </div>

          {/* Sidebar Content Area (30%) */}
          <div className="w-full lg:w-[30%] flex flex-col gap-6">
            
            {/* Global Metrics */}
            <div className="flex flex-col gap-4">
              <MetricCard 
                title="Total Trade Value (24h)" 
                value={data.totals.tradeValue24h} 
                trend="Active Flow" 
                icon={<BadgeDollarSign className="text-blue-400" />} 
                desc="Accumulated monetary value of cargo manifest crossings in the last 24h."
              />
              <MetricCard 
                title="Truck Throughput (24h)" 
                value={`${formatNum(data.totals.totalTrucks24h)} Vehicles`} 
                trend="Commercial" 
                icon={<Truck className="text-purple-400" />} 
                desc="Total volume of processed supply chain trucks and logistics containers."
              />
              <MetricCard 
                title="Average Transit Wait" 
                value={data.totals.avgCommercialDelay} 
                trend="Network Delay" 
                icon={<Clock className="text-emerald-400" />} 
                desc="Global average wait time index across all commercial freight terminals."
              />
            </div>
            
            {/* Contextual Selected Crossing Sidebar */}
            {selectedCrossing && (
              <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1a] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-gray-800/80 pb-3">
                  <Activity size={20} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Port Specification</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-semibold mb-2 ${getStatusClass(selectedCrossing.status)}`}>
                      {selectedCrossing.status}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">{selectedCrossing.name}</h3>
                  </div>

                  {/* Delay Indicators */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900/80 border border-gray-800/60 p-3 rounded-xl">
                      <span className="text-xs text-gray-500 font-bold block mb-1">Commercial Wait</span>
                      <span className="text-lg font-extrabold text-blue-400">{selectedCrossing.commercialDelay} min</span>
                    </div>
                    <div className="bg-gray-900/80 border border-gray-800/60 p-3 rounded-xl">
                      <span className="text-xs text-gray-500 font-bold block mb-1">Passenger Wait</span>
                      <span className="text-lg font-extrabold text-cyan-400">{selectedCrossing.passengerDelay} min</span>
                    </div>
                  </div>

                  {/* Port Stats */}
                  <div className="space-y-2 border-t border-gray-850 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Throughput (24h)</span>
                      <span className="text-white font-bold">{selectedCrossing.throughput24h.toLocaleString()} trucks</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trade Value (24h)</span>
                      <span className="text-white font-bold">{selectedCrossing.value24h}</span>
                    </div>
                  </div>

                  {/* Top Commodities */}
                  <div className="border-t border-gray-850 pt-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Commodity Share</span>
                    <div className="space-y-2">
                      {selectedCrossing.commodities.map((comm) => (
                        <div key={comm.name} className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-medium">{comm.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{comm.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adaptive Action Alerts */}
                  {selectedCrossing.status !== "Normal" && (
                    <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-xl flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-amber-200 text-xs font-medium">
                        <span className="text-white font-bold block mb-0.5">Congestion Advisory:</span>
                        High freight backlogs detected. Reroute non-perishable shipments or extend customs agent schedules.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delay Cards Stack */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Transit Delay Status</h2>
                <p className="text-xs text-gray-400 mt-1">Active crossings ranked by transit backlog duration.</p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {data.crossings
                  .sort((a, b) => b.commercialDelay - a.commercialDelay)
                  .map((crossing) => (
                    <div 
                      key={crossing.id}
                      onClick={() => setSelectedId(crossing.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors cursor-pointer ${selectedId === crossing.id ? "border-blue-500/50 bg-blue-950/10" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(crossing.status)}`}></span>
                        <div className="text-xs">
                          <span className="text-white font-bold block">{crossing.name.split(" ")[0]}</span>
                          <span className="text-gray-500">{crossing.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-300 block">{crossing.commercialDelay} min</span>
                        <span className="text-[10px] text-gray-500">Commercial</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Information Card (Why this matters & Who controls this) */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Why this matters</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Transit delays directly impact global supply chains, increasing transport costs and affecting just-in-time manufacturing. Monitoring these metrics in real-time allows logistics operators to optimize routing, reduce idle fuel waste, and ensure timely cargo delivery.
                </p>
              </div>
              <div className="border-t border-gray-800/80 pt-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Who controls this</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Port operations and border crossing points are co-managed by federal and state agencies, including <strong>U.S. Customs and Border Protection (CBP)</strong> and Mexico's <strong>Servicio de Administración Tributaria (SAT)</strong>, alongside local port authorities.
                </p>
              </div>
            </div>

            {/* Export Action Button */}
            <button 
              onClick={() => {
                alert("Exporting border logistics report...");
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-semibold rounded-xl text-sm transition-colors shadow-lg"
            >
              <FileSpreadsheet size={16} />
              Export Logistics CSV
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, desc }: { title: string, value: string, trend: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl shadow-lg hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-800 rounded-lg">
          {icon}
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">{trend}</span>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
      <p className="text-xs text-gray-500 mt-3 border-t border-gray-800 pt-3">{desc}</p>
    </div>
  );
}
