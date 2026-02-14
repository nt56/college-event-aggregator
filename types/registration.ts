import { Types } from "mongoose";

export interface IRegistration {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  studentId: Types.ObjectId;
  registeredAt: Date;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  studentId: string;
  registeredAt: string;
}

export interface RegistrationWithEvent extends RegistrationResponse {
  event?: {
    id: string;
    title: string;
    date: string;
    venue: string;
    status: string;
  };
}

export interface RegistrationWithStudent extends RegistrationResponse {
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export function formatRegistrationResponse(
  registration: IRegistration,
): RegistrationResponse {
  return {
    id: registration._id.toString(),
    eventId: registration.eventId.toString(),
    studentId: registration.studentId.toString(),
    registeredAt: registration.registeredAt.toISOString(),
  };
}
