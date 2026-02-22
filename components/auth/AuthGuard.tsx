"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useRequireRole } from "@/hooks/useAuth";
import type { UserRole } from "@/store/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const { hasRole } = useRequireRole(requiredRole || []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && !hasRole) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, requiredRole, hasRole, router]);

  if (isLoading) {
    return fallback || <AuthLoadingSkeleton />;
  }

  if (!isAuthenticated) return null;
  if (requiredRole && !hasRole) return null;

  return <>{children}</>;
}

function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/20 animate-pulse" />
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

/** Redirect authenticated users away from auth pages */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <AuthLoadingSkeleton />;
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
