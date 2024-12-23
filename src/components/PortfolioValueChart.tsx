import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface PortfolioValueChartProps {
  data: Array<{
    date: string;
    value: number;
    ytdReturn?: number;
  }>;
}

export function PortfolioValueChart({ data }: PortfolioValueChartProps) {
  console.log("PortfolioValueChart - Raw Data:", data);

  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: format(new Date(item.date), 'MMM yyyy'),
      formattedValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(item.value),
    }));
  }, [data]);

  console.log("PortfolioValueChart - Formatted Data:", formattedData);

  // Calculate domain padding (10% above max and below min)
  const domainPadding = React.useMemo(() => {
    if (!data.length) return { min: 0, max: 0 };
    
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    return {
      min: minValue - (range * 0.1),
      max: maxValue + (range * 0.1)
    };
  }, [data]);

  return (
    <div className="w-full">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              vertical={false}
              strokeDasharray="3 3" 
            />
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: '#888888', fontSize: 11 }}
            />
            <YAxis
              domain={[domainPadding.min, domainPadding.max]}
              tick={{ fill: '#888888', fontSize: 11 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                      <p className="text-sm font-bold">{label}</p>
                      <p className="text-sm">
                        Value: {payload[0].payload.formattedValue}
                      </p>
                      {payload[0].payload.ytdReturn !== undefined && (
                        <p className="text-sm">
                          YTD Return: {payload[0].payload.ytdReturn.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}