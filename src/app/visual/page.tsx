'use client';

import { useState, useMemo, useRef } from 'react';
import updates from '@/data/updates.json';

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product" | "market" | "policy";
}

const categoryColors: Record<string, string> = {
  model: '#c41e3a',
  lab: '#1e40af',
  research: '#854d0e',
  product: '#166534',
  market: '#7c3aed',
  policy: '#9a3412',
};

export default function VisualTimeline() {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const years = useMemo(() => {
    const allYears = (updates as Update[]).map(u => new Date(u.date).getFullYear());
    return [...new Set(allYears)].sort().reverse();
  }, []);

  const filtered = useMemo(() => {
    return (updates as Update[])
      .filter(u => selectedYear === 'all' || new Date(u.date).getFullYear().toString() === selectedYear)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedYear]);

  const timelineData = useMemo(() => {
    if (filtered.length === 0) return [];
    
    const minDate = new Date(filtered[0].date).getTime();
    const maxDate = new Date(filtered[filtered.length - 1].date).getTime();
    const range = maxDate - minDate || 1;
    
    return filtered.map(item => {
      const date = new Date(item.date).getTime();
      const position = ((date - minDate) / range) * 100;
      return { ...item, position };
    });
  }, [filtered]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Masthead */}
      <header className="border-b border-[--border] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[--bg-primary]/95 backdrop-blur z-50">
        <div>
          <h1 className="font-[family-name:var(--font-tiempos)] text-2xl">Visual Timeline</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[--bg-card] border border-[--border] text-[--text-primary] px-3 py-1.5 text-sm focus:outline-none focus:border-[--text-muted]"
          >
            <option value="all">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          <a href="/" className="text-xs font-semibold tracking-wider text-[--text-muted] hover:text-[--accent]">
            BACK
          </a>
        </div>
      </header>

      {/* Timeline Container */}
      <div className="relative h-[calc(100vh-72px)] flex flex-col">
        {/* Year markers */}
        <div className="h-14 border-b border-[--border] flex items-center px-8 relative bg-[--bg-secondary]">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={`absolute text-xs font-semibold tracking-wider px-3 py-1 transition-colors ${
                selectedYear === year.toString() 
                  ? 'text-[--accent] bg-[--accent-light]' 
                  : 'text-[--text-muted] hover:text-[--text-primary]'
              }`}
              style={{ left: `${(years.indexOf(year) / (years.length - 1)) * 80 + 10}%` }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Horizontal scroll area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[--bg-secondary]"
          style={{ 
            backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px)',
            backgroundSize: '100px 100%'
          }}
        >
          {/* Main timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[--border]" style={{ width: '200%' }} />
          
          {/* Events */}
          <div className="relative h-full" style={{ width: 'max(200%, 2000px)', minWidth: '100vw' }}>
            {timelineData.map((item, index) => {
              const isTop = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="absolute transform -translate-x-1/2 group cursor-pointer"
                  style={{
                    left: `${item.position}%`,
                    top: isTop ? '25%' : '75%',
                  }}
                >
                  {/* Connector line */}
                  <div 
                    className="absolute left-1/2 w-px bg-[--border]"
                    style={{
                      height: '100px',
                      top: isTop ? '100%' : 'auto',
                      bottom: isTop ? 'auto' : '100%',
                    }}
                  />
                  
                  {/* Dot */}
                  <div 
                    className="w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:scale-125 bg-[--bg-primary]"
                    style={{ borderColor: categoryColors[item.category] }}
                  />
                  
                  {/* Card */}
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 w-64 p-4 bg-[--bg-card] border border-[--border] shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none z-10 ${
                      isTop ? 'bottom-full mb-4' : 'top-full mt-4'
                    }`}
                  >
                    <span 
                      className="text-xs font-semibold tracking-wider uppercase"
                      style={{ color: categoryColors[item.category] }}
                    >
                      {item.category}
                    </span>
                    <p className="text-xs text-[--text-muted] mt-1">{item.date}</p>
                    <h3 className="font-[family-name:var(--font-tiempos)] text-base mt-2 leading-tight">{item.title}</h3>
                    <p className="text-xs text-[--text-secondary] mt-2 line-clamp-3">{item.description}</p>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener"
                        className="text-xs font-semibold mt-3 block hover:underline"
                        style={{ color: categoryColors[item.category] }}
                      >
                        Read more →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="h-14 border-t border-[--border] flex items-center gap-6 px-8 bg-[--bg-primary] overflow-x-auto">
          <span className="text-xs text-[--text-muted] font-semibold tracking-wider whitespace-nowrap">LEGEND</span>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2 whitespace-nowrap">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-[--text-secondary] uppercase">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
