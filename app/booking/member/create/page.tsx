"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ExperienceSelector from "../../components/ExperienceSelector";
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import GuestSelector from "../../components/GuestSelector";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { createMemberReservation } from "../../../../store/booking/bookingThunks";
import type { RootState } from "../../../../store";
import { ChevronLeft, Sailboat, CalendarDays, Users, Loader2, CheckCircle } from "lucide-react";

export default function CreateMemberReservationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { loading, error } = useAppSelector((state: RootState) => state.booking);

  const [experience, setExperience] = useState<"dining" | "spa">("dining");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("19:00");
  const [guests, setGuests] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const availableTimes = ["18:00", "18:30", "19:00", "19:30", "20:00"];

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/booking/member/create");
      return;
    }

    // Format date string as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const reservationDateStr = `${year}-${month}-${day}`;

    const payload = {
      reservation_date: reservationDateStr,
      reservation_time: `${time}:00`,
      number_of_guests: guests,
    };

    try {
      await dispatch(createMemberReservation(payload)).unwrap();
      router.push("/booking/member/reservations");
    } catch (err) {
      console.error("Failed to create reservation:", err);
    }
  };

  return (
    <>
      <header className="w-full bg-navy-deep px-gutter py-4 flex flex-col items-center justify-center relative shadow-sm shadow-navy-deep/20 z-10 rounded-b-xl border-b border-gold-light/20">
        <button
          aria-label="Go Back"
          className="absolute left-gutter top-1/2 -translate-y-1/2 text-gold-light p-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-light/30 bg-primary-container flex items-center justify-center">
          <Sailboat className="text-gold-light w-8 h-8" />
        </div>
        <h1 className="font-h4 text-h4 text-gold-light mt-2">Member Reservation</h1>
      </header>

      <main className="flex-1 px-gutter py-container-margin w-full max-w-md mx-auto lg:max-w-5xl relative z-0">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm border border-error/20 mb-6">
            {error}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ExperienceSelector value={experience} onChange={setExperience} />

            <section className="bg-surface rounded-xl p-card-padding border border-gold-light/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] relative overflow-hidden">
              <h2 className="font-h4 text-h4 text-primary-container mb-4 flex items-center gap-2">
                <CalendarDays className="text-gold-muted w-6 h-6" />
                Date &amp; Time
              </h2>
              <div className="flex flex-col gap-4">
                <DatePicker value={date} onChange={setDate} />
                <TimePicker value={time} onChange={setTime} availableTimes={availableTimes} />
              </div>
            </section>

            <section className="bg-surface rounded-xl p-card-padding border border-gold-light/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] mb-6 lg:mb-0">
              <h2 className="font-h4 text-h4 text-primary-container mb-4 flex items-center gap-2">
                <Users className="text-gold-muted w-6 h-6" />
                Details
              </h2>
              <GuestSelector value={guests} onChange={setGuests} />
              <div>
                <label
                  className="font-label-uppercase text-label-uppercase text-text-secondary mb-2 block"
                  htmlFor="special-requests"
                >
                  Special Requests (Optional)
                </label>
                <textarea
                  id="special-requests"
                  placeholder="Allergies, occasions..."
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-cream border border-cream-dark rounded-lg px-input-padding-x py-input-padding-y text-body-lg text-text-primary focus:border-primary-container focus:ring-2 focus:ring-gold-muted/60 placeholder:text-text-muted transition-all resize-none"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 mt-6 lg:mt-0 sticky top-24 mb-24 lg:mb-0">
            <section className="bg-surface rounded-xl p-card-padding border border-gold-light/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)]">
              <h2 className="font-h4 text-h4 text-primary-container mb-4 flex items-center gap-2">
                <CheckCircle className="text-gold-muted w-6 h-6" />
                Confirm Booking
              </h2>
              
              <div className="text-sm text-text-secondary mb-6 leading-relaxed">
                As a member, you are not required to pay a deposit for your reservation. 
                Your club credit will be available to use during your visit.
              </div>
              
              <div className="mt-6 pt-6 border-t border-gold-light/20">
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full bg-navy-deep text-gold-light border border-gold-muted font-label-uppercase text-label-uppercase py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-muted hover:text-navy-deep active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {loading ? "Processing..." : "Confirm Reservation"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 w-full bg-surface/90 backdrop-blur-md p-4 border-t border-gold-light/20 z-40 lg:hidden shadow-[0_-8px_30px_rgba(16,36,63,0.1)]">
        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="w-full bg-navy-deep text-gold-light border border-gold-muted font-label-uppercase text-label-uppercase py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-muted hover:text-navy-deep active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {loading ? "Processing..." : "Confirm Reservation"}
        </button>
      </div>
    </>
  );
}
