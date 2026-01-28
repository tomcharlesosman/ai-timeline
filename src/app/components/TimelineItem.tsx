interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product";
}

const categoryLabels: Record<Update["category"], string> = {
  model: "Model",
  lab: "Lab",
  research: "Research",
  product: "Product",
};

const categoryColors: Record<Update["category"], string> = {
  model: "bg-accent text-white",
  lab: "bg-foreground text-background",
  research: "bg-muted text-background",
  product: "bg-border text-foreground",
};

export default function TimelineItem({ item }: { item: Update }) {
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
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
