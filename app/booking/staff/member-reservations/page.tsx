"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getAllMemberReservations } from "../../../../store/booking/bookingThunks";
import {
  selectMemberReservations,
  selectBookingLoading,
  selectBookingError,
} from "../../../../store/booking/bookingSelectors";
import {
  Loader2,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ExternalLink,
  Users,
  UserCheck,
  ReceiptText,
} from "lucide-react";

const PAGE_SIZE = 15;

export default function StaffMemberReservationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const memberReservations = useAppSelector(selectMemberReservations);
  const loading = useAppSelector(selectBookingLoading);
  const error = useAppSelector(selectBookingError);

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllMemberReservations(undefined));
  }, [dispatch]);

  const handleApply = () => {
    setPage(1);
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    if (dateFilter) params.date = dateFilter;
    dispatch(getAllMemberReservations(Object.keys(params).length ? params : undefined));
  };

  const handleReset = () => {
    setStatusFilter("");
    setDateFilter("");
    setPage(1);
    dispatch(getAllMemberReservations(undefined));
  };

  const totalPages = Math.max(1, Math.ceil(memberReservations.length / PAGE_SIZE));
  const paged = memberReservations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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
              Member Reservations
            </h1>
            <p className="text-[#4A4A4A]">View and manage club member dining reservations.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-[#B7922B]/25 rounded-lg p-1 w-fit shadow-sm">
          <button
            onClick={() => router.push("/booking/staff/reservations")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-widest text-[#B7922B] hover:bg-[#F8F1DF] transition-all duration-200"
          >
            <Users className="w-4 h-4" />
            Non-Members
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-widest bg-[#10243F] text-[#F1E0A6] shadow-sm transition-all duration-200"
          >
            <UserCheck className="w-4 h-4" />
            Members
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
                id="member-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#F8F1DF] border border-[#EDE3CC] px-3 py-2.5 rounded text-sm appearance-none focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#10243F]/30 text-[#1A1A1A] transition-all pr-8"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronRight className="w-4 h-4 rotate-90 absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#10243F] mb-1.5">
              Date
            </label>
            <input
              id="member-date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#F8F1DF] border border-[#EDE3CC] px-3 py-2.5 rounded text-sm focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[#10243F]/30 text-[#1A1A1A] transition-all"
            />
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
              <p className="text-sm text-[#6B7280]">Loading member reservations…</p>
            </div>
          ) : memberReservations.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-[#B7922B]/40 mx-auto mb-3" />
              <p className="text-[#10243F] font-semibold mb-1">No member reservations found</p>
              <p className="text-sm text-[#6B7280]">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[680px]">
                  <thead>
                    <tr className="bg-[#10243F] text-[#F1E0A6] border-b border-[#B7922B]/50">
                      <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider">Member</th>
                      <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider">Date</th>
                      <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider">Status</th>
                      <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider">Created</th>
                      <th className="py-4 px-5 text-xs font-semibold uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-[#EDE3CC] group hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(30,58,95,0.08)] transition-all duration-150 ${
                          i % 2 === 0 ? "bg-white" : "bg-[#F8F1DF]/50"
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="font-medium text-[#10243F] text-sm">
                            {r.user_email ?? "—"}
                          </div>
                          <div className="text-xs text-[#6B7280] font-mono">{r.id.slice(0, 8)}…</div>
                        </td>
                        <td className="py-3.5 px-5 text-sm text-[#4A4A4A]">{formatDate(r.reservation_date)}</td>
                        <td className="py-3.5 px-5">{getStatusBadge(r.status)}</td>
                        <td className="py-3.5 px-5 text-sm text-[#6B7280]">{formatDate(r.created_at)}</td>
                        <td className="py-3.5 px-5 text-center flex items-center justify-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const params = new URLSearchParams({ type: "member" });
                              if (r.card_token) params.set("cardToken", r.card_token);
                              if (r.user_name) params.set("userName", r.user_name);
                              if (r.user_email) params.set("userEmail", r.user_email);
                              router.push(`/booking/staff/spend-entries/create?${params.toString()}`);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] group-hover:text-[#10243F] font-semibold uppercase tracking-wider transition-colors hover:underline"
                          >
                            <ReceiptText className="w-3.5 h-3.5" />
                            Log Spend
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/booking/staff/member-reservations/${r.id}`);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-[#B7922B] group-hover:text-[#10243F] font-semibold uppercase tracking-wider transition-colors hover:underline"
                          >
                            View
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4 pb-6">
                {paged.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => router.push(`/booking/staff/member-reservations/${r.id}`)}
                    className="bg-white rounded-lg border border-[#B7922B]/25 p-5 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(30,58,95,0.12)] hover:border-[#B7922B]/50 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EDE3CC] flex-shrink-0 flex items-center justify-center text-[#10243F] font-medium uppercase font-serif">
                            {r.user_email ? r.user_email[0].toUpperCase() : "M"}
                          </div>
                          <div>
                            <h3
                              className="font-semibold text-[#10243F] text-sm leading-tight"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {r.user_email ?? "Member"}
                            </h3>
                            <p className="text-[#6B7280] text-xs mt-0.5 font-mono">
                              ID: {r.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(r.status)}
                      </div>
                      <div className="grid grid-cols-1 gap-4 mb-4 bg-[#F8F1DF]/50 rounded p-3 border border-[#EDE3CC]">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
                            Date
                          </p>
                          <p className="text-sm text-[#10243F] font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-[#B7922B]" />
                            {formatDate(r.reservation_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#EDE3CC] pt-4 mt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
                        Created
                      </p>
                      <p className="text-sm text-[#4A4A4A]">{formatDate(r.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && memberReservations.length > 0 && (
            <div className="bg-white px-5 py-4 border-t border-[#B7922B]/20 flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, memberReservations.length)} of{" "}
                {memberReservations.length}
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
      </div>
    </div>
  );
}
