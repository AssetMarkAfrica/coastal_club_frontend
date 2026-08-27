"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getMyMemberReservations } from "../../../../store/booking/bookingThunks";
import { selectMemberReservations, selectBookingLoading, selectBookingError } from "../../../../store/booking/bookingSelectors";
import {
  Utensils,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
} from "lucide-react";

export default function MyMemberReservationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(selectMemberReservations);
  const loading = useAppSelector(selectBookingLoading);
  const error = useAppSelector(selectBookingError);

  useEffect(() => {
    dispatch(getMyMemberReservations());
  }, [dispatch]);

  const handleBookTable = () => {
    router.push("/booking/member/create");
  };

  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border backdrop-blur-sm";
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <span className={`${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`}>
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className={`${base} bg-rose-500/10 text-rose-400 border-rose-500/30`}>
            <XCircle className="w-3 h-3" />
            Cancelled
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm font-semibold text-gold-muted mb-2 tracking-[0.2em] uppercase">
            My Experiences
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-deep tracking-tight">
            My Reservations
          </h1>
        </div>
        <button
          onClick={handleBookTable}
          className="inline-flex items-center gap-2 bg-navy-deep text-gold-light border border-gold-muted px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-gold-light hover:text-navy-deep transition-all duration-300 active:scale-95 shadow-lg shadow-navy-deep/10"
        >
          <Utensils className="w-4 h-4" />
          Book Table
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8 animate-fade-in-up"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-navy-deep/60">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold-muted" />
          <p className="text-sm font-medium tracking-wide">Loading your reservations…</p>
        </div>
      ) : reservations.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 bg-surface rounded-xl border border-gold-light/20 shadow-sm animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-light/10 mb-6">
            <Utensils className="w-8 h-8 text-gold-muted/60" />
          </div>
          <h2 className="text-2xl font-semibold text-navy-deep mb-3">
            No Reservations Yet
          </h2>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            You haven't made any upcoming reservations. Explore our dining experiences and secure
            your table.
          </p>
          <button
            onClick={handleBookTable}
            className="inline-flex items-center gap-2 bg-navy-deep text-gold-light px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider hover:bg-navy-deep/90 transition-all active:scale-95 shadow-md"
          >
            Make a Booking
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Reservation cards grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reservations.map((reservation, index) => {
            const dateObj = new Date(reservation.reservation_date);
            const dateFormatted = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <article
                key={reservation.id}
                className="card-navy rounded-xl p-6 flex flex-col relative overflow-hidden group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Subtle dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#F1E0A6 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                {/* Card header */}
                <div className="flex justify-between items-start mb-6 z-10">
                  <div>
                    <h3 className="text-xl font-bold text-on-primary mb-1">
                      Estrella del Mar
                    </h3>
                    <p className="text-sm text-gold-light/70 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4" />
                      Club Experience
                    </p>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>

                {/* Date row */}
                <div className="flex items-start gap-2 mb-8 z-10 border-b border-gold-muted/20 pb-6">
                  <Calendar className="w-4 h-4 text-gold-light/60 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-light/50 mb-1">
                      Date
                    </p>
                    <p className="text-sm font-medium text-on-primary">
                      {dateFormatted}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-auto z-10 bg-navy-deep/50 p-5 rounded-lg border border-gold-muted/10 flex justify-between items-center backdrop-blur-md">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-light/50 mb-1">
                      Member Reservation
                    </p>
                    <p className="text-sm font-medium text-gold-light">
                      No deposit required
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center gap-1.5 text-gold-light hover:text-white border border-gold-muted/30 px-3 py-1.5 rounded-lg hover:bg-gold-light/10 transition-all text-xs font-semibold"
                      onClick={() => router.push(`/review?venue=${reservation.venue_type || 'skybar'}&member_reservation=${reservation.id}`)}
                    >
                      <Star className="w-3.5 h-3.5 fill-gold-light/20" />
                      <span className="hidden sm:inline">Review Experience</span>
                      <span className="sm:hidden">Review</span>
                    </button>
                    <button
                      aria-label={`View details for reservation`}
                      className="inline-flex items-center gap-2 text-gold-light hover:text-white transition-all px-3 py-2 rounded-full hover:bg-white/5 active:scale-95 text-sm font-semibold"
                      onClick={() => router.push(`/booking/member/reservations/${reservation.id}`)}
                    >
                      <span className="hidden sm:inline">View Details</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
