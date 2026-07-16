"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getEventById, rsvpToEvent, cancelEventRSVP } from "@/store/event/eventThunks";
import {
  selectCurrentEvent,
  selectEventLoading,
  selectEventError,
} from "@/store/event/eventSelectors";
import { clearCurrentEvent, clearEventError } from "@/store/event/eventSlice";

/* ─────────────────────────── helpers ─── */
function formatFullDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/* ─────────────────────── RSVP Confirm Modal ─── */
function RsvpModal({
  title,
  cancel,
  loading,
  onConfirm,
  onClose,
}: {
  title: string;
  cancel: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#10243F]/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full sm:max-w-sm rounded-2xl shadow-2xl border border-[rgba(212,175,55,0.2)] overflow-hidden">
        {/* Top accent */}
        <div className={`h-1 w-full ${cancel ? "bg-[#B42318]" : "bg-gradient-to-r from-[#10243F] to-[#B7922B]"}`} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                cancel ? "bg-[#ffdad6]" : "bg-[#F8F1DF]"
              }`}
            >
              {cancel ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-[#10243F] font-semibold text-lg leading-tight mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                {cancel ? "Cancel your RSVP?" : "Reserve your place"}
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                {cancel
                  ? `You will lose your spot for "${title}". This cannot be undone.`
                  : `Confirm your attendance for "${title}".`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-[#EDE3CC] text-[#4A4A4A] text-xs font-semibold tracking-[0.08em] uppercase hover:border-[#B7922B] transition-colors"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 py-3 rounded-lg text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 ${
                cancel
                  ? "bg-[#B42318] text-white hover:bg-[#93000a]"
                  : "bg-[#10243F] text-[#F1E0A6] border border-[rgba(183,146,43,0.5)] hover:bg-[#F1E0A6] hover:text-[#10243F]"
              }`}
            >
              {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />}
              {cancel ? "Cancel RSVP" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Toast ─── */
function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  return (
    <div
      className={`fixed bottom-36 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border text-sm font-medium ${
        type === "success"
          ? "bg-[#10243F] text-[#F1E0A6] border-[rgba(183,146,43,0.3)]"
          : "bg-[#B42318] text-white border-red-700"
      }`}
    >
      {type === "success" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}

/* ─────────────────────── Detail Info Row ─── */
function InfoRow({ icon, primary, secondary }: { icon: React.ReactNode; primary: string; secondary?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#B7922B] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[16px] leading-[1.7] text-[#B7922B] font-medium">{primary}</p>
        {secondary && <p className="text-sm text-[#6B7280]">{secondary}</p>}
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─── */
export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const event = useAppSelector(selectCurrentEvent);
  const loading = useAppSelector(selectEventLoading);
  const error = useAppSelector(selectEventError);

  const [modal, setModal] = useState<"rsvp" | "cancel" | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (id) dispatch(getEventById(id));
    return () => {
      dispatch(clearCurrentEvent());
      dispatch(clearEventError());
    };
  }, [id, dispatch]);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleRsvp = async () => {
    if (!id) return;
    setRsvpLoading(true);
    try {
      await dispatch(rsvpToEvent(id)).unwrap();
      setModal(null);
      setToast({ message: "You're confirmed! See you there.", type: "success" });
    } catch (err) {
      setModal(null);
      setToast({ message: (err as string) || "Failed to RSVP.", type: "error" });
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async () => {
    if (!id) return;
    setRsvpLoading(true);
    try {
      await dispatch(cancelEventRSVP(id)).unwrap();
      setModal(null);
      setToast({ message: "RSVP cancelled successfully.", type: "success" });
    } catch (err) {
      setModal(null);
      setToast({ message: (err as string) || "Failed to cancel RSVP.", type: "error" });
    } finally {
      setRsvpLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading && !event) {
    return (
      <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#F8F1DF] overflow-hidden shadow-2xl">
        {/* Skeleton hero */}
        <div className="h-[45vh] bg-[#EDE3CC] animate-pulse" />
        <div className="relative z-10 -mt-12 bg-white rounded-t-[2rem] px-6 py-8 min-h-[55vh]">
          <div className="space-y-4">
            <div className="h-5 bg-[#EDE3CC] rounded-full w-28 animate-pulse" />
            <div className="h-8 bg-[#EDE3CC] rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-[#EDE3CC] rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-[#EDE3CC] rounded w-full mt-6 animate-pulse" />
            <div className="h-3 bg-[#EDE3CC] rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!event && !loading) {
    return (
      <div className="relative w-full max-w-md mx-auto min-h-screen bg-[#F8F1DF] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="text-[#10243F] font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Event not found</p>
        <p className="text-[#6B7280] text-sm mb-6">This event may have been removed or is no longer available.</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded bg-[#10243F] text-[#F1E0A6] border border-[rgba(183,146,43,0.4)] text-xs font-semibold tracking-[0.08em] uppercase hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!event) return null;

  const rsvpPct = Math.min(Math.round((event.rsvp_count / event.max_attendees) * 100), 100);
  const isFull = event.rsvp_count >= event.max_attendees && !event.is_user_rsvped;
  const spotsLeft = Math.max(event.max_attendees - event.rsvp_count, 0);

  return (
    <>
      {/* ── Modals & Toasts ── */}
      {modal && (
        <RsvpModal
          title={event.title}
          cancel={modal === "cancel"}
          loading={rsvpLoading}
          onConfirm={modal === "cancel" ? handleCancelRsvp : handleRsvp}
          onClose={() => setModal(null)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* ── App Shell ── */}
      <main className="relative w-full max-w-md mx-auto min-h-screen bg-[#F8F1DF] overflow-hidden shadow-2xl pb-36">

        {/* ── Floating Back Button ── */}
        <button
          id="event-detail-back"
          aria-label="Go back"
          onClick={() => router.back()}
          className="absolute top-6 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(16,36,63,0.4)] backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-[rgba(16,36,63,0.65)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Hero Image ── */}
        <div className="relative w-full h-[45vh] bg-[#10243F]">
          {event.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#10243F] to-[#1E3A5F] flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(241,224,166,0.25)" strokeWidth="0.8">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,36,63,0.55)] via-transparent to-[rgba(16,36,63,0.75)]" />
        </div>

        {/* ── Content Card (overlapping) ── */}
        <div className="relative z-10 -mt-12 bg-white rounded-t-[2rem] px-6 py-8 border-t border-[rgba(183,146,43,0.3)] shadow-[0_-8px_30px_rgba(16,36,63,0.1)] min-h-[60vh]">

          {/* ── Status / Badge ── */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(254,214,91,0.15)] border border-[rgba(183,146,43,0.4)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#B7922B" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#B7922B]">
                {event.is_members_only ? "Premier Member Event" : "Open Event"}
              </span>
            </div>
            {event.is_user_rsvped && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold tracking-widest uppercase text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Confirmed
              </span>
            )}
            {!event.is_active && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EDE3CC] border border-[#B7922B]/30 text-[11px] font-semibold tracking-widest uppercase text-[#6B7280]">
                Inactive
              </span>
            )}
          </div>

          {/* ── Title ── */}
          <h1
            className="text-[#10243F] text-[36px] leading-[1.3] font-semibold mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {event.title}
          </h1>

          {/* ── Meta ── */}
          <div className="flex flex-col gap-4 mb-8">
            <InfoRow
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              primary={formatFullDate(event.event_date)}
              secondary={formatTime(event.event_time)}
            />
            <InfoRow
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              }
              primary={event.location}
              secondary="Coastal Club"
            />
          </div>

          {/* ── Ornamental Divider ── */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(183,146,43,0.4)] to-transparent my-8" />

          {/* ── Capacity Card ── */}
          <div className="mb-8 p-5 rounded-xl border border-[rgba(183,146,43,0.2)] bg-[rgba(248,241,223,0.5)] shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#10243F]">
                Guest Capacity
              </span>
              <span className="text-sm text-[#B7922B] font-semibold">
                {event.rsvp_count} / {event.max_attendees}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#EDE3CC] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  rsvpPct >= 90 ? "bg-[#B42318]" : rsvpPct >= 60 ? "bg-[#B7922B]" : "bg-[#10243F]"
                }`}
                style={{ width: `${rsvpPct}%` }}
              />
            </div>
            <p className="text-xs text-[#6B7280] mt-2 text-right">
              {isFull
                ? "Event is fully booked"
                : rsvpPct >= 80
                ? `Only ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left!`
                : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} available`}
            </p>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[#ffdad6] border border-[#B42318]/20 text-[#B42318] text-sm mb-6">
              <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{error}</span>
              <button onClick={() => dispatch(clearEventError())} className="ml-auto opacity-60 hover:opacity-100">✕</button>
            </div>
          )}

          {/* ── About ── */}
          <div className="space-y-4">
            <h2
              className="text-[22px] font-medium text-[#10243F]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              About the Evening
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#4A4A4A] whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="h-8" />
        </div>
      </main>

      {/* ── Sticky Action Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[rgba(183,146,43,0.2)] p-6 z-50 shadow-[0_-10px_40px_rgba(16,36,63,0.08)]">
        {event.is_user_rsvped ? (
          /* Already RSVP'd state */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              <span className="text-emerald-700 text-xs font-semibold tracking-[0.08em] uppercase">
                You're confirmed for this event
              </span>
            </div>
            <button
              id="event-detail-cancel-rsvp"
              onClick={() => setModal("cancel")}
              disabled={rsvpLoading}
              className="w-full py-3 bg-transparent text-[#6B7280] border border-transparent rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase hover:text-[#B42318] hover:bg-[rgba(180,35,24,0.05)] transition-all duration-200 disabled:opacity-50"
            >
              Cancel Existing RSVP
            </button>
          </div>
        ) : isFull ? (
          /* Full state */
          <div className="flex flex-col gap-3">
            <div className="w-full py-4 bg-[#EDE3CC] border border-[#B7922B]/30 rounded-lg text-center">
              <span className="text-[#6B7280] text-xs font-semibold tracking-[0.08em] uppercase">
                This event is fully booked
              </span>
            </div>
          </div>
        ) : !event.is_active ? (
          /* Inactive state */
          <div className="w-full py-4 bg-[#EDE3CC] border border-[#B7922B]/30 rounded-lg text-center">
            <span className="text-[#6B7280] text-xs font-semibold tracking-[0.08em] uppercase">
              Event not currently available
            </span>
          </div>
        ) : (
          /* CTA state */
          <div className="flex flex-col gap-3">
            <button
              id="event-detail-rsvp"
              onClick={() => setModal("rsvp")}
              disabled={rsvpLoading}
              className="w-full py-4 bg-[#10243F] text-[#F1E0A6] border border-[rgba(241,224,166,0.5)] rounded-lg text-[13px] font-semibold tracking-[0.08em] uppercase shadow-md hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {rsvpLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              ) : (
                <>
                  Reserve Your Place
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-[#6B7280]">
              {spotsLeft > 0 && `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining`}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
