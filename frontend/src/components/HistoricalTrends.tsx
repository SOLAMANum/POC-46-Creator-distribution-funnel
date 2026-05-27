"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  day: string;
  throughput: number;
  delay: number;
}

export function HistoricalTrends({ data }: { data: TrendData[] }) {
  return (
    <div className="h-[280px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="day" stroke="#9ca3af" tickLine={false} axisLine={false} />
          
          {/* Left Y Axis for Throughput */}
          <YAxis 
            yAxisId="left" 
            stroke="#3b82f6" 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
          />
          
          {/* Right Y Axis for Delay */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#f59e0b" 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `${val}m`}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f3f4f6' }}
            labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
          />
          
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Throughput Line */}
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="throughput" 
            name="Truck Flow (Vehicles)"
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }} 
            activeDot={{ r: 6 }} 
          />
          
          {/* Delay Line */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="delay" 
            name="Avg Delay (Minutes)"
            stroke="#f59e0b" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
