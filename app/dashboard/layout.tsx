"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  CalendarCheck2,
  Compass,
  Users,
  GraduationCap,
  Building2,
  UserCircle,
  Settings,
  Plus,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    href: "/dashboard/my-events",
    icon: CalendarCheck2,
    roles: ["student"],
  },
  {
    label: "Discover",
    href: "/events",
    icon: Compass,
  },
  {
    label: "My Events",
    href: "/dashboard/manage-events",
    icon: ClipboardList,
    roles: ["organizer"],
  },
  {
    label: "Create Event",
    href: "/dashboard/create-event",
    icon: Plus,
    roles: ["organizer"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Colleges",
    href: "/dashboard/colleges",
    icon: Building2,
    roles: ["admin"],
  },
  {
    label: "All Events",
    href: "/dashboard/all-events",
    icon: GraduationCap,
    roles: ["admin"],
  },
];

const bottomItems: NavItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);
  const role = user?.role;

  const filteredNav = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  );

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#0f0a1e]">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-40">
          <div className="p-6 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div>
                <Image
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  src="/logo.jpg"
                  alt="Logo"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                CampusConnect
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {filteredNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "group-hover:text-primary",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group text-sm font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
