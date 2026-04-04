import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PerformanceData } from '@/types';
import { format, parseISO } from 'date-fns';

interface PerformanceChartProps {
  data: PerformanceData[];
  isDarkMode: boolean;
  metrics?: Array<'impressions' | 'clicks' | 'conversions' | 'spend'>;
}

export function PerformanceChart({ 
  data, 
  isDarkMode,
  metrics = ['impressions', 'clicks', 'conversions']
}: PerformanceChartProps) {
  // Format data for chart
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: format(parseISO(item.date), 'MMM dd'),
    }));
  }, [data]);

  // Metric configurations
  const metricConfig = {
    impressions: { color: '#3b82f6', label: 'Impressions' },
    clicks: { color: '#10b981', label: 'Clicks' },
    conversions: { color: '#f59e0b', label: 'Conversions' },
    spend: { color: '#ef4444', label: 'Spend ($)' },
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-3 rounded-lg shadow-lg border
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        `}>
          <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#334155' : '#e5e7eb'} 
          />
          <XAxis 
            dataKey="date" 
            stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}k`;
              }
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: isDarkMode ? '#94a3b8' : '#6b7280'
            }}
          />
          {metrics.map(metric => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={metricConfig[metric].label}
              stroke={metricConfig[metric].color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
