"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEventById, clearCurrentEvent } from "@/store/slices/eventsSlice";
import EventForm from "@/components/events/EventForm";
import { DashboardSkeleton } from "@/components/common/Skeletons";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentEvent, isLoading } = useAppSelector((s) => s.events);

  useEffect(() => {
    if (id) dispatch(fetchEventById(id));
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, id]);

  if (isLoading || !currentEvent) return <DashboardSkeleton />;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Update the event details below.
        </p>
      </header>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <EventForm defaultValues={currentEvent} isEditing />
      </div>
    </div>
  );
}
