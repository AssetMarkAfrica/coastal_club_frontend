"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getAllSpendEntries } from "../../../../store/booking/bookingThunks";
import type { RootState } from "../../../../store";
import {
  Loader2,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  SlidersHorizontal,
  ExternalLink,
  ReceiptText,
  Plus,
} from "lucide-react";

const PAGE_SIZE = 15;

export default function StaffSpendEntriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { spendEntries, loading, error } = useAppSelector(
    (state: RootState) => state.booking,
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    if (customerTypeFilter) params.customer_type = customerTypeFilter;
    dispatch(getAllSpendEntries(Object.keys(params).length ? params : undefined));
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    setPage(1);
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    if (customerTypeFilter) params.customer_type = customerTypeFilter;
    dispatch(getAllSpendEntries(Object.keys(params).length ? params : undefined));
  };

  const handleReset = () => {
    setStatusFilter("");
    setCustomerTypeFilter("");
    setPage(1);
    dispatch(getAllSpendEntries(undefined));
  };

  const totalPages = Math.max(1, Math.ceil(spendEntries.length / PAGE_SIZE));
  const paged = spendEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "settled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Settled
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getInitials = (nameOrEmail: string) =>
    nameOrEmail?.split(" ")[0]?.slice(0, 1).toUpperCase() + (nameOrEmail?.split(" ")[1]?.slice(0, 1).toUpperCase() ?? nameOrEmail?.split("@")[0]?.slice(1, 2).toUpperCase() ?? "") || "?";

  return (
    <div className="min-h-screen bg-[#F8F1DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#10243F] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Spend Entries
            </h1>
            <p className="text-[#4A4A4A]">Review and manage all on-property transactions.</p>
          </div>
          <button
            onClick={() => router.push("/booking/staff/spend-entries/create")}
            className="inline-flex items-center gap-2 bg-[#10243F] text-[#F1E0A6] border border-[#B7922B] px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Log Spend Entry
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-[#B7922B]/25 rounded-lg p-5 mb-8 shadow-sm flex flex-wrap gap-4 items-end">
          <SlidersHorizontal className="w-5 h-5 text-[#B7922B] self-center hidden sm:block" />
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#10243F] mb-1.5">
              Status
            </label>
            <div className="relative">
              <select
                id="se-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#F8F1DF] border border-[#EDE3CC] px-3 py-2.5 rounded text-sm appearance-none focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#10243F]/30 text-[#1A1A1A] transition-all pr-8"
              >
                <option value="">All Statuses</option>
                <option value="settled">Settled</option>
                <option value="pending_payment">Pending Shortfall</option>
              </select>
              <ChevronRight className="w-4 h-4 rotate-90 absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#10243F] mb-1.5">
              Customer Type
            </label>
            <div className="relative">
              <select
                id="se-type-filter"
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="w-full bg-[#F8F1DF] border border-[#EDE3CC] px-3 py-2.5 rounded text-sm appearance-none focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#10243F]/30 text-[#1A1A1A] transition-all pr-8"
              >
                <option value="">All Types</option>
                <option value="non_member">Non-Member</option>
                <option value="member">Member</option>
              </select>
              <ChevronRight className="w-4 h-4 rotate-90 absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="bg-[#10243F] text-[#F1E0A6] border border-[#B7922B] px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-200"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="bg-transparent border border-[#B7922B]/40 text-[#B7922B] px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#B7922B]/10 transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white border border-[#B7922B]/25 rounded-lg overflow-hidden shadow-[0_4px_24px_rgba(30,58,95,0.08)]">
          <div className="h-1 w-full bg-gradient-to-r from-[#10243F] to-[#455f87]" />
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#B7922B]" />
              <p className="text-sm text-[#6B7280]">Loading spend entries…</p>
            </div>
          ) : spendEntries.length === 0 ? (
            <div className="text-center py-16">
              <ReceiptText className="w-12 h-12 text-[#B7922B]/40 mx-auto mb-3" />
              <p className="text-[#10243F] font-semibold mb-1">No spend entries found</p>
              <p className="text-sm text-[#6B7280]">Try adjusting your filters or log a new entry.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#10243F] text-[#F1E0A6] border-b-2 border-[#B7922B] text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-5">Date / Time</th>
                    <th className="py-4 px-5">Customer</th>
                    <th className="py-4 px-5">Staff</th>
                    <th className="py-4 px-5 text-right">Amount Spent</th>
                    <th className="py-4 px-5 text-right">Credit Applied</th>
                    <th className="py-4 px-5 text-right">Shortfall Due</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE3CC]/50">
                  {paged.map((entry) => {
                    const isPending = entry.status === "pending_payment";
                    const dt = formatDateTime(entry.created_at);
                    return (
                      <tr
                        key={entry.id}
                        className={`group hover:bg-amber-50/50 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(30,58,95,0.06)] ${
                          isPending ? "border-l-[3px] border-l-[#B45309] bg-amber-500/[0.02]" : ""
                        }`}
                      >
                        <td className="py-4 px-5 text-sm">
                          <div className="text-[#10243F] font-medium">{dt.date}</div>
                          <div className="text-[#6B7280] text-xs">{dt.time}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#10243F]/10 flex items-center justify-center text-[#10243F] text-xs font-bold flex-shrink-0">
                              {getInitials(entry.customer_full_name ?? entry.customer_email ?? "")}
                            </div>
                            <div>
                              <div className="text-[#10243F] font-medium text-sm">
                                {entry.customer_full_name ?? entry.customer_email ?? "—"}
                              </div>
                              {entry.customer_full_name && (
                                <div className="text-[#6B7280] text-xs">{entry.customer_email}</div>
                              )}
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-[#B7922B] font-semibold uppercase tracking-wider">
                                  {entry.customer_type === "non_member" ? "Non-Member" : "Member"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-[#4A4A4A]">
                          <div>{entry.staff_full_name ?? entry.staff_user_email ?? "—"}</div>
                          {entry.staff_full_name && <div className="text-xs text-[#6B7280]">{entry.staff_user_email}</div>}
                        </td>
                        <td className="py-4 px-5 text-right font-medium text-[#10243F] text-sm">
                          GHS {(entry.amount_spent_pesewas / 100).toFixed(2)}
                        </td>
                        <td className="py-4 px-5 text-right text-[#0F766E] text-sm">
                          −GHS {(entry.credit_applied_pesewas / 100).toFixed(2)}
                        </td>
                        <td
                          className={`py-4 px-5 text-right text-sm font-semibold ${
                            entry.amount_due_pesewas > 0 ? "text-[#B45309]" : "text-[#6B7280]"
                          }`}
                        >
                          GHS {(entry.amount_due_pesewas / 100).toFixed(2)}
                        </td>
                        <td className="py-4 px-5 text-center">{getStatusBadge(entry.status)}</td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => router.push(`/booking/staff/spend-entries/${entry.id}`)}
                            className="inline-flex items-center gap-1.5 text-xs text-[#B7922B] group-hover:text-[#10243F] font-semibold uppercase tracking-wider transition-colors hover:underline"
                          >
                            View
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4 pb-6">
                {paged.map((entry) => {
                  const dt = formatDateTime(entry.created_at);
                  return (
                    <div
                      key={entry.id}
                      onClick={() => router.push(`/booking/staff/spend-entries/${entry.id}`)}
                      className={`bg-white rounded-lg border p-5 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(30,58,95,0.12)] hover:border-[#B7922B]/50 flex flex-col justify-between cursor-pointer ${
                        entry.status === "pending_payment"
                          ? "border-[#B45309]/40"
                          : "border-[#B7922B]/25"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-4">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EDE3CC] flex-shrink-0 flex items-center justify-center text-[#10243F] font-medium uppercase font-serif">
                              {getInitials(entry.customer_full_name || entry.customer_email || "")}
                            </div>
                              <div className="min-w-0">
                                <h3
                                  className="font-semibold text-[#10243F] text-sm leading-tight"
                                  style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                  {entry.customer_full_name ?? entry.customer_email ?? "No Email"}
                                </h3>
                                {entry.customer_full_name && (
                                  <p className="text-[#6B7280] text-xs mt-0.5 break-all">{entry.customer_email}</p>
                                )}
                                <p className="text-[10px] text-[#B7922B] font-semibold uppercase tracking-wider mt-0.5">
                                  {entry.customer_type === "non_member" ? "Non-Member" : "Member"}
                                </p>
                              </div>
                          </div>
                          <div className="flex-shrink-0">{getStatusBadge(entry.status)}</div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-4 bg-[#F8F1DF]/50 rounded p-3 border border-[#EDE3CC]">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
                              Date / Time
                            </p>
                            <p className="text-sm text-[#10243F] font-medium flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5 text-[#B7922B]" />
                              {dt.date}
                              <span className="text-[#6B7280] font-normal ml-2">{dt.time}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
                              Staff
                            </p>
                            <p className="text-sm text-[#10243F] font-medium break-all">
                              {entry.staff_full_name ?? entry.staff_user_email ?? "—"}
                            </p>
                            {entry.staff_full_name && (
                              <p className="text-xs text-[#6B7280] break-all">{entry.staff_user_email}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#EDE3CC] pt-4 mt-2 grid grid-cols-3 gap-3 items-start">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
                            Spent
                          </p>
                          <p className="text-sm text-[#10243F] font-medium">
                            GHS {(entry.amount_spent_pesewas / 100).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0F766E] mb-1">
                            Credit
                          </p>
                          <p className="text-sm text-[#0F766E] font-medium">
                            -GHS {(entry.credit_applied_pesewas / 100).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B7922B] mb-1">
                            Due
                          </p>
                          <p
                            className={`text-base font-bold ${
                              entry.amount_due_pesewas > 0 ? "text-[#B45309]" : "text-[#10243F]"
                            }`}
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            GHS {(entry.amount_due_pesewas / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && spendEntries.length > 0 && (
            <div className="bg-white px-5 py-4 border-t border-[#B7922B]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm text-[#6B7280]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, spendEntries.length)} of {spendEntries.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded text-[#6B7280] hover:text-[#10243F] hover:bg-[#F8F1DF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                        page === pg
                          ? "bg-[#10243F] text-[#F1E0A6]"
                          : "text-[#4A4A4A] hover:bg-[#EDE3CC]"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded text-[#6B7280] hover:text-[#10243F] hover:bg-[#F8F1DF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pending shortfall summary strip */}
        {!loading && spendEntries.filter((e) => e.status === "pending_payment").length > 0 && (
          <div className="mt-6 flex justify-end">
            <div className="bg-[#10243F] rounded-lg shadow-lg p-4 flex flex-wrap items-center gap-4 sm:gap-6 border border-[#B7922B]/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-white text-sm font-medium">
                    {spendEntries.filter((e) => e.status === "pending_payment").length} Pending Shortfall{spendEntries.filter((e) => e.status === "pending_payment").length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[#F1E0A6]/70 text-xs">
                    Total: GHS{" "}
                    {(
                      spendEntries
                        .filter((e) => e.status === "pending_payment")
                        .reduce((sum, e) => sum + e.amount_due_pesewas, 0) / 100
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#B7922B]/30" />
              <button
                onClick={() => router.push("/booking/staff/spend-entries/create")}
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#10243F] bg-[#F1E0A6] border border-[#F1E0A6] rounded hover:bg-white transition-colors"
              >
                Log New Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
