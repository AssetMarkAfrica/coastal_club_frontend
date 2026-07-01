"use client";
// app/booking/customer/reservations/[id]/page.tsx

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { getMyReservationById } from "../../../../../store/booking/bookingThunks";
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
    ExternalLink,
    Receipt,
    Hash,
} from "lucide-react";

export default function ReservationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();
    const { currentReservation, loading, error } = useAppSelector(
        (state: RootState) => state.booking,
    );

    const reservationId = params?.id as string;

    useEffect(() => {
        if (reservationId) {
            dispatch(getMyReservationById(reservationId));
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
            "px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border backdrop-blur-sm";
        switch (status?.toLowerCase()) {
            case "confirmed":
                return (
                    <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`}>
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                        Confirmed
                    </span>
                );
            case "pending_payment":
                return (
                    <span className={`${base} bg-amber-500/10 text-amber-400 border-amber-500/30`}>
                        <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                        Pending Payment
                    </span>
                );
            case "cancelled":
                return (
                    <span className={`${base} bg-rose-500/10 text-rose-400 border-rose-500/30`}>
                        <XCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                        Cancelled
                    </span>
                );
            case "expired":
                return (
                    <span className={`${base} bg-slate-500/10 text-slate-400 border-slate-500/30`}>
                        <AlertCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
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
            {/* Back button + Header */}
            <button
                onClick={() => router.push("/booking/customer/reservations")}
                className="inline-flex items-center gap-2 text-sm text-navy-deep hover:text-gold-muted transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Reservations
            </button>

            {/* Error state */}
            {error && (
                <div
                    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8"
                    role="alert"
                >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && !currentReservation ? (
                <div className="flex flex-col items-center justify-center py-20 text-navy-deep/60">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold-muted" />
                    <p className="text-sm font-medium tracking-wide">Loading reservation details…</p>
                </div>
            ) : currentReservation ? (
                /* Detail card */
                <div className="card-navy rounded-xl p-6 sm:p-8 relative overflow-hidden animate-fade-in-up opacity-0">
                    {/* Subtle dot pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(#F1E0A6 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                        }}
                    />

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 z-10">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-on-primary mb-1">
                                Reservation Details
                            </h1>
                            <p className="text-sm text-gold-light/70 flex items-center gap-1.5">
                                <Hash className="w-4 h-4" />
                                {currentReservation.id.slice(0, 8)}...
                            </p>
                        </div>
                        {getStatusBadge(currentReservation.status)}
                    </div>

                    {/* Core details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 z-10 border-b border-gold-muted/20 pb-8">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gold-light/60 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">
                                    Reservation Date
                                </p>
                                <p className="text-base font-medium text-on-primary">
                                    {formatDate(currentReservation.reservation_date)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Banknote className="w-5 h-5 text-gold-light/60 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">
                                    Initial Deposit
                                </p>
                                <p className="text-base font-medium text-on-primary">
                                    GHS {(currentReservation.intended_spend_pesewas / 100).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-gold-light/60 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">
                                    Remaining Spend Credit
                                </p>
                                <p className="text-xl font-bold gold-gradient-text chiseled-text tracking-tight">
                                    GHS {(currentReservation.spend_credit_remaining_pesewas / 100).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment & reference information */}
                    <div className="space-y-6 z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">
                                    Paystack Reference
                                </p>
                                <p className="text-sm font-mono text-on-primary break-all">
                                    {currentReservation.paystack_reference || "—"}
                                </p>
                            </div>
                            {currentReservation.payment_authorization_url &&
                                currentReservation.status !== "confirmed" && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-2">
                                        Payment Link
                                    </p>
                                    <a
                                        href={currentReservation.payment_authorization_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all text-sm font-semibold"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Complete Payment
                                        <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gold-muted/10">
                            <div>
                                <p className="text-xs text-gold-light/50 mb-0.5">Expires</p>
                                <p className="text-xs text-on-primary/70">
                                    {currentReservation.expires_at
                                        ? formatDateTime(currentReservation.expires_at)
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gold-light/50 mb-0.5">Paid at</p>
                                <p className="text-xs text-on-primary/70">
                                    {currentReservation.paid_at
                                        ? formatDateTime(currentReservation.paid_at)
                                        : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gold-light/50 mb-0.5">Created</p>
                                <p className="text-xs text-on-primary/70">
                                    {formatDateTime(currentReservation.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gold-light/50 mb-0.5">Updated</p>
                                <p className="text-xs text-on-primary/70">
                                    {formatDateTime(currentReservation.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action area – only shown when payment is still pending */}
                    {currentReservation.status === "pending_payment" && currentReservation.payment_authorization_url && (
                        <div className="mt-8 z-10">
                            <a
                                href={currentReservation.payment_authorization_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gold-muted text-navy-deep px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-gold-light transition-all active:scale-95 shadow-md"
                            >
                                <CreditCard className="w-4 h-4" />
                                Pay Now
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                /* Fallback if not loading and no reservation */
                !loading && (
                    <div className="text-center py-20 bg-surface rounded-xl border border-gold-light/20 shadow-sm animate-fade-in-up">
                        <Receipt className="w-12 h-12 text-gold-muted/40 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-navy-deep mb-2">
                            Reservation Not Found
                        </h2>
                        <p className="text-text-secondary mb-6">
                            We couldn’t find this reservation. It may have been removed or the link is incorrect.
                        </p>
                        <button
                            onClick={() => router.push("/booking/customer/reservations")}
                            className="text-gold-muted hover:text-navy-deep font-label-uppercase text-label-uppercase transition-colors underline"
                        >
                            View My Reservations
                        </button>
                    </div>
                )
            )}
        </div>
    );
}