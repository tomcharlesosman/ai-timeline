'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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

const ITEMS_PER_PAGE = 10;

export default function Timeline() {
  const [category, setCategory] = useState<"all" | typeof CATEGORIES[number]["value"]>("all");
  const [source, setSource] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [category, source, dateFrom, dateTo, search]);

  // Group by date
  const grouped = useMemo(() => {
    return filtered.reduce((acc, update) => {
      if (!acc[update.date]) acc[update.date] = [];
      acc[update.date].push(update);
      return acc;
    }, {} as Record<string, Update[]>);
  }, [filtered]);

  // Sort dates descending
  const sortedDates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [grouped]);

  // Flatten items for pagination
  const allItems = useMemo(() => {
    const items: { date: string; item: Update }[] = [];
    sortedDates.forEach(date => {
      grouped[date].forEach(item => {
        items.push({ date, item });
      });
    });
    return items;
  }, [sortedDates, grouped]);

  // Visible items
  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  // Intersection observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, allItems.length));
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading, allItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  const clearFilters = () => {
    setCategory("all");
    setSource("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasFilters = category !== "all" || source !== "all" || dateFrom || dateTo || search;

  // Group visible items by date for rendering
  const visibleGrouped = useMemo(() => {
    const grouped: Record<string, Update[]> = {};
    visibleItems.forEach(({ date, item }) => {
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    return grouped;
  }, [visibleItems]);

  const visibleDates = Object.keys(visibleGrouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

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
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted flex justify-between">
          <span>Showing {visibleItems.length} of {filtered.length} updates</span>
          {filtered.length !== updates.length && (
            <span>({updates.length} total in database)</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-12">
        {visibleDates.length === 0 ? (
          <p className="text-stone-500 text-center py-8">No updates found matching your filters.</p>
        ) : (
          visibleDates.map((date) => (
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
                {visibleGrouped[date].map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator / Infinite scroll trigger */}
      <div 
        ref={loaderRef}
        className="py-12 text-center"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 text-muted">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-sm">Loading more...</span>
          </div>
        ) : hasMore ? (
          <p className="text-sm text-muted">Scroll for more</p>
        ) : visibleItems.length > 0 ? (
          <p className="text-sm text-muted">End of timeline</p>
        ) : null}
      </div>
    </div>
  );
}
