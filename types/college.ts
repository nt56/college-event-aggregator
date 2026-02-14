import { Types } from "mongoose";

export interface ICollege {
  _id: Types.ObjectId;
  name: string;
  location?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollegeResponse {
  id: string;
  name: string;
  location?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export function formatCollegeResponse(college: ICollege): CollegeResponse {
  return {
    id: college._id.toString(),
    name: college.name,
    location: college.location,
    isVerified: college.isVerified,
    createdAt: college.createdAt.toISOString(),
    updatedAt: college.updatedAt.toISOString(),
  };
}
