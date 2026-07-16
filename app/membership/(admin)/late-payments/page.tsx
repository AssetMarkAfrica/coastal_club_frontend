"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminLatePayments,
  selectMembershipError,
  selectMembershipLoading,
} from "@/store/membership/membershipSelectors";
import { fetchAdminLatePayments } from "@/store/membership/membershipThunks";
import type { MembershipApplication, AdminSubscriptionDetail } from "@/types/membership";

const formatDate = (value: string | null) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (pesewas: number | undefined) => {
  if (pesewas === undefined) return "N/A";
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(pesewas / 100);
};

const formatCurrencyCompact = (pesewas: number) => {
  const cedis = pesewas / 100;
  if (cedis >= 1_000_000) return `GHc ${(cedis / 1_000_000).toFixed(1)}M`;
  if (cedis >= 1_000) return `GHc ${(cedis / 1_000).toFixed(1)}K`;
  return `GHc ${cedis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── Stacked horizontal bar ────────────────────────────────────────────────
function HorizontalStackedBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="w-full">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color,
            }}
            title={`${s.label}: ${s.value}`}
            className="transition-all"
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-[10px] uppercase tracking-wide text-text-muted">
              {s.label}
            </span>
            <span className="text-[10px] font-semibold text-navy-deep">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Risk bar (single member, shows overdue amount as % of max) ──────────
function RiskBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-cream-dark/30">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[10px] text-text-muted">{pct}%</span>
    </div>
  );
}

export default function AdminLatePaymentsPage() {
  const dispatch = useAppDispatch();
  const latePaymentsData = useAppSelector(selectAdminLatePayments);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "application" | "initiation" | "renewal" | "maintenance"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<"table" | "analytics">("table");

  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchAdminLatePayments());
  }, [dispatch]);

  const flattenedLatePayments = useMemo(() => {
    if (!latePaymentsData) return [];

    const items: Array<{
      id: string;
      user: { first_name: string; last_name: string; email: string };
      type: "application" | "initiation" | "renewal" | "maintenance";
      typeDisplay: string;
      amountDue: number;
      dueDate: string | null;
      planTier: string;
    }> = [];

    latePaymentsData.pending_applications.forEach((app: MembershipApplication) => {
      items.push({
        id: app.id,
        user: {
          first_name: app.applicant.first_name,
          last_name: app.applicant.last_name,
          email: app.applicant.email,
        },
        type: "application",
        typeDisplay: "Application Fee",
        amountDue: 0,
        dueDate: app.created_at,
        planTier: app.plan.tier,
      });
    });

    latePaymentsData.pending_subscriptions.forEach((sub: AdminSubscriptionDetail) => {
      items.push({
        id: sub.id,
        user: {
          first_name: sub.member.first_name,
          last_name: sub.member.last_name,
          email: sub.member.email,
        },
        type: "initiation",
        typeDisplay: "Initiation & Annual Fee",
        amountDue: sub.plan.initiation_fee_pesewas + sub.plan.annual_fee_pesewas,
        dueDate: sub.created_at,
        planTier: sub.plan.tier,
      });
    });

    latePaymentsData.expired_subscriptions.forEach((sub: AdminSubscriptionDetail) => {
      items.push({
        id: sub.id,
        user: {
          first_name: sub.member.first_name,
          last_name: sub.member.last_name,
          email: sub.member.email,
        },
        type: "renewal",
        typeDisplay: "Annual Renewal",
        amountDue: sub.plan.annual_fee_pesewas,
        dueDate: sub.current_period_end,
        planTier: sub.plan.tier,
      });
    });

    latePaymentsData.late_maintenance_subscriptions.forEach((sub: AdminSubscriptionDetail) => {
      items.push({
        id: sub.id,
        user: {
          first_name: sub.member.first_name,
          last_name: sub.member.last_name,
          email: sub.member.email,
        },
        type: "maintenance",
        typeDisplay: "Monthly Maintenance",
        amountDue: sub.maintenance_fee_due_pesewas,
        dueDate: sub.maintenance_fee_paid_through_month,
        planTier: sub.plan.tier,
      });
    });

    return items.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [latePaymentsData]);

  const filteredPayments = useMemo(() => {
    return flattenedLatePayments.filter((payment) => {
      const search = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        `${payment.user.first_name} ${payment.user.last_name}`
          .toLowerCase()
          .includes(search) ||
        payment.user.email.toLowerCase().includes(search);
      const matchesType = filterType === "all" || payment.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [flattenedLatePayments, searchQuery, filterType]);

  const stats = useMemo(() => {
    const maintenance = flattenedLatePayments.filter((p) => p.type === "maintenance");
    const renewal = flattenedLatePayments.filter((p) => p.type === "renewal");
    const initiation = flattenedLatePayments.filter((p) => p.type === "initiation");
    const application = flattenedLatePayments.filter((p) => p.type === "application");

    const totalOutstanding = flattenedLatePayments.reduce(
      (sum, p) => sum + (p.amountDue || 0),
      0
    );

    return {
      total: flattenedLatePayments.length,
      maintenance: maintenance.length,
      renewal: renewal.length,
      initiation: initiation.length,
      application: application.length,
      totalOutstanding,
    };
  }, [flattenedLatePayments]);

  // ── Per-member aggregation for analytics
  const memberRisk = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        email: string;
        totalDue: number;
        count: number;
        types: Set<string>;
      }
    >();

    for (const p of flattenedLatePayments) {
      const key = p.user.email;
      const existing = map.get(key);
      if (existing) {
        existing.totalDue += p.amountDue || 0;
        existing.count++;
        existing.types.add(p.type);
      } else {
        map.set(key, {
          name: `${p.user.first_name} ${p.user.last_name}`.trim(),
          email: p.user.email,
          totalDue: p.amountDue || 0,
          count: 1,
          types: new Set([p.type]),
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalDue - a.totalDue);
  }, [flattenedLatePayments]);

  const maxDue = Math.max(...memberRisk.map((m) => m.totalDue), 1);

  const TYPE_META: Record<
    string,
    { color: string; label: string; badgeClass: string }
  > = {
    maintenance: {
      color: "#e63946",
      label: "Maintenance",
      badgeClass: "bg-red-50 text-danger border-danger/25",
    },
    renewal: {
      color: "#f4a261",
      label: "Renewal",
      badgeClass: "bg-orange-50 text-orange-600 border-orange-200",
    },
    initiation: {
      color: "#0e2a47",
      label: "Initiation",
      badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
    },
    application: {
      color: "#b8973a",
      label: "Application",
      badgeClass: "bg-amber-50 text-warning border-warning/25",
    },
  };

  const stackedSegments = [
    {
      label: "Maintenance",
      value: stats.maintenance,
      color: TYPE_META.maintenance.color,
    },
    {
      label: "Renewal",
      value: stats.renewal,
      color: TYPE_META.renewal.color,
    },
    {
      label: "Initiation",
      value: stats.initiation,
      color: TYPE_META.initiation.color,
    },
    {
      label: "App Fee",
      value: stats.application,
      color: TYPE_META.application.color,
    },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedPayments = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, safeCurrentPage]);

  return (
    <main className="flex-1 min-w-0 bg-cream text-navy-deep">
      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* ── Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1
                className="text-4xl font-semibold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Late Payments
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Monitor members with outstanding balances or expired
                subscriptions.
              </p>
            </div>
            {/* Nav link to Payment History */}
            <Link
              href="/membership/payments"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-navy-deep/30 bg-navy-deep/8 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-deep transition-colors hover:bg-navy-deep hover:text-gold-light lg:self-auto"
            >
              <span>💳</span>
              <span>View Payment History</span>
            </Link>
          </div>

          {/* ── Stat Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-danger bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Late Maintenance
              </p>
              <p
                className="mt-2 text-3xl font-semibold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stats.maintenance.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-warning bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Overdue Renewal
              </p>
              <p
                className="mt-2 text-3xl font-semibold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stats.renewal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-navy-deep bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Pending Initiation
              </p>
              <p
                className="mt-2 text-3xl font-semibold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stats.initiation.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-gold-muted bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                Pending App Fee
              </p>
              <p
                className="mt-2 text-3xl font-semibold text-navy-deep"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stats.application.toLocaleString()}
              </p>
            </div>
          </div>

          {/* ── Outstanding amount banner */}
          {stats.totalOutstanding > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-danger/25 bg-gradient-to-r from-danger/5 to-danger/10 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-danger">
                  Total Outstanding Balance
                </p>
                <p
                  className="mt-1 text-3xl font-semibold text-danger"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {formatCurrencyCompact(stats.totalOutstanding)}
                </p>
              </div>
              <span className="text-4xl opacity-30">⚠</span>
            </div>
          )}

          {/* ── View toggle */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-lg bg-cream p-1">
              {(["table", "analytics"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setActiveView(v)}
                  className={`rounded-md px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    activeView === v
                      ? "bg-navy-deep text-gold-light shadow-sm"
                      : "text-text-muted hover:text-navy-deep"
                  }`}
                >
                  {v === "table" ? "Outstanding List" : "Risk Analytics"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* ════════════════════ ANALYTICS VIEW ════════════════════ */}
          {activeView === "analytics" && (
            <div className="flex flex-col gap-6">
              {/* Breakdown bar + per-type summary */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Breakdown composition */}
                <div className="rounded-xl border border-gold-muted/25 bg-white p-6 shadow-sm">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                    Overdue Composition
                  </p>
                  <p
                    className="mb-5 text-lg font-semibold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {stats.total} Outstanding Records
                  </p>
                  <HorizontalStackedBar segments={stackedSegments} />

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {stackedSegments.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-gold-muted/15 bg-cream/30 p-3"
                      >
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold"
                          style={{ background: s.color }}
                        >
                          {s.value}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-navy-deep">
                            {s.label}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {stats.total > 0
                              ? Math.round((s.value / stats.total) * 100)
                              : 0}
                            % of total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outstanding by type */}
                <div className="rounded-xl border border-gold-muted/25 bg-white p-6 shadow-sm">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                    Amount at Risk
                  </p>
                  <p
                    className="mb-5 text-lg font-semibold text-navy-deep"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    By Category
                  </p>
                  <div className="space-y-4">
                    {(
                      ["maintenance", "renewal", "initiation", "application"] as const
                    ).map((type) => {
                      const meta = TYPE_META[type];
                      const items = flattenedLatePayments.filter(
                        (p) => p.type === type
                      );
                      const totalAmt = items.reduce(
                        (s, p) => s + (p.amountDue || 0),
                        0
                      );
                      const pct =
                        stats.totalOutstanding > 0
                          ? (totalAmt / stats.totalOutstanding) * 100
                          : 0;
                      return (
                        <div key={type}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-semibold text-navy-deep">
                              {meta.label}
                            </span>
                            <span className="text-xs font-semibold text-navy-deep">
                              {totalAmt > 0
                                ? formatCurrencyCompact(totalAmt)
                                : "Pending Calc"}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-dark/20">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: meta.color,
                              }}
                            />
                          </div>
                          <p className="mt-0.5 text-[10px] text-text-muted">
                            {items.length} member{items.length !== 1 ? "s" : ""}{" "}
                            · {pct.toFixed(1)}% of outstanding
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Per-member risk table */}
              <div className="overflow-hidden rounded-xl border border-gold-muted/25 bg-white shadow-xl">
                <div className="border-b border-gold-muted/15 bg-navy-deep px-6 py-4">
                  <p
                    className="text-lg font-semibold text-gold-light"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Per-Member Risk Assessment
                  </p>
                  <p className="text-[11px] text-gold-light/60 mt-0.5">
                    Ranked by total outstanding balance
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr className="bg-cream/60">
                        <th className="border-b border-gold-muted/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          Member
                        </th>
                        <th className="border-b border-gold-muted/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          Amount Due
                        </th>
                        <th className="border-b border-gold-muted/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          Exposure
                        </th>
                        <th className="border-b border-gold-muted/20 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          # Overdue
                        </th>
                        <th className="border-b border-gold-muted/20 px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                          Overdue Types
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-muted/10">
                      {memberRisk.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-sm text-text-muted"
                          >
                            {loading ? "Loading…" : "No outstanding balances."}
                          </td>
                        </tr>
                      ) : (
                        memberRisk.map((m, i) => {
                          const initials = m.name
                            .split(" ")
                            .map((n) => n[0] ?? "")
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);
                          const riskColor =
                            m.totalDue > 5000_00
                              ? "#e63946"
                              : m.totalDue > 1000_00
                              ? "#f4a261"
                              : "#b8973a";
                          return (
                            <tr
                              key={m.email}
                              className={`transition-colors hover:bg-cream/40 ${
                                i % 2 === 1 ? "bg-cream/10" : ""
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-sm font-semibold text-danger">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-navy-deep text-sm">
                                      {m.name}
                                    </p>
                                    <p className="text-xs text-text-muted">
                                      {m.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-danger text-sm">
                                  {m.totalDue > 0
                                    ? formatCurrency(m.totalDue)
                                    : "Pending"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <RiskBar
                                  value={m.totalDue}
                                  max={maxDue}
                                  color={riskColor}
                                />
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-danger/10 text-[11px] font-bold text-danger">
                                  {m.count}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-wrap justify-end gap-1">
                                  {Array.from(m.types).map((t) => {
                                    const meta =
                                      TYPE_META[t] ?? TYPE_META.application;
                                    return (
                                      <span
                                        key={t}
                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}
                                      >
                                        {meta.label}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════ TABLE VIEW ════════════════════ */}
          {activeView === "table" && (
            <>
              <div className="rounded-xl border border-gold-muted/25 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="inline-flex items-center gap-1 self-start rounded-lg bg-cream p-1 overflow-x-auto max-w-full">
                    {(
                      [
                        "all",
                        "maintenance",
                        "renewal",
                        "initiation",
                        "application",
                      ] as const
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFilterType(type);
                          setCurrentPage(1);
                        }}
                        className={`rounded-md px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
                          filterType === type
                            ? "bg-navy-deep text-gold-light shadow-sm"
                            : "text-text-muted hover:text-navy-deep"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full lg:w-80">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search members..."
                      className="w-full rounded-lg border border-gold-muted/20 bg-surface px-4 py-2 text-sm outline-none transition focus:border-gold-muted focus:ring-2 focus:ring-gold-muted/40"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gold-muted/25 bg-white shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-left">
                    <thead>
                      <tr className="bg-navy-deep text-gold-light">
                        <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Member
                        </th>
                        <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Plan
                        </th>
                        <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Overdue Reason
                        </th>
                        <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Amount Due
                        </th>
                        <th className="border-b border-gold-muted/30 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Due Date / Since
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-muted/10">
                      {loading && flattenedLatePayments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-sm text-text-muted"
                          >
                            Loading late payments...
                          </td>
                        </tr>
                      ) : paginatedPayments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-sm text-text-muted"
                          >
                            No members currently have outstanding balances.
                          </td>
                        </tr>
                      ) : (
                        paginatedPayments.map((payment, index) => {
                          const initials = `${payment.user.first_name?.[0] ?? ""}${payment.user.last_name?.[0] ?? ""}`.toUpperCase() || "A";
                          const meta =
                            TYPE_META[payment.type] ?? TYPE_META.application;

                          return (
                            <tr
                              key={payment.id}
                              className={`transition-colors hover:bg-cream/40 ${
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
                                      {payment.user.first_name}{" "}
                                      {payment.user.last_name}
                                    </p>
                                    <p className="text-xs text-text-muted">
                                      {payment.user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="rounded-full border border-gold-muted/20 bg-cream-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-navy-deep">
                                  {payment.planTier}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${meta.badgeClass}`}
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                  {payment.typeDisplay}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-navy-deep">
                                {payment.amountDue > 0
                                  ? formatCurrency(payment.amountDue)
                                  : "Pending Calculation"}
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-text-muted">
                                {formatDate(payment.dueDate)}
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
                      {filteredPayments.length === 0
                        ? 0
                        : (safeCurrentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-navy-deep">
                      {Math.min(
                        safeCurrentPage * pageSize,
                        filteredPayments.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-navy-deep">
                      {filteredPayments.length}
                    </span>{" "}
                    records
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safeCurrentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className="rounded border border-gold-muted/20 p-2 disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
