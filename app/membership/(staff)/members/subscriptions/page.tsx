"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptions, fetchSubscriptionDetail } from "@/store/membership/membershipThunks";
import {
    selectSubscriptions,
    selectSubscriptionDetail,
} from "@/store/membership/membershipSelectors";
import type { SubscriptionListItem } from "@/types/membership";

// ─── Helpers ────────────────────────────────────────────────────────────────

const pesewasToGHS = (pesewas: number) =>
    new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
    }).format(pesewas / 100);

const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");

// ─── Status / Maintenance badge helpers ─────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === "active")
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                Active
            </span>
        );
    if (s === "pending")
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                Pending
            </span>
        );
    if (s === "cancelled" || s === "expired")
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                {status}
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-semibold">
            {status}
        </span>
    );
}

function MaintenanceBadge({ status }: { status: string }) {
    const s = status.toLowerCase();
    if (s === "bonus_active" || s === "bonus active")
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                ⚡ Bonus Active
            </span>
        );
    if (s === "paid")
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-xs font-medium">
                ✓ Paid
            </span>
        );
    if (s === "unpaid" || s === "overdue")
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                Unpaid
            </span>
        );
    if (s === "clear")
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
                Clear
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium">
            {status || "—"}
        </span>
    );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#EDE3CC]/60 animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="py-5 px-6">
                            <div className="h-4 bg-[#EDE3CC] rounded w-3/4" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

function MobileCardSkeleton() {
    return (
        <>
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl p-5 border border-[#EDE3CC] animate-pulse"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#EDE3CC]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#EDE3CC] rounded w-2/3" />
                            <div className="h-3 bg-[#EDE3CC] rounded w-1/2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-10 bg-[#EDE3CC] rounded" />
                        <div className="h-10 bg-[#EDE3CC] rounded" />
                    </div>
                </div>
            ))}
        </>
    );
}

// ─── Detail Panel ────────────────────────────────────────────────────────────

