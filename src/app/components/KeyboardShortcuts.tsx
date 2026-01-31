'use client';

import { useEffect } from 'react';

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '/':
          // Focus search
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
          break;

        case 'd':
          // Toggle dark mode
          const themeToggle = document.querySelector('button[aria-label*="Switch"]') as HTMLButtonElement;
          themeToggle?.click();
          break;

        case '?':
          // Show help (could add a modal later)
          alert(`Keyboard Shortcuts:
/ - Focus search
d - Toggle dark mode
? - Show this help
j / Arrow Down - Next item
k / Arrow Up - Previous item`);
          break;

        case 'j':
        case 'ArrowDown':
          // Navigate to next timeline item
          e.preventDefault();
          const currentFocus = document.activeElement;
          const allItems = document.querySelectorAll('.timeline-item h3 a');
          const currentIndex = Array.from(allItems).indexOf(currentFocus as Element);
          const nextItem = allItems[currentIndex + 1] as HTMLElement;
          nextItem?.focus();
          nextItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;

        case 'k':
        case 'ArrowUp':
          // Navigate to previous timeline item
          e.preventDefault();
          const currentEl = document.activeElement;
          const items = document.querySelectorAll('.timeline-item h3 a');
          const idx = Array.from(items).indexOf(currentEl as Element);
          const prevItem = items[idx - 1] as HTMLElement;
          prevItem?.focus();
          prevItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;

        case 'Escape':
          // Clear focus
          (document.activeElement as HTMLElement)?.blur();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
