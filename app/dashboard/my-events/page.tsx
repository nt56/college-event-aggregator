"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRegistrations } from "@/store/slices/registrationsSlice";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { DashboardSkeleton } from "@/components/common/Skeletons";

export default function MyEventsPage() {
  const { isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) return <DashboardSkeleton />;

  return <StudentDashboard />;
}
