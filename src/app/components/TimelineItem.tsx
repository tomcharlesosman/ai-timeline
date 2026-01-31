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

export default function TimelineItem({ item }: { item: Update }) {
  const linkUrl = item.url ? addUtmParams(item.url, item.source) : undefined;
  
  return (
    <article className="timeline-item group">
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
      <p className="text-muted leading-relaxed">{item.description}</p>
    </article>
  );
}
