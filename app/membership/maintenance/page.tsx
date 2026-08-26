"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyMembership } from "@/store/membership/membershipThunks";
import { checkoutMaintenanceFee } from "@/store/membership/membershipThunks";
import {
  selectMyMembership,
  selectMembershipLoading,
  selectMaintenanceFeeLoading,
  selectMembershipError,
} from "@/store/membership/membershipSelectors";

/* ── helpers ── */
const formatMoney = (pesewas: number) =>
  `GHc ${(pesewas / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatMonth = (isoDate: string | null) => {
  if (!isoDate) return "this month";
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
};

/* ── icons ── */
const IconWallet = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 12V8H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12v4" />
    <path d="M20 12v4H6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14v-4" />
    <circle cx="18" cy="12" r="1" fill="currentColor" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBack = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MaintenanceFeePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const membership = useAppSelector(selectMyMembership);
  const loading = useAppSelector(selectMembershipLoading);
  const checkoutLoading = useAppSelector(selectMaintenanceFeeLoading);
  const error = useAppSelector(selectMembershipError);

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    dispatch(fetchMyMembership()).finally(() => setFetched(true));
  }, [dispatch]);

  const handlePayNow = async () => {
    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/membership/maintenance/verify`
        : "";

    const result = await dispatch(
      checkoutMaintenanceFee({ callback_url: callbackUrl })
    );

    if (checkoutMaintenanceFee.fulfilled.match(result)) {
      const { authorization_url } = result.payload as {
        authorization_url: string;
      };
      window.location.href = authorization_url;
    }
  };

  /* ── loading skeleton ── */
  if (!fetched || loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37]/30 border-t-[#1E3A5F]" />
      </main>
    );
  }

  /* ── no active membership ── */
  if (!membership) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8] px-6">
        <div className="rounded-2xl border border-[#D4AF37]/25 bg-white px-8 py-12 text-center max-w-md shadow-[0_4px_24px_rgba(16,36,63,0.08)]">
          <p className="text-[#1E3A5F] font-semibold text-lg mb-2">No Active Membership</p>
          <p className="text-[#6B7280] text-sm">
            You don't have an active membership yet. Apply for one to access this page.
          </p>
          <button
            onClick={() => router.push("/membership/plans")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-[#D4AF37] hover:bg-[#162847] transition-colors"
          >
            View Plans <IconArrow />
          </button>
        </div>
      </main>
    );
  }

  const feeStatus = membership.maintenance_fee_status;
  const isBonusActive = feeStatus === "bonus_active";
  const isPaid = feeStatus === "paid" || membership.is_maintenance_fee_paid_current_month;
  const dueAmount = membership.maintenance_fee_due_pesewas;

  /* ── bonus active — nothing to pay ── */
  if (isBonusActive) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8] px-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-12 text-center max-w-lg shadow-[0_4px_24px_rgba(16,36,63,0.06)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <IconCheck />
          </div>
          <h1
            className="text-2xl font-bold text-emerald-800"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Signup Bonus Active
          </h1>
          <p className="mt-3 text-sm text-emerald-700 leading-relaxed">
            Your signup bonus is active until{" "}
            <strong>{membership.signup_bonus_expires_on ?? "end of bonus period"}</strong>
            . No maintenance fee is required until then.
          </p>
          <button
            onClick={() => router.push("/membership/dashboard")}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#1E3A5F]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#1E3A5F] hover:bg-[#f5f0e8] transition-colors"
          >
            <IconBack /> Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  /* ── already paid this month ── */
  if (isPaid) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8] px-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-12 text-center max-w-lg shadow-[0_4px_24px_rgba(16,36,63,0.06)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <IconCheck />
          </div>
          <h1
            className="text-2xl font-bold text-emerald-800"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Maintenance Fee Paid
          </h1>
          <p className="mt-3 text-sm text-emerald-700 leading-relaxed">
            Your maintenance fee for{" "}
            <strong>
              {formatMonth(membership.maintenance_fee_paid_through_month)}
            </strong>{" "}
            has been paid. Your spend credit is up to date.
          </p>
          <p className="mt-4 text-xl font-semibold text-emerald-900" style={{ fontFamily: "var(--font-playfair)" }}>
            {formatMoney(membership.spend_credit_remaining_pesewas)} available
          </p>
          <button
            onClick={() => router.push("/membership/dashboard")}
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#1E3A5F]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#1E3A5F] hover:bg-[#f5f0e8] transition-colors"
          >
            <IconBack /> Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  /* ── unpaid — main payment UI ── */
  return (
    <main className="flex-1 bg-[#f5f0e8] px-6 py-10">
      <div className="mx-auto max-w-lg">
        {/* Back link */}
        <button
          onClick={() => router.push("/membership/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1E3A5F] transition-colors"
        >
          <IconBack /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-[#D4AF37]">
            <IconWallet />
          </div>
          <h1
            className="text-3xl font-bold text-[#1E3A5F]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Monthly Maintenance Fee
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Keep your membership active and spend credit flowing.
          </p>
        </div>

        {/* Amount card */}
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-8 text-center mb-6"
          style={{
            background:
              "linear-gradient(135deg, #10243F 0%, #1E3A5F 60%, #2A4F7A 100%)",
          }}
        >
          {/* subtle diagonal pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 40px)",
            }}
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]/70 mb-2">
            Amount Due
          </p>
          <p
            className="relative text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {formatMoney(dueAmount)}
          </p>
          <p className="relative mt-2 text-sm text-[#D4AF37]/60">
            For {formatMonth(new Date().toISOString().slice(0, 10))}
          </p>
        </div>

        {/* What you get */}
        <div className="rounded-xl border border-[#D4AF37]/20 bg-white px-6 py-5 mb-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280] mb-4">
            What's included
          </p>
          <ul className="space-y-3">
            {[
              `${formatMoney(membership.plan.club_maintenance_fee_pesewas)} in spend credit added to your account`,
              "Keep full access to all club amenities",
              "Guest pass privileges maintained",
              "Priority event registration",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#374151]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                  <IconCheck />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handlePayNow}
          disabled={checkoutLoading}
          className="w-full rounded-xl bg-[#1E3A5F] py-4 text-base font-semibold text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#1E3A5F] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {checkoutLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D4AF37]/40 border-t-[#D4AF37]" />
              Preparing payment…
            </>
          ) : (
            <>
              Pay {formatMoney(dueAmount)} via Paystack
              <IconArrow />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-[#9CA3AF]">
          You will be redirected to Paystack to complete your payment securely.
        </p>
      </div>
    </main>
  );
}
