"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents, deleteEvent } from "@/store/slices/eventsSlice";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { EventStatusBadge } from "@/components/common/Badges";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  Users,
  CalendarClock,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarX,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export default function OrganizerDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items: events, isLoading } = useAppSelector((s) => s.events);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents({ organizerId: user?.id || "" }));
  }, [dispatch, user?.id]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deleteEvent(deleteTarget)).unwrap();
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.registrationCount || 0),
    0,
  );
  const activeEvents = events.filter((e) => e.status === "upcoming").length;

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your events and track registrations.
          </p>
        </div>
        <Link href="/dashboard/create-event">
          <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Events</p>
              <h3 className="text-2xl font-bold">{events.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up delay-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Total Registrations
              </p>
              <h3 className="text-2xl font-bold">{totalRegistrations}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up delay-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-600">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Active Events
              </p>
              <h3 className="text-2xl font-bold">{activeEvents}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg">Your Events</h2>
        </div>

        {events.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={CalendarX}
              title="No events created yet"
              description="Create your first event and start accepting registrations."
              actionLabel="Create Event"
              onAction={() =>
                (window.location.href = "/dashboard/create-event")
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {events.map((event) => {
                  const eid = event.id || event._id;
                  return (
                    <tr
                      key={eid}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {event.venue}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium">
                        {event.date
                          ? format(new Date(event.date), "MMM dd, yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-primary">
                          {event.registrationCount || 0}
                          {event.capacity ? `/${event.capacity}` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <EventStatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={`/events/${eid}`}>
                            <button className="text-slate-400 hover:text-primary transition-colors pt-2">
                              <Eye className="h-5 w-5" />
                            </button>
                          </Link>
                          <Link href={`/dashboard/edit-event/${eid}`}>
                            <button className="text-slate-400 hover:text-primary transition-colors pt-2">
                              <Pencil className="h-5 w-5" />
                            </button>
                          </Link>
                          <button
                            className="text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => setDeleteTarget(eid!)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event? All registrations will be lost. This cannot be undone."
        confirmLabel="Delete Event"
        onConfirm={handleDelete}
        isLoading={deleting}
        variant="danger"
      />
    </div>
  );
}
