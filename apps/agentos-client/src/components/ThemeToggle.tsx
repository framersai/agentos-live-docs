import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, Theme } from '../state/themeStore';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const themes: Array<{ value: Theme; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
    { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
  ];

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/70 p-0.5 backdrop-blur dark:bg-slate-900/50"
      role="radiogroup"
      aria-label="Theme preference"
    >
      {themes.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          role="radio"
          aria-checked={theme === value}
          className={`
            inline-flex items-center justify-center rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
            ${theme === value ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-white/10'}
          `}
          title={`${label} theme`}
          aria-label={`${label} theme`}
        >
          <span aria-hidden="true">{icon}</span>
        </button>
      ))}
    </div>
  );
}
