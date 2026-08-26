"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/auth/authSelectors";
import {
  selectMembershipLoading,
  selectMyMembership,
  selectMembershipApplication,
  selectMyMembershipStatus,
} from "@/store/membership/membershipSelectors";
import { fetchMyMembership, fetchMyMembershipStatus } from "@/store/membership/membershipThunks";
import WaitlistExperience from "./WaitlistExperience";
import { IconBill, IconShield, IconSpend, IconTicket, IconTrendUp } from "./icons";
import { formatMoney, formatDate, toTitleCase, QUICK_SERVICES } from "./utils";

export default function MembershipDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const membership = useAppSelector(selectMyMembership);
  const loading = useAppSelector(selectMembershipLoading);
  const application = useAppSelector(selectMembershipApplication);
  const myMembershipStatus = useAppSelector(selectMyMembershipStatus);

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.allSettled([
        dispatch(fetchMyMembership()),
        dispatch(fetchMyMembershipStatus()),
      ]);
      setFetched(true);
    };
    loadData();
  }, [dispatch]);

  const lastName = currentUser?.last_name;
  const tierLabel = membership ? toTitleCase(membership.plan.tier) : null;
  const spendCredit = membership ? formatMoney(membership.spend_credit_remaining_pesewas) : null;
  const monthlyDues = membership ? formatMoney(membership.maintenance_fee_due_pesewas) : null;
  const renewsDate = membership ? formatDate(membership.current_period_end) : null;
  const isActive = membership?.is_active ?? null;
  const guestPasses = membership?.plan.guest_passes_per_visit ?? null;
  const memberSince = membership ? formatDate(membership.created_at) : null;

  if (!fetched || loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#f5f0e8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-muted/30 border-t-primary" />
      </main>
    );
  }

  if (!membership) {
    const status = myMembershipStatus?.status;

    if (status === "pending_fee" || status === "pending_review" || (!myMembershipStatus && application)) {
      return <WaitlistExperience />;
    }

    if (status === "approved") {
      return (
        <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f5f0e8] px-6 py-10">
          <section className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gold-muted/25 bg-white shadow-[0_24px_64px_rgba(16,36,63,0.14)] text-center px-8 py-12">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2
              className="text-2xl font-semibold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Application Approved!
            </h2>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Your application for membership has been approved. Please review and sign your contract to complete your onboarding.
            </p>
            <div className="mt-8">
              <Link
                href="/membership/contract"
                className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted focus:ring-offset-2"
              >
                Sign Contract
              </Link>
            </div>
          </section>
        </main>
      );
    }

    // ── User has not applied yet — split-path hero ──────────────────────
    return (
      <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f5f0e8] px-6 py-10">
        <section className="w-full max-w-4xl">
          {/* Intro */}
          <div className="text-center mb-10">
            <span
              className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-gold-muted mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Estrella del Mar
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Begin Your Journey
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
              Reserve a table today, or become a member for unlimited access to every
              privilege the club offers.
            </p>
          </div>

          {/* Two paths */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {/* Membership — featured */}
            <Link
              href="/membership/plans"
              className="group relative overflow-hidden rounded-2xl px-8 py-10 flex flex-col shadow-[0_24px_64px_rgba(16,36,63,0.28)] transition-transform duration-200 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #0d1f3c 0%, #162847 55%, #1c3259 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 40px)",
                }}
              />
              <span className="absolute top-5 right-5 rounded-full border border-gold-muted/50 bg-gold-muted/10 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-gold-muted">
                Recommended
              </span>

              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gold-muted/15 text-gold-muted mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3l2.7 5.9L21 9.7l-4.6 4.3 1.2 6.4L12 17.6l-5.6 2.8 1.2-6.4L3 9.7l6.3-.8L12 3z" strokeLinejoin="round" />
                </svg>
              </div>

              <h3
                className="relative text-2xl font-semibold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Become a Member
              </h3>
              <p className="relative mt-3 text-sm text-cream/70 leading-relaxed flex-1">
                Unlock spend credit, guest passes, priority reservations and exclusive
                events reserved only for members.
              </p>

              <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold-muted">
                Explore Membership Plans
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Booking — secondary */}
            <Link
              href="/booking/customer/create"
              className="group relative overflow-hidden rounded-2xl border border-gold-muted/25 bg-white px-8 py-10 flex flex-col shadow-[0_12px_32px_rgba(16,36,63,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-gold-muted/50 hover:shadow-[0_20px_48px_rgba(16,36,63,0.14)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/5 text-primary mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
                </svg>
              </div>

              <h3
                className="text-2xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Book a Table
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed flex-1">
                No membership required. Reserve a table and experience Estrella del
                Mar as our guest.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Make a Reservation
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ── Has membership → full dashboard (unchanged) ─────────────────────────
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#f5f0e8]">
      <section
        className="relative overflow-hidden px-8 py-8 text-cream"
        style={{
          background: "linear-gradient(135deg, #0d1f3c 0%, #162847 60%, #1c3259 100%)",
        }}
      >
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

      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-8 py-6 bg-[#f5f0e8]">
        {[
          {
            label: "Spend Credit",
            value: spendCredit ?? "—",
            sub: spendCredit ? (
              <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                <IconTrendUp /> Available to use
              </span>
            ) : null,
            icon: <IconSpend />,
          },
          {
            label: "Monthly Dues",
            value: monthlyDues ?? "—",
            sub: (() => {
              const feeStatus = membership.maintenance_fee_status;
              if (feeStatus === "bonus_active") {
                return (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                    ✦ Bonus Active
                  </span>
                );
              }
              if (feeStatus === "paid" || membership.is_maintenance_fee_paid_current_month) {
                return (
                  <span className="text-text-secondary text-[11px]">
                    Paid through {membership.maintenance_fee_paid_through_month}
                  </span>
                );
              }
              return (
                <button
                  onClick={() => router.push("/membership/maintenance")}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  ⚠ Pay Now
                </button>
              );
            })(),
            icon: <IconBill />,
          },
          {
            label: "Validity",
            value: isActive ? "Active" : "Inactive",
            sub: renewsDate ? (
              <span className="text-text-secondary text-[11px]">Renews {renewsDate}</span>
            ) : null,
            icon: <IconShield />,
            valueCls: "text-2xl font-bold",
          },
          {
            label: "Guest Passes",
            value: guestPasses !== null ? String(guestPasses) : "—",
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

      <section className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 px-8 pb-8 bg-[#f5f0e8]">
        <div className="flex flex-col gap-6">
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

          <div>
            <Link
              href="/membership/card"
              className="block relative overflow-hidden rounded-2xl group"
              style={{
                width: "100%",
                maxWidth: "360px",
                aspectRatio: "1.586",
                background: "linear-gradient(135deg, #0d1f3c 0%, #1a3058 50%, #0d1f3c 100%)",
              }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 z-10 rounded-2xl" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(201,168,76,0.15) 18px, rgba(201,168,76,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(201,168,76,0.15) 18px, rgba(201,168,76,0.15) 20px)",
                }}
              />
              <p
                className="absolute top-5 left-6 text-xl italic text-gold-muted"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Estrella
              </p>
              <div className="absolute top-5 right-6 text-gold-muted/60">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" opacity=".3" />
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity=".6" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
              </div>
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
            </Link>
          </div>
        </div>

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