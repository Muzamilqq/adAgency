import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  isDarkMode: boolean;
  format?: 'number' | 'currency' | 'percentage';
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs last period', 
  icon: Icon,
  isDarkMode,
  format = 'number'
}: KPICardProps) {
  // Format value based on type
  const formattedValue = (() => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value));
    }
    if (format === 'percentage') {
      return `${Number(value).toFixed(2)}%`;
    }
    if (typeof value === 'number' && value >= 1000) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    }
    return value;
  })();

  // Determine trend
  const TrendIcon = change === undefined ? Minus : change >= 0 ? TrendingUp : TrendingDown;
  const trendColor = change === undefined 
    ? 'text-gray-500' 
    : change >= 0 
      ? 'text-green-500' 
      : 'text-red-500';

  return (
    <Card className={`
      transition-all duration-200 hover:shadow-lg
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
    `}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {title}
        </CardTitle>
        <div className={`
          p-2 rounded-lg
          ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}
        `}>
          <Icon className={`w-4 h-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {formattedValue}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className={`text-sm font-medium ${trendColor}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              {changeLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
