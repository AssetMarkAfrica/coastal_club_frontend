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
import { formatMoney, formatDate, toTitleCase } from "./utils";
import {
  Utensils,
  Sunset,
  DoorClosed,
  Calendar,
  CreditCard,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  PhoneCall,
  Clock,
  Wine,
  GlassWater,
  ShieldCheck,
} from "lucide-react";

/* ── Lounge Showcase Assets ── */
const VENUE_SHOWCASE = [
  {
    id: "fine-dining",
    title: "The Fine Dining Room",
    category: "Gastronomy & Sommelier Cellar",
    description: "An exquisite à la carte culinary journey prepared by master chefs paired with vintage wines.",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787761397/FineDining7_fepbsb.png",
    badge: "Signature Dining",
    bookUrl: "/booking/member/create?venue=fine_dining",
    exploreUrl: "/fine-dining",
    icon: Utensils,
  },
  {
    id: "skybar",
    title: "Skybar & Ocean Lounge",
    category: "Craft Cocktails & Panoramic Sunset",
    description: "Enjoy handcrafted cocktails beneath open skies with unhindered ocean views and live DJ sets.",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
    badge: "Rooftop Lounge",
    bookUrl: "/booking/member/create?venue=skybar",
    exploreUrl: "/skybar",
    icon: Sunset,
  },
  {
    id: "private-room",
    title: "Private Executive Suite",
    category: "Exclusive Hostings & Private Meetings",
    description: "An intimate sanctuary for private celebrations, confidential business dinners, and VIP hosting.",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
    badge: "VIP Sanctuary",
    bookUrl: "/booking/member/create?venue=private_room",
    exploreUrl: "/private-room",
    icon: DoorClosed,
  },
];

