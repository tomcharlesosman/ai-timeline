'use client';

import { useEffect, useState } from 'react';
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

const categoryLabels: Record<string, string> = {
  model: 'Model',
  lab: 'Lab',
  research: 'Research',
  product: 'Product',
  market: 'Market',
  policy: 'Policy',
};

export default function PrintTimeline() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  const grouped = (updates as Update[]).reduce((acc, item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Update[]>);

  const sortedMonths = Object.keys(grouped).sort().reverse();

  if (!mounted) return null;

  return (
    <div className="print-container">
      <style>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body { background: white !important; color: black !important; font-family: Georgia, serif; }
          .no-print { display: none !important; }
        }
        @media screen {
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            color: black;
            min-height: 100vh;
            font-family: Georgia, serif;
          }
        }
      `}</style>
      
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 text-sm font-semibold">
          Print / Save PDF
        </button>
        <button onClick={() => window.close()} className="border border-black px-4 py-2 text-sm">
          Close
        </button>
      </div>

      <header className="border-b-2 border-black pb-6 mb-10">
        <h1 className="text-5xl font-[family-name:var(--font-tiempos)] mb-3">AI Timeline</h1>
        <p className="text-sm text-gray-500">
          Printed {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="space-y-10">
        {sortedMonths.map(monthKey => {
          const [year, month] = monthKey.split('-');
          const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
            month: 'long', year: 'numeric'
          });
          
          return (
            <section key={monthKey} className="break-inside-avoid">
              <h2 className="text-xl font-[family-name:var(--font-tiempos)] border-b border-gray-300 pb-3 mb-6">
                {monthName}
              </h2>
              <div className="space-y-5">
                {grouped[monthKey]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(item => (
                    <div key={item.id} className="border-l-2 border-gray-200 pl-4 py-1">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-xs text-gray-400 font-semibold">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider">{categoryLabels[item.category]}</span>
                      </div>
                      <h3 className="font-[family-name:var(--font-tiempos)] text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-16 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">AI Timeline • {updates.length} entries • ai-timeline-omega.vercel.app</p>
      </footer>
    </div>
  );
}
