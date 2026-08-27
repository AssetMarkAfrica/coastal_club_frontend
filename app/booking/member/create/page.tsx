"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExperienceSelector from "../../components/ExperienceSelector";
import DatePicker from "../../components/DatePicker";
import TimePicker from "../../components/TimePicker";
import GuestSelector from "../../components/GuestSelector";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { createMemberReservation } from "../../../../store/booking/bookingThunks";
import type { RootState } from "../../../../store";
import type { VenueType } from "../../../../types/booking";
import {
  ChevronLeft,
  CalendarDays,
  Clock,
  Users,
  Loader2,
  CheckCircle,
  ShieldCheck,
  Utensils,
  Sofa,
  DoorClosed,
  Sunset,
} from "lucide-react";

/* ── Venue metadata (mirrors ExperienceSelector) ── */
const VENUE_META: Record<
  VenueType,
  { label: string; tagline: string; image: string | null; Icon: React.ElementType }
> = {
  fine_dining: {
    label: "Fine Dining",
    tagline: "An exquisite à la carte dining journey",
    image:
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787761397/FineDining7_fepbsb.png",
    Icon: Utensils,
  },
  executive_lounge: {
    label: "Executive Lounge",
    tagline: "An exclusive sanctuary for our members",
    image: null,
    Icon: Sofa,
  },
  private_room: {
    label: "Private Room",
    tagline: "Intimate parties & private gatherings",
    image:
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
    Icon: DoorClosed,
  },
  skybar: {
    label: "Skybar",
    tagline: "Cocktails beneath an open sky",
    image:
      "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
    Icon: Sunset,
  },
};

