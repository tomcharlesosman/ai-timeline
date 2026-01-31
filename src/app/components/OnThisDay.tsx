'use client';

import { useMemo } from 'react';
import updates from '../../data/updates.json';

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: string;
}

export default function OnThisDay() {
  const todayEvents = useMemo(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Find events from same month/day in previous years
    const historicalEvents = (updates as Update[]).filter(update => {
      const eventDate = new Date(update.date);
      return eventDate.getMonth() + 1 === month && 
             eventDate.getDate() === day &&
             eventDate.getFullYear() < today.getFullYear();
    });
    
    // Sort by year (most recent first)
    return historicalEvents.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 3); // Show max 3 events
  }, []);
  
  if (todayEvents.length === 0) return null;
  
  return (
    <section className="bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-accent p-6 mb-8 rounded-r-lg">
      <h3 className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-4">
        On this day in AI
      </h3>
      <div className="space-y-4">
        {todayEvents.map((event) => (
          <div key={event.id} className="flex gap-4 items-start">
            <span className="font-mono text-sm text-muted whitespace-nowrap">
              {new Date(event.date).getFullYear()}
            </span>
            <div>
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors font-medium"
              >
                {event.title}
              </a>
              <p className="text-sm text-muted line-clamp-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
