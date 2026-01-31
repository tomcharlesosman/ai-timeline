'use client';

import { useState, useMemo } from "react";
import TimelineItem from "./TimelineItem";
import updates from "../../data/updates.json";

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  source: string;
  url?: string;
  category: "model" | "lab" | "research" | "product" | "market" | "policy";
}

const CATEGORIES = [
  { value: "all", label: "All", color: "bg-stone-600" },
  { value: "model", label: "Models", color: "bg-emerald-600" },
  { value: "lab", label: "Labs", color: "bg-blue-600" },
  { value: "research", label: "Research", color: "bg-amber-600" },
  { value: "product", label: "Products", color: "bg-rose-600" },
  { value: "market", label: "Market", color: "bg-violet-600" },
  { value: "policy", label: "Policy", color: "bg-cyan-600" },
] as const;

export default function Timeline() {
  const [category, setCategory] = useState<"all" | typeof CATEGORIES[number]["value"]>("all");
  const [source, setSource] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Get unique sources for filter
  const sources = useMemo(() => {
    const allSources = (updates as Update[]).map(u => u.source);
    return [...new Set(allSources)].sort();
  }, []);

  // Filter updates
  const filtered = useMemo(() => {
    return (updates as Update[]).filter(update => {
      if (category !== "all" && update.category !== category) return false;
      if (source !== "all" && update.source !== source) return false;
      if (dateFrom && update.date < dateFrom) return false;
      if (dateTo && update.date > dateTo) return false;
      if (search) {
        const query = search.toLowerCase();
        const matchTitle = update.title.toLowerCase().includes(query);
        const matchDesc = update.description.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [category, source, dateFrom, dateTo, search]);

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

  const clearFilters = () => {
    setCategory("all");
    setSource("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const hasFilters = category !== "all" || source !== "all" || dateFrom || dateTo || search;

  return (
    <div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted">Search</label>
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path strokeWidth="2" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search updates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Source filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-[140px]"
            >
              <option value="all">All Sources</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Clear button */}
          {hasFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
          Showing {filtered.length} of {updates.length} updates
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-12">
        {sortedDates.length === 0 ? (
          <p className="text-stone-500 text-center py-8">No updates found matching your filters.</p>
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
