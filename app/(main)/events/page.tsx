"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents } from "@/store/slices/eventsSlice";
import { fetchColleges } from "@/store/slices/collegesSlice";
import { EventCard } from "@/components/events/EventCard";
import { EventCardGridSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { Search, CalendarX, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "All Categories", value: "" },
  { label: "Workshop", value: "workshop" },
  { label: "Seminar", value: "seminar" },
  { label: "Cultural", value: "cultural" },
  { label: "Sports", value: "sports" },
  { label: "Technical", value: "technical" },
  { label: "Social", value: "social" },
  { label: "Other", value: "other" },
];

const statuses = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Closed", value: "closed" },
];

export default function BrowseEventsPage() {
  const dispatch = useAppDispatch();
  const { items: events, pagination, isLoading } = useAppSelector((s) => s.events);
  const { items: colleges } = useAppSelector((s) => s.colleges);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [collegeId, setCollegeId] = useState("");
  const [page, setPage] = useState(1);

  const loadEvents = useCallback(() => {
    const params: Record<string, string> = { page: String(page), limit: "12" };
    if (search) params.search = search;
    if (category) params.category = category;
    if (status) params.status = status;
    if (collegeId) params.collegeId = collegeId;
    dispatch(fetchEvents(params));
  }, [dispatch, page, search, category, status, collegeId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    dispatch(fetchColleges({ limit: "100" }));
  }, [dispatch]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("upcoming");
    setCollegeId("");
    setPage(1);
  };

  const hasActiveFilters = search || category || status !== "upcoming" || collegeId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Discover Campus Events
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Join the best workshops, sports, and cultural festivals happening
          around you.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10 dark:border-primary/20 shadow-sm mb-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm outline-none"
              placeholder="Search by title or keyword..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <select
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <select
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* College */}
          <div className="md:col-span-3">
            <select
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
              value={collegeId}
              onChange={(e) => {
                setCollegeId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div className="md:col-span-1">
            <button
              className="w-full flex items-center justify-center py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
              disabled={!hasActiveFilters}
              onClick={resetFilters}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Event Grid */}
      {isLoading ? (
        <EventCardGridSkeleton count={12} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No events found"
          description="Try adjusting your filters or search terms."
          actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
          onAction={hasActiveFilters ? resetFilters : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id || event._id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="p-2 border border-primary/10 dark:border-primary/20 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          pageNum === page
                            ? "bg-primary text-white font-bold shadow-md"
                            : "hover:bg-white dark:hover:bg-slate-800"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                className="p-2 border border-primary/10 dark:border-primary/20 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
                disabled={!pagination.hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
