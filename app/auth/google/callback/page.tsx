// app/auth/google/callback/GoogleCallbackClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setGooglePending } from "@/store/auth/authSlice";
import * as authService from "@/services/auth/AuthService";
import type { AuthTokenData, PendingOtpData } from "@/types/auth";

/* ── Shared luxury spinner styles injected once ── */
const SpinnerStyles = () => (
  <style>{`
    @keyframes luxury-spin {
      0%   { transform: rotate(0deg);   border-top-color: #B7922B; }
      50%  { transform: rotate(180deg); border-top-color: #F1E0A6; }
      100% { transform: rotate(360deg); border-top-color: #B7922B; }
    }
    .spinner-gold {
      border: 2px solid rgba(212,175,55,0.1);
      border-top: 2px solid #B7922B;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: luxury-spin 2s cubic-bezier(0.4,0,0.2,1) infinite;
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in-up 1.2s ease-out forwards; }
  `}</style>
);

const BrandLogo = () => (
  <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
    <circle cx="100" cy="100" r="90" stroke="#D4AF37" strokeWidth="2" />
    <circle cx="100" cy="100" r="84" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
    <path d="M60 140V70L100 110L140 70V140" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M100 45V65M90 55H110M93 48L107 62M93 62L107 48" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 140C80 130 120 150 140 140" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
    <line x1="85" y1="95" x2="115" y2="95" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-8 h-8 mb-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── Main layout shell shared between states ── */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpinnerStyles />
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto min-h-screen animate-fade-in">
        <div className="mb-12">
          <BrandLogo />
        </div>
        {children}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
          <p
            className="text-[11px] font-semibold tracking-[0.4em] text-gold-muted/50 uppercase"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Estrella del Mar
          </p>
        </div>
      </main>
    </>
  );
}

/* ── Loading state ── */
function LoadingView({ message }: { message: string }) {
  return (
    <Shell>
      <div className="mb-8 flex flex-col items-center">
        <GoogleIcon />
        <h1
          className="text-3xl font-semibold text-primary tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {message}
        </h1>
      </div>

      <div className="mb-8">
        <div className="spinner-gold mx-auto" />
      </div>

      <div className="max-w-sm mx-auto">
        <p
          className="text-base font-medium text-primary-container"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Verifying your membership credentials.
        </p>
        <p
          className="text-base text-primary/60 mt-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Please wait a moment while we prepare your session.
        </p>
      </div>
    </Shell>
  );
}

/* ── Error state ── */
function ErrorView({ message }: { message: string }) {
  return (
    <Shell>
      <div className="mb-8 flex flex-col items-center">
        <GoogleIcon />
        <h1
          className="text-3xl font-semibold text-primary tracking-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Sign-In Failed
        </h1>
      </div>

      <div className="max-w-sm mx-auto space-y-4">
        <p
          className="text-base font-medium text-danger"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {message}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-lg border border-gold-muted/50 px-5 py-2.5 text-sm font-semibold text-gold-muted hover:bg-gold-muted/10 transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          ← Back to login
        </Link>
      </div>
    </Shell>
  );
}

/* ── Main client component ── */
export default function GoogleCallbackClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [message, setMessage] = useState("Signing in with Google...");
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
          setMessage("Almost done. Redirecting to OTP verification...");
          router.replace("/auth/verify-otp");
          return;
        }

        dispatch(setCredentials(payload));
        setMessage("Sign-in complete. Redirecting...");
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
    return <ErrorView message="Missing Google authorization code." />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return <LoadingView message={message} />;
}