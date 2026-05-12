"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectPaymentError,
  selectPaymentLoading,
  selectPaymentVerificationResult,
} from "@/store/payment/paymentSelectors";
import { clearPaymentError } from "@/store/payment/paymentSlice";
import { verifyMembershipPaymentByReference } from "@/store/payment/paymentThunks";
import type { MembershipActivation, PaymentVerificationData } from "@/types/payment";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isMembershipActivation = (
  value: PaymentVerificationData | null
): value is MembershipActivation =>
  isRecord(value) &&
  typeof value.status === "string" &&
  typeof value.is_active === "boolean" &&
  isRecord(value.plan) &&
  typeof value.plan.name === "string";

export default function PaymentCallbackPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectPaymentLoading);
  const error = useAppSelector(selectPaymentError);
  const verificationResult = useAppSelector(selectPaymentVerificationResult);

  const reference = useMemo(() => {
    return searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  }, [searchParams]);

  const resultStatus = useMemo(() => {
    if (!isRecord(verificationResult)) return null;
    return typeof verificationResult.status === "string"
      ? verificationResult.status
      : null;
  }, [verificationResult]);

  useEffect(() => {
    if (!reference) return;

    dispatch(clearPaymentError());
    void dispatch(verifyMembershipPaymentByReference(reference));
  }, [dispatch, reference]);

  const onRetry = () => {
    if (!reference) return;
    dispatch(clearPaymentError());
    void dispatch(verifyMembershipPaymentByReference(reference));
  };

  const showVerificationSuccess = Boolean(verificationResult) && !error;

  return (
    <main className="min-h-screen bg-cream text-text-primary antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-10">
        <section className="w-full rounded border border-gold-muted/25 bg-surface-container-lowest shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden">
          <div className="border-b border-cream-dark bg-cream/30 px-6 py-6 text-center sm:px-8">
            <h1
              className="text-4xl font-semibold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Payment Verification
            </h1>
            <p
              className="mt-2 text-sm text-text-secondary"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Verifying your transaction with our membership payment service.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="rounded border border-gold-muted/30 bg-cream px-4 py-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary">
                Reference
              </p>
              <p className="mt-1 break-all text-sm text-text-secondary">
                {reference || "Missing payment reference in callback URL."}
              </p>
            </div>

            {!reference && (
              <div className="mt-5 rounded border border-danger/30 bg-error-container px-4 py-3 text-sm text-danger">
                The callback URL does not include a valid <code>reference</code> or <code>trxref</code>.
              </div>
            )}

            {loading && reference && (
              <div className="mt-5 rounded border border-gold-muted/25 bg-surface-container-low px-4 py-4 text-sm text-text-secondary">
                Verifying payment, please wait...
              </div>
            )}

            {error && (
              <div className="mt-5 rounded border border-danger/30 bg-error-container px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {showVerificationSuccess && isMembershipActivation(verificationResult) && (
              <div className="mt-5 rounded border border-success/30 bg-surface-container-low px-4 py-4">
                <p className="text-sm font-semibold text-success">
                  Membership activated successfully.
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Plan: <span className="font-semibold text-primary">{verificationResult.plan.name}</span>
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Status: <span className="font-semibold uppercase text-primary">{verificationResult.status}</span>
                </p>
              </div>
            )}

            {showVerificationSuccess &&
              !isMembershipActivation(verificationResult) &&
              resultStatus === "pending_review" && (
                <div className="mt-5 rounded border border-gold-muted/30 bg-surface-container-low px-4 py-4">
                  <p className="text-sm font-semibold text-primary">
                    Application fee confirmed.
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Your application is now pending admin review.
                  </p>
                </div>
              )}

            {showVerificationSuccess &&
              !isMembershipActivation(verificationResult) &&
              resultStatus !== "pending_review" && (
                <div className="mt-5 rounded border border-gold-muted/30 bg-surface-container-low px-4 py-4">
                  <p className="text-sm font-semibold text-primary">
                    Payment verification received.
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Current status: <span className="font-semibold uppercase">{resultStatus ?? "unknown"}</span>
                  </p>
                </div>
              )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRetry}
                disabled={!reference || loading}
                className="w-full rounded border border-gold-muted bg-primary px-4 py-3 text-xs font-semibold tracking-widest uppercase text-gold-light transition-all duration-300 hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Retry Verification
              </button>
              <Link
                href="/membership/plans"
                className="w-full rounded border border-primary/30 px-4 py-3 text-center text-xs font-semibold tracking-widest uppercase text-primary transition-colors hover:bg-primary/5"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Back to Plans
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
