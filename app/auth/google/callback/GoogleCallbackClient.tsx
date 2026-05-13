"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setGooglePending } from "@/store/auth/authSlice";
import * as authService from "@/services/auth/authService";
import type { AuthTokenData, PendingOtpData } from "@/types/auth";

export default function GoogleCallbackClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [message, setMessage] = useState("Completing Google sign-in...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    let active = true;

    const run = async () => {
      try {
        const response = await authService.googleCallback(code);
        if (!active) return;

        const payload: AuthTokenData | PendingOtpData = response.data.data;

        if ("pending_token" in payload) {
          dispatch(setGooglePending(payload));
          setMessage("Almost done. Please verify your OTP.");
          router.replace("/auth/verify-otp");
          return;
        }

        dispatch(setCredentials(payload));
        setMessage("Sign-in complete. Redirecting to home...");
        router.replace("/");
      } catch {
        if (!active) return;
        setError("Google sign-in failed. Please try again.");
      }
    };

    void run();
    return () => { active = false; };
  }, [code, dispatch, router]);

  if (!code) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Google Sign-In</h1>
          <p className="mt-3 text-sm text-red-600">Missing Google authorization code.</p>
          <Link href="/auth/login" className="mt-6 inline-block text-sm underline">
            Back to login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Google Sign-In</h1>
        {error ? (
          <>
            <p className="mt-3 text-sm text-red-600">{error}</p>
            <Link href="/auth/login" className="mt-6 inline-block text-sm underline">
              Back to login
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-600">{message}</p>
        )}
      </section>
    </main>
  );
}