"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";

export default function AuthLandingPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Authentication</h1>
        <p className="mt-2 text-slate-600">
          Choose how you want to continue.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            href="/auth/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700"
          >
            Create account
          </Link>
          <Link
            href={isAuthenticated ? "/profile" : "/"}
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700"
          >
            {isAuthenticated ? "Go to profile" : "Back home"}
          </Link>
        </div>
      </section>
    </main>
  );
}
