"use client";

import { useEffect, useMemo, useState } from "react";
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

const normalizeStatusBucket = (status: string) => {
  const lower = status.toLowerCase();
  if (lower.includes("approved") || lower.includes("accepted")) return "approved";
  if (lower.includes("reject") || lower.includes("declin")) return "rejected";
  return "pending";
};

const statusBadgeClass = (status: string) => {
  const lower = status.toLowerCase();
  if (lower.includes("approved") || lower.includes("accepted")) {
    return "bg-emerald-50 text-success border-success/25";
  }
  if (lower.includes("reject") || lower.includes("declin")) {
    return "bg-red-50 text-danger border-danger/25";
  }
  return "bg-amber-50 text-warning border-warning/25";
};

export default function AdminMembershipApplicationsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const applications = useAppSelector(selectAdminMembershipApplications);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

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
      // Error state is handled in slice.
    } finally {
      setApprovingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(
      (application) => normalizeStatusBucket(application.status) === "pending"
    ).length;
    const approved = applications.filter(
      (application) => normalizeStatusBucket(application.status) === "approved"
    ).length;
    const rejected = applications.filter(
      (application) => normalizeStatusBucket(application.status) === "rejected"
    ).length;

    return { total, pending, approved, rejected };
  }, [applications]);

  const availablePlans = useMemo(
    () => Array.from(new Set(applications.map((application) => application.plan.tier))),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const statusBucket = normalizeStatusBucket(application.status);
      const matchesStatus = statusFilter === "all" || statusBucket === statusFilter;
      const matchesPlan = planFilter === "all" || application.plan.tier === planFilter;
      const search = searchQuery.trim().toLowerCase();
      const fullName =
        `${application.applicant.first_name} ${application.applicant.last_name}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        application.applicant.email.toLowerCase().includes(search) ||
        application.id.toLowerCase().includes(search);

      return matchesStatus && matchesPlan && matchesSearch;
    });
  }, [applications, statusFilter, planFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedApplications = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, safeCurrentPage]);

  return (
    <main className="flex-1 min-w-0 bg-cream text-navy-deep">
      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                Membership Applications
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Manage and review pending requests for Estrella del Mar membership tiers.
              </p>
            </div>

          
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-navy-deep bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Total Applications</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-gold-muted bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Pending Review</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {stats.pending.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-success bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Approved</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {stats.approved.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-danger bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Rejected</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {stats.rejected.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gold-muted/25 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex items-center gap-1 self-start rounded-lg bg-cream p-1">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`rounded-md px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      statusFilter === status
                        ? "bg-navy-deep text-gold-light shadow-sm"
                        : "text-text-muted hover:text-navy-deep"
                    }`}
                  >
                    {toTitleCase(status)}
                  </button>
                ))}
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search applications..."
                    className="w-full rounded-lg border border-gold-muted/20 bg-surface px-4 py-2 text-sm outline-none transition focus:border-gold-muted focus:ring-2 focus:ring-gold-muted/40"
                  />
                </div>

                <select
                  value={planFilter}
                  onChange={(event) => {
                    setPlanFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-gold-muted/20 bg-surface px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-deep outline-none transition focus:border-gold-muted focus:ring-2 focus:ring-gold-muted/40 sm:w-56"
                >
                  <option value="all">All Plans</option>
                  {availablePlans.map((tier) => (
                    <option key={tier} value={tier}>
                      {toTitleCase(tier)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-gold-muted/25 bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 border-collapse text-left">
                <thead>
                  <tr className="bg-navy-deep text-gold-light">
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Applicant</th>
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Email Address</th>
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Plan Tier</th>
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Status</th>
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Applied Date</th>
                    <th className="border-b border-gold-muted/30 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-muted/10">
                  {loading && applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-text-muted">
                        Loading applications...
                      </td>
                    </tr>
                  ) : paginatedApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-text-muted">
                        No applications match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedApplications.map((application, index) => {
                      const detailHref = `/membership/view-applications/application-detail/${application.id}`;
                      const isApproved = normalizeStatusBucket(application.status) === "approved";
                      const isApproving = approvingId === application.id;
                      const initials =
                        `${application.applicant.first_name?.[0] ?? ""}${application.applicant.last_name?.[0] ?? ""}`.toUpperCase() || "A";

                      return (
                        <tr
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
                          className={`cursor-pointer transition-colors hover:bg-cream/40 ${
                            index % 2 === 1 ? "bg-cream/10" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-muted/10 text-sm font-semibold text-gold-muted">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-navy-deep">
                                  {application.applicant.first_name} {application.applicant.last_name}
                                </p>
                                <p className="text-xs text-text-muted">#{application.id.slice(0, 8).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">{application.applicant.email}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full border border-gold-muted/20 bg-cream-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-navy-deep">
                              {toTitleCase(application.plan.tier)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${statusBadgeClass(
                                application.status
                              )}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {toTitleCase(application.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-muted">{formatDate(application.created_at)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  router.push(detailHref);
                                }}
                                className="rounded p-2 text-gold-muted transition-colors hover:text-navy-deep"
                                aria-label="View details"
                              >
                                <span>👁</span>
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onApprove(application.id);
                                }}
                                disabled={loading || isApproved || isApproving}
                                className="rounded border border-gold-muted bg-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-light transition-colors hover:bg-gold-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isApproved ? "Approved" : isApproving ? "Approving..." : "Approve"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gold-muted/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-muted">
                Showing{" "}
                <span className="font-semibold text-navy-deep">
                  {filteredApplications.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-navy-deep">
                  {Math.min(safeCurrentPage * pageSize, filteredApplications.length)}
                </span>{" "}
                of <span className="font-semibold text-navy-deep">{filteredApplications.length}</span> applications
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="rounded border border-gold-muted/20 p-2 disabled:opacity-50"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(0, 5)
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-8 w-8 rounded text-xs font-semibold ${
                        safeCurrentPage === pageNumber
                          ? "bg-navy-deep text-gold-light"
                          : "text-navy-deep hover:bg-cream"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  className="rounded border border-gold-muted/20 p-2 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          

            <div className="rounded-xl border border-gold-muted/25 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
                <span className="text-3xl text-gold-muted">✓</span>
              </div>
              <h4 className="text-xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                Security Audit
              </h4>
              <p className="mt-2 text-sm text-text-muted">
                Identity and profile checks remain active for all incoming applicants.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
