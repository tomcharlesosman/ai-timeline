'use client';

import { useState } from 'react';
import updates from '@/data/updates.json';

export default function DataPage() {
  const [loading, setLoading] = useState(false);
  const entryCount = updates.length;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-[#222] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#050505]/95 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#ff00ff]" style={{ boxShadow: '0 0 10px #ff00ff' }} />
          <span className="font-[family-name:var(--font-syne)] font-bold text-sm tracking-wider">
            DATA<span className="text-[#ff00ff]">_</span>EXPORT
          </span>
        </div>
        <a href="/" className="font-mono text-xs text-[#888] hover:text-[#ff00ff]">[BACK]</a>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 tracking-tight">
            AI Timeline
            <span className="block text-[#ff00ff]">Dataset</span>
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto">
            Complete structured data on AI developments. For researchers, analysts, and builders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16 border border-[#222] p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ff00ff]">{entryCount.toLocaleString()}</div>
            <div className="text-xs text-[#555] font-mono mt-1">ENTRIES</div>
          </div>
          <div className="text-center border-x border-[#222]">
            <div className="text-3xl font-bold text-[#00ffff]">6</div>
            <div className="text-xs text-[#555] font-mono mt-1">CATEGORIES</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ffff00]">CSV</div>
            <div className="text-xs text-[#555] font-mono mt-1">FORMAT</div>
          </div>
        </div>

        {/* What's included */}
        <div className="border border-[#222] p-8 mb-12">
          <h2 className="font-mono text-sm text-[#888] mb-6 tracking-wider">WHAT'S INCLUDED</h2>
          <ul className="space-y-4">
            {[
              'All timeline entries with full metadata',
              'Date, category, title, description, source, URL for each entry',
              'Structured CSV format (easy import to Excel, Python, R)',
              'Free updates for 1 year',
              'Commercial use license included',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#ff00ff]">✓</span>
                <span className="text-[#ccc]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="border border-[#ff00ff] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#ff00ff] text-black text-xs font-mono px-3 py-1">
            ONE-TIME PURCHASE
          </div>
          <div className="text-6xl font-bold mb-2">$99</div>
          <div className="text-sm text-[#888] mb-8">One-time payment • Updates for 1 year</div>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-[#ff00ff] text-black font-bold py-4 px-8 hover:bg-[#ff44ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : 'BUY DATASET'}
          </button>
          <p className="text-xs text-[#555] mt-4 font-mono">
            Secure payment via Stripe. Instant download after purchase.
          </p>
        </div>

        {/* Use cases */}
        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {[
            { title: 'Research', desc: 'Academic studies on AI development patterns' },
            { title: 'Analysis', desc: 'Market intelligence and trend forecasting' },
            { title: 'Startups', desc: 'Competitive analysis and timing strategy' },
            { title: 'Investors', desc: 'Due diligence and sector tracking' },
          ].map((use) => (
            <div key={use.title} className="border border-[#222] p-6 hover:border-[#333] transition-colors">
              <h3 className="font-bold text-lg mb-2">{use.title}</h3>
              <p className="text-sm text-[#888]">{use.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
