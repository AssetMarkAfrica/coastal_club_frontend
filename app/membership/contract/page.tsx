"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth/authSelectors";
import {
  selectMembershipError,
  selectMembershipLoading,
  selectMyMembershipContract,
} from "@/store/membership/membershipSelectors";
import { clearMembershipError } from "@/store/membership/membershipSlice";
import {
  acceptMembershipContract,
  fetchMyMembershipContract,
} from "@/store/membership/membershipThunks";

const formatContractMoney = (value: string | number) => {
  if (typeof value === "string") return value;

  return `GHc${(value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value: string | null) => {
  if (!value) return "Not accepted yet";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default function MembershipContractPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const contract = useAppSelector(selectMyMembershipContract);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptClubRules, setAcceptClubRules] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(clearMembershipError());
    void dispatch(fetchMyMembershipContract());
  }, [dispatch, isAuthenticated]);

  const hasAcceptedContract = Boolean(
    contract?.accepted_terms &&
      contract.accepted_privacy &&
      contract.accepted_club_rules
  );

  const canAccept = Boolean(
    contract &&
      acceptTerms &&
      acceptPrivacy &&
      acceptClubRules &&
      !loading &&
      !hasAcceptedContract
  );

  const financialRows = useMemo(() => {
    if (!contract) return [];

    return [
      {
        label: "Application Fee",
        value: formatContractMoney(contract.application_fee_paid_pesewas),
        tone: "white",
      },
      {
        label: "Initiation Fee",
        value: formatContractMoney(contract.initiation_fee_pesewas),
        tone: "cream",
      },
      {
        label: "Annual Membership Fee",
        value: formatContractMoney(contract.annual_fee_pesewas),
        tone: "white",
      },
    ];
  }, [contract]);

  const onAcceptContract = async () => {
    if (!contract || !canAccept) return;

    dispatch(clearMembershipError());

    try {
      const result = await dispatch(
        acceptMembershipContract({
          membershipContractId: contract.id,
          payload: {
            accept_terms: acceptTerms,
            accept_privacy: acceptPrivacy,
            accept_club_rules: acceptClubRules,
          },
        })
      ).unwrap();

      window.location.assign(result.payment.authorization_url);
    } catch {
      // Error state is handled in the slice.
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-12 text-text-primary">
        <section className="w-full max-w-lg rounded-xl border border-gold-muted/25 bg-surface-container-lowest p-8 text-center shadow-2xl">
          <h1
            className="text-3xl font-semibold text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Membership Agreement
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            Sign in to view and accept your membership contract.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex rounded-lg border border-gold-muted bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold-light transition-colors hover:bg-gold-light hover:text-primary"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-grow items-center justify-center bg-cream px-6 py-12 text-text-primary antialiased">
      <section className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-gold-muted/25 bg-surface-container-lowest shadow-2xl">
        <div className="border-b border-gold-muted/50 bg-gradient-to-br from-navy-deep to-primary-container px-8 py-8 text-center text-on-primary">
          <h1
            className="mb-2 text-4xl font-bold tracking-tight text-gold-light sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Membership Agreement
          </h1>
          <p
            className="text-base text-gold-light/80"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Estrella del Mar Private Members Club
          </p>
        </div>

        <div className="bg-cream/30 p-6 sm:p-8 md:p-12">
          {loading && !contract && (
            <div className="rounded-lg border border-gold-muted/25 bg-surface-container-lowest px-6 py-8 text-center text-sm text-text-secondary">
              Loading your membership contract...
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-lg border border-danger/30 bg-error-container px-5 py-4 text-sm text-danger">
              {error}
            </div>
          )}

          {!loading && !contract && !error && (
            <div className="rounded-lg border border-gold-muted/25 bg-surface-container-lowest px-6 py-8 text-center">
              <h2
                className="text-2xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No contract is available yet.
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Contracts become available after your application fee is paid and admin
                approves your membership application.
              </p>
              <Link
                href="/membership/plans"
                className="mt-6 inline-flex rounded-lg border border-gold-muted px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold-muted transition-colors hover:bg-gold-muted hover:text-primary"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Back to Plans
              </Link>
            </div>
          )}

          {contract && (
            <>
              <div className="mb-10 overflow-hidden rounded-lg border border-gold-muted/25 bg-surface-container-lowest shadow-sm">
                <div className="border-b-2 border-gold-muted bg-navy-deep px-6 py-3">
                  <h2
                    className="text-2xl font-medium text-gold-light"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Financial Summary
                  </h2>
                </div>

                <div className="divide-y divide-cream-dark">
                  {financialRows.map((row) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-6 px-6 py-4 ${
                        row.tone === "cream" ? "bg-cream/50" : "bg-surface-container-lowest"
                      }`}
                    >
                      <span className="text-base leading-7 text-text-secondary">
                        {row.label}
                      </span>
                      <span className="text-right text-base font-medium leading-7">
                        {row.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between gap-6 border-t border-gold-muted/25 bg-cream/80 px-6 py-5">
                    <span
                      className="text-2xl font-bold text-navy-deep"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Total Due Now
                    </span>
                    <span
                      className="text-right text-2xl font-bold text-navy-deep"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {formatContractMoney(contract.total_due_now_pesewas)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-outline-variant/30 bg-surface-dim px-6 py-3 text-sm text-text-secondary">
                  <span className="italic">
                    Plus Monthly Maintenance Fee:{" "}
                    {formatContractMoney(contract.monthly_maintenance_fee_pesewas)} billed
                    separately.
                  </span>
                </div>
              </div>

              <div className="relative mb-10 h-96 overflow-y-auto rounded-lg border border-gold-muted/20 bg-[#FBF9F6] p-6 shadow-inner sm:p-8 md:p-10">
                <article className="max-w-none">
                  <h2
                    className="mb-6 border-b border-gold-muted/20 pb-2 text-3xl font-semibold text-navy-deep sm:text-4xl"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Terms of Membership
                  </h2>
                  <p className="mb-6 text-base leading-7 text-text-secondary">
                    This Membership Agreement is entered into by and between Estrella del Mar
                    and the undersigned applicant. By accepting this Agreement, the Member
                    acknowledges and agrees to be bound by the terms, conditions, rules, and
                    regulations set forth herein and as may be amended from time to time by
                    the Club.
                  </p>

                  <h3
                    className="mb-4 mt-8 text-2xl font-semibold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    1. Club Rules &amp; Conduct
                  </h3>
                  <p className="mb-4 text-base leading-7 text-text-secondary">
                    Members are expected to conduct themselves in a manner befitting the
                    prestige and decorum of Estrella del Mar. The Club reserves the right to
                    suspend or terminate membership for conduct deemed detrimental to the Club
                    or its members.
                  </p>
                  <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-7 text-text-secondary">
                    <li>Adherence to the Club dress code is mandatory in all designated areas.</li>
                    <li>Members are responsible for the conduct of their guests at all times.</li>
                    <li>
                      The use of mobile phones for voice calls is restricted in dining areas
                      and the main lounge.
                    </li>
                  </ul>

                  <h3
                    className="mb-4 mt-8 text-2xl font-semibold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    2. Financial Obligations
                  </h3>
                  <p className="mb-6 text-base leading-7 text-text-secondary">
                    The Member agrees to pay all applicable fees, including but not limited to
                    the Initiation Fee, Annual Membership Fee, and Monthly Maintenance Fees,
                    as outlined in the Financial Summary above. Failure to remit payment
                    within thirty days of the due date may result in suspension of Club
                    privileges.
                  </p>

                  <h3
                    className="mb-4 mt-8 text-2xl font-semibold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    3. Privacy Policy
                  </h3>
                  <p className="mb-16 text-base leading-7 text-text-secondary">
                    The Club respects the privacy of its Members. Personal information
                    collected by the Club is used solely for managing memberships, providing
                    services, and communicating with Members. Information will not be shared
                    with third parties without explicit consent, except as required by law.
                  </p>
                </article>

                <div className="sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FBF9F6] to-transparent" />
              </div>

              {hasAcceptedContract && (
                <div className="mb-8 rounded-lg border border-success/30 bg-surface-container-low px-5 py-4 text-sm text-success">
                  Contract accepted on {formatDate(contract.accepted_at)}.
                </div>
              )}

              <div className="mb-10 space-y-4 pl-1 sm:pl-2">
                <label className="group flex cursor-pointer items-start gap-3">
                  <span className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={acceptTerms || hasAcceptedContract}
                      disabled={hasAcceptedContract}
                      onChange={(event) => setAcceptTerms(event.target.checked)}
                      className="h-5 w-5 rounded border-gold-muted/50 text-navy-deep focus:ring-gold-light focus:ring-offset-cream"
                    />
                  </span>
                  <span className="text-base leading-7 text-text-primary transition-colors group-hover:text-navy-deep">
                    I have read, understood, and agree to the{" "}
                    <span className="font-semibold text-navy-deep">
                      Terms of Membership
                    </span>{" "}
                    and Club Rules.
                  </span>
                </label>

                <label className="group flex cursor-pointer items-start gap-3">
                  <span className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={acceptClubRules || hasAcceptedContract}
                      disabled={hasAcceptedContract}
                      onChange={(event) => setAcceptClubRules(event.target.checked)}
                      className="h-5 w-5 rounded border-gold-muted/50 text-navy-deep focus:ring-gold-light focus:ring-offset-cream"
                    />
                  </span>
                  <span className="text-base leading-7 text-text-primary transition-colors group-hover:text-navy-deep">
                    I acknowledge and agree to the{" "}
                    <span className="font-semibold text-navy-deep">
                      Financial Obligations and Club Rules
                    </span>{" "}
                    detailed in the summary above.
                  </span>
                </label>

                <label className="group flex cursor-pointer items-start gap-3">
                  <span className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={acceptPrivacy || hasAcceptedContract}
                      disabled={hasAcceptedContract}
                      onChange={(event) => setAcceptPrivacy(event.target.checked)}
                      className="h-5 w-5 rounded border-gold-muted/50 text-navy-deep focus:ring-gold-light focus:ring-offset-cream"
                    />
                  </span>
                  <span className="text-base leading-7 text-text-primary transition-colors group-hover:text-navy-deep">
                    I accept the{" "}
                    <span className="font-semibold text-navy-deep">Privacy Policy</span>{" "}
                    regarding the handling of my personal information.
                  </span>
                </label>
              </div>

              <div className="mt-8 flex flex-col items-center border-t border-gold-muted/20 pt-8">
                {hasAcceptedContract && contract.payment_authorization_url ? (
                  <a
                    href={contract.payment_authorization_url}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold-muted/50 bg-navy-deep px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gold-light shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:text-navy-deep md:w-auto"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span>Continue to Membership Payment</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onAcceptContract}
                    disabled={!canAccept}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold-muted/50 bg-navy-deep px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-gold-light shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gold-light hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-navy-deep disabled:hover:text-gold-light md:w-auto"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <span>
                      {loading
                        ? "Accepting Contract..."
                        : "Accept Contract & Proceed to Payment"}
                    </span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}

                <p className="mt-4 max-w-md text-center text-sm text-text-muted">
                  By proceeding, you will be directed to our secure payment gateway to
                  finalize your initial membership transaction.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
