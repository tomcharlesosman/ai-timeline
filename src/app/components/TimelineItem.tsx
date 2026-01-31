interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product" | "market" | "policy";
}

const categoryClasses: Record<Update["category"], string> = {
  model: "category-model",
  lab: "category-lab",
  research: "category-research",
  product: "category-product",
  market: "category-market",
  policy: "category-policy",
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
  } catch {
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
    <article className="group" id={item.id}>
      <span className={`category-badge ${categoryClasses[item.category]}`}>
        {item.category}
      </span>
      
      <h3 className="article-link mb-3">
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[--accent]">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
      
      <p className="text-[--text-secondary] leading-relaxed mb-4">
        {item.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-[--text-muted] font-medium uppercase tracking-wider">
          {item.source}
        </span>
        
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={getShareUrl('twitter', item)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[--text-muted] hover:text-[--accent]"
            aria-label="Share on X"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href={getShareUrl('linkedin', item)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[--text-muted] hover:text-[--accent]"
            aria-label="Share on LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <button
            onClick={() => copyToClipboard(item)}
            className="text-[--text-muted] hover:text-[--accent]"
            aria-label="Copy link"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
