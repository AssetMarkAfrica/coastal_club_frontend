"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCurrentUser,
  selectCurrentUserRole,
  selectIsAuthenticated,
} from "@/store/auth/authSelectors";
import { logoutUser } from "@/store/auth/authThunks";
import Link from "next/link";
import LandingPageContent from "@/components/LandingPageContent";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentUserRole);

  // Defer auth-dependent rendering until after client hydration.
  // Server always renders the landing page (isAuthenticated = false on server),
  // and both server + first client paint match — no hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const onLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/auth/login");
  };

  // ── Unauthenticated (or not yet mounted) → public landing page ──
  if (!mounted || !isAuthenticated) {
    return <LandingPageContent />;
  }

  // ── Authenticated → member home ──
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Coastal Club</h1>

        <p className="mt-3 text-slate-600">Welcome back, {user?.name ?? "User"}.</p>
        <p className="mt-1 text-slate-600">
          You are signed in as{" "}
          <span className="font-semibold">{role ?? "member"}</span>.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/profile"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Go to Profile
          </Link>
          <Link
            href="/membership/plans"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Explore Membership Plans
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
