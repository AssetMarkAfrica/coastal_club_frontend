"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyMaintenanceFee } from "@/store/membership/membershipThunks";
import {
  selectMyMembership,
  selectMaintenanceFeeLoading,
  selectMembershipError,
} from "@/store/membership/membershipSelectors";

/* ── helpers ── */
const formatMoney = (pesewas: number) =>
  `GHc ${(pesewas / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* ── animated checkmark ── */
const AnimatedCheck = () => (
  <svg
    className="h-20 w-20 animate-[draw_0.6s_ease_forwards]"
    viewBox="0 0 80 80"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <style>{`
      @keyframes draw {
        from { stroke-dashoffset: 200; opacity: 0; }
        to   { stroke-dashoffset: 0;   opacity: 1; }
      }
      .check-circle { stroke-dasharray: 220; stroke-dashoffset: 220; animation: draw 0.5s 0.1s ease forwards; }
      .check-mark   { stroke-dasharray: 80;  stroke-dashoffset: 80;  animation: draw 0.4s 0.5s ease forwards; }
    `}</style>
    <circle className="check-circle" cx="40" cy="40" r="34" stroke="#D4AF37" strokeWidth="3" />
    <path className="check-mark" d="M22 40l13 13 23-23" stroke="#D4AF37" strokeWidth="4" />
  </svg>
);

const AnimatedX = () => (
  <svg
    className="h-20 w-20"
    viewBox="0 0 80 80"
    fill="none"
    strokeLinecap="round"
  >
    <circle cx="40" cy="40" r="34" stroke="#B42318" strokeWidth="3" />
    <path d="M26 26l28 28M54 26L26 54" stroke="#B42318" strokeWidth="4" />
  </svg>
);

type VerifyState = "loading" | "success" | "error";

export default function MaintenanceFeeVerifyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? "";

  const membership = useAppSelector(selectMyMembership);
  const isLoading = useAppSelector(selectMaintenanceFeeLoading);
  const storeError = useAppSelector(selectMembershipError);

  const [verifyState, setVerifyState] = useState<VerifyState>("loading");
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!reference || hasVerified.current) return;
    hasVerified.current = true;

    dispatch(verifyMaintenanceFee({ reference })).then((result) => {
      if (verifyMaintenanceFee.fulfilled.match(result)) {
        setVerifyState("success");
      } else {
        setVerifyState("error");
      }
    });
  }, [dispatch, reference]);

  /* countdown auto-redirect on success */
  useEffect(() => {
    if (verifyState !== "success") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/membership/dashboard");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [verifyState, router]);

  /* ── loading state ── */
  if (verifyState === "loading" || isLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-6 bg-[#f5f0e8] min-h-[60vh]">
        <div
          className="h-16 w-16 animate-spin rounded-full border-4"
          style={{
            borderColor: "rgba(212,175,55,0.25)",
            borderTopColor: "#D4AF37",
          }}
        />
        <p
          className="text-xl font-semibold text-[#1E3A5F]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Verifying your payment…
        </p>
        <p className="text-sm text-[#6B7280]">This will only take a moment.</p>
      </main>
    );
  }

  /* ── success state ── */
  if (verifyState === "success") {
    const newCredit = membership?.spend_credit_remaining_pesewas ?? 0;

    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8] px-6 py-12">
        <div className="w-full max-w-md text-center">
          {/* Gold checkmark */}
          <div className="flex justify-center mb-6">
            <AnimatedCheck />
          </div>

          <h1
            className="text-3xl font-bold text-[#1E3A5F]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Payment Successful!
          </h1>
          <p className="mt-3 text-[#6B7280] text-sm leading-relaxed">
            Your maintenance fee has been received. Your spend credit has been
            refreshed for this month.
          </p>

          {/* Updated credit */}
          <div className="mt-7 rounded-xl border border-[#D4AF37]/30 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9CA3AF] mb-1">
              Spend Credit Available
            </p>
            <p
              className="text-4xl font-bold text-[#1E3A5F]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {formatMoney(newCredit)}
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">
              ✓ Ready to use at the club
            </p>
          </div>

          {/* Auto-redirect notice */}
          <p className="mt-6 text-sm text-[#9CA3AF]">
            Redirecting to dashboard in{" "}
            <span className="font-semibold text-[#1E3A5F]">{countdown}s</span>…
          </p>

          <button
            onClick={() => router.push("/membership/dashboard")}
            className="mt-4 w-full rounded-xl bg-[#1E3A5F] py-3.5 text-sm font-semibold text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#1E3A5F] transition-all duration-200"
          >
            Go to Dashboard Now
          </button>
        </div>
      </main>
    );
  }

  /* ── error state ── */
  return (
    <main className="flex-1 flex items-center justify-center bg-[#f5f0e8] px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AnimatedX />
        </div>

        <h1
          className="text-3xl font-bold text-[#B42318]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Verification Failed
        </h1>
        <p className="mt-3 text-[#6B7280] text-sm leading-relaxed">
          {storeError ??
            "We could not confirm your payment. Please try again or contact support if the issue persists."}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => router.push("/membership/maintenance")}
            className="w-full rounded-xl bg-[#1E3A5F] py-3.5 text-sm font-semibold text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#1E3A5F] transition-all duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/membership/dashboard")}
            className="w-full rounded-xl border border-[#1E3A5F]/20 bg-white py-3.5 text-sm font-medium text-[#1E3A5F] hover:bg-[#f5f0e8] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
