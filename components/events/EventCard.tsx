"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CategoryBadge, EventStatusBadge } from "@/components/common/Badges";
import { MapPin, Users, Calendar } from "lucide-react";
import type { EventItem } from "@/store/slices/eventsSlice";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const eventId = event.id || event._id;
  const eventDate = event.date ? new Date(event.date) : null;
  const collegeName =
    typeof event.collegeId === "object" && event.collegeId
      ? (event.collegeId as { _id: string; name: string }).name
      : "";

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 animate-fade-in-up">
      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        {/* Date badge */}
        {eventDate && (
          <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
            <p className="text-xs font-bold text-primary uppercase">
              {format(eventDate, "MMM dd")}
            </p>
          </div>
        )}
        {/* Status badge */}
        {event.status && (
          <div className="absolute top-4 right-4 z-20">
            <EventStatusBadge status={event.status} />
          </div>
        )}
        {/* Event image or placeholder */}
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {event.category && <CategoryBadge category={event.category} />}
          {event.venue && (
            <span className="text-slate-400 text-xs flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {event.venue}
            </span>
          )}
        </div>

        <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h4>

        {event.description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          {collegeName && <span>{collegeName}</span>}
          {event.capacity && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {event.registrationCount || 0}/{event.capacity}
            </span>
          )}
        </div>

        <Link href={`/events/${eventId}`}>
          <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold transition-all">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
