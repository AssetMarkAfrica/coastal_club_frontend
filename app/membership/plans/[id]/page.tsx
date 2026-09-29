"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import {
  selectMembershipError,
  selectMembershipLoading,
  selectPlanDetail,
  selectMyMembership,
} from "@/store/membership/membershipSelectors";
import { fetchMembershipPlanById, submitMembershipApplication } from "@/store/membership/membershipThunks";
import { clearMembershipError } from "@/store/membership/membershipSlice";
import { TShirtSize } from "@/types/membership";

const formatMoney = (pesewas: number) =>
  `$${(pesewas / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const APPLICATION_FEE_LABEL = "$100";

const APPLICATION_PROCESS_STEPS = [
  "Pay the application fee to submit your membership application.",
  "Your application joins the waiting list while the admin team reviews it within 48 hours.",
  "If approved, you will receive an email with your membership contract.",
  "Accept the contract terms before paying your membership dues.",
];

const UPGRADE_PROCESS_STEPS = [
  "Your upgrade request is instantly approved — no waiting period.",
  "A new contract with your prorated credit is generated immediately.",
  "Accept the new contract terms in the contract page.",
  "Pay the prorated difference to activate your upgraded membership.",
];

// Tier colour palette (primary tint for gradient accents)
const TIER_COLOURS: Record<string, { from: string; via: string; accent: string }> = {
  social:    { from: "#6b7280", via: "#9ca3af", accent: "#6b7280" },
  sports:    { from: "#2563eb", via: "#3b82f6", accent: "#2563eb" },
  premier:   { from: "#b45309", via: "#d97706", accent: "#b45309" },
  corporate: { from: "#7c3aed", via: "#8b5cf6", accent: "#7c3aed" },
};

export default function MembershipPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params?.id);

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const plan = useAppSelector(selectPlanDetail);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);
  const myMembership = useAppSelector(selectMyMembership);

  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTShirtSize, setSelectedTShirtSize] = useState<TShirtSize | "">("");

  useEffect(() => {
    if (!Number.isNaN(planId) && planId > 0) {
      dispatch(fetchMembershipPlanById(planId));
    }
  }, [dispatch, planId]);

  const tierColours = TIER_COLOURS[plan?.tier ?? ""] ?? TIER_COLOURS.social;
  const isSubscribed = Boolean(plan?.is_subscribed);
  const hasActiveMembership = myMembership?.is_active === true;

  const standardBenefits = (plan?.benefits ?? []).filter(
    (b) => b.benefit_type === "standard" && b.is_active
  );
  const festiveBenefits = (plan?.benefits ?? []).filter(
    (b) => b.benefit_type === "festive" && b.is_active
  );

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setSelectedTShirtSize("");
  };

  const onConfirmApplication = async () => {
    if (!isAuthenticated || !plan) return;
    // For upgrades no t-shirt size is required; for new apps it must be selected
    const isUpgrade = hasActiveMembership && !isSubscribed;
    if (!isUpgrade && !selectedTShirtSize) return;
    dispatch(clearMembershipError());
    setSubmitting(true);
    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      const response = await dispatch(
        submitMembershipApplication({
          plan_tier: plan.tier,
          callback_url: callbackUrl,
          t_shirt_size: selectedTShirtSize as TShirtSize,
        })
      ).unwrap();
      if (response.is_upgrade) {
        window.location.assign("/membership/contract");
      } else if (response.authorization_url) {
        window.location.assign(response.authorization_url);
      }
    } catch {
      // error handled via slice
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────
  if (loading && !plan) {
    return (
      <main className="flex-1 min-w-0 bg-cream text-text-primary antialiased">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
          <div className="h-6 w-32 rounded bg-gold-muted/15 animate-pulse mb-6" />
          <div className="h-48 w-full rounded-2xl bg-gold-muted/10 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="h-32 rounded-xl bg-gold-muted/10 animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────
  if (!loading && !plan) {
    return (
      <main className="flex-1 min-w-0 bg-cream flex items-center justify-center py-24">
        <div className="text-center space-y-4 px-4">
          <p className="text-5xl">🏛️</p>
          <h1 className="text-2xl font-semibold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
            Plan Not Found
          </h1>
          <p className="text-sm text-text-secondary">
            This membership plan doesn&apos;t exist or is no longer available.
          </p>
          <Link
            href="/membership/plans"
            className="inline-flex rounded border border-gold-muted px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-muted hover:bg-gold-muted hover:text-primary transition-colors"
          >
            ← Back to Plans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 min-w-0 bg-cream text-text-primary antialiased">
        {/* ── Hero banner ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #10243f 0%, #1a3556 60%, ${tierColours.from}33 100%)`,
          }}
        >
          {/* Decorative orb */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: tierColours.via }}
          />

          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16 relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]" aria-label="breadcrumb">
              <Link href="/membership/plans" className="text-gold-muted/70 hover:text-gold-muted transition-colors">
                Plans
              </Link>
              <span className="text-gold-muted/40">/</span>
              <span className="text-gold-muted">{plan ? toTitleCase(plan.tier) : "—"}</span>
            </nav>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                {/* Tier badge */}
                <span
                  className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary mb-3"
                  style={{ background: tierColours.via }}
                >
                  {plan ? toTitleCase(plan.tier) : ""} Membership
                </span>

                <h1
                  className="text-4xl sm:text-5xl font-semibold text-white leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {plan?.name}
                </h1>

                <p className="mt-3 text-sm text-white/60 max-w-xl leading-relaxed">
                  Everything you need to know about the {plan ? toTitleCase(plan.tier) : ""} membership tier — pricing,
                  perks, benefits and welcome gifts, all in one place.
                </p>
              </div>

              {/* Pricing callout */}
              <div className="shrink-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-5 min-w-52">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-muted mb-1">Annual Fee</p>
                <p className="text-4xl font-semibold text-gold-muted leading-none" style={{ fontFamily: "var(--font-playfair)" }}>
                  {plan ? formatMoney(plan.annual_fee_pesewas) : "—"}
                </p>
                <p className="mt-2 text-xs text-white/50">
                  + {plan ? formatMoney(plan.initiation_fee_pesewas) : "—"} initiation fee
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14 space-y-12">

          {/* Error banner */}
          {error && (
            <div className="rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger flex items-center justify-between gap-3">
              <span>{error}</span>
              {error.includes("complete your profile") && (
                <Link
                  href="/profile"
                  className="shrink-0 rounded border border-danger px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-danger hover:bg-danger hover:text-white transition-colors"
                >
                  Complete Profile
                </Link>
              )}
            </div>
          )}

          {/* ── Pricing Summary ──────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted mb-4">
              Pricing Summary
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Annual Fee", value: formatMoney(plan?.annual_fee_pesewas ?? 0), sub: "Billed once per year" },
                { label: "Initiation Fee", value: formatMoney(plan?.initiation_fee_pesewas ?? 0), sub: "One-time, on first activation" },
                { label: "Application Fee", value: APPLICATION_FEE_LABEL, sub: "Non-refundable" },
                {
                  label: "Monthly Membership Quota",
                  value: plan && plan.fb_minimum_pesewas > 0 ? formatMoney(plan.fb_minimum_pesewas) : "None",
                  sub: plan && plan.fb_minimum_pesewas > 0 ? "Minimum monthly spend on F&B" : "No minimum spend required",
                },
              ].map(({ label, value, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gold-muted/20 bg-surface-container-lowest px-5 py-4 shadow-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary mb-1">
                    {label}
                  </p>
                  <p
                    className="text-2xl font-semibold text-gold-muted leading-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {value}
                  </p>
                  <p className="mt-1.5 text-xs text-text-secondary">{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Membership Perks ─────────────────────────────────── */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted mb-4">
              Membership Perks
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: "👥",
                  label: "Guest Passes",
                  value: `${plan?.guest_passes_per_visit ?? 0} per visit`,
                  detail: "Bring guests to the club",
                },
                {
                  icon: "📅",
                  label: "Priority Booking",
                  value: plan?.priority_booking ? "Included" : "Standard",
                  detail: plan?.priority_booking
                    ? "Skip the queue on bookings"
                    : "Standard booking access",
                },
                {
                  icon: "🔓",
                  label: "Blackout Window",
                  value: plan?.bypass_blackout_window ? "Bypassed" : "Standard",
                  detail: plan?.bypass_blackout_window
                    ? "Book during blackout periods"
                    : "Subject to blackout periods",
                },
                {
                  icon: "🍽️",
                  label: "Monthly Quota",
                  value: plan && plan.fb_minimum_pesewas > 0 ? formatMoney(plan.fb_minimum_pesewas) : "None",
                  detail: plan && plan.fb_minimum_pesewas > 0 ? "Minimum monthly F&B spend" : "No minimum required",
                },
              ].map(({ icon, label, value, detail }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 rounded-xl border border-gold-muted/20 bg-surface-container-lowest px-5 py-4 shadow-sm"
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    {label}
                  </p>
                  <p className="text-base font-semibold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                    {value}
                  </p>
                  <p className="text-xs text-text-secondary">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Standard Benefits ────────────────────────────────── */}
          {standardBenefits.length > 0 && (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted mb-4">
                Standard Benefits
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {standardBenefits.map((benefit) => (
                  <li
                    key={benefit.id}
                    className="flex items-start gap-3 rounded-xl border border-gold-muted/15 bg-surface-container-lowest px-5 py-4 shadow-sm"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-muted text-[10px] text-gold-muted">
                      ✓
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-primary">{benefit.title}</p>
                      {benefit.description && (
                        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                          {benefit.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Festive / Seasonal Benefits ──────────────────────── */}
          {festiveBenefits.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted">
                  Seasonal Benefits
                </p>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                  Limited time
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {festiveBenefits.map((benefit) => (
                  <li
                    key={benefit.id}
                    className="relative flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50/40 px-5 py-4 shadow-sm overflow-hidden"
                  >
                    {/* Seasonal glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-200/10 to-transparent" />

                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] text-white">
                      🎄
                    </span>
                    <div className="relative">
                      <p className="text-sm font-semibold text-primary">
                        {benefit.title}
                        {benefit.festive_name && (
                          <span className="ml-2 text-[10px] font-normal text-amber-600">
                            ({benefit.festive_name})
                          </span>
                        )}
                      </p>
                      {benefit.description && (
                        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                          {benefit.description}
                        </p>
                      )}
                      {benefit.festive_start_date && benefit.festive_end_date && (
                        <p className="mt-1 text-[10px] text-amber-600 font-semibold">
                          {new Date(benefit.festive_start_date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(benefit.festive_end_date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {!benefit.is_currently_available && (
                        <p className="mt-1 text-[10px] text-text-secondary italic">
                          Currently unavailable
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Welcome Package / Swag ───────────────────────────── */}
          {(plan?.swag_items ?? []).length > 0 && (
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted mb-4">
                Welcome Package
              </p>
              <p className="text-sm text-text-secondary mb-5 max-w-xl">
                Every new {plan ? toTitleCase(plan.tier) : ""} member receives a curated welcome gift on first activation.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(plan?.swag_items ?? []).map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-gold-muted/20 bg-surface-container-lowest px-5 py-4 shadow-sm"
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold-muted/10 text-2xl">
                        🎁
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-primary">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {item.quantity > 1 && (
                        <p className="mt-1 text-[10px] font-semibold text-gold-muted">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Application Process ──────────────────────────────── */}
          <section className="rounded-xl border border-gold-muted/20 bg-surface-container-lowest px-6 py-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted mb-2">
              Application Process
            </p>
            <h2
              className="text-xl font-semibold text-primary mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Apply once, then let the club review your fit.
            </h2>
            <ol className="grid gap-3 text-sm text-text-primary sm:grid-cols-2">
              {APPLICATION_PROCESS_STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-muted text-[11px] font-semibold text-gold-muted">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── CTA bar ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gold-muted/25 bg-primary/5 px-6 py-5">
            <div>
              <p className="font-semibold text-primary">
                {isSubscribed
                  ? `You're already a ${plan ? toTitleCase(plan.tier) : ""} member!`
                  : hasActiveMembership
                  ? "You already have an active membership."
                  : `Ready to join as a ${plan ? toTitleCase(plan.tier) : ""} Member?`}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {isSubscribed
                  ? "Thank you for being a valued member of Estrella del Mar."
                  : hasActiveMembership
                  ? "You have an active membership. Visit your dashboard to manage it."
                  : `An application fee of ${APPLICATION_FEE_LABEL} is required to get started.`}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/membership/plans"
                className="rounded border border-primary/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold-muted hover:text-gold-muted"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                ← All Plans
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  disabled={isSubscribed || submitting}
                  className="rounded border border-gold-muted bg-primary px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {isSubscribed
                    ? "Subscribed"
                    : hasActiveMembership
                    ? `Upgrade to ${plan ? toTitleCase(plan.tier) : ""}`
                    : `Apply for ${plan ? toTitleCase(plan.tier) : ""}`}
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded border border-gold-muted bg-primary px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Sign In to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Application modal ─────────────────────────────────────── */}
      {showModal && plan && (() => {
        const isUpgrade = hasActiveMembership && !isSubscribed;
        const stepsToShow = isUpgrade ? UPGRADE_PROCESS_STEPS : APPLICATION_PROCESS_STEPS;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/65 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-detail-application-title"
          >
            <section className="w-full max-w-lg rounded border border-gold-muted/35 bg-surface-container-lowest shadow-[0_24px_80px_rgba(16,36,63,0.28)]">
              <div className="border-b border-gold-muted/20 px-6 py-5">
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-muted"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {isUpgrade ? "Membership Upgrade" : "Membership Application"}
                </p>
                <h2
                  id="plan-detail-application-title"
                  className="mt-2 text-2xl font-semibold text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {isUpgrade
                    ? `Upgrade to ${toTitleCase(plan.tier)}`
                    : `Application Fee: ${APPLICATION_FEE_LABEL}. Ready to proceed?`}
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  {isUpgrade
                    ? `Upgrading to the ${toTitleCase(plan.tier)} tier. Your unused time will be credited toward the new plan cost.`
                    : <>You are applying for the <strong>{toTitleCase(plan.tier)}</strong> membership plan.</>}
                </p>
              </div>

              <div className="px-6 py-5">
                {isUpgrade ? (
                  <div className="rounded border border-amber-300/40 bg-amber-50/40 px-4 py-3 text-sm text-amber-800">
                    <p className="font-semibold">✦ No application fee required</p>
                    <p className="mt-1 text-xs">As an existing member, your upgrade is instant. A prorated credit for your remaining subscription period will be applied to the new membership cost.</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-text-secondary">
                    After payment, you will be added to the waiting list. Admin will review your
                    application within the next 48 hours. If approved, you will receive an email
                    with the contract, and you must accept its terms before making your membership payment.
                  </p>
                )}

                {!isUpgrade && (
                  <div className="mt-5">
                    <label
                      htmlFor="plan-detail-tshirt-size"
                      className="block text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-2"
                    >
                      Select T-Shirt Size *
                    </label>
                    <select
                      id="plan-detail-tshirt-size"
                      value={selectedTShirtSize}
                      onChange={(e) => setSelectedTShirtSize(e.target.value as TShirtSize)}
                      className="w-full rounded border border-gold-muted/25 bg-surface-container-lowest px-4 py-2.5 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-1 focus:ring-gold-muted transition-colors"
                      disabled={submitting}
                      required
                    >
                      <option value="" disabled>Choose a size...</option>
                      <option value={TShirtSize.XS}>Extra Small</option>
                      <option value={TShirtSize.S}>Small</option>
                      <option value={TShirtSize.M}>Medium</option>
                      <option value={TShirtSize.L}>Large</option>
                      <option value={TShirtSize.XL}>Extra Large</option>
                      <option value={TShirtSize.XXL}>2XL</option>
                    </select>
                  </div>
                )}

                <div className="mt-5 rounded border border-gold-muted/25 bg-cream px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Next steps
                  </p>
                  <ol className="mt-3 space-y-2 text-sm text-text-primary">
                    {stepsToShow.map((step, index) => (
                      <li key={`modal-${step}`} className="flex gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-gold-light">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gold-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded border border-primary/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold-muted hover:text-gold-muted disabled:opacity-60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirmApplication}
                  disabled={submitting || (!isUpgrade && !selectedTShirtSize)}
                  className="rounded border border-gold-muted bg-primary px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {submitting
                    ? isUpgrade ? "Upgrading..." : "Preparing Payment..."
                    : isUpgrade ? "Confirm Upgrade" : "Proceed to Payment"}
                </button>
              </div>
            </section>
          </div>
        );
      })()}
    </>
  );
}
