'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DownloadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (!sessionId) return;
    
    fetch(`/api/stripe/verify?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setVerified(data.valid);
        if (data.email) setEmail(data.email);
      })
      .catch(() => setVerified(false));
  }, [sessionId]);

  const handleDownload = () => {
    if (!sessionId) return;
    window.location.href = `/api/data/export?session_id=${sessionId}`;
  };

  if (verified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[--accent] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[--text-muted]">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <h1 className="text-3xl font-[family-name:var(--font-tiempos)] mb-4">Payment Required</h1>
          <p className="text-[--text-secondary] mb-6">We couldn't verify your payment. Please try purchasing again.</p>
          <a href="/data" className="inline-block bg-[--accent] text-white font-semibold py-3 px-6 hover:opacity-90">
            Back to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="border-b border-[--border]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-tiempos)] text-3xl">Download Ready</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h2 className="text-3xl font-[family-name:var(--font-tiempos)] mb-4">Thank You</h2>
        <p className="text-[--text-secondary] mb-8">
          {email && `A receipt has been sent to ${email}. `}
          Your dataset is ready for download.
        </p>

        <div className="article-card border-[--accent] mb-8">
          <h3 className="section-title mb-4">AI Timeline Dataset</h3>
          <p className="text-sm text-[--text-muted] mb-6">ai-timeline-dataset.csv</p>
          <button
            onClick={handleDownload}
            className="w-full bg-[--accent] text-white font-semibold py-4 px-8 hover:opacity-90 transition-opacity"
          >
            Download CSV
          </button>
        </div>

        <div className="text-sm text-[--text-muted]">
          <p>Questions? Contact <a href="mailto:tom@tomosman.com" className="text-[--accent]">tom@tomosman.com</a></p>
          <a href="/" className="text-[--text-primary] hover:text-[--accent] mt-4 inline-block">
            ← Back to AI Timeline
          </a>
        </div>
      </main>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[--accent] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[--text-muted]">Loading...</p>
        </div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