/* ── Helpers ── */
function formatDateDisplay(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ── Section wrapper ── */
function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_24px_rgba(0,0,0,0.055)]">
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-navy-deep/5 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-[11px] font-bold text-navy-deep uppercase tracking-[0.15em]">
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ── Main page ── */
export default function CreateMemberReservationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { loading, error } = useAppSelector((state: RootState) => state.booking);

  const [venueType, setVenueType] = useState<VenueType>("fine_dining");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get("venue") || params.get("venue_type")) as VenueType | null;
      const validVenues: VenueType[] = ["fine_dining", "executive_lounge", "private_room", "skybar"];
      if (v && validVenues.includes(v)) {
        setVenueType(v);
      }
    }
  }, []);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>("19:00");
  const [guests, setGuests] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const availableTimes = ["18:00", "18:30", "19:00", "19:30", "20:00"];
  const venue = VENUE_META[venueType];
  const canSubmit = !loading && !!venueType;

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/booking/member/create");
      return;
    }

    const payload = {
      venue_type: venueType,
      reservation_date: toDateString(date),
      reservation_time: `${time}:00`,
      number_of_guests: guests,
      notes: specialRequests,
    };

    try {
      await dispatch(createMemberReservation(payload)).unwrap();
      router.push("/booking/member/reservations");
    } catch (err) {
      console.error("Failed to create reservation:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* ─────────────── Header ─────────────── */}
      <header className="w-full bg-navy-deep/95 backdrop-blur-sm px-4 py-3.5 flex items-center justify-between z-20 sticky top-0 border-b border-white/10">
        <button
          aria-label="Go Back"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gold-light/70 hover:text-gold-light transition-colors rounded-lg p-1 -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        <div className="text-center">
          <p className="text-gold-light/50 text-[9px] font-bold uppercase tracking-[0.25em] leading-none mb-0.5">
            Coastal Club Member
          </p>
          <h1 className="text-white font-semibold text-[15px] leading-none">
            New Reservation
          </h1>
        </div>

        {/* Balance spacer */}
        <div className="w-16" />
      </header>

      {/* ─────────────── Error Banner ─────────────── */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* ─────────────── Page body ─────────────── */}
      <main className="w-full max-w-md mx-auto lg:max-w-[1152px] px-4 pt-6 pb-32 lg:pb-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start">

          {/* ─── Left column ─── */}
          <div className="lg:col-span-7 flex flex-col gap-5">

            {/* 1. Venue hero picker */}
            <ExperienceSelector value={venueType} onChange={setVenueType} />

            {/* 2. Date & Time */}
            <FormSection
              icon={<CalendarDays className="w-4 h-4 text-navy-deep" />}
              title="Date & Time"
            >
              <div className="flex flex-col gap-5">
                <DatePicker value={date} onChange={setDate} />
                <TimePicker
                  value={time}
                  onChange={setTime}
                  availableTimes={availableTimes}
                />
              </div>
            </FormSection>

            {/* 3. Booking details */}
            <FormSection
              icon={<Users className="w-4 h-4 text-navy-deep" />}
              title="Booking Details"
            >
              <div className="flex flex-col gap-5">
                <GuestSelector value={guests} onChange={setGuests} />

                <div>
                  <label
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 block"
                    htmlFor="special-requests-member"
                  >
                    Special Requests{" "}
                    <span className="font-normal normal-case text-gray-300">
                      — optional
                    </span>
                  </label>
                  <textarea
                    id="special-requests-member"
                    placeholder="Dietary requirements, special occasion, seating preferences…"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-navy-deep focus:ring-2 focus:ring-gold-muted/20 transition-all resize-none outline-none"
                  />
                </div>
              </div>
            </FormSection>
          </div>

          {/* ─── Right sticky sidebar ─── */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.09)] bg-white">

              {/* Venue photo */}
              <div className="relative h-44 overflow-hidden">
                {venue.image ? (
                  <img
                    key={venueType}
                    src={venue.image}
                    alt={venue.label}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#1E3A5F 0%,#10243F 100%)",
                    }}
                  >
                    <venue.Icon className="w-14 h-14 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-gold-light/70 text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5">
                    Selected Venue
                  </p>
                  <p className="text-white font-bold text-xl leading-tight">
                    {venue.label}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="p-5 flex flex-col gap-5">

                {/* Quick summary */}
                <ul className="flex flex-col gap-3">
                  <SummaryRow
                    icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
                    label={formatDateDisplay(date)}
                  />
                  <SummaryRow
                    icon={<Clock className="w-4 h-4 text-gray-400" />}
                    label={time}
                  />
                  <SummaryRow
                    icon={<Users className="w-4 h-4 text-gray-400" />}
                    label={`${guests} ${guests === 1 ? "guest" : "guests"}`}
                  />
                </ul>

                <div className="border-t border-gray-100" />
                
                <div className="bg-navy-deep/5 rounded-xl px-4 py-3 border border-navy-deep/10">
                   <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckCircle className="w-4 h-4 text-navy-deep/60" />
                      </div>
                      <p className="text-[12px] text-gray-600 leading-relaxed">
                        As a member, no deposit is required. Your club credit will be available to use during your visit.
                      </p>
                   </div>
                </div>

                {/* CTA */}
                <button
                  id="confirm-btn"
                  onClick={handleConfirmBooking}
                  disabled={!canSubmit}
                  className="w-full bg-navy-deep text-gold-light font-bold text-[11px] uppercase tracking-[0.18em] py-4 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gold-light hover:text-navy-deep active:scale-[0.98] transition-all shadow-md disabled:opacity-40 mt-1"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {loading ? "Processing…" : "Confirm Reservation"}
                </button>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                  <span className="text-[11px] text-gray-400">
                    Priority member confirmation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────── Mobile sticky footer ─────────────── */}
      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.07)] lg:hidden">
        
        <div className="px-4 py-3 bg-navy-deep/5 border-b border-gray-100">
           <div className="flex items-center justify-between">
              <p className="text-[11px] text-gray-600 font-medium">
                No deposit required for members
              </p>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-navy-deep text-sm leading-none">
                  {venue.label}
                </p>
              </div>
           </div>
        </div>

        <div className="px-4 py-3">
          <button
            id="confirm-btn-mobile"
            onClick={handleConfirmBooking}
            disabled={!canSubmit}
            className="w-full bg-navy-deep text-gold-light font-bold text-[11px] uppercase tracking-[0.18em] py-4 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gold-light hover:text-navy-deep active:scale-[0.98] transition-all shadow-md disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {loading ? "Processing…" : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Small summary row helper ── */
function SummaryRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5 text-sm text-gray-600">
      {icon}
      <span>{label}</span>
    </li>
  );
}
