"use client";

import { useEffect, useState } from "react";
import { FunnelChart } from "./FunnelChart";
import { PlatformSplit } from "./PlatformSplit";
import { CohortCompare } from "./CohortCompare";
import { Filter, Users, Eye, ArrowRightCircle, Loader2, Info } from "lucide-react";

export function Dashboard() {
  const [activeStage, setActiveStage] = useState<string>("Impressions");
  const [data, setData] = useState<{
    funnelData: any[];
    platformData: any[];
    cohortData: any[];
    totals: { viewers: number; builders: number; allocators: number };
  } | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Creator Distribution Funnel
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Real Rails Intelligence Library. Monitor the core rail of <span className="text-white font-medium">Distribution & Demand</span>. 
              Track engagement from everyday viewers to dedicated builders and allocators.
            </p>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="/creator-distribution-funnel-sample.csv" 
              download 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium rounded-lg text-sm transition-colors shadow-lg"
            >
              Download Sample CSV
            </a>
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm text-gray-300">
              <Filter size={16} />
              <span>Content Type: All</span>
            </div>
          </div>
        </header>



        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Everyday Viewers (Impressions)" 
            value={formatNum(data.totals.viewers)} 
            trend="Real-time" 
            icon={<Eye className="text-blue-400" />} 
            desc="Broad audience reached through impressions and short-form content."
          />
          <MetricCard 
            title="Builders (Clicks)" 
            value={formatNum(data.totals.builders)} 
            trend="Real-time" 
            icon={<Users className="text-purple-400" />} 
            desc="Engaged users who click through and spend significant watch time."
          />
          <MetricCard 
            title="Allocators (Conversions)" 
            value={formatNum(data.totals.allocators)} 
            trend="Real-time" 
            icon={<ArrowRightCircle className="text-emerald-400" />} 
            desc="High-intent users taking conversion actions."
          />
        </div>

        {/* 70/30 Layout Split */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Content Area (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6">
            
            {/* Main Funnel */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Distribution & Demand Funnel</h2>
                <p className="text-sm text-gray-400 mt-1">Click on a stage below to view detailed handshake insights in the sidebar.</p>
              </div>
              <FunnelChart data={data.funnelData} onStageClick={setActiveStage} />
            </div>

            {/* Cohort Compare */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Audience Cohort Comparison</h2>
                  <p className="text-sm text-gray-400 mt-1">Analyzing audience segments engagement over time.</p>
                </div>
              </div>
              <CohortCompare data={data.cohortData} />
            </div>
          </div>

          {/* Sidebar Content Area (30%) */}
          <div className="w-full lg:w-[30%] flex flex-col gap-6">
            
            {/* Interactive Stage Handshake Panel */}
            <StageSidebar stage={activeStage} />

            {/* Platform Split */}
            <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Platform Split</h2>
                <p className="text-sm text-gray-400 mt-1">Where the audience is consuming content.</p>
              </div>
              <PlatformSplit data={data.platformData} />
            </div>
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
        <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">{trend}</span>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
      <p className="text-xs text-gray-500 mt-3 border-t border-gray-800 pt-3">{desc}</p>
    </div>
  );
}

function StageSidebar({ stage }: { stage: string }) {
  const stageData: Record<string, { title: string, desc: string, highlight: string }> = {
    "Impressions": {
      title: "Top-of-Funnel Reach",
      desc: "This stage represents the total visibility of your content across all platforms. A high impression count indicates strong algorithm distribution, primarily capturing the 'Everyday Viewers' segment.",
      highlight: "Focus on eye-catching thumbnails and broad hooks to drive users deeper into the funnel."
    },
    "Watch Time (hrs)": {
      title: "Content Retention",
      desc: "Deep engagement metric. High watch time indicates that the content resonates strongly. This is where 'Everyday Viewers' begin transitioning into 'Builders'.",
      highlight: "Analyze drop-off rates in your long-form content to improve core retention."
    },
    "Clicks (CTR)": {
      title: "Intent Signal",
      desc: "Users are taking explicit action to explore further. High CTR implies your calls-to-action (CTAs) and value propositions are effective.",
      highlight: "A/B test your CTAs and link placements to maximize the throughput to Conversions."
    },
    "Conversions": {
      title: "Bottom-of-Funnel Success",
      desc: "The final handshake. These are your 'Allocators' committing capital, time, or significant trust to your ecosystem.",
      highlight: "Nurture this cohort. They represent your highest Lifetime Value (LTV) audience."
    }
  };

  // Fallback if stage doesn't perfectly match (though it should)
  const data = stageData[stage] || stageData["Impressions"];

  return (
    <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1a] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Info size={20} />
        <h2 className="text-sm font-bold uppercase tracking-wider">Stage Handshake</h2>
      </div>
      
      <div className="flex-1">
        <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs font-semibold mb-3">
          {stage}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{data.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {data.desc}
        </p>
        
        <div className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-xl">
          <p className="text-blue-200 text-sm font-medium">
            <span className="text-white font-bold block mb-1">Action Item:</span>
            {data.highlight}
          </p>
        </div>
      </div>
    </div>
  );
}
