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
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="border-b border-[--border]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="text-xs text-[--text-muted] font-semibold tracking-wider">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </div>
            <a href="/" className="text-xs font-semibold tracking-wider text-[--text-muted] hover:text-[--accent]">
              ← BACK TO TIMELINE
            </a>
          </div>
          <h1 className="text-center text-4xl sm:text-5xl font-[family-name:var(--font-tiempos)] font-light tracking-tight py-6">
            AI Timeline <span className="italic">Dataset</span>
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-lg text-[--text-secondary] leading-relaxed max-w-2xl mx-auto">
            Complete structured data on AI developments. For researchers, analysts, and builders.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16 border border-[--border] p-8 bg-[--bg-secondary]">
          <div className="text-center">
            <div className="text-4xl font-[family-name:var(--font-tiempos)] text-[--accent]">{entryCount.toLocaleString()}</div>
            <div className="text-xs text-[--text-muted] font-semibold tracking-wider mt-2">ENTRIES</div>
          </div>
          <div className="text-center border-x border-[--border]">
            <div className="text-4xl font-[family-name:var(--font-tiempos)] text-[--text-primary]">6</div>
            <div className="text-xs text-[--text-muted] font-semibold tracking-wider mt-2">CATEGORIES</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-[family-name:var(--font-tiempos)] text-[--text-primary]">CSV</div>
            <div className="text-xs text-[--text-muted] font-semibold tracking-wider mt-2">FORMAT</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What's included */}
          <div className="article-card">
            <h2 className="section-title mb-6">What's Included</h2>
            <ul className="space-y-4">
              {[
                'All timeline entries with full metadata',
                'Date, category, title, description, source, URL',
                'Structured CSV (Excel, Python, R compatible)',
                'Free updates for 1 year',
                'Commercial use license',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[--text-secondary]">
                  <span className="text-[--accent]">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="article-card border-[--accent]">
            <div className="text-xs font-semibold tracking-wider text-[--accent] mb-4">ONE-TIME PURCHASE</div>
            <div className="text-6xl font-[family-name:var(--font-tiempos)] mb-2">$99</div>
            <div className="text-sm text-[--text-muted] mb-8">Single payment • Updates for 1 year</div>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-[--accent] text-white font-semibold py-4 px-8 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Buy Dataset'}
            </button>
            <p className="text-xs text-[--text-muted] mt-4 text-center">
              Secure payment via Stripe. Instant download.
            </p>
          </div>
        </div>

        {/* Use cases */}
        <div className="mt-16">
          <h2 className="section-title mb-8 text-center">Use Cases</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Research', desc: 'Academic studies on AI development patterns' },
              { title: 'Analysis', desc: 'Market intelligence and trend forecasting' },
              { title: 'Startups', desc: 'Competitive analysis and timing strategy' },
              { title: 'Investors', desc: 'Due diligence and sector tracking' },
            ].map((use) => (
              <div key={use.title} className="article-card">
                <h3 className="font-[family-name:var(--font-tiempos)] text-xl mb-2">{use.title}</h3>
                <p className="text-sm text-[--text-secondary]">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[--border] mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 text-center">
          <p className="text-xs text-[--text-muted]">
            Questions? Contact <a href="mailto:tom@tomosman.com" className="text-[--accent]">tom@tomosman.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
