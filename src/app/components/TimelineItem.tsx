'use client';

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product" | "market" | "policy";
}

const categoryLabels: Record<Update["category"], string> = {
  model: "Model",
  lab: "Lab",
  research: "Research",
  product: "Product",
  market: "Market",
  policy: "Policy",
};

const categoryColors: Record<Update["category"], string> = {
  model: "bg-emerald-600 text-white",
  lab: "bg-blue-600 text-white",
  research: "bg-amber-600 text-white",
  product: "bg-rose-600 text-white",
  market: "bg-violet-600 text-white",
  policy: "bg-cyan-600 text-white",
};

function addUtmParams(url: string, source: string): string {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=aitimeline&utm_medium=referral&utm_campaign=daily`;
}

function getShareUrl(platform: 'twitter' | 'linkedin', item: Update): string {
  const baseUrl = 'https://ai-timeline-omega.vercel.app';
  const text = encodeURIComponent(`${item.title} — ${item.description.slice(0, 100)}...`);
  const url = encodeURIComponent(`${baseUrl}/#${item.id}`);
  
  if (platform === 'twitter') {
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}

async function copyToClipboard(item: Update) {
  const baseUrl = 'https://ai-timeline-omega.vercel.app';
  const url = `${baseUrl}/#${item.id}`;
  try {
    await navigator.clipboard.writeText(url);
    // Could add toast notification here
  } catch {
    // Fallback
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

export default function TimelineItem({ item }: { item: Update }) {
  const linkUrl = item.url ? addUtmParams(item.url, item.source) : undefined;
  
  return (
    <article className="timeline-item group" id={item.id}>
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[item.category]}`}
        >
          {categoryLabels[item.category]}
        </span>
        <span className="text-sm text-muted">{item.source}</span>
      </div>
      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
      <p className="text-muted leading-relaxed mb-4">{item.description}</p>
      
      {/* Social Sharing */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-muted mr-2">Share:</span>
        <a
          href={getShareUrl('twitter', item)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"
          aria-label="Share on Twitter"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a
          href={getShareUrl('linkedin', item)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <button
          onClick={() => copyToClipboard(item)}
          className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded transition-colors"
          aria-label="Copy link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
      </div>
    </article>
  );
}
