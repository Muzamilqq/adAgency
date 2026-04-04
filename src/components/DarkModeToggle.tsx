import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`
        relative overflow-hidden transition-colors
        ${isDarkMode 
          ? 'hover:bg-slate-800 text-yellow-400' 
          : 'hover:bg-gray-100 text-gray-600'
        }
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun 
        className={`
          w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
        `}
      />
      <Moon 
        className={`
          absolute w-5 h-5 transition-all duration-300
          ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
        `}
      />
    </Button>
  );
}
