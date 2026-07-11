"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectCurrentUserRole,
  selectAuthLoading,
  selectIsAuthenticated,
} from "@/store/auth/authSelectors";

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: ReactNode;
}) {
  const role = useAppSelector(selectCurrentUserRole);
  const loading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in at all → send to login
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    // Logged in but wrong role → go back
    if (role && !allowedRoles.includes(role)) {
      router.back();
    }
  }, [role, allowedRoles, router, loading, isAuthenticated]);

  // Show a spinner while auth state is resolving
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-muted/30 border-t-gold-muted" />
      </main>
    );
  }

  // Don't render children until we confirm the user has the correct role
  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
