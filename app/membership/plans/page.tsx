"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import {
  selectMembershipError,
  selectMembershipLoading,
  selectMembershipPlans,
} from "@/store/membership/membershipSelectors";
import {
  fetchMembershipPlans,
  submitMembershipApplication,
} from "@/store/membership/membershipThunks";
import { clearMembershipError } from "@/store/membership/membershipSlice";
import { selectPendingPayment } from "@/store/payment/paymentSelectors";
import type { MembershipPlan } from "@/types/membership";

const formatMoney = (pesewas: number) =>
  `GHc${(pesewas / 100).toLocaleString(undefined, {
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

const buildPlanHighlights = (plan: MembershipPlan) => {
  const apiBenefits = (plan.benefits ?? []).map((benefit) => benefit.title.trim());

  if (apiBenefits.length > 0) {
    return apiBenefits;
  }

  const highlights = [
    `${plan.guest_passes_per_visit} guest pass${plan.guest_passes_per_visit === 1 ? "" : "es"
    } per visit`,
    `Points multiplier: x${plan.points_multiplier}`,
    `Monthly maintenance fee: ${formatMoney(plan.club_maintenance_fee_pesewas)}`,
    `Signup bonus credit: ${formatMoney(plan.signup_bonus_spend_credit_pesewas)}`,
    plan.fb_minimum_pesewas > 0
      ? `F&B minimum: ${formatMoney(plan.fb_minimum_pesewas)}`
      : "No food and beverage minimum",
  ];

  return highlights;
};

export default function MembershipPlansPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const plans = useAppSelector(selectMembershipPlans);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);
  const pendingPayment = useAppSelector(selectPendingPayment);
  const [submittingTier, setSubmittingTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.annual_fee_pesewas - b.annual_fee_pesewas),
    [plans]
  );

  const featuredPlanTier = useMemo(() => {
    const premierPlan = sortedPlans.find((plan) => plan.tier.toLowerCase() === "premier");
    if (premierPlan) return premierPlan.tier;
    const highestByFee = [...sortedPlans].sort(
      (a, b) => b.annual_fee_pesewas - a.annual_fee_pesewas
    )[0];
    return highestByFee?.tier ?? null;
  }, [sortedPlans]);

  const closeApplicationModal = () => {
    if (submittingTier) return;
    setSelectedPlan(null);
  };

  const onConfirmApplication = async () => {
    if (!isAuthenticated || !selectedPlan) return;

    const planTier = selectedPlan.tier;
    dispatch(clearMembershipError());
    setSubmittingTier(planTier);
    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      const response = await dispatch(
        submitMembershipApplication({ plan_tier: planTier, callback_url: callbackUrl })
      ).unwrap();
      if (response.authorization_url) {
        window.location.assign(response.authorization_url);
      }
    } catch {
      // Error state is handled in the slice.
    } finally {
      setSubmittingTier(null);
      setSelectedPlan(null);
    }
  };

  return (
    <main className="flex-1 min-w-0 bg-cream text-text-primary antialiased">
      <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">

              {/* Hero text */}
              <div className="text-center mb-10 sm:mb-12">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Choose Your Membership
                </h1>
                <p
                  className="mt-4 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Elevate your lifestyle with access to world-class amenities, exclusive
                  culinary experiences, and a curated community of discerning individuals.
                  Select the tier that best aligns with your aspirations.
                </p>
              </div>

              {/* Application process */}
              <section className="mb-8 border-y border-gold-muted/25 bg-surface-container-lowest px-4 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <p
                      className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-muted"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Application Process
                    </p>
                    <h2
                      className="mt-2 text-2xl font-semibold text-primary"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Apply once, then let the club review your fit.
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      The application fee is {APPLICATION_FEE_LABEL}. After payment,
                      prospective members are placed on the waiting list while admin reviews
                      the application within the next 48 hours.
                    </p>
                  </div>

                  <ol className="grid gap-3 text-sm text-text-primary sm:grid-cols-2 lg:max-w-xl">
                    {APPLICATION_PROCESS_STEPS.map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-muted text-[11px] font-semibold text-gold-muted">
                          {index + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Pending payment banner */}
              {pendingPayment?.authorization_url && (
                <div className="mb-6 rounded border border-gold-muted/30 bg-surface-container-lowest px-4 py-3 text-sm text-text-secondary shadow-sm">
                  <p className="font-semibold text-primary text-sm">Pending Payment Detected</p>
                  <p className="mt-1 text-xs">
                    Continue your payment using reference{" "}
                    <span className="font-semibold text-primary">{pendingPayment.reference}</span>.
                  </p>
                  <a
                    href={pendingPayment.authorization_url}
                    className="mt-2 inline-flex rounded border border-gold-muted px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-gold-muted hover:bg-gold-muted hover:text-primary transition-colors"
                  >
                    Continue Payment
                  </a>
                </div>
              )}

              <div className="mb-6 flex flex-col gap-3 rounded border border-gold-muted/25 bg-cream/60 px-4 py-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-primary">Already approved?</p>
                  <p className="mt-1 text-xs">
                    View your membership contract, accept all required terms, and proceed
                    to the final membership payment.
                  </p>
                </div>
                <Link
                  href="/membership/contract"
                  className="inline-flex shrink-0 rounded border border-gold-muted px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-muted transition-colors hover:bg-gold-muted hover:text-primary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  View Contract
                </Link>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-6 rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              {/* Plan cards */}
              {loading && sortedPlans.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map((key) => (
                    <div
                      key={key}
                      className="h-105 rounded-2xl border border-gold-muted/20 bg-surface-container-lowest animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
                  {sortedPlans.map((plan) => {
                    const isFeatured = featuredPlanTier === plan.tier;
                    const highlights = buildPlanHighlights(plan);
                    const isSubmitting = submittingTier === plan.tier;
                    const isSubscribed = Boolean(plan.is_subscribed);

                    return (
                      <article
                        key={plan.id}
                        className={`relative flex flex-col rounded-2xl border bg-surface-container-lowest p-6 transition-all duration-300 hover:-translate-y-1 ${isFeatured
                            ? "border-gold-muted shadow-[0_18px_44px_rgba(16,36,63,0.14)]"
                            : "border-gold-muted/20 shadow-[0_8px_24px_rgba(16,36,63,0.08)]"
                          }`}
                      >
                        {/* Featured badge */}
                        {isFeatured && (
                          <span
                            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-muted px-4 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-primary whitespace-nowrap"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            Most Popular
                          </span>
                        )}

                        {/* Tier name */}
                        <h2
                          className="text-xl font-semibold text-primary"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {toTitleCase(plan.tier)}
                        </h2>

                        {/* Pricing */}
                        <div className="mt-3 flex items-end gap-1.5">
                          <p
                            className="text-3xl font-semibold text-gold-muted leading-none"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {formatMoney(plan.annual_fee_pesewas)}
                          </p>
                          <span className="pb-0.5 text-sm text-text-secondary">/ year</span>
                        </div>

                        <p className="mt-1 text-xs text-text-secondary">
                          {formatMoney(plan.initiation_fee_pesewas)} Initiation Fee
                        </p>

                        <div className="my-4 h-px w-full bg-gold-muted/20" />

                        {/* Highlights */}
                        <ul className="space-y-2.5 flex-1">
                          {highlights.slice(0, 5).map((highlight, index) => (
                            <li key={`${plan.id}-${index}`} className="flex items-start gap-2">
                              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold-muted text-gold-muted text-[10px]">
                                ✓
                              </span>
                              <span className="text-xs text-text-primary leading-relaxed">{highlight}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <div className="mt-6">
                          {isAuthenticated ? (
                            <button
                              type="button"
                              onClick={() => setSelectedPlan(plan)}
                              disabled={isSubmitting || loading || isSubscribed}
                              className={`w-full rounded border px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors ${isFeatured
                                  ? "border-gold-muted bg-primary text-gold-light hover:bg-gold-muted hover:text-primary"
                                  : "border-gold-muted text-gold-muted hover:bg-gold-muted hover:text-primary"
                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                              style={{ fontFamily: "var(--font-inter)" }}
                            >
                              {isSubscribed
                                ? "Subscribed"
                                : isSubmitting
                                  ? "Processing…"
                                  : `Apply for ${toTitleCase(plan.tier)}`}
                            </button>
                          ) : (
                            <p className="text-xs text-text-secondary text-center">
                              <Link
                                href="/auth/login"
                                className="text-gold-muted font-semibold hover:text-primary transition-colors"
                              >
                                Sign in
                              </Link>{" "}
                              to apply for this plan.
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/65 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-confirmation-title"
        >
          <section className="w-full max-w-lg rounded border border-gold-muted/35 bg-surface-container-lowest shadow-[0_24px_80px_rgba(16,36,63,0.28)]">
            <div className="border-b border-gold-muted/20 px-6 py-5">
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-muted"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Membership Application
              </p>
              <h2
                id="application-confirmation-title"
                className="mt-2 text-2xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Application Fee: {APPLICATION_FEE_LABEL}. Ready to Proceed with payment?
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                You are applying for the {toTitleCase(selectedPlan.tier)} membership plan.
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed text-text-secondary">
                After payment, you will be added to the waiting list. Admin will review your
                application within the next 48 hours. If approved, you will receive an email
                with the contract, and you must accept its terms before making your
                membership payment.
              </p>

              <div className="mt-5 rounded border border-gold-muted/25 bg-cream px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Next steps
                </p>
                <ol className="mt-3 space-y-2 text-sm text-text-primary">
                  {APPLICATION_PROCESS_STEPS.map((step, index) => (
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
                onClick={closeApplicationModal}
                disabled={Boolean(submittingTier)}
                className="rounded border border-primary/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold-muted hover:text-gold-muted disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Review Plans
              </button>
              <button
                type="button"
                onClick={onConfirmApplication}
                disabled={Boolean(submittingTier)}
                className="rounded border border-gold-muted bg-primary px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {submittingTier ? "Preparing Payment..." : "Proceed to Payment"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

