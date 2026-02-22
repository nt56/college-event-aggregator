"use client";

import EventForm from "@/components/events/EventForm";

export default function CreateEventPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Fill in the details below to create a new campus event.
        </p>
      </header>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <EventForm />
      </div>
    </div>
  );
}
