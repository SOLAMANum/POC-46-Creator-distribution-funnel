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
  FileSpreadsheet,
  Info,
  X
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const apiUrl = 'https://poc-46-creator-distribution-funnel-1.onrender.com';
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
            <button 
              onClick={() => setIsInfoOpen(true)}
              className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer font-medium"
            >
              <Info size={16} />
              <span>Developer Signature</span>
            </button>
          </div>
        </header>



        {/* Main Dashboard Layout */}
        <div className="flex flex-col gap-6">
          
          {/* Expanded 100% Full Width Map/Visualization Stage */}
          <div className="w-full">
            <BorderMap 
              crossings={data.crossings} 
              selectedId={selectedId} 
              onSelectCrossing={(id) => {
                setSelectedId(id);
                setIsPanelOpen(true);
              }} 
            />
          </div>

          {/* Crossing Compare Engine */}
          <div className="w-full">
            <CrossingCompare crossings={data.crossings} />
          </div>

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

        {/* Dynamic Slide-over Intelligence Panel (Backdrop Overlay) */}
        {isPanelOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsPanelOpen(false)}
          />
        )}

        {/* Intelligence Panel Slide-over */}
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-gradient-to-b from-[#0f172a] to-[#030712] border-l border-gray-800/80 shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${
            isPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Panel Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-800/60 bg-[#070b15]/60 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Intelligence Command</h2>
              <p className="text-xs text-gray-400 mt-0.5">Real-time crossing analytics & metrics</p>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Panel Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800">
            
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
              <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1a] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-gray-850/80 pb-3">
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
                      onClick={() => {
                        setSelectedId(crossing.id);
                        setIsPanelOpen(true);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-colors cursor-pointer ${selectedId === crossing.id ? "border-blue-500/50 bg-blue-950/10" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(crossing.status)}`}></span>
                        <div className="text-xs">
                          <span className="text-white font-bold block">{crossing.name.split(" ")[0]}</span>
                          <span className="text-gray-500 text-[10px]">{crossing.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-300 block">{crossing.commercialDelay} min</span>
                        <span className="text-[9px] text-gray-500">Commercial</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Information Card (Why this matters & Who controls this) */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Why this matters</h4>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Logistical delay metrics direct the flow of supply-chains, directly affecting just-in-time cross-border manufacturing pipelines.
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Co-Managing Jurisdictions</h4>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Clearance operations co-managed by **U.S. Customs & Border Protection (CBP)** and Mexico's **SAT**.
                </p>
              </div>
            </div>

            {/* CSV export manifest trigger */}
            <button 
              onClick={() => {
                alert("Exporting border logistics report...");
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-semibold rounded-xl text-sm transition-colors shadow-lg"
            >
              <FileSpreadsheet size={14} />
              Export Logistics Stream CSV
            </button>
          </div>
        </div>

        {/* Developer Signature Metadata Modal */}
        {isInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsInfoOpen(false)}
            />
            
            {/* Modal Box */}
            <div className="relative bg-gradient-to-br from-[#0c142c] via-[#080d1e] to-[#040810] border border-blue-900/40 w-full max-w-md p-6 rounded-2xl shadow-2xl z-10 transform scale-100 transition-all">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Developer Signature</h3>
                  <p className="text-xs text-gray-400 mt-1">Platform Architecture & Metadata</p>
                </div>
                <button 
                  onClick={() => setIsInfoOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Info Rows */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-800/80">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Architect</span>
                  <span className="text-sm font-bold text-blue-400">solaman um</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-800/80">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch</span>
                  <span className="text-sm font-semibold text-emerald-400">Batch 2 Interns</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-800/80">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Scope</span>
                  <span className="text-sm font-medium text-gray-300">Creator Distribution Funnel</span>
                </div>
                <div className="py-2.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Technology Stack</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">Next.js 16</span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">FastAPI</span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">Tailwind CSS v4</span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">Recharts</span>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md">Selenium WebDriver</span>
                  </div>
                </div>
              </div>

              {/* Close Action */}
              <button 
                onClick={() => setIsInfoOpen(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer shadow-lg"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        )}

      </div>

      {/* InfoCreon Popover Modal Signature */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in select-none">
          <div className="w-full max-w-sm bg-[#090f1e]/95 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
            
            <button 
              onClick={() => setIsInfoOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-800 bg-[#090f1e]/85"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-gray-850 pb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Developer Signature</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Infocreon Structural Verification</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#111827]/40 border border-gray-800 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Architect:</span>
                  <span className="text-white font-bold">Solaman UM</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Batch:</span>
                  <span className="text-white font-bold">Batch 2 Interns</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Stack:</span>
                  <span className="text-blue-400 font-bold">Next.js, FastAPI, Tailwind CSS, SVG Map, Recharts</span>
                </div>
              </div>

              <div className="text-[9px] text-gray-500 text-center uppercase tracking-wider border-t border-gray-850 pt-4 font-bold">
                Border Analytics HUD Command Center • v1.0.0
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

interface FloatingMetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function FloatingMetricCard({ title, value, icon }: FloatingMetricCardProps) {
  return (
    <div className="bg-[#090f1e]/80 backdrop-blur-md border border-gray-800/80 px-4 py-2.5 rounded-xl shadow-lg hover:border-gray-700 transition-colors pointer-events-auto flex items-center gap-3">
      <div className="p-1.5 bg-[#111827]/80 border border-gray-850 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{title}</h4>
        <p className="text-xs font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  desc: string;
}

function MetricCard({ title, value, trend, icon, desc }: MetricCardProps) {
  return (
    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{title}</span>
          <span className="text-2xl font-bold text-white tracking-tight block">{value}</span>
        </div>
        <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl group-hover:border-gray-700 transition-all duration-300">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-850 pt-3">
        <span className="text-[11px] text-gray-500 line-clamp-1">{desc}</span>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
          {trend}
        </span>
      </div>
    </div>
  );
}
