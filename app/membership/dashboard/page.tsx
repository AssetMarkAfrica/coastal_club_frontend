"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/auth/authSelectors";
import {
  selectMembershipLoading,
  selectMyMembership,
} from "@/store/membership/membershipSelectors";
import { fetchMyMembership } from "@/store/membership/membershipThunks";
import WaitlistExperience from "./WaitlistExperience";
import { IconBill, IconShield, IconSpend, IconTicket, IconTrendUp } from "./icons";
import { formatMoney, formatDate, toTitleCase, QUICK_SERVICES } from "./utils";



export default function MembershipDashboardPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const membership = useAppSelector(selectMyMembership);
  const loading = useAppSelector(selectMembershipLoading);

  useEffect(() => {
    dispatch(fetchMyMembership());
  }, [dispatch]);

  const lastName = currentUser?.last_name;
  const tierLabel = membership ? toTitleCase(membership.plan.tier) : null;

  const spendCredit = membership
    ? formatMoney(membership.spend_credit_remaining_pesewas)
    : null;

  const monthlyDues = membership
    ? formatMoney(membership.maintenance_fee_due_pesewas)
    : null;

  const renewsDate = membership ? formatDate(membership.current_period_end) : null;

  const isActive = membership?.is_active ?? null;

  const guestPasses = membership?.plan.guest_passes_per_visit ?? null;

  const memberSince = membership ? formatDate(membership.created_at) : null;

  if (!loading && !membership) {
    return <WaitlistExperience />;
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#f5f0e8]">


        {/* ── Hero welcome banner ── */}
        <section
          className="relative overflow-hidden px-8 py-8 text-cream"
          style={{
            background: "linear-gradient(135deg, #0d1f3c 0%, #162847 60%, #1c3259 100%)",
          }}
        >
          {/* subtle geometric pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 40px)",
            }}
          />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Welcome back{lastName ? `, Mr. ${lastName}` : ""}.
              </h1>
              <p className="mt-2 text-sm text-cream/70 max-w-xl leading-relaxed">
                The concierge is available for any arrangements you may need.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end shrink-0">
              {tierLabel && (
                <div className="flex items-center gap-2 rounded-full border border-gold-muted/50 bg-gold-muted/10 px-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-muted" />
                  <span
                    className="text-[11px] font-semibold tracking-[0.16em] uppercase text-gold-muted"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {tierLabel} Tier
                  </span>
                </div>
              )}
              {memberSince && (
                <p className="mt-2 text-xs text-cream/50">Member since {memberSince}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── Stat cards ── */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-8 py-6 bg-[#f5f0e8]">
          {[
            {
              label: "Spend Credit",
              value: loading ? "—" : (spendCredit ?? "—"),
              sub: spendCredit ? (
                <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                  <IconTrendUp /> Available to use
                </span>
              ) : null,
              icon: <IconSpend />,
            },
            {
              label: "Monthly Dues",
              value: loading ? "—" : (monthlyDues ?? "—"),
              sub: membership?.maintenance_fee_paid_through_month ? (
                <span className="text-text-secondary text-[11px]">
                  Paid through {membership.maintenance_fee_paid_through_month}
                </span>
              ) : null,
              icon: <IconBill />,
            },
            {
              label: "Validity",
              value: loading ? "—" : (isActive === null ? "—" : isActive ? "Active" : "Inactive"),
              sub: renewsDate ? (
                <span className="text-text-secondary text-[11px]">Renews {renewsDate}</span>
              ) : null,
              icon: <IconShield />,
              valueCls: "text-2xl font-bold",
            },
            {
              label: "Guest Passes",
              value: loading ? "—" : (guestPasses !== null ? String(guestPasses) : "—"),
              sub: guestPasses !== null ? (
                <span className="text-text-secondary text-[11px]">Per visit</span>
              ) : null,
              icon: <IconTicket />,
              suffix: guestPasses !== null ? "Per visit" : undefined,
            },
          ].map(({ label, value, icon, valueCls, suffix }) => (
            <div
              key={label}
              className="rounded-lg border border-gold-muted/20 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-secondary tracking-wide">{label}</span>
                <span className="text-gold-muted/70">{icon}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p
                  className={valueCls ?? "text-2xl font-semibold text-primary"}
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {value}
                </p>
                {suffix && (
                  <span className="text-sm text-text-secondary">{suffix}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── Lower grid: Quick Services + Member Card  |  Recent Updates ── */}
        <section className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 px-8 pb-8 bg-[#f5f0e8]">

          {/* Left column */}
          <div className="flex flex-col gap-6">

            {/* Quick Services */}
            <div>
              <h2
                className="text-xl font-semibold text-primary mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Quick Services
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_SERVICES.map(({ label, icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gold-muted/20 bg-white py-6 px-3 text-center shadow-sm hover:border-gold-muted/50 hover:shadow-md transition-all duration-200 group"
                  >
                    <span className="text-gold-muted group-hover:scale-110 transition-transform duration-200">
                      {icon}
                    </span>
                    <span className="text-xs text-text-primary font-medium leading-snug whitespace-pre-line">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Member Card */}
            <div>
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  aspectRatio: "1.586",
                  background: "linear-gradient(135deg, #0d1f3c 0%, #1a3058 50%, #0d1f3c 100%)",
                }}
              >
                {/* Geometric diamond pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(201,168,76,0.15) 18px, rgba(201,168,76,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(201,168,76,0.15) 18px, rgba(201,168,76,0.15) 20px)",
                  }}
                />

                {/* Card brand */}
                <p
                  className="absolute top-5 left-6 text-xl italic text-gold-muted"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Estrella
                </p>

                {/* NFC icon */}
                <div className="absolute top-5 right-6 text-gold-muted/60">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" opacity=".3" />
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity=".6" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </div>

                {/* Card details */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="text-[9px] font-semibold tracking-[0.22em] uppercase text-gold-muted/70 mb-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {tierLabel ? `${tierLabel} Member` : "Member"}
                  </p>
                  {currentUser && (
                    <p
                      className="text-xl font-bold tracking-widest text-white"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {currentUser.first_name?.[0]
                        ? `${currentUser.first_name[0]}. ${(currentUser.last_name ?? "").toUpperCase()}`
                        : (currentUser.last_name ?? "").toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column – Recent Updates */}
          <div>
            <h2
              className="text-xl font-semibold text-primary mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Recent Updates
            </h2>
            <div className="rounded-lg border border-gold-muted/20 bg-white shadow-sm px-6 py-10 text-center">
              <p className="text-sm text-text-secondary">No recent updates.</p>
            </div>
          </div>
        </section>
    </main>
  );
}

