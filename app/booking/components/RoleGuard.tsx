"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUserRole, selectAuthLoading, selectIsAuthenticated } from "../../../store/auth/authSelectors";

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
    // If auth is loaded, user is authenticated, and the role is known but not in the allowed list
    if (!loading && isAuthenticated && role && !allowedRoles.includes(role)) {
      router.back();
    }
  }, [role, allowedRoles, router, loading, isAuthenticated]);

  // Don't render children until we confirm the user has the correct role
  if (loading || !isAuthenticated || !role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
