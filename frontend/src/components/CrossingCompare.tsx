"use client";

import { useState } from "react";
import { ArrowLeftRight, Clock, Truck, ShieldAlert, BadgeDollarSign } from "lucide-react";

interface Commodity {
  name: string;
  value: number;
}

interface Crossing {
  id: string;
  name: string;
  status: string;
  commercialDelay: number;
  passengerDelay: number;
  throughput24h: number;
  value24h: string;
  commodities: Commodity[];
}

interface CrossingCompareProps {
  crossings: Crossing[];
}

export function CrossingCompare({ crossings }: CrossingCompareProps) {
  const [portAId, setPortAId] = useState<string>(crossings[0]?.id || "laredo");
  const [portBId, setPortBId] = useState<string>(crossings[1]?.id || "elpaso");

  const portA = crossings.find((c) => c.id === portAId) || crossings[0];
  const portB = crossings.find((c) => c.id === portBId) || crossings[1];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "delayed":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "congested":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getCommodityColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "electronics":
        return "bg-blue-500";
      case "automotive":
        return "bg-purple-500";
      case "machinery":
        return "bg-pink-500";
      case "agriculture":
        return "bg-emerald-500";
      case "textiles":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl w-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-800/50 pb-4 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <ArrowLeftRight className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Crossing Comparison Engine</h2>
          <p className="text-sm text-gray-400 mt-1">
            Compare wait delays, commercial flow capacity, and commodity profiles between ports.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Port A (Left Spec)</label>
          <select
            value={portAId}
            onChange={(e) => setPortAId(e.target.value)}
            className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-medium"
          >
            {crossings.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === portBId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Port B (Right Spec)</label>
          <select
            value={portBId}
            onChange={(e) => setPortBId(e.target.value)}
            className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 font-medium"
          >
            {crossings.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === portAId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Port A Card */}
        {portA && (
          <div className="bg-[#0f1522] border border-gray-800/80 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-white">{portA.name}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(portA.status)} font-semibold`}>
                {portA.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Commercial Wait</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {portA.commercialDelay}m
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Passenger Wait</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {portA.passengerDelay}m
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Throughput (24h)</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-purple-400" />
                  {portA.throughput24h.toLocaleString()} trucks
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Trade Value (24h)</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
                  {portA.value24h}
                </span>
              </div>
            </div>

            {/* Commodities */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Commodity Makeup</span>
              <div className="space-y-3">
                {portA.commodities.map((comm) => (
                  <div key={comm.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-300">{comm.name}</span>
                      <span className="text-white font-bold">{comm.value}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCommodityColor(comm.name)} rounded-full`}
                        style={{ width: `${comm.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Port B Card */}
        {portB && (
          <div className="bg-[#0f1522] border border-gray-800/80 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-white">{portB.name}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(portB.status)} font-semibold`}>
                {portB.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Commercial Wait</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {portB.commercialDelay}m
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Passenger Wait</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {portB.passengerDelay}m
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Throughput (24h)</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-purple-400" />
                  {portB.throughput24h.toLocaleString()} trucks
                </span>
              </div>
              <div className="bg-[#1f2937]/30 border border-gray-800/50 p-3 rounded-lg">
                <span className="text-xs text-gray-500 font-semibold block mb-1">Trade Value (24h)</span>
                <span className="text-xl font-bold text-white flex items-center gap-1.5">
                  <BadgeDollarSign className="w-4 h-4 text-emerald-400" />
                  {portB.value24h}
                </span>
              </div>
            </div>

            {/* Commodities */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Commodity Makeup</span>
              <div className="space-y-3">
                {portB.commodities.map((comm) => (
                  <div key={comm.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-300">{comm.name}</span>
                      <span className="text-white font-bold">{comm.value}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCommodityColor(comm.name)} rounded-full`}
                        style={{ width: `${comm.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
