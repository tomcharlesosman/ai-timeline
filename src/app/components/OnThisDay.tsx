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
    
    const historicalEvents = (updates as Update[]).filter(update => {
      const eventDate = new Date(update.date);
      return eventDate.getMonth() + 1 === month && 
             eventDate.getDate() === day &&
             eventDate.getFullYear() < today.getFullYear();
    });
    
    return historicalEvents.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 3);
  }, []);
  
  if (todayEvents.length === 0) return null;
  
  return (
    <section className="border-l-2 border-[--accent] pl-6 py-2 mb-12">
      <h3 className="section-title text-[--accent] mb-4">
        On this day in AI
      </h3>
      <div className="space-y-4">
        {todayEvents.map((event) => (
          <div key={event.id} className="flex gap-4 items-start">
            <span className="text-sm font-[family-name:var(--font-tiempos)] text-[--text-muted] whitespace-nowrap">
              {new Date(event.date).getFullYear()}
            </span>
            <div>
              <a 
                href={event.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[--text-primary] hover:text-[--accent] transition-colors font-medium"
              >
                {event.title}
              </a>
              <p className="text-sm text-[--text-secondary] line-clamp-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
