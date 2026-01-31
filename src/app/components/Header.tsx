'use client';

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleTheme}
        className="text-xs font-semibold tracking-wider text-[--text-muted] hover:text-[--text-primary] transition-colors px-3 py-1.5 border border-[--border] bg-[--bg-card]"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? 'DARK' : 'LIGHT'}
      </button>
    </div>
  );
}
