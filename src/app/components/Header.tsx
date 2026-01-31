'use client';

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-[#222] sticky top-0 z-50 bg-[#050505]/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#ff00ff] animate-pulse" style={{ boxShadow: '0 0 10px #ff00ff' }} />
          <span className="font-[family-name:var(--font-syne)] font-bold text-sm tracking-wider">
            AI<span className="text-[#ff00ff]">_</span>TIMELINE
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="font-mono text-xs text-[#888] hover:text-[#ffff00] transition-colors tracking-wider"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            [{theme === 'light' ? 'DARK_MODE' : 'LIGHT_MODE'}]
          </button>
          <span className="font-mono text-xs text-[#555] hidden sm:inline">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </span>
        </div>
      </div>
    </header>
  );
}
