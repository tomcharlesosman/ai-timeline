'use client';

import { useState } from 'react';

export default function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thanks! Check your inbox to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  };

  return (
    <section className="article-card mt-16">
      <h3 className="font-[family-name:var(--font-tiempos)] text-xl mb-2">
        Weekly Digest
      </h3>
      <p className="text-[--text-secondary] text-sm mb-6">
        Curated AI news delivered to your inbox every Sunday.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-[--accent] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${status === 'error' ? 'text-[--accent]' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <p className="mt-3 text-xs text-[--text-muted]">
        No spam, ever. Unsubscribe anytime.
      </p>
    </section>
  );
}
