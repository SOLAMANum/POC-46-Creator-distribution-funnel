"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CommodityData {
  name: string;
  value: number;
  fill: string;
}

export function CommodityFlows({ data }: { data: CommodityData[] }) {
  // Format numbers to USD Millions
  const formatUSD = (val: number) => {
    return `$${val.toFixed(1)}M`;
  };

  return (
    <div className="h-[280px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} vertical={true} />
          <XAxis 
            type="number" 
            stroke="#9ca3af" 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `$${val}M`}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#9ca3af" 
            tickLine={false} 
            axisLine={false} 
            width={90}
            fontSize={12}
            fontWeight={600}
          />
          <Tooltip 
            formatter={(value: any) => [formatUSD(value), "Trade Value"]}
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#f3f4f6' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
