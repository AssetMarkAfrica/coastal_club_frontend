"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/auth/authSlice";
import { resendOtp, verifyOtp } from "@/store/auth/authThunks";
import {
  selectAuthError,
  selectAuthLoading,
  selectOtpDelivery,
  selectPendingToken,
} from "@/store/auth/authSelectors";

export default function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const pendingToken = useAppSelector(selectPendingToken);
  const otpDelivery = useAppSelector(selectOtpDelivery);
  const [code, setCode] = useState("");
  const [info, setInfo] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingToken) return;

    dispatch(clearError());
    setInfo("");

    try {
      await dispatch(
        verifyOtp({
          pending_token: pendingToken,
          code,
        })
      ).unwrap();
      router.push("/profile");
    } catch {
      // Slice handles errors.
    }
  };

  const onResend = async () => {
    if (!pendingToken) return;
    dispatch(clearError());
    setInfo("");

    try {
      await dispatch(resendOtp(pendingToken)).unwrap();
      setInfo("A new OTP has been sent.");
    } catch {
      // Slice handles errors.
    }
  };

  const deliveryDescription = [
    otpDelivery?.email ? "email" : "",
    otpDelivery?.sms ? "SMS" : "",
  ]
    .filter(Boolean)
    .join(" and ");

  if (!pendingToken) {
    return (
      <>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          .animate-fade-in-up { animation: fadeInUp 0.7s ease both; }
        `}</style>

        <main className="flex min-h-screen bg-cream text-text-primary antialiased">
          {/* Left panel */}
          <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-navy-deep to-primary">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaienLFT5eqymFHGYCcsUqY9kMDYXaWwisWIi5P1HUOMoAoKZBcKhrlc3q3jz2UntYHe1xlxasg0ihVTIxaI7onQSEViG9ZVH9yK8eswxWIPN5-SVU5q4uM7YYYbO-0WV90v3r8Gp4KHRn_7ONSnSYNDMAHyvQxU5SyFOlsqKTNM5MULh84rMIKUVfktKPS3MkdlIgYM6X7E0TpTliT2IQg4fb7QpOHs7O1hodEe7UGqP2WF0DLJx-rhbzBwyXCKXBCiN2Gw4"
                alt="Coastal Club interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg animate-fade-in-up">
              <Link
                href="/"
                className="text-6xl font-bold italic tracking-tight drop-shadow-lg mb-6 text-gold-light hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Coastal Club
              </Link>
              <div className="w-24 h-px mb-6 bg-gold-muted/50" />
              <p
                className="text-3xl font-semibold opacity-90 leading-snug text-cream-dark"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Exclusive Access
                <br />
                Awaits You
              </p>
            </div>
            <div className="absolute inset-6 border border-gold-muted/20 pointer-events-none rounded-lg" />
          </div>

          {/* Right panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden text-center mb-10">
                <Link
                  href="/"
                  className="text-4xl font-bold tracking-tight mb-2 text-primary hover:opacity-80 transition-opacity"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Coastal Club
                </Link>
                <p className="text-base italic text-gold-muted" style={{ fontFamily: "var(--font-inter)" }}>
                  Exclusive Access Awaits You
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded border border-gold-muted/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-cream-dark text-center bg-cream/30">
                  <h1
                    className="text-3xl font-semibold text-primary mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    No Pending Verification
                  </h1>
                  <p className="text-base text-text-secondary" style={{ fontFamily: "var(--font-inter)" }}>
                    Please complete registration first.
                  </p>
                </div>
                <div className="p-6 text-center">
                  <Link
                    href="/auth/register"
                    className="inline-flex justify-center py-3 px-6 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary transition-all duration-300 hover:-translate-y-0.5 text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Go to Register
                  </Link>
                </div>
                <div className="h-1 w-full bg-gradient-to-r from-gold-muted/20 via-gold-muted to-gold-muted/20" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%);  }
        }
        .animate-shimmer { animation: shimmer 1.2s ease forwards; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease both; }

        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.7; }
          50%  { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
      `}</style>

      <main className="flex min-h-screen bg-cream text-text-primary antialiased">
        {/* Left decorative panel */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-navy-deep to-primary">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaienLFT5eqymFHGYCcsUqY9kMDYXaWwisWIi5P1HUOMoAoKZBcKhrlc3q3jz2UntYHe1xlxasg0ihVTIxaI7onQSEViG9ZVH9yK8eswxWIPN5-SVU5q4uM7YYYbO-0WV90v3r8Gp4KHRn_7ONSnSYNDMAHyvQxU5SyFOlsqKTNM5MULh84rMIKUVfktKPS3MkdlIgYM6X7E0TpTliT2IQg4fb7QpOHs7O1hodEe7UGqP2WF0DLJx-rhbzBwyXCKXBCiN2Gw4"
              alt="Coastal Club interior"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg animate-fade-in-up">
            <Link
              href="/"
              className="text-6xl font-bold italic tracking-tight drop-shadow-lg mb-6 text-gold-light hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Coastal Club
            </Link>
            <div className="w-24 h-px mb-6 bg-gold-muted/50" />
            {/* OTP icon pulse */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-gold-light/30 animate-pulse-ring" />
              <div className="w-20 h-20 rounded-full bg-gold-light/10 border border-gold-light/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gold-light">shield_lock</span>
              </div>
            </div>
            <p
              className="text-3xl font-semibold opacity-90 leading-snug text-cream-dark"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              One Step
              <br />
              From Entry
            </p>
            <p className="mt-4 text-sm text-gold-light/60 max-w-xs" style={{ fontFamily: "var(--font-inter)" }}>
              Verify your identity to unlock exclusive access to Coastal Club membership benefits.
            </p>
          </div>

          <div className="absolute inset-6 border border-gold-muted/20 pointer-events-none rounded-lg" />
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-10">
              <Link
                href="/"
                className="text-4xl font-bold tracking-tight mb-2 text-primary hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Coastal Club
              </Link>
              <p className="text-base italic text-gold-muted" style={{ fontFamily: "var(--font-inter)" }}>
                Exclusive Access Awaits You
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded border border-gold-muted/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden animate-fade-in-up">
              {/* Card header */}
              <div className="p-6 border-b border-cream-dark text-center bg-cream/30">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-primary">mark_email_read</span>
                  </div>
                </div>
                <h1
                  className="text-3xl font-semibold text-primary mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Verify Your Identity
                </h1>
                <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-inter)" }}>
                  {deliveryDescription
                    ? `We sent a one-time code to your ${deliveryDescription}.`
                    : "Enter the one-time code we sent you."}
                </p>
              </div>

              {/* Form body */}
              <div className="p-6">
                <form onSubmit={onSubmit} className="grid gap-5">
                  <div>
                    <label
                      htmlFor="otp-code"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      One-Time Code
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        pin
                      </span>
                      <input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        required
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-center text-xl font-bold tracking-[0.4em] text-text-primary placeholder:text-text-muted/40 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p
                      className="text-sm text-danger flex items-center gap-1.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <span className="material-symbols-outlined text-base leading-none">error</span>
                      {error}
                    </p>
                  )}

                  {info && (
                    <p
                      className="text-sm text-emerald-700 flex items-center gap-1.5"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <span className="material-symbols-outlined text-base leading-none">check_circle</span>
                      {info}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {loading ? "Verifying…" : "Verify & Continue"}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"
                    />
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-inter)" }}>
                    Didn&apos;t receive it?
                  </p>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={loading}
                    className="text-sm font-semibold text-gold-muted hover:text-primary disabled:opacity-50 transition-colors underline underline-offset-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Resend OTP
                  </button>
                </div>

                <p
                  className="mt-6 text-center text-sm text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Wrong account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-gold-muted hover:text-primary font-semibold transition-colors"
                  >
                    Start over
                  </Link>
                </p>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-gold-muted/20 via-gold-muted to-gold-muted/20" />
            </div>

            <div className="mt-8 text-center flex justify-center gap-6 flex-wrap">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact Concierge", href: "#" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
