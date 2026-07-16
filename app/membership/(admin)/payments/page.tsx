"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAdminPaymentHistory,
  selectMembershipError,
  selectMembershipLoading,
} from "@/store/membership/membershipSelectors";
import { fetchAdminPaymentHistory } from "@/store/membership/membershipThunks";

const formatDate = (value: string | null) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (pesewas: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(
    pesewas / 100
  );

const formatCurrencyCompact = (pesewas: number) => {
  const cedis = pesewas / 100;
  if (cedis >= 1_000_000) return `GHc ${(cedis / 1_000_000).toFixed(1)}M`;
  if (cedis >= 1_000) return `GHc ${(cedis / 1_000).toFixed(1)}K`;
  return `GHc ${cedis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── SVG Bar chart ────────────────────────────────────────────────────────
function BarChart({ data, color = "#b8973a" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const H = 140, BAR_W = 28, GAP = 12;
  const W = data.length * (BAR_W + GAP) + GAP;
  return (
    <svg viewBox={`0 0 ${W} ${H + 36}`} className="w-full overflow-visible" style={{ maxHeight: 200 }}>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * H);
        const x = GAP + i * (BAR_W + GAP);
        return (
          <g key={i}>
            <rect x={x} y={0} width={BAR_W} height={H} rx={4} fill="rgba(184,151,58,0.08)" />
            <rect x={x} y={H - barH} width={BAR_W} height={barH} rx={4} fill={color} opacity={0.85} />
            <text x={x + BAR_W / 2} y={H + 16} textAnchor="middle" fontSize={9} fill="#888" fontFamily="inherit">
              {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut chart ──────────────────────────────────────────────────────
function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 46, CX = 60, CY = 60, strokeW = 16;
  let cumAngle = -90;
  const arcs = slices.map((s) => {
    const pct = s.value / total;
    const start = cumAngle;
    cumAngle += pct * 360;
    return { ...s, start, end: cumAngle };
  });
  const polar = (deg: number) => ({
    x: CX + R * Math.cos((deg * Math.PI) / 180),
    y: CY + R * Math.sin((deg * Math.PI) / 180),
  });
  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0">
      {arcs.map((a, i) => {
        const s = polar(a.start), e = polar(a.end - 0.5);
        const large = a.end - a.start > 180 ? 1 : 0;
        return (
          <path key={i} d={`M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`}
            stroke={a.color} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
        );
      })}
      <circle cx={CX} cy={CY} r={R - strokeW / 2 - 2} fill="white" />
      <text x={CX} y={CY - 5} textAnchor="middle" fontSize={10} fill="#0e2a47" fontWeight="600">{slices.length}</text>
      <text x={CX} y={CY + 9} textAnchor="middle" fontSize={7} fill="#888" fontWeight="500">TYPES</text>
    </svg>
  );
}

const DONUT_COLORS = ["#b8973a", "#0e2a47", "#2d6a4f", "#e63946", "#457b9d", "#a8dadc"];

export default function AdminPaymentHistoryPage() {
  const dispatch = useAppDispatch();
  const payments = useAppSelector(selectAdminPaymentHistory);
  const loading = useAppSelector(selectMembershipLoading);
  const error = useAppSelector(selectMembershipError);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<"table" | "analytics">("table");
  // Group toggle: false = individual transactions, true = grouped by member
  const [groupByMember, setGroupByMember] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchAdminPaymentHistory());
  }, [dispatch]);

  // ── Summary stats
  const stats = useMemo(() => {
    const successful = payments.filter((p) => p.status.toLowerCase() === "success");
    const totalRevenue = successful.reduce((sum, p) => sum + (p.amount_pesewas || 0), 0);
    const avgTransaction = successful.length > 0 ? totalRevenue / successful.length : 0;
    return { total: payments.length, totalRevenue, avgTransaction, successCount: successful.length };
  }, [payments]);

  // ── Per-member aggregation
  const memberStats = useMemo(() => {
    const map = new Map<string, {
      userId: string; name: string; email: string;
      totalPaid: number; txCount: number; successCount: number; lastPayment: string | null;
    }>();
    for (const p of payments) {
      const key = p.user.id;
      const isSuccess = p.status.toLowerCase() === "success";
      const existing = map.get(key);
      if (existing) {
        existing.txCount++;
        if (isSuccess) { existing.totalPaid += p.amount_pesewas || 0; existing.successCount++; }
        if (p.paid_at && (!existing.lastPayment || new Date(p.paid_at) > new Date(existing.lastPayment)))
          existing.lastPayment = p.paid_at;
      } else {
        map.set(key, {
          userId: key,
          name: `${p.user.first_name} ${p.user.last_name}`.trim(),
          email: p.user.email,
          totalPaid: isSuccess ? p.amount_pesewas || 0 : 0,
          txCount: 1,
          successCount: isSuccess ? 1 : 0,
          lastPayment: p.paid_at || null,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalPaid - a.totalPaid);
  }, [payments]);

  // ── Payment type breakdown (for analytics)
  const typeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of payments) {
      if (p.status.toLowerCase() !== "success") continue;
      const key = p.payment_type_display || p.payment_type || "Other";
      map.set(key, (map.get(key) ?? 0) + (p.amount_pesewas || 0));
    }
    return Array.from(map.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [payments]);

  const donutSlices = typeBreakdown.slice(0, 6).map((t, i) => ({ ...t, color: DONUT_COLORS[i % DONUT_COLORS.length] }));
  const topMembersChartData = memberStats.slice(0, 8).map((m) => ({ label: m.name.split(" ")[0], value: m.totalPaid }));

  // ── Filtered individual payments
  const filteredPayments = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return payments;
    return payments.filter((p) => {
      const fullName = `${p.user.first_name} ${p.user.last_name}`.toLowerCase();
      return fullName.includes(search) || p.user.email.toLowerCase().includes(search) || p.reference.toLowerCase().includes(search);
    });
  }, [payments, searchQuery]);

  // ── Filtered grouped members
  const filteredMembers = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return memberStats;
    return memberStats.filter((m) => m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search));
  }, [memberStats, searchQuery]);

  // ── Pagination (shared, resets on group toggle / search)
  const activeList = groupByMember ? filteredMembers : filteredPayments;
  const totalPages = Math.max(1, Math.ceil(activeList.length / pageSize));
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return activeList.slice(start, start + pageSize);
  }, [activeList, safeCurrentPage]);

  return (
    <main className="flex-1 min-w-0 bg-cream text-navy-deep">
      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">

          {/* ── Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                Payment History
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                View all membership-related payments and per-member revenue.
              </p>
            </div>
            <Link
              href="/membership/late-payments"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-danger/40 bg-danger/8 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-danger transition-colors hover:bg-danger hover:text-white lg:self-auto"
            >
              <span>⚠</span>
              <span>View Late Payments</span>
            </Link>
          </div>

          {/* ── Stat Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-navy-deep bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Total Transactions</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-success bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {formatCurrencyCompact(stats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-gold-muted bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Avg. Transaction</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {formatCurrencyCompact(stats.avgTransaction)}
              </p>
            </div>
            <div className="rounded-xl border border-gold-muted/25 border-t-4 border-t-info bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Unique Members</p>
              <p className="mt-2 text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
                {memberStats.length}
              </p>
            </div>
          </div>

          {/* ── View toggle */}
          <div className="inline-flex items-center gap-1 self-start rounded-lg bg-cream p-1">
            {(["table", "analytics"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={`rounded-md px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  activeView === v ? "bg-navy-deep text-gold-light shadow-sm" : "text-text-muted hover:text-navy-deep"
                }`}
              >
                {v === "table" ? "Transactions" : "Analytics"}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded border border-danger/35 bg-error-container px-4 py-3 text-sm text-danger">{error}</div>
          )}

          {/* ════════════════════ ANALYTICS VIEW ════════════════════ */}
          {activeView === "analytics" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-gold-muted/25 bg-white p-6 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Revenue by Member</p>
                <p className="mb-4 text-lg font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>Top Contributors</p>
                {topMembersChartData.length === 0
                  ? <p className="py-8 text-center text-sm text-text-muted">No data yet.</p>
                  : <BarChart data={topMembersChartData} color="#b8973a" />}
              </div>
              <div className="rounded-xl border border-gold-muted/25 bg-white p-6 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Revenue by Type</p>
                <p className="mb-4 text-lg font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>Payment Breakdown</p>
                {donutSlices.length === 0
                  ? <p className="py-8 text-center text-sm text-text-muted">No data yet.</p>
                  : (
                    <div className="flex items-center gap-6">
                      <DonutChart slices={donutSlices} />
                      <div className="flex-1 space-y-2">
                        {donutSlices.map((s, i) => (
                          <div key={i} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                              <span className="truncate text-[11px] text-text-muted uppercase tracking-wide">{s.label}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-navy-deep whitespace-nowrap">
                              {formatCurrencyCompact(s.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ════════════════════ TABLE VIEW ════════════════════ */}
          {activeView === "table" && (
            <div className="flex flex-col gap-4">
              {/* Search + group toggle in one bar */}
              <div className="rounded-xl border border-gold-muted/25 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder={groupByMember ? "Search by name or email…" : "Search by name, email, or reference…"}
                      className="w-full rounded-lg border border-gold-muted/20 bg-surface px-4 py-2 text-sm outline-none transition focus:border-gold-muted focus:ring-2 focus:ring-gold-muted/40"
                    />
                  </div>

                  {/* Group toggle */}
                  <button
                    type="button"
                    onClick={() => { setGroupByMember((v) => !v); setCurrentPage(1); setSearchQuery(""); }}
                    className={`inline-flex items-center gap-2 self-start rounded-lg border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:self-auto ${
                      groupByMember
                        ? "border-gold-muted bg-gold-muted/10 text-gold-muted hover:bg-gold-muted hover:text-white"
                        : "border-gold-muted/30 bg-cream text-text-muted hover:border-gold-muted hover:text-navy-deep"
                    }`}
                  >
                    <span>{groupByMember ? "⊞" : "⊟"}</span>
                    <span>{groupByMember ? "Grouped by Member" : "Group by Member"}</span>
                  </button>
                </div>
              </div>

              {/* ── Single adaptive table */}
              <div className="overflow-hidden rounded-xl border border-gold-muted/25 bg-white shadow-xl">
                <div className="overflow-x-auto">
                  {groupByMember ? (
                    /* ─ GROUPED VIEW ─ */
                    <table className="w-full min-w-[700px] border-collapse text-left">
                      <thead>
                        <tr className="bg-navy-deep text-gold-light">
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Rank</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Member</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Total Revenue</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Transactions</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">Last Payment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-muted/10">
                        {loading && memberStats.length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted">Loading…</td></tr>
                        ) : (paginatedItems as typeof memberStats).length === 0 ? (
                          <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted">No members found.</td></tr>
                        ) : (
                          (paginatedItems as typeof memberStats).map((m, i) => {
                            const rank = (safeCurrentPage - 1) * pageSize + i;
                            const initials = m.name.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
                            const revPct = stats.totalRevenue > 0 ? (m.totalPaid / stats.totalRevenue) * 100 : 0;
                            return (
                              <tr key={m.userId} className={`transition-colors hover:bg-cream/40 ${i % 2 === 1 ? "bg-cream/10" : ""}`}>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                                    rank === 0 ? "bg-gold-muted text-white"
                                    : rank === 1 ? "bg-slate-300 text-slate-700"
                                    : rank === 2 ? "bg-amber-600 text-white"
                                    : "bg-cream text-text-muted"
                                  }`}>
                                    {rank + 1}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-muted/10 text-sm font-semibold text-gold-muted">{initials}</div>
                                    <div>
                                      <p className="font-semibold text-navy-deep">{m.name}</p>
                                      <p className="text-xs text-text-muted">{m.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-navy-deep">{formatCurrency(m.totalPaid)}</p>
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-cream-dark/30">
                                      <div className="h-full rounded-full bg-gold-muted transition-all" style={{ width: `${revPct}%` }} />
                                    </div>
                                    <span className="text-[10px] text-text-muted">{revPct.toFixed(1)}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-navy-deep">
                                  <span className="font-medium">{m.txCount}</span>
                                  <span className="ml-1 text-xs text-text-muted">({m.successCount} successful)</span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-text-muted">{formatDate(m.lastPayment)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  ) : (
                    /* ─ INDIVIDUAL TRANSACTIONS VIEW ─ */
                    <table className="w-full min-w-[800px] border-collapse text-left">
                      <thead>
                        <tr className="bg-navy-deep text-gold-light">
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Member</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Payment Type</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Amount</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Reference</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em]">Status</th>
                          <th className="border-b border-gold-muted/30 px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em]">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-muted/10">
                        {loading && payments.length === 0 ? (
                          <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-text-muted">Loading payments…</td></tr>
                        ) : (paginatedItems as typeof payments).length === 0 ? (
                          <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-text-muted">No payments match your search.</td></tr>
                        ) : (
                          (paginatedItems as typeof payments).map((payment, index) => {
                            const initials = `${payment.user.first_name?.[0] ?? ""}${payment.user.last_name?.[0] ?? ""}`.toUpperCase() || "A";
                            const isSuccess = payment.status.toLowerCase() === "success";
                            return (
                              <tr key={payment.id} className={`transition-colors hover:bg-cream/40 ${index % 2 === 1 ? "bg-cream/10" : ""}`}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-muted/10 text-sm font-semibold text-gold-muted">{initials}</div>
                                    <div>
                                      <p className="font-semibold text-navy-deep">{payment.user.first_name} {payment.user.last_name}</p>
                                      <p className="text-xs text-text-muted">{payment.user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-navy-deep">{payment.payment_type_display}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-navy-deep">{formatCurrency(payment.amount_pesewas)}</td>
                                <td className="px-6 py-4 text-xs text-text-muted font-mono">{payment.reference}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                                    isSuccess ? "bg-emerald-50 text-success border-success/25" : "bg-red-50 text-danger border-danger/25"
                                  }`}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {payment.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-text-muted">{formatDate(payment.paid_at)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-gold-muted/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-text-muted">
                    Showing{" "}
                    <span className="font-semibold text-navy-deep">
                      {activeList.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-navy-deep">
                      {Math.min(safeCurrentPage * pageSize, activeList.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-navy-deep">{activeList.length}</span>{" "}
                    {groupByMember ? "members" : "payments"}
                  </p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={safeCurrentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded border border-gold-muted/20 p-2 disabled:opacity-50">←</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((n) => (
                      <button key={n} type="button" onClick={() => setCurrentPage(n)}
                        className={`h-8 w-8 rounded text-xs font-semibold ${safeCurrentPage === n ? "bg-navy-deep text-gold-light" : "text-navy-deep hover:bg-cream"}`}>
                        {n}
                      </button>
                    ))}
                    <button type="button" disabled={safeCurrentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded border border-gold-muted/20 p-2 disabled:opacity-50">→</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
