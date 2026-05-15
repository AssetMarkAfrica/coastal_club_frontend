"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminMembershipApplicationDetail,
  selectMembershipError,
  selectMembershipLoading,
} from "@/store/membership/membershipSelectors";
import { clearMembershipError } from "@/store/membership/membershipSlice";
import {
  approveMembershipApplication,
  fetchAdminMembershipApplicationDetail,
} from "@/store/membership/membershipThunks";

const formatDateTime = (value: string | null) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatDate = (value: string | null) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
};

const formatCedis = (pesewas: number) => {
  const cedis = pesewas / 100;
  return `GHc ${cedis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatCompactCedis = (pesewas: number) => {
  const cedis = pesewas / 100;
  if (cedis >= 1000) {
    return `GHc ${(cedis / 1000).toFixed(1).replace(/\\.0$/, "")}k`;
  }
  return formatCedis(pesewas);
};

const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusClasses: Record<string, string> = {
  approved: "bg-success/15 text-success border-success/40",
  pending: "bg-warning/15 text-warning border-warning/40",
  rejected: "bg-danger/15 text-danger border-danger/40",
};

function MetaField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">{label}</p>
      <p className="mt-1 text-sm text-text-primary">{value || "Not available"}</p>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const application = useAppSelector(selectAdminMembershipApplicationDetail);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) dispatch(fetchAdminMembershipApplicationDetail(id));
  }, [dispatch, id]);

  const applicant = application?.applicant;
  const plan = application?.plan;

  const avatarUrl = useMemo(() => {
    const directAvatar = applicant?.avatar_url?.trim();
    const profilePicture = applicant?.profile?.profile_picture?.trim();
    const genericAvatar =
      typeof (applicant as Record<string, unknown> | undefined)?.avatar === "string"
        ? ((applicant as Record<string, unknown>).avatar as string).trim()
        : "";
    return directAvatar || profilePicture || genericAvatar || null;
  }, [applicant]);

  const showAvatar = Boolean(avatarUrl) && avatarUrl !== failedAvatarUrl;
  const initials =
    [applicant?.first_name?.[0], applicant?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  const statusKey = application?.status?.toLowerCase() ?? "";
  const statusClass = statusClasses[statusKey] ?? "bg-gold-muted/15 text-gold-muted border-gold-muted/40";
  const isApproved = statusKey === "approved";

  const benefits = plan?.benefits ?? [];

  const onApprove = async () => {
    if (!application) return;
    dispatch(clearMembershipError());

    try {
      const callbackUrl = `${window.location.origin}/payment/callback`;
      await dispatch(
        approveMembershipApplication({
          application_id: application.id,
          callback_url: callbackUrl,
          admin_notes: "Approved after membership application review.",
        })
      ).unwrap();
      dispatch(fetchAdminMembershipApplicationDetail(application.id));
    } catch {
      // Error state handled by slice.
    }
  };

  return (
    <main className="flex-1 min-w-0 bg-cream text-text-primary antialiased pb-12">
      <header className="sticky top-0 z-30 border-b border-gold-muted/20 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto w-full max-w-screen-2xl px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <nav className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-text-muted">
                <span>Admin</span>
                <span>›</span>
                <span>Applications</span>
                <span>›</span>
                <span className="text-gold-muted">Detail</span>
              </nav>
              <h1 className="text-3xl font-semibold text-primary" style={{ fontFamily: "var(--font-playfair)" }}>
                Application Detail
              </h1>
              {application?.application_fee_reference && (
                <p className="mt-1 text-xs text-text-secondary">
                  Reference:{" "}
                  <span className="font-mono text-text-primary">{application.application_fee_reference}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
             
              <button
                type="button"
                onClick={onApprove}
                disabled={loading || isApproved || !application}
                className="rounded border border-gold-muted bg-navy-deep px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-light transition-colors hover:bg-gold-muted hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApproved ? "Approved" : loading ? "Approving..." : "Approve Application"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-screen-2xl px-6 py-8">
        <Link
          href="/membership/view-applications"
          className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-muted hover:text-primary"
        >
          <span>←</span>
          <span>Back To Applications</span>
        </Link>

        {error && (
          <div className="mb-6 rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {loading && !application ? (
          <div className="rounded border border-gold-muted/25 bg-white px-6 py-10 text-sm text-text-secondary">
            Loading application detail...
          </div>
        ) : null}

        {application ? (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 space-y-4 lg:col-span-8">
              <section className="rounded border border-gold-muted/25 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded border border-gold-muted/30 bg-cream-dark/20 p-1">
                    {showAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={`${applicant?.first_name ?? "Applicant"} ${applicant?.last_name ?? ""}`.trim()}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => setFailedAvatarUrl(avatarUrl)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-semibold text-primary">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2
                          className="text-2xl font-semibold text-primary"
                          style={{ fontFamily: "var(--font-playfair)" }}
                        >
                          {`${applicant?.first_name ?? ""} ${applicant?.last_name ?? ""}`.trim() || "Applicant"}
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">{applicant?.email || "Not available"}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}
                      >
                        {toTitleCase(application.status)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 border-t border-gold-muted/15 pt-4 sm:grid-cols-3">
                      <MetaField label="Role" value={toTitleCase(applicant?.role ?? "")} />
                      <MetaField label="Account ID" value={applicant?.id ?? "Not available"} />
                      <MetaField label="Tier Track" value={toTitleCase(plan?.tier ?? "")} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded border border-gold-muted/25 bg-white shadow-sm">
                <div className="bg-navy-deep px-6 py-3">
                  <h3 className="text-lg font-semibold text-gold-light" style={{ fontFamily: "var(--font-playfair)" }}>
                    Profile Information
                  </h3>
                </div>

                <div className="space-y-8 p-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                    <div className="sm:col-span-4 border-b border-gold-muted/15 pb-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Personal Details</p>
                    </div>
                    <MetaField label="Gender" value={toTitleCase(applicant?.profile?.gender ?? "")} />
                    <MetaField label="Date of Birth" value={formatDate(applicant?.profile?.date_of_birth ?? null)} />
                    <MetaField label="Age" value={applicant?.profile?.age != null ? `${applicant.profile.age} years` : "Not available"} />
                    <MetaField label="Nationality" value={applicant?.profile?.nationality || "Not available"} />
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="border-b border-gold-muted/15 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Identification</p>
                      </div>
                      <MetaField label="ID Type" value={applicant?.profile?.id_type || "Not available"} />
                      <MetaField label="Document Number" value={applicant?.profile?.id_number || "Not available"} />
                    </div>
                    <div className="space-y-4">
                      <div className="border-b border-gold-muted/15 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Address</p>
                      </div>
                      <MetaField label="City" value={applicant?.profile?.city || "Not available"} />
                      <MetaField label="Country" value={applicant?.profile?.country || "Not available"} />
                      <MetaField label="Address" value={applicant?.profile?.address_line1 || "Not available"} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-gold-muted/15 pb-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Emergency Contact</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <MetaField label="Contact Name" value={applicant?.profile?.emergency_contact_name || "Not available"} />
                      <MetaField label="Phone" value={applicant?.profile?.emergency_contact_phone || "Not available"} />
                    </div>
                  </div>
                </div>
              </section>

              {applicant?.profile?.bio ? (
                <section className="rounded border border-gold-muted/25 bg-white p-6 shadow-sm">
                  <p className="mb-3 border-b border-gold-muted/15 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Member Bio
                  </p>
                  <p className="rounded-r-lg border-l-4 border-gold-muted bg-cream/30 px-5 py-4 text-sm italic leading-relaxed text-text-secondary">
                    &ldquo;{applicant.profile.bio}&rdquo;
                  </p>
                </section>
              ) : null}
            </div>

            <div className="col-span-12 space-y-4 lg:col-span-4">
              <section className="overflow-hidden rounded border border-gold-muted/25 bg-white shadow-sm">
                <div className="border-t-4 border-gold-muted p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Status</p>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClass}`}
                    >
                      {toTitleCase(application.status)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Reference</span>
                      <span className="text-xs font-mono text-primary">{application.application_fee_reference}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Submitted</span>
                      <span className="text-xs text-primary">{formatDateTime(application.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Fee Paid</span>
                      <span className="text-xs text-primary">{formatDateTime(application.application_fee_paid_at)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {plan ? (
                <section className="rounded border border-gold-muted/25 bg-gradient-to-br from-navy-deep to-primary p-6 shadow-xl">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                        {plan.name}
                      </h4>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-light/70">
                        Selected Tier
                      </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-muted text-gold-light">
                      ★
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                        {formatCompactCedis(plan.annual_fee_pesewas)}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-gold-light/70">per year</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/15 pt-3">
                      <span className="text-[11px] uppercase tracking-[0.1em] text-white/70">Initiation Fee</span>
                      <span className="text-xs font-semibold text-gold-light">
                        {formatCedis(plan.initiation_fee_pesewas)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-light/80">
                      Included Benefits
                    </p>
                    <div className="space-y-2">
                      {benefits.length > 0 ? (
                        benefits.slice(0, 3).map((benefit) => (
                          <div key={benefit.id} className="flex items-start gap-2 text-sm text-white/90">
                            <span className="mt-0.5 text-gold-muted">●</span>
                            <span>{benefit.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/70">No listed benefits.</p>
                      )}
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="rounded border border-gold-muted/25 bg-white p-6 shadow-sm">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Internal Admin Notes</p>
                <div className="rounded border border-gold-muted/20 bg-cream-dark/15 px-4 py-3 text-sm text-text-secondary">
                  {application.admin_notes || "No internal notes added yet."}
                </div>
              </section>

              <section className="rounded border border-gold-muted/15 bg-surface-container-low p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">Audit Trail</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-success" />
                    <div>
                      <p className="text-xs font-semibold text-primary">Application Submitted</p>
                      <p className="text-[10px] text-text-muted">{formatDateTime(application.created_at)}</p>
                    </div>
                  </div>
                  {application.application_fee_paid_at ? (
                    <div className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-gold-muted" />
                      <div>
                        <p className="text-xs font-semibold text-primary">Application Fee Paid</p>
                        <p className="text-[10px] text-text-muted">{formatDateTime(application.application_fee_paid_at)}</p>
                      </div>
                    </div>
                  ) : null}
                  {application.approved_at ? (
                    <div className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-info" />
                      <div>
                        <p className="text-xs font-semibold text-primary">Application Approved</p>
                        <p className="text-[10px] text-text-muted">{formatDateTime(application.approved_at)}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded border border-gold-muted/25 bg-white p-6 shadow-sm">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Application Snapshot</p>
                <div className="grid grid-cols-1 gap-4">
                  <MetaField label="Plan Tier" value={toTitleCase(plan?.tier ?? "")} />
                  <MetaField label="F and B Minimum" value={plan ? formatCedis(plan.fb_minimum_pesewas) : "Not available"} />
                  <MetaField label="Points Multiplier" value={plan?.points_multiplier || "Not available"} />
                  <MetaField label="Guest Passes / Visit" value={plan?.guest_passes_per_visit?.toString() || "Not available"} />
                  <MetaField label="Last Updated" value={formatDateTime(application.updated_at)} />
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
