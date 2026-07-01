"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { getReservationById } from "../../../../../store/booking/bookingThunks";
import { clearCurrentReservation } from "../../../../../store/booking/bookingSlice";
import type { RootState } from "../../../../../store";
import {
  ArrowLeft,
  Calendar,
  Banknote,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Receipt,
  Hash,
  TimerOff,
  User,
  ExternalLink,
} from "lucide-react";

export default function StaffReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentReservation, loading, error } = useAppSelector(
    (state: RootState) => state.booking,
  );

  const reservationId = params?.id as string;

  useEffect(() => {
    if (reservationId) {
      dispatch(getReservationById(reservationId));
    }
    return () => {
      dispatch(clearCurrentReservation());
    };
  }, [reservationId, dispatch]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border backdrop-blur-sm";
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case "pending_payment":
        return (
          <span className={`${base} bg-amber-500/10 text-amber-400 border-amber-500/30`}>
            <Clock className="w-3.5 h-3.5" />
            Pending Payment
          </span>
        );
      case "cancelled":
        return (
          <span className={`${base} bg-rose-500/10 text-rose-400 border-rose-500/30`}>
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case "expired":
        return (
          <span className={`${base} bg-slate-500/10 text-slate-400 border-slate-500/30`}>
            <TimerOff className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      default:
        return (
          <span className={`${base} bg-slate-400/10 text-slate-300 border-slate-400/30`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Back button */}
      <button
        onClick={() => router.push("/booking/staff/reservations")}
        className="inline-flex items-center gap-2 text-sm text-navy-deep hover:text-gold-muted transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Reservations
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8" role="alert">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && !currentReservation ? (
        <div className="flex flex-col items-center justify-center py-20 text-navy-deep/60">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold-muted" />
          <p className="text-sm font-medium tracking-wide">Loading reservation details…</p>
        </div>
      ) : currentReservation ? (
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
              <h1 className="text-2xl sm:text-3xl font-bold text-on-primary mb-1">Reservation Details</h1>
              <p className="text-sm text-gold-light/70 flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                {currentReservation.id.slice(0, 8)}…
              </p>
            </div>
            {getStatusBadge(currentReservation.status)}
          </div>

          {/* Guest info */}
          {(currentReservation.user_email || currentReservation.user_id) && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 border border-gold-muted/20 rounded-lg z-10">
              <div className="w-10 h-10 rounded-full bg-gold-light/10 border border-gold-light/30 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gold-light/60" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-0.5">Guest</p>
                <p className="text-sm font-medium text-on-primary">{currentReservation.user_email ?? currentReservation.user_id}</p>
              </div>
            </div>
          )}

          {/* Core details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 z-10 border-b border-gold-muted/20 pb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gold-light/60 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">Reservation Date</p>
                <p className="text-base font-medium text-on-primary">{formatDate(currentReservation.reservation_date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Banknote className="w-5 h-5 text-gold-light/60 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">Initial Deposit</p>
                <p className="text-base font-medium text-on-primary">
                  GHS {(currentReservation.intended_spend_pesewas / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gold-light/60 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">Remaining Spend Credit</p>
                <p className="text-xl font-bold gold-gradient-text chiseled-text tracking-tight">
                  GHS {(currentReservation.spend_credit_remaining_pesewas / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment reference */}
          <div className="space-y-6 z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">Paystack Reference</p>
                <p className="text-sm font-mono text-on-primary break-all">{currentReservation.paystack_reference || "—"}</p>
              </div>
              {/* Payment link only for non-confirmed reservations */}
              {currentReservation.payment_authorization_url &&
                currentReservation.status !== "confirmed" && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-2">Payment Link</p>
                  <a
                    href={currentReservation.payment_authorization_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-semibold"
                  >
                    <CreditCard className="w-4 h-4" />
                    Payment Link
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gold-muted/10">
              {[
                { label: "Expires", value: currentReservation.expires_at ? formatDateTime(currentReservation.expires_at) : "—" },
                { label: "Paid at", value: currentReservation.paid_at ? formatDateTime(currentReservation.paid_at) : "—" },
                { label: "Created", value: formatDateTime(currentReservation.created_at) },
                { label: "Updated", value: formatDateTime(currentReservation.updated_at) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gold-light/50 mb-0.5">{label}</p>
                  <p className="text-xs text-on-primary/70">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Staff action — log a spend entry */}
          {currentReservation.status === "confirmed" && (
            <div className="mt-8 z-10">
              <button
                onClick={() =>
                  router.push(
                    `/booking/staff/spend-entries/create?reservationId=${currentReservation.id}`
                  )
                }
                className="inline-flex items-center gap-2 bg-gold-muted text-navy-deep px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-gold-light transition-all active:scale-95 shadow-md"
              >
                <Receipt className="w-4 h-4" />
                Log Spend Entry
              </button>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-surface rounded-xl border border-gold-light/20 shadow-sm animate-fade-in-up">
            <Receipt className="w-12 h-12 text-gold-muted/40 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-navy-deep mb-2">Reservation Not Found</h2>
            <p className="text-text-secondary mb-6">
              We couldn&apos;t find this reservation.
            </p>
            <button
              onClick={() => router.push("/booking/staff/reservations")}
              className="text-gold-muted hover:text-navy-deep font-label-uppercase text-label-uppercase transition-colors underline"
            >
              View All Reservations
            </button>
          </div>
        )
      )}
    </div>
  );
}
