import { Types } from "mongoose";

export type EventStatus = "upcoming" | "closed" | "completed";

export type EventCategory =
  | "workshop"
  | "seminar"
  | "cultural"
  | "sports"
  | "technical"
  | "social"
  | "other";

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  venue: string;
  organizerId: Types.ObjectId;
  collegeId: Types.ObjectId;
  registrationDeadline: Date;
  capacity: number;
  status: EventStatus;
  category: EventCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  organizerId: string;
  collegeId: string;
  registrationDeadline: string;
  capacity: number;
  status: EventStatus;
  category: EventCategory;
  registrationCount?: number;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export function formatEventResponse(
  event: IEvent,
  registrationCount?: number,
  isRegistered?: boolean,
): EventResponse {
  return {
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    venue: event.venue,
    organizerId: event.organizerId.toString(),
    collegeId: event.collegeId.toString(),
    registrationDeadline: event.registrationDeadline.toISOString(),
    capacity: event.capacity,
    status: event.status,
    category: event.category,
    registrationCount,
    isRegistered,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}
