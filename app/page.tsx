"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "@/store/auth/authSelectors";

import LandingPageContent from "@/components/LandingPageContent";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentUserRole);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Once mounted, redirect authenticated users based on role.
  // Runs whenever mount state or auth state changes.
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;

    if (role === "admin") {
      router.replace("/membership/view-applications");
    } else {
      // "member" or any other authenticated role
      router.replace("/membership/dashboard");
    }
  }, [mounted, isAuthenticated, role, router]);

  // Before hydration completes, render the landing page so server
  // and first client paint are identical — no hydration mismatch.
  if (!mounted) {
    return <LandingPageContent />;
  }

  // Mounted + authenticated → show a spinner while the redirect fires.
  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
      </main>
    );
  }

  // Mounted + not authenticated → public landing page.
  return <LandingPageContent />;
}