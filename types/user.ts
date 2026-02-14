import { Types } from "mongoose";

export type UserRole = "student" | "organizer" | "admin";
export type Gender = "male" | "female" | "other" | "prefer-not-to-say";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  bio?: string;
  collegeId?: Types.ObjectId;
  authUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  bio?: string;
  collegeId?: string;
  createdAt: string;
  updatedAt: string;
}

export function formatUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth?.toISOString(),
    phone: user.phone,
    bio: user.bio,
    collegeId: user.collegeId?.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
