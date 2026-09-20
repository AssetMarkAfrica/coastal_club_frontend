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
import type { ClubEvent } from "@/types/event";

/* ─────────────────────────── helpers ─── */
function formatFullDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function formatTime(timeStr: string | null | undefined) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
/** Only "full" when a non-zero cap is set AND count has reached it */
function isEventFull(event: ClubEvent) {
  if (event.is_user_rsvped) return false;
  if (!event.max_attendees || event.max_attendees === 0) return false;
  return event.rsvp_count >= event.max_attendees;
}

/* ─────────────────────── Modal ─── */
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1f35] w-full sm:max-w-sm rounded-2xl shadow-2xl border border-[rgba(241,224,166,0.12)] overflow-hidden">
        <div className={`h-[2px] w-full ${cancel ? "bg-[#B42318]" : "bg-gradient-to-r from-[#B7922B] to-[#F1E0A6]"}`} />
        <div className="p-7">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                cancel ? "bg-[#B42318]/15 border border-[#B42318]/30" : "bg-[#F1E0A6]/10 border border-[rgba(241,224,166,0.2)]"
              }`}
            >
              {cancel ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1E0A6" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg leading-tight mb-1.5" style={{ fontFamily: "var(--font-playfair)" }}>
                {cancel ? "Cancel your RSVP?" : "Reserve your place"}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {cancel
                  ? `You will lose your spot for "${title}". This cannot be undone.`
                  : `Confirm your attendance for "${title}".`}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[rgba(241,224,166,0.12)] text-white/60 text-xs font-semibold tracking-[0.08em] uppercase hover:border-[rgba(241,224,166,0.3)] hover:text-white transition-all"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 ${
                cancel
                  ? "bg-[#B42318] text-white hover:bg-[#93000a]"
                  : "bg-[#F1E0A6] text-[#10243F] hover:bg-white"
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
function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border text-sm font-medium ${
        type === "success"
          ? "bg-[#10243F] text-[#F1E0A6] border-[rgba(183,146,43,0.4)]"
          : "bg-[#B42318] text-white border-red-700/50"
      }`}
    >
      {type === "success" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
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

  /* ── Loading skeleton ── */
  if (loading && !event) {
    return (
      <div className="min-h-screen bg-[#06111e] animate-pulse">
        <div className="h-[50vh] bg-white/5" />
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-5">
          <div className="h-4 bg-white/8 rounded w-24" />
          <div className="h-10 bg-white/8 rounded w-3/4" />
          <div className="h-10 bg-white/6 rounded w-1/2" />
          <div className="h-3 bg-white/6 rounded w-full mt-8" />
          <div className="h-3 bg-white/6 rounded w-5/6" />
          <div className="h-3 bg-white/6 rounded w-4/5" />
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!event && !loading) {
    return (
      <div className="min-h-screen bg-[#06111e] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#B42318]/10 border border-[#B42318]/25 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="text-white font-semibold text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Event not found
        </p>
        <p className="text-white/40 text-sm mb-8">
          This event may have been removed or is no longer available.
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-3.5 rounded-full bg-[#F1E0A6] text-[#10243F] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-white transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!event) return null;

  const dateLabel = formatFullDate(event.event_date);
  const timeLabel = formatTime(event.event_time);
  const full = isEventFull(event);
  const hasCapacity = event.max_attendees > 0;
  const rsvpPct = hasCapacity
    ? Math.min(Math.round((event.rsvp_count / event.max_attendees) * 100), 100)
    : 0;
  const spotsLeft = hasCapacity ? Math.max(event.max_attendees - event.rsvp_count, 0) : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .ed-fade-1 { opacity:0; animation: fadeInUp 0.8s ease-out 0.1s forwards; }
          .ed-fade-2 { opacity:0; animation: fadeInUp 0.8s ease-out 0.25s forwards; }
          .ed-fade-3 { opacity:0; animation: fadeInUp 0.8s ease-out 0.4s forwards; }
          .ed-fade-4 { opacity:0; animation: fadeInUp 0.8s ease-out 0.55s forwards; }
        `
      }} />

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

      <div className="min-h-screen bg-[#06111e]">

        {/* ── Hero ── */}
        <div className="relative w-full h-[55vh] min-h-[380px] overflow-hidden">
          {event.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0d1f35] to-[#162d48] flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(241,224,166,0.1)" strokeWidth="0.6">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          )}
          {/* Cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111e] via-[rgba(6,17,30,0.5)] to-[rgba(6,17,30,0.2)]" />

          {/* Floating back button */}
          <button
            id="event-detail-back"
            aria-label="Go back"
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white hover:bg-black/50 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* ── Content ── */}
        <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-10 pb-40">

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6 ed-fade-1">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase border backdrop-blur-sm ${
                event.is_members_only
                  ? "bg-[#10243F]/90 text-[#F1E0A6] border-[rgba(183,146,43,0.35)]"
                  : "bg-white/10 text-white border-white/20"
              }`}
            >
              {event.is_members_only ? "Premier Member Event" : "Open Event"}
            </span>
            {event.is_user_rsvped && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Confirmed
              </span>
            )}
            {!event.is_active && (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase text-white/40 border border-white/15">
                Inactive
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-white text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold mb-8 ed-fade-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {event.title}
          </h1>

          {/* Gold divider */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#B7922B] to-[#F1E0A6] mb-8 ed-fade-2" />

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ed-fade-3">
            {/* Date / Time */}
            <div className="flex items-start gap-4 bg-white/[0.03] border border-[rgba(241,224,166,0.07)] rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-[#F1E0A6]/10 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F1E0A6" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-white/30 mb-1">Date &amp; Time</p>
                <p className="text-white font-medium text-sm">
                  {dateLabel ?? <span className="text-white/40 italic">Date TBA</span>}
                </p>
                {timeLabel && (
                  <p className="text-[#B7922B] text-sm mt-0.5">{timeLabel}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 bg-white/[0.03] border border-[rgba(241,224,166,0.07)] rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-[#F1E0A6]/10 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F1E0A6" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-white/30 mb-1">Location</p>
                <p className="text-white font-medium text-sm">
                  {event.location || <span className="text-white/40 italic">Coastal Club</span>}
                </p>
                <p className="text-[#B7922B] text-sm mt-0.5">Estrella del Mar</p>
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#B42318]/10 border border-[#B42318]/25 text-[#ff8a7a] text-sm mb-8 ed-fade-3">
              <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
              <button onClick={() => dispatch(clearEventError())} className="ml-auto opacity-60 hover:opacity-100">✕</button>
            </div>
          )}

          {/* Capacity */}
          {hasCapacity && (
            <div className="mb-10 p-6 rounded-xl border border-[rgba(241,224,166,0.08)] bg-white/[0.03] ed-fade-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.1em] text-white/40">Guest Capacity</span>
                <span className="text-[#B7922B] text-sm font-semibold">
                  {event.rsvp_count} / {event.max_attendees}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    rsvpPct >= 90 ? "bg-[#B42318]" : rsvpPct >= 60 ? "bg-[#B7922B]" : "bg-[#F1E0A6]/70"
                  }`}
                  style={{ width: `${rsvpPct}%` }}
                />
              </div>
              <p className="text-xs text-white/30 text-right">
                {full
                  ? "Event is fully booked"
                  : rsvpPct >= 80
                  ? `Only ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining!`
                  : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} available`}
              </p>
            </div>
          )}

          {/* About */}
          <div className="ed-fade-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-[#B7922B]" />
              <span className="text-[12px] uppercase tracking-[0.1em] font-semibold text-[#B7922B]">About</span>
            </div>
            <h2
              className="text-white text-[28px] font-medium mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              About the Evening
            </h2>
            <p className="text-white/60 text-[16px] leading-[1.85] whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* ── Sticky CTA footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#06111e]/95 backdrop-blur-xl border-t border-[rgba(241,224,166,0.08)] p-5 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
          <div className="max-w-3xl mx-auto">
            {event.is_user_rsvped ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 py-3.5 bg-emerald-900/30 border border-emerald-700/40 rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-400 text-xs font-semibold tracking-[0.08em] uppercase">
                    You&apos;re confirmed for this event
                  </span>
                </div>
                <button
                  id="event-detail-cancel-rsvp"
                  onClick={() => setModal("cancel")}
                  disabled={rsvpLoading}
                  className="w-full py-3 text-white/35 hover:text-[#B42318] text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors disabled:opacity-50"
                >
                  Cancel Existing RSVP
                </button>
              </div>
            ) : full ? (
              <div className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-white/30 text-xs font-semibold tracking-[0.1em] uppercase">
                  This event is fully booked
                </span>
              </div>
            ) : !event.is_active ? (
              <div className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-white/30 text-xs font-semibold tracking-[0.1em] uppercase">
                  Event not currently available
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  id="event-detail-rsvp"
                  onClick={() => setModal("rsvp")}
                  disabled={rsvpLoading}
                  className="w-full py-4 bg-[#F1E0A6] text-[#10243F] rounded-xl text-[13px] font-semibold tracking-[0.08em] uppercase shadow-lg hover:bg-white transition-all duration-300 flex justify-center items-center gap-2.5 disabled:opacity-60"
                >
                  {rsvpLoading ? (
                    <span className="h-4 w-4 rounded-full border-2 border-[#10243F]/30 border-t-[#10243F] animate-spin" />
                  ) : (
                    <>
                      Reserve Your Place
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
                {spotsLeft !== null && spotsLeft > 0 && (
                  <p className="text-center text-[11px] text-white/30">
                    {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} remaining
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
