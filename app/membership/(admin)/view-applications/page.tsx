"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminMembershipApplications,
  selectMembershipError,
  selectMembershipLoading,
} from "@/store/membership/membershipSelectors";
import { clearMembershipError } from "@/store/membership/membershipSlice";
import {
  approveMembershipApplication,
  fetchAdminMembershipApplications,
} from "@/store/membership/membershipThunks";

const formatDate = (value: string | null) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AdminMembershipApplicationsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const applications = useAppSelector(selectAdminMembershipApplications);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminMembershipApplications());
  }, [dispatch]);

  const onApprove = async (applicationId: string) => {
    dispatch(clearMembershipError());
    setApprovingId(applicationId);

    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      await dispatch(
        approveMembershipApplication({
          application_id: applicationId,
          callback_url: callbackUrl,
          admin_notes: "Approved after membership application review.",
        })
      ).unwrap();
      await dispatch(fetchAdminMembershipApplications());
    } catch {
      // Error state is handled in the slice.
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-cream text-text-primary antialiased">
      <header className="border-b border-gold-muted/20 bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Admin Review
            </p>
            <h1
              className="mt-2 text-3xl font-semibold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Membership Applications
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Review paid application-fee submissions within 48 hours. Approval creates the
              membership contract the prospect must accept before paying membership dues.
            </p>
          </div>

          <Link
            href="/membership/plans"
            className="rounded border border-gold-muted px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-muted transition-colors hover:bg-gold-muted hover:text-primary"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            View Plans
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {loading && applications.length === 0 ? (
          <div className="rounded border border-gold-muted/25 bg-surface-container-lowest px-6 py-10 text-sm text-text-secondary">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded border border-gold-muted/25 bg-surface-container-lowest px-6 py-10">
            <h2
              className="text-2xl font-semibold text-primary"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              No applications waiting right now.
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              New paid applications will appear here after prospective members complete the
              application-fee payment.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-gold-muted/25 bg-surface-container-lowest">
            <div className="grid grid-cols-1 border-b border-gold-muted/20 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
              <span>Applicant</span>
              <span>Plan</span>
              <span>Status</span>
              <span>Submitted</span>
              <span className="text-right">Action</span>
            </div>

            {applications.map((application) => {
              const isApproved = application.status.toLowerCase() === "approved";
              const isApproving = approvingId === application.id;
              const detailHref = `/membership/view-applications/application-detail/${application.id}`;

              return (
                <article
                  key={application.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(detailHref)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(detailHref);
                    }
                  }}
                  className="grid cursor-pointer grid-cols-1 gap-4 border-b border-gold-muted/15 px-5 py-5 transition-colors hover:bg-cream/50 last:border-b-0 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {application.applicant.first_name} {application.applicant.last_name}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {application.applicant.email}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-muted">
                      View full application
                    </p>
                  </div>

                  <p className="text-sm text-text-primary">
                    {toTitleCase(application.plan.tier)}
                  </p>

                  <div>
                    <span className="inline-flex rounded-full border border-gold-muted/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-muted">
                      {toTitleCase(application.status)}
                    </span>
                    {application.application_fee_paid_at && (
                      <p className="mt-1 text-xs text-text-secondary">
                        Paid {formatDate(application.application_fee_paid_at)}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary">
                    {formatDate(application.created_at)}
                  </p>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onApprove(application.id);
                    }}
                    disabled={loading || isApproved || isApproving}
                    className="rounded border border-gold-muted bg-primary px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {isApproved
                      ? "Approved"
                      : isApproving
                        ? "Approving..."
                        : "Approve"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
