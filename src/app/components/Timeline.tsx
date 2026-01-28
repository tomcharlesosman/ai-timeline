import TimelineItem from "./TimelineItem";
import updates from "../../data/updates.json";

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product";
}

export default function Timeline() {
  // Group by date
  const grouped = (updates as Update[]).reduce((acc, update) => {
    if (!acc[update.date]) acc[update.date] = [];
    acc[update.date].push(update);
    return acc;
  }, {} as Record<string, Update[]>);

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-12">
      {sortedDates.map((date) => (
        <div key={date}>
          <h2 className="font-display text-sm font-semibold text-muted uppercase tracking-wider mb-6">
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="space-y-8">
            {grouped[date].map((item) => (
              <TimelineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
