"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { getSpendEntryById } from "../../../../../store/booking/bookingThunks";
import { clearCurrentSpendEntry } from "../../../../../store/booking/bookingSlice";
import type { RootState } from "../../../../../store";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ReceiptText,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  Hash,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function StaffSpendEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentSpendEntry, loading, error } = useAppSelector(
    (state: RootState) => state.booking,
  );

  const entryId = params?.id as string;

  useEffect(() => {
    if (entryId) {
      dispatch(getSpendEntryById(entryId));
    }
    return () => {
      dispatch(clearCurrentSpendEntry());
    };
  }, [entryId, dispatch]);

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "settled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Settled
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pending Payment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-400/10 text-slate-300 border border-slate-400/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
      <button
        onClick={() => router.push("/booking/staff/spend-entries")}
        className="inline-flex items-center gap-2 text-sm text-navy-deep hover:text-gold-muted transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Spend Entries
      </button>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8" role="alert">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && !currentSpendEntry ? (
        <div className="flex flex-col items-center justify-center py-20 text-navy-deep/60">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold-muted" />
          <p className="text-sm font-medium tracking-wide">Loading spend entry…</p>
        </div>
      ) : currentSpendEntry ? (
        <div className="card-navy rounded-xl p-6 sm:p-8 relative overflow-hidden animate-fade-in-up opacity-0">
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#F1E0A6 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 z-10 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-primary mb-1">Spend Entry</h1>
              <p className="text-sm text-gold-light/70 flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                {currentSpendEntry.id.slice(0, 8)}…
              </p>
            </div>
            {getStatusBadge(currentSpendEntry.status)}
          </div>

          {/* People info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 z-10">
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-gold-muted/20 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gold-light/10 border border-gold-light/30 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gold-light/60" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-0.5">Customer</p>
                <p className="text-sm font-medium text-on-primary">{currentSpendEntry.customer_email ?? "—"}</p>
                <p className="text-xs text-gold-light/40 capitalize">{currentSpendEntry.customer_type.replace("_", " ")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-gold-muted/20 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gold-light/10 border border-gold-light/30 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gold-light/60" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-0.5">Logged by Staff</p>
                <p className="text-sm font-medium text-on-primary">{currentSpendEntry.staff_user_email ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-gradient-to-br from-[#10243F] to-[#1E3A5F] rounded-xl p-6 mb-8 border border-gold-light/20 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #F1E0A6 0%, transparent 50%)" }} />
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-gold-light/20 pb-3 mb-4 flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-gold-light" />
              Transaction Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-white/80">
                <span className="text-sm">Amount Spent</span>
                <span className="font-semibold">GHS {(currentSpendEntry.amount_spent_pesewas / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span className="text-sm">Credit Applied</span>
                <span className="font-semibold">−GHS {(currentSpendEntry.credit_applied_pesewas / 100).toFixed(2)}</span>
              </div>
              <div className="h-px bg-gold-light/20 my-2" />
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${currentSpendEntry.amount_due_pesewas > 0 ? "text-amber-300" : "text-white"}`}>
                  {currentSpendEntry.amount_due_pesewas > 0 ? "Shortfall Due" : "Amount Due"}
                </span>
                <span className={`text-xl font-bold ${currentSpendEntry.amount_due_pesewas > 0 ? "text-amber-300" : "text-white"}`}>
                  GHS {(currentSpendEntry.amount_due_pesewas / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code section — shown when pending shortfall exists */}
          {currentSpendEntry.status === "pending_payment" && currentSpendEntry.payment_authorization_url && (
            <div className="mb-8 p-6 bg-[#F8F1DF] border border-[#EDE3CC] rounded-xl text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center border-2 border-[#B7922B] shadow">
                <CreditCard className="w-6 h-6 text-[#B42318]" />
              </div>
              <h3 className="text-[#10243F] font-bold text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Shortfall Payment
              </h3>
              <p className="text-sm text-[#6B7280] mb-5">
                Present this QR code to the guest — they can scan it with their phone to pay the outstanding balance.
              </p>
              <div className="inline-block bg-white p-4 rounded-lg border border-[#EDE3CC] shadow-md mb-4">
                <QRCodeSVG
                  value={currentSpendEntry.payment_authorization_url}
                  size={192}
                  bgColor="#ffffff"
                  fgColor="#10243F"
                  level="M"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#10243F] text-sm font-medium mb-4">
                <span className="text-[#B7922B]">🔒</span>
                Secure Payment Gateway
              </div>
              <a
                href={currentSpendEntry.payment_authorization_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#B7922B] hover:text-[#10243F] transition-colors underline"
              >
                Open payment link directly
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Payment reference & timestamps */}
          <div className="space-y-6 z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">Paystack Reference</p>
              <p className="text-sm font-mono text-on-primary break-all">{currentSpendEntry.paystack_reference || "—"}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gold-muted/10">
              {[
                { label: "Settled at", value: currentSpendEntry.settled_at ? formatDateTime(currentSpendEntry.settled_at) : "—" },
                { label: "Created", value: formatDateTime(currentSpendEntry.created_at) },
                { label: "Updated", value: formatDateTime(currentSpendEntry.updated_at) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gold-light/50 mb-0.5">{label}</p>
                  <p className="text-xs text-on-primary/70">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-surface rounded-xl border border-gold-light/20 shadow-sm animate-fade-in-up">
            <ReceiptText className="w-12 h-12 text-gold-muted/40 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-navy-deep mb-2">Spend Entry Not Found</h2>
            <button
              onClick={() => router.push("/booking/staff/spend-entries")}
              className="text-gold-muted hover:text-navy-deep font-label-uppercase text-label-uppercase transition-colors underline"
            >
              View All Entries
            </button>
          </div>
        )
      )}
    </div>
  );
}
