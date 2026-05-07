"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function FunnelChart({ data, onStageClick }: { data: any[], onStageClick?: (stage: string) => void }) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
          <Tooltip 
            cursor={{ fill: 'transparent' }} 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f3f4f6' }}
            formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value) || 0)}
          />
          <Bar 
            dataKey="count" 
            radius={[0, 4, 4, 0]} 
            barSize={32} 
            onClick={(data: any) => onStageClick?.(data?.stage || data?.payload?.stage || "Impressions")} 
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
