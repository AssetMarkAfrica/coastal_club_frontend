"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getEvents, rsvpToEvent, cancelEventRSVP } from "@/store/event/eventThunks";
import {
  selectEvents,
  selectEventLoading,
  selectEventError,
} from "@/store/event/eventSelectors";
import { clearEventError } from "@/store/event/eventSlice";
import type { ClubEvent } from "@/types/event";

/* ─────────────────────────────────── helpers ─── */
function formatEventDate(dateStr: string, timeStr: string) {
  const date = new Date(`${dateStr}T${timeStr}`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function formatEventTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

type FilterTab = "all" | "upcoming" | "members" | "open";

/* ─────────────────────────────── EventCard ─── */
function EventCard({
  event,
  featured,
  onRsvp,
  rsvpLoading,
}: {
  event: ClubEvent;
  featured?: boolean;
  onRsvp: (id: string, cancel: boolean) => void;
  rsvpLoading: boolean;
}) {
  const dateLabel = `${formatEventDate(event.event_date, event.event_time)} · ${formatEventTime(event.event_time)}`;
  const rsvpPct = event.max_attendees > 0
    ? Math.min(Math.round((event.rsvp_count / event.max_attendees) * 100), 100)
    : 0;
  const isFull = event.rsvp_count >= event.max_attendees && !event.is_user_rsvped;

  return (
    <article
      className={`group bg-white rounded-xl border border-[rgba(212,175,55,0.25)] shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(16,36,63,0.12)] hover:border-[rgba(212,175,55,0.6)] flex ${
        featured ? "flex-col md:flex-row col-span-1 md:col-span-2" : "flex-col"
      }`}
    >
      {/* Image */}
      <div className={`relative shrink-0 ${featured ? "md:w-1/2 h-64 md:h-auto" : "h-52"}`}>
        {event.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#10243F] to-[#1E3A5F] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(241,224,166,0.4)" strokeWidth="1">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase border backdrop-blur-sm ${
              event.is_members_only
                ? "bg-[#10243F]/90 text-[#F1E0A6] border-[rgba(183,146,43,0.3)]"
                : "bg-white/90 text-[#10243F] border-[rgba(183,146,43,0.3)]"
            }`}
          >
            {event.is_members_only ? "Members Only" : "Open"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={`flex flex-col justify-between p-6 ${featured ? "md:w-1/2" : "flex-1"}`}>
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[13px] font-semibold tracking-[0.08em] uppercase text-[#B7922B]">
              {dateLabel}
            </span>
          </div>
          <h3
            className={`text-[#10243F] mb-2 leading-tight ${
              featured ? "text-[28px] font-semibold" : "text-[22px] font-medium"
            }`}
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {event.title}
          </h3>
          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4 line-clamp-3">
            {event.description}
          </p>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-4">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EDE3CC] pt-4 flex items-center justify-between gap-4">
          {/* Capacity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{event.rsvp_count}/{event.max_attendees} Attending</span>
            </div>
            <div className="w-full h-1 bg-[#EDE3CC] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  rsvpPct >= 90 ? "bg-[#B42318]" : rsvpPct >= 60 ? "bg-[#B7922B]" : "bg-[#10243F]"
                }`}
                style={{ width: `${rsvpPct}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/events/discover/${event.id}`}
              className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6B7280] hover:text-[#10243F] transition-colors"
            >
              Details
            </Link>
            {event.is_user_rsvped ? (
              <button
                onClick={() => onRsvp(event.id, true)}
                disabled={rsvpLoading}
                className="px-4 py-2 rounded text-[11px] font-semibold tracking-[0.08em] uppercase bg-[#F1E0A6] text-[#10243F] border border-[#B7922B]/40 hover:bg-[#EDE3CC] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {rsvpLoading && (
                  <span className="h-3 w-3 rounded-full border-2 border-[#10243F]/30 border-t-[#10243F] animate-spin" />
                )}
                Going ✓
              </button>
            ) : isFull ? (
              <span className="px-4 py-2 rounded text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6B7280] border border-[#EDE3CC] cursor-not-allowed">
                Full
              </span>
            ) : (
              <button
                onClick={() => onRsvp(event.id, false)}
                disabled={rsvpLoading}
                className="px-4 py-2 rounded text-[11px] font-semibold tracking-[0.08em] uppercase bg-[#10243F] text-[#F1E0A6] border border-[rgba(183,146,43,0.4)] hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5"
              >
                {rsvpLoading && (
                  <span className="h-3 w-3 rounded-full border-2 border-[#F1E0A6]/30 border-t-[#F1E0A6] animate-spin" />
                )}
                RSVP Now
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────── Toast ─── */
function Toast({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border text-sm font-medium transition-all ${
        type === "success"
          ? "bg-[#10243F] text-[#F1E0A6] border-[rgba(183,146,43,0.3)]"
          : "bg-[#B42318] text-white border-red-700"
      }`}
    >
      {type === "success" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}

/* ─────────────────────────────── Page ─── */
export default function DiscoverEventsPage() {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventLoading);
  const error = useAppSelector(selectEventError);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [rsvpLoadingId, setRsvpLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    dispatch(getEvents());
    return () => { dispatch(clearEventError()); };
  }, [dispatch]);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const now = new Date();
    return events.filter((ev) => {
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "upcoming") return new Date(ev.event_date) >= now;
      if (filter === "members") return ev.is_members_only;
      if (filter === "open") return !ev.is_members_only;
      return true;
    });
  }, [events, search, filter]);

  const handleRsvp = async (id: string, cancel: boolean) => {
    setRsvpLoadingId(id);
    try {
      if (cancel) {
        await dispatch(cancelEventRSVP(id)).unwrap();
        setToast({ message: "RSVP cancelled.", type: "success" });
      } else {
        await dispatch(rsvpToEvent(id)).unwrap();
        setToast({ message: "You're confirmed! See you there.", type: "success" });
      }
    } catch (err) {
      setToast({ message: (err as string) || "Something went wrong.", type: "error" });
    } finally {
      setRsvpLoadingId(null);
    }
  };

  const filters: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Events" },
    { key: "upcoming", label: "Upcoming" },
    { key: "members", label: "Members Only" },
    { key: "open", label: "Open" },
  ];

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative w-full h-[58vh] min-h-[380px] flex items-end pb-12 px-6">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10243F] via-[rgba(16,36,63,0.6)] to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[rgba(183,146,43,0.2)] border border-[rgba(183,146,43,0.5)] rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase text-[#F1E0A6] mb-4 backdrop-blur-sm">
            Social Calendar
          </span>
          <h1
            className="text-[48px] font-bold leading-[1.2] text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Curated Experiences
          </h1>
          <p className="text-[16px] leading-[1.7] text-[rgba(248,241,223,0.9)] max-w-2xl">
            Discover exclusive gatherings, culinary journeys, and cultural events designed for
            the discerning members of Coastal Club.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="px-6 py-12 flex-1 max-w-7xl mx-auto w-full">

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-[#ffdad6] border border-[#B42318]/20 text-[#B42318] text-sm mb-8">
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>{error}</span>
            <button onClick={() => dispatch(clearEventError())} className="ml-auto text-[#B42318]/60 hover:text-[#B42318]">✕</button>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="relative w-full lg:w-96">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10243F]/40"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-events"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="w-full bg-[rgba(237,227,204,0.3)] border border-[#EDE3CC] text-[#10243F] rounded pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#10243F] focus:ring-1 focus:ring-[rgba(183,146,43,0.6)] transition-all placeholder:text-[#10243F]/40"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${
                  filter === key
                    ? "bg-[#10243F] text-[#F1E0A6] border border-[#10243F]"
                    : "border border-[rgba(183,146,43,0.3)] bg-white text-[#10243F] hover:border-[#B7922B]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && events.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl bg-white border border-[rgba(212,175,55,0.15)] shadow-sm overflow-hidden animate-pulse ${
                  i === 0 ? "col-span-1 md:col-span-2" : ""
                }`}
              >
                <div className={`bg-[#EDE3CC] ${i === 0 ? "h-64" : "h-52"}`} />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-[#EDE3CC] rounded w-1/3" />
                  <div className="h-5 bg-[#EDE3CC] rounded w-2/3" />
                  <div className="h-3 bg-[#EDE3CC] rounded w-full" />
                  <div className="h-3 bg-[#EDE3CC] rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8F1DF] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-[#10243F] font-semibold text-lg mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
              No events found
            </p>
            <p className="text-[#6B7280] text-sm">
              {search ? `No results for "${search}".` : "Check back soon for upcoming events."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-semibold tracking-widest uppercase text-[#B7922B] hover:text-[#10243F] underline underline-offset-2 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Events grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ev, idx) => (
              <EventCard
                key={ev.id}
                event={ev}
                featured={idx === 0}
                onRsvp={handleRsvp}
                rsvpLoading={rsvpLoadingId === ev.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
