"use client";
import { useState } from "react";
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

const CATEGORIES = [
  { value: "all", label: "All", color: "bg-stone-600" },
  { value: "model", label: "Models", color: "bg-emerald-600" },
  { value: "lab", label: "Labs", color: "bg-blue-600" },
  { value: "research", label: "Research", color: "bg-amber-600" },
  { value: "product", label: "Products", color: "bg-rose-600" },
] as const;

export default function Timeline() {
  const [filter, setFilter] = useState<"all" | typeof CATEGORIES[number]["value"]>("all");

  // Filter updates
  const filtered = filter === "all" 
    ? (updates as Update[]) 
    : (updates as Update[]).filter(u => u.category === filter);

  // Group by date
  const grouped = filtered.reduce((acc, update) => {
    if (!acc[update.date]) acc[update.date] = [];
    acc[update.date].push(update);
    return acc;
  }, {} as Record<string, Update[]>);

  // Sort dates descending
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 border ${
              filter === cat.value
                ? `${cat.color} text-white border-transparent`
                : "bg-stone-800/50 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-12">
        {sortedDates.length === 0 ? (
          <p className="text-stone-500 text-center py-8">No updates found for this category.</p>
        ) : (
          sortedDates.map((date) => (
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
          ))
        )}
      </div>
    </div>
  );
}