/* ── Curated Member Events Feed ── */
const MEMBER_EVENTS = [
  {
    id: "jazz-night",
    title: "Sunset Jazz & Vintage Champagne",
    date: "This Friday · 8:00 PM",
    location: "Skybar Terrace",
    tag: "Exclusive Event",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar2_wt66as.png",
  },
  {
    id: "chefs-table",
    title: "Chef's 7-Course Omakase Tasting",
    date: "Next Saturday · 7:30 PM",
    location: "Fine Dining Room",
    tag: "Members Only",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining2_mluv5r.png",
  },
];

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
  const firstName = currentUser?.first_name;
  const tierLabel = membership ? toTitleCase(membership.plan.tier) : null;
  const spendCredit = membership ? formatMoney(membership.spend_credit_remaining_pesewas) : null;
  const monthlyDues = membership ? formatMoney(membership.maintenance_fee_due_pesewas) : null;
  const renewsDate = membership ? formatDate(membership.current_period_end) : null;
  const isActive = membership?.is_active ?? null;
  const guestPasses = membership?.plan.guest_passes_per_visit ?? null;
  const memberSince = membership ? formatDate(membership.created_at) : null;

  if (!fetched || loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[#F7F5F0] min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-muted/30 border-t-navy-deep" />
          <p className="text-xs text-navy-deep/60 uppercase tracking-widest font-semibold">
            Loading Member Portal…
          </p>
        </div>
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
        <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F5F0] px-6 py-10">
          <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-gold-muted/30 bg-white shadow-[0_24px_64px_rgba(16,36,63,0.14)] text-center px-8 py-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h2
              className="text-3xl font-bold text-navy-deep"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Application Approved!
            </h2>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Congratulations! Your membership application has been approved by the club executive committee. Sign your contract to complete onboarding.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/membership/contract"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-deep px-8 py-3.5 text-xs font-bold tracking-[0.14em] uppercase text-gold-light shadow-md hover:bg-gold-muted hover:text-navy-deep transition-all"
              >
                Sign Membership Contract <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </main>
      );
    }

    // ── Non-Member Hero Page ──────────────────────
    return (
      <main className="flex-1 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F5F0] px-6 py-10">
        <section className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-gold-muted mb-2 bg-gold-muted/10 border border-gold-muted/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> Estrella del Mar
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-deep mt-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Experience The Coastal Club
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto">
              Reserve your dining table today or join as a member for full privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {/* Membership Card */}
            <Link
              href="/membership/plans"
              className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 flex flex-col shadow-[0_24px_64px_rgba(16,36,63,0.25)] transition-transform duration-300 hover:-translate-y-1.5"
              style={{
                background: "linear-gradient(135deg, #0d1f3c 0%, #162847 60%, #1c3259 100%)",
              }}
            >
              <div className="absolute top-4 right-4 rounded-full border border-gold-muted/50 bg-gold-muted/15 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase text-gold-light">
                Recommended
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-muted/20 text-gold-light mb-6 border border-gold-muted/40">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Become a Member
              </h3>
              <p className="mt-3 text-sm text-cream/70 leading-relaxed flex-1">
                Unlock monthly spend credits, priority lounge bookings, guest passes, and access to private member events.
              </p>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-gold-light group-hover:underline">
                  View Plans & Tiers
                </span>
                <ChevronRight className="w-5 h-5 text-gold-light group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Booking Card */}
            <Link
              href="/booking/customer/create"
              className="group relative overflow-hidden rounded-3xl border border-gold-muted/30 bg-white p-8 sm:p-10 flex flex-col shadow-[0_12px_32px_rgba(16,36,63,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-muted hover:shadow-[0_20px_48px_rgba(16,36,63,0.14)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-deep/5 text-navy-deep mb-6 border border-navy-deep/10">
                <Utensils className="w-6 h-6 text-navy-deep" />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Book a Table
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed flex-1">
                No membership required. Enjoy à la carte fine dining, skybar cocktails, or private lounge hosting as our guest.
              </p>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-navy-deep group-hover:underline">
                  Reserve Table Now
                </span>
                <ChevronRight className="w-5 h-5 text-navy-deep group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ── FULL ACTIVE MEMBER DASHBOARD ──────────────────────────────────────────
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#F7F5F0]">
      {/* ── 1. Hero Greeting Banner ── */}
      <section
        className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 text-cream"
        style={{
          background: "linear-gradient(135deg, #0a1728 0%, #10243F 50%, #1a3459 100%)",
        }}
      >
        {/* Glow & Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-muted/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-muted/40 bg-gold-muted/15 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-gold-light">
                <Sparkles className="w-3 h-3" /> Member Portal
              </span>
              {tierLabel && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-white/90">
                  {tierLabel} Tier
                </span>
              )}
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Welcome back{firstName ? `, ${firstName}` : lastName ? `, Mr. ${lastName}` : ""}.
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-cream/75 max-w-xl leading-relaxed font-light">
              Your member privileges are active. Reserve your table at Fine Dining, Skybar, or Private Suite today.
            </p>
          </div>

          {/* Header Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/booking/member/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-muted px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase text-navy-deep shadow-lg hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="w-4 h-4" /> Book a Table
            </Link>
            <Link
              href="/membership/card"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 backdrop-blur-md px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase text-white hover:bg-white/20 hover:border-gold-light/50 transition-all"
            >
              <CreditCard className="w-4 h-4 text-gold-light" /> Member Card
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Key Privileges & Financial Stats Grid ── */}
      <section className="px-6 py-6 sm:px-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Spend Credit */}
          <div className="rounded-2xl border border-gold-muted/25 bg-white p-5 shadow-[0_4px_20px_rgba(16,36,63,0.06)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest">
                Spend Credit
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <IconSpend />
              </div>
            </div>
            <p
              className="text-2xl sm:text-3xl font-bold text-navy-deep"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {spendCredit ?? "—"}
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                <IconTrendUp /> Available to spend
              </span>
              <Link
                href="/booking/member/create"
                className="text-[11px] font-bold text-navy-deep hover:text-gold-muted flex items-center gap-0.5"
              >
                Use Credit <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Monthly Dues */}
          <div className="rounded-2xl border border-gold-muted/25 bg-white p-5 shadow-[0_4px_20px_rgba(16,36,63,0.06)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest">
                Monthly Dues
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <IconBill />
              </div>
            </div>
            <p
              className="text-2xl sm:text-3xl font-bold text-navy-deep"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {monthlyDues ?? "—"}
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
              {(() => {
                const feeStatus = membership.maintenance_fee_status;
                if (feeStatus === "bonus_active") {
                  return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      ✦ Bonus Active
                    </span>
                  );
                }
                if (feeStatus === "paid" || membership.is_maintenance_fee_paid_current_month) {
                  return (
                    <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Paid Current Month
                    </span>
                  );
                }
                return (
                  <Link
                    href="/membership/maintenance"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-amber-700 transition-colors"
                  >
                    Pay Dues Now <ArrowUpRight className="w-3 h-3" />
                  </Link>
                );
              })()}
            </div>
          </div>

          {/* Validity / Status */}
          <div className="rounded-2xl border border-gold-muted/25 bg-white p-5 shadow-[0_4px_20px_rgba(16,36,63,0.06)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest">
                Membership Status
              </span>
              <div className="p-2 rounded-xl bg-navy-deep/5 text-navy-deep">
                <IconShield />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p
                className="text-2xl font-bold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {isActive ? "Active VIP" : "Inactive"}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-text-secondary">
              <span>{renewsDate ? `Renews ${renewsDate}` : "Active"}</span>
              {memberSince && <span className="text-gold-muted font-medium">Member since {memberSince}</span>}
            </div>
          </div>

          {/* Guest Passes */}
          <div className="rounded-2xl border border-gold-muted/25 bg-white p-5 shadow-[0_4px_20px_rgba(16,36,63,0.06)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest">
                Guest Passes
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <IconTicket />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p
                className="text-2xl sm:text-3xl font-bold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {guestPasses !== null ? String(guestPasses) : "—"}
              </p>
              <span className="text-xs font-medium text-text-secondary">Passes per visit</span>
            </div>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[11px] text-emerald-600 font-semibold">Included in tier</span>
              <Link
                href="/booking/member/create"
                className="text-[11px] font-bold text-navy-deep hover:text-gold-muted"
              >
                Bring Guests →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Exclusive Lounges & Venues Showcase ── */}
      <section className="px-6 py-6 sm:px-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-muted block mb-1">
              Member Reservations
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-navy-deep"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Exclusive Venues & Experiences
            </h2>
          </div>
          <Link
            href="/booking/member/create"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-navy-deep/20 bg-white px-4 py-2.5 text-xs font-bold tracking-[0.12em] uppercase text-navy-deep hover:bg-navy-deep hover:text-gold-light transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4" /> Reserve Any Venue
          </Link>
        </div>

        {/* 3 Venue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VENUE_SHOWCASE.map((venue) => {
            const IconComp = venue.icon;
            return (
              <div
                key={venue.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold-muted/20 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(16,36,63,0.14)] transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Venue Image Header */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-gold-light">
                    <IconComp className="w-3 h-3 text-gold-light" />
                    {venue.badge}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold-light/80 mb-0.5">
                      {venue.category}
                    </p>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {venue.title}
                    </h3>
                  </div>
                </div>

                {/* Venue Description & Action Buttons */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
                    {venue.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={venue.bookUrl}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy-deep py-3 text-xs font-bold tracking-[0.14em] uppercase text-gold-light hover:bg-gold-muted hover:text-navy-deep transition-all shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Table
                    </Link>

                    <Link
                      href={venue.exploreUrl}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-semibold text-navy-deep hover:bg-gray-100 transition-colors text-center"
                    >
                      Explore Venue Details <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Main Body: Digital Card & Curated Member Events ── */}
      <section className="px-6 py-6 sm:px-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Left Column: Digital Card Showcase (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-3xl border border-gold-muted/25 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xs font-bold text-navy-deep/60 uppercase tracking-widest">
                Digital Membership Card
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● Verified VIP
              </span>
            </div>

            {/* Deluxe Card Graphic */}
            <Link
              href="/membership/card"
              className="block relative overflow-hidden rounded-2xl group w-full shadow-xl transition-transform duration-300 hover:scale-[1.02]"
              style={{
                aspectRatio: "1.586",
                background: "linear-gradient(135deg, #091526 0%, #10243F 50%, #1c365d 100%)",
              }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 z-10 rounded-2xl" />
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(201,168,76,0.2) 18px, rgba(201,168,76,0.2) 20px), repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(201,168,76,0.2) 18px, rgba(201,168,76,0.2) 20px)",
                }}
              />

              <div className="p-6 flex flex-col justify-between h-full relative z-20">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-2xl italic text-gold-light font-bold"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Estrella del Mar
                    </p>
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gold-muted/80 mt-0.5">
                      Coastal Club
                    </p>
                  </div>
                  <Sparkles className="w-6 h-6 text-gold-light/70" />
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-gold-light/70 mb-1">
                    {tierLabel ? `${tierLabel} Member` : "Member"}
                  </p>
                  {currentUser && (
                    <p
                      className="text-xl sm:text-2xl font-bold tracking-widest text-white uppercase"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {currentUser.first_name?.[0]
                        ? `${currentUser.first_name[0]}. ${currentUser.last_name ?? ""}`
                        : currentUser.last_name ?? "Valued Member"}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            {/* Action Buttons for Digital Card */}
            <div className="w-full grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-100">
              <Link
                href="/membership/card"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-deep px-4 py-3 text-xs font-bold tracking-wider uppercase text-gold-light hover:bg-gold-muted hover:text-navy-deep transition-all text-center"
              >
                <CreditCard className="w-3.5 h-3.5" /> Open Card
              </Link>
              <Link
                href="/membership/perks"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-navy-deep/20 bg-cream/40 px-4 py-3 text-xs font-bold tracking-wider uppercase text-navy-deep hover:bg-navy-deep hover:text-gold-light transition-all text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-muted" /> Member Perks
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Exclusive Member Events & Concierge (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="rounded-3xl border border-gold-muted/25 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-muted block mb-1">
                    Club Happenings
                  </span>
                  <h3
                    className="text-xl font-bold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Upcoming Member Events
                  </h3>
                </div>
                <Link
                  href="/events/discover"
                  className="text-xs font-bold text-navy-deep hover:text-gold-muted flex items-center gap-1"
                >
                  All Events <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Event Cards List */}
              <div className="flex flex-col gap-4">
                {MEMBER_EVENTS.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-100 p-3 bg-gray-50/70 hover:bg-white hover:border-gold-muted/40 hover:shadow-md transition-all group"
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full sm:w-28 h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <span className="inline-block rounded-full bg-gold-muted/15 text-gold-muted px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
                          {evt.tag}
                        </span>
                        <h4 className="text-base font-bold text-navy-deep leading-tight group-hover:text-gold-muted transition-colors">
                          {evt.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-navy-deep/60" /> {evt.date}
                        </span>
                        <Link
                          href="/booking/member/create"
                          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-navy-deep hover:underline"
                        >
                          RSVP Table →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Concierge Contact Strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-deep/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-deep text-gold-light flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-deep">24/7 Member Concierge Desk</p>
                  <p className="text-[11px] text-text-secondary">Assistance with custom arrangements & transport.</p>
                </div>
              </div>
              <Link
                href="/booking/member/create"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy-deep px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-light hover:bg-gold-muted hover:text-navy-deep transition-all shrink-0 w-full sm:w-auto"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}