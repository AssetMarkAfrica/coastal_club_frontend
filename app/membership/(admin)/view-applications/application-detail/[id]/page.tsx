"use client";

import { useEffect } from "react";
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

/* ─── helpers ─────────────────────────────────────────── */
const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
};

const formatPesewas = (value: number) =>
    new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(value / 100);

const toTitleCase = (value: string) =>
    value
        .split("_")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

const statusColors: Record<string, string> = {
    approved: "text-emerald-700 border-emerald-300 bg-emerald-50",
    pending: "text-amber-700 border-amber-300 bg-amber-50",
    rejected: "text-red-700 border-red-300 bg-red-50",
    accepted: "text-emerald-700 border-emerald-300 bg-emerald-50",
};

const statusColor = (s: string) =>
    statusColors[s.toLowerCase()] ?? "text-gold-muted border-gold-muted/35 bg-transparent";

/* ─── sub-components ──────────────────────────────────── */
function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded border border-gold-muted/25 bg-surface-container-lowest overflow-hidden">
            <div className="px-5 py-3 border-b border-gold-muted/20 bg-cream/30">
                <h2
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-muted"
                    style={{ fontFamily: "var(--font-inter)" }}
                >
                    {title}
                </h2>
            </div>
            <div className="px-5 py-5">{children}</div>
        </section>
    );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary"
                style={{ fontFamily: "var(--font-inter)" }}
            >
                {label}
            </span>
            <span
                className="text-sm text-text-primary"
                style={{ fontFamily: "var(--font-inter)" }}
            >
                {value || "—"}
            </span>
        </div>
    );
}