function DetailPanel({
    open,
    onClose,
    selectedItem,
}: {
    open: boolean;
    onClose: () => void;
    selectedItem: SubscriptionListItem | null;
}) {
    const dispatch = useAppDispatch();
    const detail = useAppSelector(selectSubscriptionDetail);
    const loading = useAppSelector((s) => s.membership.loading);

    useEffect(() => {
        if (open && selectedItem) {
            dispatch(fetchSubscriptionDetail(selectedItem.id));
        }
    }, [open, selectedItem, dispatch]);

    const creditPct =
        detail && detail.monthly_spend_credit_pesewas > 0
            ? Math.min(
                100,
                (detail.spend_credit_remaining_pesewas /
                    detail.monthly_spend_credit_pesewas) *
                100
            )
            : 0;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-[#10243F]/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Panel */}
            <aside
                className={`fixed top-0 right-0 h-full z-50 w-full max-w-lg bg-[#F8F1DF] shadow-2xl shadow-[#10243F]/30 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Panel header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE3CC] bg-[#10243F]">
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#B7922B]/80">
                            Subscription Details
                        </p>
                        {selectedItem && (
                            <p className="text-[#F1E0A6] font-semibold text-sm mt-0.5">
                                {selectedItem.member.name}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#8aa4cf]/70 hover:text-[#F1E0A6] transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Breadcrumb */}
                {selectedItem && (
                    <div className="px-6 py-3 flex items-center gap-1.5 text-xs text-[#6B7280]">
                        <span>Memberships</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        <span>Subscriptions</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        <span className="text-[#B7922B] font-medium">{selectedItem.member.name}</span>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-32">
                    {loading || !detail ? (
                        <div className="space-y-4 pt-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-24 bg-[#EDE3CC] rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-5 pt-2">
                            {/* Profile hero */}
                            <div className="flex flex-col items-center text-center py-6">
                                <div className="relative mb-3">
                                    <div className="w-20 h-20 rounded-full bg-[#EDE3CC] border-2 border-[#B7922B]/40 flex items-center justify-center text-[#10243F] text-2xl font-bold shadow-lg">
                                        {getInitials(selectedItem?.member.name ?? "")}
                                    </div>
                                    <div
                                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow ${detail.is_active ? "bg-teal-500" : "bg-gray-400"
                                            }`}
                                    />
                                </div>
                                <h2 className="text-[#10243F] text-xl font-semibold" style={{ fontFamily: "var(--font-playfair, serif)" }}>
                                    {selectedItem?.member.name}
                                </h2>
                                <p className="text-[#6B7280] text-xs mt-1">{selectedItem?.member.email}</p>
                                <div className="flex gap-2 mt-3">
                                    <StatusBadge status={detail.status} />
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F1E0A6]/40 text-[#B7922B] border border-[#B7922B]/30 text-xs font-semibold uppercase tracking-wider">
                                        {detail.plan.name}
                                    </span>
                                </div>
                            </div>

                            {/* Subscription details card */}
                            <div className="bg-white rounded-xl border border-[#EDE3CC] shadow-[0_4px_24px_rgba(16,36,63,0.04)] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#EDE3CC]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <h3 className="text-[#10243F] font-semibold text-sm">Subscription Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-y-5 gap-x-8 p-5">
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Current Plan</p>
                                        <p className="text-[#10243F] font-semibold text-sm">{detail.plan.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Billing Cycle</p>
                                        <p className="text-[#10243F] font-semibold text-sm capitalize">{detail.billing_cycle ?? "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Period Start</p>
                                        <p className="text-[#10243F] font-semibold text-sm">{formatDate(detail.current_period_start)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Period End</p>
                                        <p className="text-[#10243F] font-semibold text-sm">{formatDate(detail.current_period_end)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Member Since</p>
                                        <p className="text-[#10243F] font-semibold text-sm">{formatDate(detail.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Maintenance</p>
                                        <MaintenanceBadge status={detail.maintenance_fee_status} />
                                    </div>
                                </div>
                            </div>

                            {/* Financial overview */}
                            <div className="bg-white rounded-xl border border-[#EDE3CC] border-t-4 border-t-[#B7922B] shadow-[0_4px_24px_rgba(16,36,63,0.06)] overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-4 border-b border-[#EDE3CC]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                    <h3 className="text-[#10243F] font-semibold text-sm">Financial Overview</h3>
                                </div>
                                <div className="p-5 space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#F8F1DF]/60 rounded-lg p-4 border border-[#EDE3CC]/60">
                                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Monthly Credit</p>
                                            <p className="text-[#10243F] text-xl font-bold" style={{ fontFamily: "var(--font-playfair, serif)" }}>
                                                {pesewasToGHS(detail.monthly_spend_credit_pesewas)}
                                            </p>
                                        </div>
                                        <div className="bg-[#F8F1DF]/60 rounded-lg p-4 border border-[#EDE3CC]/60">
                                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Spent This Month</p>
                                            <p className="text-[#10243F] text-xl font-bold" style={{ fontFamily: "var(--font-playfair, serif)" }}>
                                                {pesewasToGHS(detail.fb_spend_this_month_pesewas)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Credit progress bar */}
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#10243F]">Remaining Credit</p>
                                            <p className="text-xs text-[#6B7280]">
                                                <strong className="text-[#10243F]">{pesewasToGHS(detail.spend_credit_remaining_pesewas)}</strong> left
                                            </p>
                                        </div>
                                        <div className="w-full bg-[#EDE3CC] h-2.5 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full rounded-full transition-all duration-700 ease-out"
                                                style={{
                                                    width: `${creditPct}%`,
                                                    background: "linear-gradient(90deg, #B7922B, #F1E0A6)",
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-[#6B7280] mt-1 text-right">{creditPct.toFixed(0)}% remaining</p>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            {detail.plan.benefits && detail.plan.benefits.length > 0 && (
                                <div className="bg-white rounded-xl border border-[#EDE3CC] shadow-[0_4px_24px_rgba(16,36,63,0.04)] overflow-hidden">
                                    <div className="flex items-center gap-2 px-5 py-4 border-b border-[#EDE3CC]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                        <h3 className="text-[#10243F] font-semibold text-sm">{detail.plan.name} Benefits</h3>
                                    </div>
                                    <ul className="divide-y divide-[#EDE3CC]/60">
                                        {detail.plan.benefits.map((b) => (
                                            <li key={b.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#F8F1DF]/50 transition-colors">
                                                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#F1E0A6]/50 flex items-center justify-center shrink-0">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                </span>
                                                <div>
                                                    <p className="text-[#10243F] text-sm font-medium leading-snug">{b.title}</p>
                                                    {b.description && (
                                                        <p className="text-[#6B7280] text-xs mt-0.5 leading-relaxed">{b.description}</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Signup bonus perk card */}
                            {detail.is_signup_bonus_active && (
                                <div className="rounded-xl border border-[#B7922B]/40 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #10243F 0%, #1e3a5f 100%)" }}>
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #F1E0A6 0%, transparent 60%)" }} />
                                    <div className="relative z-10 p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-[#F1E0A6] font-semibold">Status Perks</h3>
                                            <span className="bg-[#ffe088] text-[#241a00] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                ⚡ Bonus Active
                                            </span>
                                        </div>
                                        <p className="text-[#8aa4cf]/90 text-sm leading-relaxed mb-3">
                                            Member has achieved <span className="text-[#F1E0A6] font-medium">Early Renewal Bonus</span> status.
                                        </p>
                                        {detail.signup_bonus_expires_on && (
                                            <div className="bg-white/10 border border-[#F1E0A6]/20 rounded-lg p-3">
                                                <p className="text-[10px] font-semibold tracking-widest uppercase text-[#F1E0A6]/70 mb-1">Bonus Expires</p>
                                                <p className="text-white font-semibold text-sm">{formatDate(detail.signup_bonus_expires_on)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sticky footer actions */}

            </aside>
        </>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function SubscriptionsPage() {
    const dispatch = useAppDispatch();
    const subscriptions = useAppSelector(selectSubscriptions);
    const loading = useAppSelector((s) => s.membership.loading);
    const error = useAppSelector((s) => s.membership.error);

    // Panel state
    const [selectedItem, setSelectedItem] = useState<SubscriptionListItem | null>(null);
    const [panelOpen, setPanelOpen] = useState(false);

    // Filter / search state
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [maintenanceFilter, setMaintenanceFilter] = useState("all");
    const [activeMobileChip, setActiveMobileChip] = useState("all");

    // Pagination
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, [dispatch]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, maintenanceFilter, activeMobileChip]);

    const filtered = useMemo(() => {
        const chipStatus = activeMobileChip !== "all" ? activeMobileChip : statusFilter;
        return subscriptions.filter((s) => {
            const nameMatch =
                s.member.name.toLowerCase().includes(search.toLowerCase()) ||
                s.member.email.toLowerCase().includes(search.toLowerCase()) ||
                s.plan.name.toLowerCase().includes(search.toLowerCase());
            const statusMatch = chipStatus === "all" || s.status.toLowerCase() === chipStatus;
            const maintenanceMatch =
                maintenanceFilter === "all" ||
                s.maintenance_fee_status.toLowerCase().replace("_", " ") === maintenanceFilter.toLowerCase();
            return nameMatch && statusMatch && maintenanceMatch;
        });
    }, [subscriptions, search, statusFilter, maintenanceFilter, activeMobileChip]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openDetail = (item: SubscriptionListItem) => {
        setSelectedItem(item);
        setPanelOpen(true);
    };

    const closeDetail = () => {
        setPanelOpen(false);
        setTimeout(() => setSelectedItem(null), 300);
    };

    // Status chip counts for mobile
    const chipCounts = useMemo(() => {
        const all = subscriptions.length;
        const active = subscriptions.filter((s) => s.status.toLowerCase() === "active").length;
        const pending = subscriptions.filter((s) => s.status.toLowerCase() === "pending").length;
        const expired = subscriptions.filter(
            (s) => s.status.toLowerCase() === "expired" || s.status.toLowerCase() === "cancelled"
        ).length;
        return { all, active, pending, expired };
    }, [subscriptions]);

    return (
        <>
            <style>{`
        .sub-table-row {
          transition: all 0.2s ease-in-out;
        }
        .sub-table-row:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 36, 63, 0.06);
          position: relative;
          z-index: 2;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* ── Desktop Layout ─────────────────────────────────── */}
            <div className="hidden lg:flex flex-col min-h-full bg-[#F8F1DF]">
                <main className="flex-1 p-8">
                    {/* Page header */}
                    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1
                                className="text-3xl text-[#10243F] mb-1.5"
                                style={{ fontFamily: "var(--font-playfair, serif)", fontWeight: 600 }}
                            >
                                Member Subscriptions
                            </h1>
                            <p className="text-[#6B7280] text-sm">
                                Manage active plans, maintenance statuses, and renewals.
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 items-center bg-white p-2 rounded-xl border border-[#EDE3CC] shadow-sm">
                            <div className="flex items-center gap-2 px-3 py-2 border-r border-[#EDE3CC]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" /></svg>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-[#10243F] text-xs font-semibold uppercase tracking-widest cursor-pointer pr-1 outline-none"
                                >
                                    <option value="all">Status: All</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="expired">Expired</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 border-r border-[#EDE3CC]">
                                <select
                                    value={maintenanceFilter}
                                    onChange={(e) => setMaintenanceFilter(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-[#10243F] text-xs font-semibold uppercase tracking-widest cursor-pointer pr-1 outline-none"
                                >
                                    <option value="all">Maintenance: All</option>
                                    <option value="bonus active">Bonus Active</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="clear">Clear</option>
                                </select>
                            </div>
                            <div className="px-3 py-2 flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search members, plans..."
                                    className="bg-transparent border-none focus:ring-0 text-[#10243F] text-xs placeholder:text-[#6B7280]/70 outline-none w-44"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-700 text-sm flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Table card */}
                    <div className="bg-white rounded-xl border border-[#EDE3CC] shadow-sm overflow-hidden">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#10243F] text-[#F1E0A6]">
                                    <tr>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Member Name</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Plan</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Monthly Credit</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Maintenance</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap">Period End</th>
                                        <th className="py-4 px-6 text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <TableSkeleton />
                                    ) : paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center text-[#6B7280] text-sm">
                                                <div className="flex flex-col items-center gap-3">
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EDE3CC" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                    No subscriptions found.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginated.map((sub, idx) => (
                                            <tr
                                                key={sub.id}
                                                className={`sub-table-row border-b border-[#EDE3CC]/60 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-[#F8F1DF]/40"
                                                    }`}
                                                onClick={() => openDetail(sub)}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#EDE3CC] flex items-center justify-center text-[#10243F] text-sm font-bold shrink-0">
                                                            {getInitials(sub.member.name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[#10243F] font-semibold text-sm leading-tight">{sub.member.name}</p>
                                                            <p className="text-[#6B7280] text-xs">{sub.member.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F1E0A6]/30 text-[#B7922B] border border-[#B7922B]/30 text-xs font-semibold uppercase tracking-wider">
                                                        {sub.plan.name}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge status={sub.status} />
                                                </td>
                                                <td className="py-4 px-6 text-[#10243F] font-medium text-sm">
                                                    {pesewasToGHS(sub.monthly_spend_credit_pesewas)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <MaintenanceBadge status={sub.maintenance_fee_status} />
                                                </td>
                                                <td className="py-4 px-6 text-[#6B7280] text-sm">
                                                    {formatDate(sub.current_period_end)}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openDetail(sub); }}
                                                        className="p-2 text-[#6B7280] hover:text-[#10243F] hover:bg-[#EDE3CC] rounded-md transition-colors"
                                                        title="View details"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer */}
                        <div className="bg-white border-t border-[#EDE3CC] px-6 py-4 flex items-center justify-between">
                            <p className="text-[#6B7280] text-sm">
                                {loading
                                    ? "Loading..."
                                    : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} members`}
                            </p>
                            <div className="flex gap-1.5">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="px-3 py-1.5 rounded border border-[#EDE3CC] text-[#6B7280] hover:bg-[#F8F1DF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-1.5 rounded border text-sm transition-colors ${page === p
                                                    ? "border-[#B7922B] bg-[#F1E0A6]/30 text-[#10243F] font-semibold"
                                                    : "border-[#EDE3CC] text-[#6B7280] hover:bg-[#F8F1DF]"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="px-3 py-1.5 rounded border border-[#EDE3CC] text-[#6B7280] hover:bg-[#F8F1DF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Mobile Layout ──────────────────────────────────── */}
            <div className="lg:hidden flex flex-col min-h-full bg-[#F8F1DF] pb-24">
                <div className="p-4 space-y-5">
                    {/* Page header */}
                    <div className="space-y-1 pt-2">
                        <h1
                            className="text-2xl text-[#10243F]"
                            style={{ fontFamily: "var(--font-playfair, serif)", fontWeight: 600 }}
                        >
                            Memberships
                        </h1>
                        <p className="text-[#6B7280] text-sm">Manage member subscriptions and statuses.</p>
                    </div>

                    {/* Filter chips */}
                    <div className="flex overflow-x-auto pb-1 -mx-4 px-4 gap-2 no-scrollbar">
                        {[
                            { key: "all", label: `All (${chipCounts.all})` },
                            { key: "active", label: `Active (${chipCounts.active})` },
                            { key: "pending", label: `Pending (${chipCounts.pending})` },
                            { key: "expired", label: `Expired (${chipCounts.expired})` },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveMobileChip(key)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors ${activeMobileChip === key
                                        ? "bg-[#10243F] text-[#F1E0A6] border-[#B7922B]/50"
                                        : "bg-white text-[#10243F] border-[#EDE3CC] hover:bg-[#EDE3CC]"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search members..."
                            className="w-full bg-white border border-[#EDE3CC] rounded-xl py-3 pl-10 pr-4 text-[#10243F] text-sm focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#B7922B]/60 shadow-sm placeholder-[#6B7280]/60 transition-all"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Cards */}
                    <div className="space-y-4">
                        {loading ? (
                            <MobileCardSkeleton />
                        ) : paginated.length === 0 ? (
                            <div className="bg-white rounded-xl border border-[#EDE3CC] p-10 text-center text-[#6B7280] text-sm">
                                No subscriptions found.
                            </div>
                        ) : (
                            paginated.map((sub) => {
                                const statusLower = sub.status.toLowerCase();
                                const accentColor =
                                    statusLower === "active"
                                        ? "#10243F"
                                        : statusLower === "pending"
                                            ? "#B7922B"
                                            : "#B42318";

                                return (
                                    <div
                                        key={sub.id}
                                        onClick={() => openDetail(sub)}
                                        className="bg-white rounded-xl p-5 border border-[#EDE3CC] shadow-[0_4px_24px_rgba(16,36,63,0.06)] relative overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-transform duration-300"
                                    >
                                        {/* Status accent stripe */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-1"
                                            style={{ backgroundColor: accentColor }}
                                        />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-lg bg-[#EDE3CC] flex items-center justify-center text-[#10243F] font-bold text-base">
                                                    {getInitials(sub.member.name)}
                                                </div>
                                                <div>
                                                    <h3 className="text-[#10243F] font-semibold text-base leading-tight">
                                                        {sub.member.name}
                                                    </h3>
                                                    <p className="text-[#6B7280] text-xs mt-0.5">{sub.member.email}</p>
                                                </div>
                                            </div>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div>
                                                <span className="block text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Plan</span>
                                                <span className="inline-block px-2 py-0.5 rounded bg-[#F1E0A6]/40 text-[#B7922B] text-[10px] font-bold tracking-wider border border-[#B7922B]/30">
                                                    {sub.plan.name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-semibold tracking-widest uppercase text-[#6B7280] mb-1">Status</span>
                                                <StatusBadge status={sub.status} />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-[#EDE3CC] flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 text-[#6B7280]">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                <span className="text-xs">Renews: {formatDate(sub.current_period_end)}</span>
                                            </div>
                                            <MaintenanceBadge status={sub.maintenance_fee_status} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Mobile pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 rounded-lg border border-[#EDE3CC] text-[#6B7280] text-sm hover:bg-[#EDE3CC] disabled:opacity-40"
                            >
                                ‹ Prev
                            </button>
                            <span className="px-4 py-2 text-[#10243F] text-sm font-medium">
                                {page} / {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 rounded-lg border border-[#EDE3CC] text-[#6B7280] text-sm hover:bg-[#EDE3CC] disabled:opacity-40"
                            >
                                Next ›
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Detail panel (shared) ────────────────────────────── */}
            <DetailPanel
                open={panelOpen}
                onClose={closeDetail}
                selectedItem={selectedItem}
            />
        </>
    );
}
