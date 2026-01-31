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
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff00ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-[#888]">VERIFYING PAYMENT...</p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-8">
          <div className="text-4xl mb-4">✗</div>
          <h1 className="text-2xl font-bold mb-4">Payment Required</h1>
          <p className="text-[#888] mb-6">We couldn't verify your payment. Please try purchasing again.</p>
          <a href="/data" className="inline-block bg-[#ff00ff] text-black font-bold py-3 px-6 hover:bg-[#ff44ff]">
            BACK TO STORE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-[#222] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-[#050505]/95 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#ff00ff]" style={{ boxShadow: '0 0 10px #ff00ff' }} />
          <span className="font-[family-name:var(--font-syne)] font-bold text-sm tracking-wider">
            DOWNLOAD<span className="text-[#ff00ff]">_</span>READY
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-20 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-[#888] mb-8">
          {email && `A receipt has been sent to ${email}. `}
          Your dataset is ready for download.
        </p>

        <div className="border border-[#ff00ff] p-8 mb-8">
          <h2 className="font-mono text-sm text-[#888] mb-4">AI TIMELINE DATASET</h2>
          <p className="text-sm text-[#555] mb-6">ai-timeline-dataset.csv</p>
          <button
            onClick={handleDownload}
            className="w-full bg-[#ff00ff] text-black font-bold py-4 px-8 hover:bg-[#ff44ff] transition-colors"
          >
            DOWNLOAD CSV
          </button>
        </div>

        <div className="text-sm text-[#555]">
          <p>Questions? Contact tom@tomosman.com</p>
          <a href="/" className="text-[#ff00ff] hover:underline mt-4 inline-block">
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
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#ff00ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-[#888]">LOADING...</p>
        </div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