/* ─── page ────────────────────────────────────────────── */
export default function ApplicationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const application = useAppSelector(selectAdminMembershipApplicationDetail);
    const loading = useAppSelector(selectMembershipLoading);
    const error = useAppSelector(selectMembershipError);

    useEffect(() => {
        if (id) dispatch(fetchAdminMembershipApplicationDetail(id));
    }, [dispatch, id]);

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
            // Refresh detail after approval
            dispatch(fetchAdminMembershipApplicationDetail(application.id));
        } catch {
            // Error handled by slice
        }
    };

    const isApproved = application?.status.toLowerCase() === "approved";
    const { applicant, plan } = application ?? {};

    return (
        <main className="min-h-screen bg-cream text-text-primary antialiased">
            {/* ── Header ── */}
            <header className="border-b border-gold-muted/20 bg-surface-container-lowest">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/membership/view-applications"
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-muted hover:text-primary transition-colors mb-3"
                            style={{ fontFamily: "var(--font-inter)" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            All Applications
                        </Link>
                        <h1
                            className="text-3xl font-semibold text-primary"
                            style={{ fontFamily: "var(--font-playfair)" }}
                        >
                            Application Detail
                        </h1>
                        {application && (
                            <p className="mt-1 text-sm text-text-secondary">
                                Ref: <span className="font-mono text-xs">{application.application_fee_reference}</span>
                            </p>
                        )}
                    </div>

                    {application && (
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor(application.status)}`}
                            >
                                {toTitleCase(application.status)}
                            </span>

                            {!isApproved && (
                                <button
                                    type="button"
                                    onClick={onApprove}
                                    disabled={loading}
                                    className="rounded border border-gold-muted bg-primary px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{ fontFamily: "var(--font-inter)" }}
                                >
                                    {loading ? "Approving…" : "Approve"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-6">
                {/* Error */}
                {error && (
                    <div className="rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
                        {error}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && !application && (
                    <div className="rounded border border-gold-muted/25 bg-surface-container-lowest px-6 py-10 text-sm text-text-secondary">
                        Loading application…
                    </div>
                )}

                {application && (
                    <>
                        {/* ── Applicant ── */}
                        <Section title="Applicant">
                            <div className="flex items-center gap-4 mb-5">
                                {applicant?.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={applicant.avatar_url}
                                        alt={`${applicant.first_name} ${applicant.last_name}`}
                                        className="h-14 w-14 rounded-full object-cover border border-gold-muted/30"
                                    />
                                ) : (
                                    <div className="h-14 w-14 rounded-full bg-primary/10 border border-gold-muted/30 flex items-center justify-center text-primary font-semibold text-lg">
                                        {applicant?.first_name?.[0] ?? "?"}
                                    </div>
                                )}
                                <div>
                                    <p
                                        className="text-lg font-semibold text-primary"
                                        style={{ fontFamily: "var(--font-playfair)" }}
                                    >
                                        {applicant?.first_name} {applicant?.last_name}
                                    </p>
                                    <p className="text-sm text-text-secondary">{applicant?.email}</p>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-muted">
                                        via {toTitleCase(applicant?.auth_provider ?? "")}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <Field label="Username" value={applicant?.username || "—"} />
                                <Field label="Role" value={toTitleCase(applicant?.role ?? "")} />
                                <Field label="Verified" value={applicant?.is_verified ? "Yes" : "No"} />
                                <Field label="Gender" value={toTitleCase(applicant?.profile?.gender ?? "")} />
                                <Field label="Date of Birth" value={applicant?.profile?.date_of_birth ?? "—"} />
                                <Field label="Age" value={applicant?.profile?.age?.toString() ?? "—"} />
                                <Field label="Phone" value={applicant?.profile?.phone_number} />
                                <Field label="Nationality" value={applicant?.profile?.nationality} />
                                <Field label="Occupation" value={applicant?.profile?.occupation} />
                                <Field label="ID Type" value={applicant?.profile?.id_type} />
                                <Field label="ID Number" value={applicant?.profile?.id_number} />
                                <Field
                                    label="Profile Complete"
                                    value={applicant?.profile?.is_profile_complete ? "Yes" : "No"}
                                />
                            </div>

                            {/* Address */}
                            <div className="mt-4 pt-4 border-t border-gold-muted/15 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <Field label="Address" value={applicant?.profile?.address_line1} />
                                <Field label="Address Line 2" value={applicant?.profile?.address_line2} />
                                <Field label="City" value={applicant?.profile?.city} />
                                <Field label="Region / State" value={applicant?.profile?.region_state} />
                                <Field label="Postal Code" value={applicant?.profile?.postal_code} />
                                <Field label="Country" value={applicant?.profile?.country} />
                            </div>

                            {/* Emergency */}
                            <div className="mt-4 pt-4 border-t border-gold-muted/15 grid grid-cols-2 gap-4">
                                <Field
                                    label="Emergency Contact"
                                    value={applicant?.profile?.emergency_contact_name}
                                />
                                <Field
                                    label="Emergency Phone"
                                    value={applicant?.profile?.emergency_contact_phone}
                                />
                            </div>

                            {applicant?.profile?.bio && (
                                <div className="mt-4 pt-4 border-t border-gold-muted/15">
                                    <Field label="Bio" value={applicant.profile.bio} />
                                </div>
                            )}
                        </Section>

                        {/* ── Plan ── */}
                        <Section title="Membership Plan">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-4">
                                <Field label="Plan" value={plan?.name} />
                                <Field label="Tier" value={toTitleCase(plan?.tier ?? "")} />
                                <Field
                                    label="Points Multiplier"
                                    value={plan?.points_multiplier ? `${plan.points_multiplier}×` : "—"}
                                />
                                <Field
                                    label="Annual Fee"
                                    value={plan?.annual_fee_pesewas != null ? formatPesewas(plan.annual_fee_pesewas) : "—"}
                                />
                                <Field
                                    label="Initiation Fee"
                                    value={plan?.initiation_fee_pesewas != null ? formatPesewas(plan.initiation_fee_pesewas) : "—"}
                                />
                                <Field
                                    label="Club Maintenance Fee"
                                    value={plan?.club_maintenance_fee_pesewas != null ? formatPesewas(plan.club_maintenance_fee_pesewas) : "—"}
                                />
                                <Field
                                    label="Signup Bonus Credit"
                                    value={plan?.signup_bonus_spend_credit_pesewas != null ? formatPesewas(plan.signup_bonus_spend_credit_pesewas) : "—"}
                                />
                                <Field
                                    label="F&B Minimum"
                                    value={plan?.fb_minimum_pesewas != null ? formatPesewas(plan.fb_minimum_pesewas) : "—"}
                                />
                                <Field
                                    label="Guest Passes / Visit"
                                    value={plan?.guest_passes_per_visit?.toString()}
                                />
                            </div>

                            {/* Benefits */}
                            {plan?.benefits && plan.benefits.length > 0 && (
                                <div className="pt-4 border-t border-gold-muted/15">
                                    <p
                                        className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary mb-3"
                                        style={{ fontFamily: "var(--font-inter)" }}
                                    >
                                        Benefits
                                    </p>
                                    <div className="space-y-2">
                                        {plan.benefits.map((b) => (
                                            <div
                                                key={b.id}
                                                className="flex items-start gap-3 rounded border border-gold-muted/15 px-4 py-3 bg-cream/40"
                                            >
                                                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold-muted shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-primary">{b.title}</p>
                                                    <p className="text-xs text-text-secondary">{b.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* ── Application Details ── */}
                        <Section title="Application Details">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <Field label="Application ID" value={
                                    <span className="font-mono text-xs break-all">{application.id}</span>
                                } />
                                <Field label="Status" value={toTitleCase(application.status)} />
                                <Field label="Fee Reference" value={
                                    <span className="font-mono text-xs">{application.application_fee_reference}</span>
                                } />
                                <Field label="Fee Paid At" value={formatDate(application.application_fee_paid_at)} />
                                <Field label="Approved At" value={formatDate(application.approved_at)} />
                                <Field label="Submitted At" value={formatDate(application.created_at)} />
                                <Field label="Last Updated" value={formatDate(application.updated_at)} />
                                {application.admin_notes && (
                                    <div className="col-span-2 sm:col-span-3">
                                        <Field label="Admin Notes" value={application.admin_notes} />
                                    </div>
                                )}
                            </div>
                        </Section>

                        {/* ── Contract ── */}
                        {application.contract_id && (
                            <Section title="Contract">
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Contract ID" value={
                                        <span className="font-mono text-xs break-all">{application.contract_id}</span>
                                    } />
                                    <Field label="Contract Status" value={
                                        <span
                                            className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor(application.contract_status ?? "")}`}
                                        >
                                            {toTitleCase(application.contract_status ?? "—")}
                                        </span>
                                    } />
                                </div>
                            </Section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
