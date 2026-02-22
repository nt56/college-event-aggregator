"use client";

import { useAppSelector } from "@/store/hooks";
import { DashboardSkeleton } from "@/components/common/Skeletons";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import OrganizerDashboard from "@/components/dashboard/OrganizerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  const { user, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) return <DashboardSkeleton />;

  switch (user?.role) {
    case "organizer":
      return <OrganizerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
}
