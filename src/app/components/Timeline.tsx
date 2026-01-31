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
  { value: "all", label: "All Categories" },
  { value: "model", label: "Models" },
  { value: "lab", label: "Labs" },
  { value: "research", label: "Research" },
  { value: "product", label: "Products" },
  { value: "market", label: "Market" },
  { value: "policy", label: "Policy" },
] as const;

const ITEMS_PER_PAGE = 10;
type ZoomLevel = "day" | "week" | "month" | "year";

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getMonthKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getYearKey(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

function formatZoomLabel(key: string, zoom: ZoomLevel): string {
  if (zoom === "day") {
    return new Date(key).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
  if (zoom === "week") {
    const [year, week] = key.split('-W');
    return `Week ${week}, ${year}`;
  }
  if (zoom === "month") {
    const [year, month] = key.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  return key;
}

export default function Timeline() {
  const [category, setCategory] = useState<"all" | typeof CATEGORIES[number]["value"]>("all");
  const [source, setSource] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [zoom, setZoom] = useState<ZoomLevel>("day");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const sources = useMemo(() => {
    const allSources = (updates as Update[]).map(u => u.source);
    return [...new Set(allSources)].sort();
  }, []);

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

  const grouped = useMemo(() => {
    return filtered.reduce((acc, update) => {
      let key: string;
      switch (zoom) {
        case "week": key = getWeekKey(update.date); break;
        case "month": key = getMonthKey(update.date); break;
        case "year": key = getYearKey(update.date); break;
        default: key = update.date;
      }
      if (!acc[key]) acc[key] = [];
      acc[key].push(update);
      return acc;
    }, {} as Record<string, Update[]>);
  }, [filtered, zoom]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [category, source, dateFrom, dateTo, search, zoom]);

  const sortedDates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [grouped]);

  const allItems = useMemo(() => {
    const items: { date: string; item: Update }[] = [];
    sortedDates.forEach(date => {
      grouped[date].forEach(item => {
        items.push({ date, item });
      });
    });
    return items;
  }, [sortedDates, grouped]);

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      setIsLoading(true);
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
    setZoom("day");
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasFilters = category !== "all" || source !== "all" || dateFrom || dateTo || search;

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
      <div className="filter-bar mb-8">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Search</label>
            <input
              type="text"
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">View</label>
            <select value={zoom} onChange={(e) => setZoom(e.target.value as ZoomLevel)}>
              <option value="day">By Day</option>
              <option value="week">By Week</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="all">All Sources</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <div className="flex items-end">
              <button onClick={clearFilters} className="text-xs font-semibold text-[--text-muted] hover:text-[--text-primary]">
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[--border] text-xs text-[--text-muted]">
          Showing {visibleItems.length} of {filtered.length} updates
          {filtered.length !== updates.length && ` (${updates.length} total)`}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-16">
        {visibleDates.length === 0 ? (
          <p className="text-[--text-muted] text-center py-12">No updates found matching your filters.</p>
        ) : (
          visibleDates.map((date) => (
            <div key={date} className="timeline-section">
              <h2 className="timeline-date">{formatZoomLabel(date, zoom)}</h2>
              <div className="space-y-8">
                {visibleGrouped[date].map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator */}
      <div ref={loaderRef} className="py-12 text-center">
        {isLoading ? (
          <p className="text-sm text-[--text-muted]">Loading more...</p>
        ) : hasMore ? (
          <p className="text-sm text-[--text-muted]">Scroll for more</p>
        ) : visibleItems.length > 0 ? (
          <p className="text-sm text-[--text-muted]">End of timeline</p>
        ) : null}
      </div>
    </div>
  );
}
