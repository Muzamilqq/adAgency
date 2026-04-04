import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  onChange: (range: { start: string; end: string } | undefined) => void;
  isDarkMode: boolean;
}

type PresetRange = '7d' | '30d' | '90d' | 'custom';

export function DateRangePicker({ onChange, isDarkMode }: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetRange>('30d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  // Apply preset range
  const applyPreset = (preset: PresetRange) => {
    setSelectedPreset(preset);
    
    if (preset === 'custom') {
      return;
    }

    const end = new Date();
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
    const start = subDays(end, days);

    const range = {
      from: startOfDay(start),
      to: endOfDay(end),
    };

    setDateRange(range);
    onChange({
      start: format(range.from, 'yyyy-MM-dd'),
      end: format(range.to, 'yyyy-MM-dd'),
    });
    setIsOpen(false);
  };

  // Handle custom date selection
  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setSelectedPreset('custom');
    
    if (range?.from && range?.to) {
      onChange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.to, 'yyyy-MM-dd'),
      });
    }
  };

  // Format display text
  const getDisplayText = () => {
    if (selectedPreset !== 'custom') {
      return selectedPreset === '7d' 
        ? 'Last 7 days' 
        : selectedPreset === '30d' 
          ? 'Last 30 days' 
          : 'Last 90 days';
    }

    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
    }

    return 'Select date range';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`
            flex items-center gap-2 min-w-[180px]
            ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}
          `}
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="flex-1 text-left">{getDisplayText()}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-auto p-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : ''}`}
        align="end"
      >
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as PresetRange[]).map((preset) => (
              <Button
                key={preset}
                variant={selectedPreset === preset ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset === '7d' ? '7d' : preset === '30d' ? '30d' : '90d'}
              </Button>
            ))}
          </div>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateSelect}
          numberOfMonths={2}
          className={isDarkMode ? 'dark' : ''}
        />
        {selectedPreset === 'custom' && dateRange?.from && dateRange?.to && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-700">
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
