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
  model: '#ff00ff',
  lab: '#00ffff',
  research: '#ffff00',
  product: '#ff4444',
  market: '#44ff44',
  policy: '#ffaa00',
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

  // Calculate positions for timeline
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
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-[#222] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#050505]/95 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#ff00ff]" style={{ boxShadow: '0 0 10px #ff00ff' }} />
          <span className="font-[family-name:var(--font-syne)] font-bold text-sm tracking-wider">
            VISUAL<span className="text-[#ff00ff]">_</span>TIMELINE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#111] border border-[#333] text-white px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[#ff00ff]"
          >
            <option value="all">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          <a href="/" className="font-mono text-xs text-[#888] hover:text-[#ff00ff]">
            [BACK]
          </a>
        </div>
      </header>

      {/* Timeline Container */}
      <div className="relative h-[calc(100vh-72px)] flex flex-col">
        {/* Year markers */}
        <div className="h-12 border-b border-[#222] flex items-center px-8 relative">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={`absolute font-mono text-xs px-3 py-1 transition-colors ${
                selectedYear === year.toString() 
                  ? 'text-[#ff00ff] bg-[#ff00ff]/10' 
                  : 'text-[#555] hover:text-[#888]'
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
          className="flex-1 overflow-x-auto overflow-y-hidden relative"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #0a0a0a 1px, transparent 1px)',
            backgroundSize: '100px 100%'
          }}
        >
          {/* Main timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff00ff]/50 to-transparent" style={{ width: '200%' }} />
          
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
                    className="absolute left-1/2 w-px transition-all duration-300"
                    style={{
                      backgroundColor: categoryColors[item.category],
                      height: isTop ? '100px' : '100px',
                      top: isTop ? '100%' : 'auto',
                      bottom: isTop ? 'auto' : '100%',
                      boxShadow: `0 0 10px ${categoryColors[item.category]}`,
                    }}
                  />
                  
                  {/* Dot */}
                  <div 
                    className="w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                    style={{
                      backgroundColor: '#050505',
                      borderColor: categoryColors[item.category],
                      boxShadow: `0 0 15px ${categoryColors[item.category]}`,
                    }}
                  />
                  
                  {/* Card */}
                  <div 
                    className={`absolute left-1/2 -translate-x-1/2 w-64 p-4 bg-[#111] border transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none z-10 ${
                      isTop ? 'bottom-full mb-4' : 'top-full mt-4'
                    }`}
                    style={{ borderColor: categoryColors[item.category] }}
                  >
                    <span 
                      className="text-xs font-mono uppercase tracking-wider"
                      style={{ color: categoryColors[item.category] }}
                    >
                      {item.category}
                    </span>
                    <p className="text-xs text-[#555] font-mono mt-1">{item.date}</p>
                    <h3 className="font-semibold text-sm mt-2 leading-tight">{item.title}</h3>
                    <p className="text-xs text-[#888] mt-2 line-clamp-3">{item.description}</p>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener"
                        className="text-xs font-mono mt-3 block hover:underline"
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
        <div className="h-14 border-t border-[#222] flex items-center gap-6 px-8 overflow-x-auto">
          <span className="font-mono text-xs text-[#555] whitespace-nowrap">LEGEND:</span>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2 whitespace-nowrap">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}
              />
              <span className="font-mono text-xs text-[#888] uppercase">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #111;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #ff00ff;
        }
      `}</style>
    </div>
  );
}
