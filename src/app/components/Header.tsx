'use client';

import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-display font-semibold text-sm">AI Timeline</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <button
            onClick={toggleTheme}
            className="hover:text-foreground transition-colors flex items-center gap-1"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          <span>{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
          <a
            href="https://github.com/tomcharlesosman/ai-timeline"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
