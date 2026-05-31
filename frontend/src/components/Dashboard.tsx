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
  X,
  ChevronDown,
  ChevronUp
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
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(true);
  const [analyticsTab, setAnalyticsTab] = useState<"compare" | "charts">("charts");

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
      <div className="min-h-screen bg-[#040914] flex items-center justify-center">
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
    <div className="h-screen w-screen bg-[#040914] text-gray-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* Pillar III: Transparent InfoCreon Header */}
      <header className="h-16 border-b border-gray-800/55 bg-[#040914]/70 backdrop-blur-md px-6 flex items-center justify-between z-40 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-wide select-none">
              Border Crossing Trade & Logistics Analytics
            </h1>
            <p className="text-[9px] text-gray-500 font-bold tracking-wider uppercase hidden sm:block">
              Real-Time Corridor Operations Command Center
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#090f1e]/60 border border-gray-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase">
            <span>Sectors: US-MEX Corridor</span>
          </div>
          
          {/* sleek (i) Info Icon Button */}
          <button 
            onClick={() => setIsInfoOpen(true)}
            className="p-2 hover:bg-gray-850/80 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-800/40 bg-[#090f1e]/40"
            title="Structural Metadata"
          >
            <Info className="w-5 h-5 text-blue-400 hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Content Area (100% Full Screen Stage) */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#02040a]">
        
        {/* Background Map Container (Takes up 100% Screen) */}
        <div className="absolute inset-0 w-full h-full z-0">
          <BorderMap 
            crossings={data.crossings} 
            selectedId={selectedId} 
            onSelectCrossing={(id) => {
              setSelectedId(id);
              setIsPanelOpen(true); // Clicking map marker slides open panel
            }} 
          />
        </div>

        {/* Global Mini-Metrics HUD Panel - Floating Top Left */}
        <div className="absolute top-4 left-4 z-20 flex flex-col md:flex-row gap-3 max-w-[calc(100vw-32px)]">
          <FloatingMetricCard 
            title="Total Trade Value (24h)"
            value={data.totals.tradeValue24h}
            icon={<BadgeDollarSign className="text-blue-400 w-4 h-4" />}
          />
          <FloatingMetricCard 
            title="Truck Throughput (24h)"
            value={`${formatNum(data.totals.totalTrucks24h)} Vehicles`}
            icon={<Truck className="text-purple-400 w-4 h-4" />}
          />
          <FloatingMetricCard 
            title="Average Wait Index"
            value={data.totals.avgCommercialDelay}
            icon={<Clock className="text-emerald-400 w-4 h-4" />}
          />
        </div>

        {/* Collapsible Analytics Command Engine HUD Panel - Floating Bottom Left */}
        <div className={`absolute bottom-4 left-4 z-20 w-[550px] max-w-[calc(100vw-32px)] bg-[#090f1e]/85 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 pointer-events-auto flex flex-col ${isAnalyticsOpen ? "h-[380px]" : "h-12"}`}>
          
          {/* HUD Header */}
          <div className="h-12 px-4 border-b border-gray-800/80 flex items-center justify-between shrink-0 bg-[#060a15]/90">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">Logistics Analytics Engine</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Tab Selector */}
              {isAnalyticsOpen && (
                <div className="flex items-center bg-[#131b2e] border border-gray-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <button 
                    onClick={() => setAnalyticsTab("compare")} 
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${analyticsTab === "compare" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    Compare Engine
                  </button>
                  <button 
                    onClick={() => setAnalyticsTab("charts")} 
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${analyticsTab === "charts" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    Trends & Splits
                  </button>
                </div>
              )}
              
              {/* Collapse HUD Toggle */}
              <button 
                onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                className="p-1 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {isAnalyticsOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {/* HUD Panel Content */}
          {isAnalyticsOpen && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#090f1e]/60">
              <div className={analyticsTab === "compare" ? "scale-95 origin-top-left w-[105%]" : "hidden"}>
                <CrossingCompare crossings={data.crossings} />
              </div>
              <div className={analyticsTab === "charts" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "hidden"}>
                {/* Commodity split */}
                <div className="bg-[#111827]/40 border border-gray-800/40 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Global Commodity Split</h3>
                  <div className="h-[200px]">
                    <CommodityFlows data={data.globalCommodities} />
                  </div>
                </div>
                {/* Historical delays */}
                <div className="bg-[#111827]/40 border border-gray-800/40 p-4 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">7-Day Transit Delays</h3>
                  <div className="h-[200px]">
                    <HistoricalTrends data={data.historicalTrends} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pillar II: Slide-over Intelligence Panel Drawer (30% Content) */}
        <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#070b14]/95 backdrop-blur-xl border-l border-gray-800/80 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          {/* Drawer Header */}
          <div className="h-16 px-6 border-b border-gray-800/85 flex items-center justify-between shrink-0 bg-[#090f1e]">
            <div className="flex items-center gap-2 text-blue-400">
              <Activity size={18} className="animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Checkpoint Spec Sheet</h2>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-800 bg-[#090f1e]/80"
              title="Close Drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#070b14] to-[#040811]">
            
            {/* Selected Crossing Core Details */}
            {selectedCrossing && (
              <div className="space-y-6">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-2 ${getStatusClass(selectedCrossing.status)}`}>
                    {selectedCrossing.status}
                  </span>
                  <h3 className="text-2xl font-bold text-white leading-tight">{selectedCrossing.name}</h3>
                </div>

                {/* Delay HUD */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#111827]/40 border border-gray-800/50 p-3.5 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Commercial Wait</span>
                    <span className="text-lg font-extrabold text-blue-400">{selectedCrossing.commercialDelay} min</span>
                  </div>
                  <div className="bg-[#111827]/40 border border-gray-800/50 p-3.5 rounded-xl">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Passenger Wait</span>
                    <span className="text-lg font-extrabold text-cyan-400">{selectedCrossing.passengerDelay} min</span>
                  </div>
                </div>

                {/* Throughput details */}
                <div className="space-y-2.5 border-t border-gray-850 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Processed Throughput (24h)</span>
                    <span className="text-white font-bold">{selectedCrossing.throughput24h.toLocaleString()} trucks</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Manifest Value (24h)</span>
                    <span className="text-white font-bold">{selectedCrossing.value24h}</span>
                  </div>
                </div>

                {/* Commodity split percentages */}
                <div className="border-t border-gray-850 pt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Commodity Makeup</span>
                  <div className="space-y-2.5">
                    {selectedCrossing.commodities.map((comm) => (
                      <div key={comm.name} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300 font-medium">{comm.name}</span>
                        <span className="text-white font-bold">{comm.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advisory Warnings */}
                {selectedCrossing.status !== "Normal" && (
                  <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
                    <p className="text-amber-200 text-xs font-medium leading-relaxed">
                      <span className="text-white font-bold block mb-0.5">Corridor Delay Advisory:</span>
                      Freight backlog detected. Reroute non-perishables or extend customs clearance operations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Global ranked list of backlogs */}
            <div className="border-t border-gray-850 pt-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Delay Queue Stack</h3>
                <p className="text-[10px] text-gray-500 mt-1">Crossings ranked by commercial freight wait duration.</p>
              </div>

              <div className="space-y-2">
                {data.crossings
                  .sort((a, b) => b.commercialDelay - a.commercialDelay)
                  .map((crossing) => (
                    <div 
                      key={crossing.id}
                      onClick={() => setSelectedId(crossing.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${selectedId === crossing.id ? "border-blue-500/50 bg-blue-950/15" : "border-gray-850 bg-[#111827]/20 hover:border-gray-800"}`}
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

            {/* Context Advisory Details */}
            <div className="border-t border-gray-850 pt-6 space-y-4">
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
              onClick={() => alert("Downloading cross-border logistics stream CSV...")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-bold rounded-xl text-xs transition-colors shadow-lg cursor-pointer"
            >
              <FileSpreadsheet size={14} />
              Export Logistics Stream CSV
            </button>
          </div>
        </div>

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
                  <span className="text-white font-bold">Antigravity AI & Angel UM</span>
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
