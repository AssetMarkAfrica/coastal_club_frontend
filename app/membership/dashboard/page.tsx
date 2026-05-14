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

const formatMoney = (pesewas: number) =>
  `$${(pesewas / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value)
  );
};

const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

/* ── Icons (inline SVG to avoid import overhead) ── */
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconSupport = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconSpend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconBill = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconTicket = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
  </svg>
);
const IconFork = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="10" x2="12" y2="22" />
    <path d="M9 2v4a3 3 0 0 0 6 0V2" />
  </svg>
);
const IconSpa = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22C6 22 2 17 2 11c0-1.5.3-3 .8-4.3C5 7.5 7.5 8 9.5 9.5 10.5 7 12 5 12 2c0 3 1.5 5 2.5 7.5 2-1.5 4.5-2 6.7-2.8C21.7 8 22 9.5 22 11c0 6-4 11-10 11z" />
  </svg>
);
const IconEvents = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);
const IconConcierge = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
const IconTrendUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

/* ── Nav items ── */
const NAV_ITEMS = [
  { label: "Dashboard", icon: <IconGrid />, href: "/membership/dashboard", active: true },
  { label: "Member Card", icon: <IconCard />, href: "/membership/card" },
  { label: "Bookings", icon: <IconCalendar />, href: "/membership/bookings" },
  { label: "Exclusive Perks", icon: <IconStar />, href: "/membership/perks" },
  { label: "Settings", icon: <IconSettings />, href: "/membership/settings" },
];

/* ── Quick services ── */
const QUICK_SERVICES = [
  { label: "Dining\nReservation", icon: <IconFork />, href: "#" },
  { label: "Spa\nBooking", icon: <IconSpa />, href: "#" },
  { label: "Private\nEvents", icon: <IconEvents />, href: "#" },
  { label: "Concierge\nRequest", icon: <IconConcierge />, href: "#" },
];



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

  return (
    <div
      className="flex min-h-screen bg-cream font-sans text-text-primary antialiased"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside
        className="hidden lg:flex w-[248px] shrink-0 flex-col bg-navy-deep text-cream border-r border-white/5"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {/* Brand + profile */}
        <div className="px-6 pt-8 pb-6 border-b border-white/8">
          <p
            className="text-2xl italic text-gold-muted leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Estrella del Mar
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-gold-muted/60 bg-primary-container/60 overflow-hidden flex items-center justify-center shrink-0">
              <span className="text-gold-muted text-sm font-semibold">
                {(currentUser?.first_name?.[0] ?? "").toUpperCase() || "M"}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-cream leading-tight">Member Profile</p>
              <p className="text-[11px] text-gold-muted/80 mt-0.5">
                {tierLabel ? `${tierLabel} Member` : "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {NAV_ITEMS.map(({ label, icon, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-all duration-150 ${
                active
                  ? "bg-primary/70 border-l-2 border-gold-muted text-gold-light font-medium"
                  : "text-cream/60 hover:text-cream hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <span className={active ? "text-gold-muted" : "text-cream/40"}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-6 space-y-4 border-t border-white/8 pt-4">
          <button
            type="button"
            className="w-full rounded border border-gold-muted/70 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-gold-light hover:bg-gold-muted hover:text-primary transition-colors"
          >
            Reserve a Table
          </button>
          <div className="space-y-0.5">
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-cream/50 hover:text-cream/80 transition-colors">
              <IconSupport /> Support
            </Link>
            <Link href="/auth/logout" className="flex items-center gap-3 px-3 py-2 text-sm text-cream/50 hover:text-cream/80 transition-colors">
              <IconLogout /> Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* ════════════════ MAIN ════════════════ */}
      <main className="flex-1 min-w-0 flex flex-col">

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
    </div>
  );
}