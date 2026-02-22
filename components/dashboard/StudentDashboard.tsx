"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRegistrations } from "@/store/slices/registrationsSlice";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { EventStatusBadge } from "@/components/common/Badges";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { cancelRegistration } from "@/store/slices/registrationsSlice";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck2,
  CalendarClock,
  History,
  Eye,
  XCircle,
  CalendarX,
  Compass,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export default function StudentDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items: registrations, isLoading } = useAppSelector(
    (s) => s.registrations,
  );
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchRegistrations({}));
  }, [dispatch]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await dispatch(cancelRegistration({ eventId: cancelTarget })).unwrap();
      toast.success("Registration cancelled");
      dispatch(fetchRegistrations({}));
    } catch {
      toast.error("Failed to cancel registration");
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  // Helper to extract populated event — API returns event data in reg.event
  // (eventId is returned as a plain string ID after formatting)
  const getEvent = (reg: (typeof registrations)[0]) => {
    if (reg.event) return reg.event;
    if (typeof reg.eventId === "object" && reg.eventId !== null)
      return { ...reg.eventId, id: reg.eventId._id };
    return null;
  };
  const getEventIdStr = (reg: (typeof registrations)[0]) => {
    if (reg.event?.id) return reg.event.id;
    if (typeof reg.eventId === "string") return reg.eventId;
    return reg.eventId?._id;
  };

  const upcoming = registrations.filter((r) => {
    const ev = getEvent(r);
    return ev && ev.status === "upcoming";
  });
  const past = registrations.filter((r) => {
    const ev = getEvent(r);
    return ev && (ev.status === "completed" || ev.status === "closed");
  });

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || "Student"} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your registrations and event schedule.
          </p>
        </div>
        <Link href="/events">
          <Button className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Find Events
          </Button>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Total Registrations
              </p>
              <h3 className="text-2xl font-bold">{registrations.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up delay-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-600">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Upcoming Events
              </p>
              <h3 className="text-2xl font-bold">{upcoming.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in-up delay-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-600">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Past Events</p>
              <h3 className="text-2xl font-bold">{past.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">Registered Events</h2>
        </div>

        {registrations.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={CalendarX}
              title="No registrations yet"
              description="Browse events and register for ones that interest you."
              actionLabel="Browse Events"
              onAction={() => (window.location.href = "/events")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Venue
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
                {registrations.map((reg) => {
                  const ev = getEvent(reg);
                  const eidStr = getEventIdStr(reg);
                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {ev?.title || "Unknown Event"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium">
                          {ev?.date
                            ? format(new Date(ev.date), "MMM dd, yyyy")
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">{ev?.venue || "-"}</div>
                      </td>
                      <td className="px-6 py-5">
                        {ev?.status && (
                          <EventStatusBadge
                            status={
                              ev.status as "upcoming" | "completed" | "closed"
                            }
                          />
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={`/events/${eidStr}`}>
                            <button className="text-slate-400 hover:text-primary transition-colors py-2">
                              <Eye className="h-5 w-5" />
                            </button>
                          </Link>
                          {ev?.status === "upcoming" && (
                            <button
                              className="text-slate-400 hover:text-red-500 transition-colors"
                              onClick={() => setCancelTarget(eidStr || null)}
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          )}
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

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel Registration"
        description="Are you sure you want to cancel this registration? This action cannot be undone."
        confirmLabel="Cancel Registration"
        onConfirm={handleCancel}
        isLoading={cancelling}
        variant="danger"
      />
    </div>
  );
}
