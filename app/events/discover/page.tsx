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
function formatEventDate(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function formatEventTime(timeStr?: string | null) {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  const [h, m] = parts;
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function getMonthLabel(dateStr?: string | null): string {
  if (!dateStr) return "Date TBA";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
/** Only "full" when a non-zero cap is set AND rsvp_count has reached it */
function isEventFull(event: ClubEvent) {
  if (event.is_user_rsvped) return false;
  if (!event.max_attendees || event.max_attendees === 0) return false;
  return event.rsvp_count >= event.max_attendees;
}

type FilterTab = "all" | "members" | "open" | "rsvped";

/* ─────────────────────────────── Toast ─── */
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
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl border text-sm font-medium transition-all ${
        type === "success"
          ? "bg-[#10243F] text-[#F1E0A6] border-[rgba(183,146,43,0.4)]"
          : "bg-[#B42318] text-white border-red-700/50"
      }`}
    >
      {type === "success" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        ✕
      </button>
    </div>
  );
}

/* ─────────────────────────────── EventCard ─── */
function EventCard({
  event,
  onRsvp,
  rsvpLoading,
}: {
  event: ClubEvent;
  onRsvp: (id: string, cancel: boolean) => void;
  rsvpLoading: boolean;
}) {
  const dateLabel = formatEventDate(event.event_date);
  const timeLabel = formatEventTime(event.event_time);
  const full = isEventFull(event);
  const hasCapacity = event.max_attendees > 0;
  const rsvpPct = hasCapacity
    ? Math.min(Math.round((event.rsvp_count / event.max_attendees) * 100), 100)
    : 0;

  return (
    <article className="group relative flex flex-col bg-[#0a1628]/80 border border-[rgba(241,224,166,0.08)] rounded-2xl overflow-hidden transition-all duration-500 hover:border-[rgba(241,224,166,0.22)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
      {/* Image / placeholder */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d1f35] to-[#162d48] flex items-center justify-center">
            {/* decorative cigar icon */}
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(241,224,166,0.15)" strokeWidth="0.7">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-60" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase border backdrop-blur-sm ${
              event.is_members_only
                ? "bg-[#10243F]/90 text-[#F1E0A6] border-[rgba(183,146,43,0.35)]"
                : "bg-white/10 text-white border-white/20"
            }`}
          >
            {event.is_members_only ? "Members Only" : "Open Event"}
          </span>
        </div>

        {/* RSVP'd badge */}
        {event.is_user_rsvped && (
          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Going
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Date / time */}
        <div className="flex items-center gap-2 mb-3">
          {dateLabel ? (
            <span className="text-[#B7922B] text-[12px] font-semibold tracking-[0.08em] uppercase">
              {dateLabel}{timeLabel ? ` · ${timeLabel}` : ""}
            </span>
          ) : (
            <span className="text-white/30 text-[11px] font-semibold tracking-[0.1em] uppercase">
              Date TBA
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-white text-[20px] leading-tight mb-2 group-hover:text-[#F1E0A6] transition-colors duration-300"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-1.5 text-white/35 text-xs mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(241,224,166,0.07)] mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          {/* Capacity */}
          <div className="flex-1 min-w-0">
            {hasCapacity ? (
              <>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/30 text-[11px]">
                    {event.rsvp_count} / {event.max_attendees} attending
                  </span>
                  {rsvpPct >= 80 && (
                    <span className="text-[10px] text-[#B42318] font-semibold tracking-wide">
                      {full ? "Full" : "Almost full"}
                    </span>
                  )}
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      rsvpPct >= 90 ? "bg-[#B42318]" : rsvpPct >= 60 ? "bg-[#B7922B]" : "bg-[#F1E0A6]/60"
                    }`}
                    style={{ width: `${rsvpPct}%` }}
                  />
                </div>
              </>
            ) : (
              <span className="text-white/25 text-[11px]">Open attendance</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/events/discover/${event.id}`}
              className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#F1E0A6]/50 hover:text-[#F1E0A6] transition-colors"
            >
              Details
            </Link>
            {event.is_user_rsvped ? (
              <button
                onClick={() => onRsvp(event.id, true)}
                disabled={rsvpLoading}
                className="px-4 py-2 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase bg-[#F1E0A6]/15 text-[#F1E0A6] border border-[rgba(241,224,166,0.25)] hover:bg-[#F1E0A6]/25 transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                {rsvpLoading && (
                  <span className="h-3 w-3 rounded-full border-2 border-[#F1E0A6]/30 border-t-[#F1E0A6] animate-spin" />
                )}
                Going ✓
              </button>
            ) : full ? (
              <span className="px-4 py-2 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase text-white/30 border border-white/10 cursor-not-allowed">
                Full
              </span>
            ) : !event.is_active ? (
              <span className="px-4 py-2 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase text-white/25 border border-white/10 cursor-not-allowed">
                Unavailable
              </span>
            ) : (
              <button
                onClick={() => onRsvp(event.id, false)}
                disabled={rsvpLoading}
                className="px-4 py-2 rounded-lg text-[11px] font-semibold tracking-[0.08em] uppercase bg-[#10243F] text-[#F1E0A6] border border-[rgba(183,146,43,0.4)] hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5"
              >
                {rsvpLoading && (
                  <span className="h-3 w-3 rounded-full border-2 border-[#F1E0A6]/30 border-t-[#F1E0A6] animate-spin" />
                )}
                RSVP
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
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
    return () => {
      dispatch(clearEventError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === "members") return ev.is_members_only;
      if (filter === "open") return !ev.is_members_only;
      if (filter === "rsvped") return ev.is_user_rsvped;
      return true;
    });
  }, [events, search, filter]);

  /** Group by month label: "Date TBA" | "January 2026" … */
  const grouped = useMemo(() => {
    const map = new Map<string, ClubEvent[]>();
    filtered.forEach((ev) => {
      const key = getMonthLabel(ev.event_date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    // Sort: TBA last, real months chronologically
    const sorted = [...map.entries()].sort(([a], [b]) => {
      if (a === "Date TBA") return 1;
      if (b === "Date TBA") return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    });
    return sorted;
  }, [filtered]);

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

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Events" },
    { key: "members", label: "Members Only" },
    { key: "open", label: "Open" },
    { key: "rsvped", label: "My RSVPs" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .ev-fade-1 { opacity:0; animation: fadeInUp 0.9s ease-out 0.15s forwards; }
          .ev-fade-2 { opacity:0; animation: fadeInUp 0.9s ease-out 0.35s forwards; }
          .ev-fade-3 { opacity:0; animation: fadeInUp 0.9s ease-out 0.55s forwards; }
        `
      }} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative w-full h-[62vh] min-h-[420px] flex items-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1800&q=85')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111e] via-[rgba(6,17,30,0.65)] to-[rgba(6,17,30,0.35)]" />
          {/* Subtle noise grain */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5 ev-fade-1">
            <span className="w-8 h-px bg-[#F1E0A6]" />
            <span className="text-[12px] uppercase tracking-[0.12em] font-semibold text-[#F1E0A6]">
              Estrella del Mar · Social Calendar
            </span>
          </div>

          <h1
            className="text-white mb-5 drop-shadow-lg ev-fade-2 leading-tight"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Curated{" "}
            <span className="bg-gradient-to-br from-[#F1E0A6] to-[#B7922B] bg-clip-text text-transparent italic pr-2">
              Experiences
            </span>
          </h1>

          <p className="text-white/70 text-lg max-w-2xl leading-relaxed ev-fade-3">
            Exclusive gatherings, culinary journeys, and cultural events crafted for the
            discerning members of Coastal Club.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="bg-[#06111e] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#B42318]/10 border border-[#B42318]/25 text-[#ff8a7a] text-sm mb-8">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
              <button onClick={() => dispatch(clearEventError())} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">✕</button>
            </div>
          )}

          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-5">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="search-events"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full bg-white/5 border border-[rgba(241,224,166,0.1)] text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[rgba(241,224,166,0.35)] focus:ring-1 focus:ring-[rgba(241,224,166,0.15)] transition-all placeholder:text-white/25"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 border ${
                    filter === key
                      ? "bg-[#F1E0A6] text-[#10243F] border-[#F1E0A6]"
                      : "border-[rgba(241,224,166,0.15)] bg-transparent text-white/50 hover:border-[rgba(241,224,166,0.35)] hover:text-white/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && events.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/5 border border-[rgba(241,224,166,0.06)] overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-white/8" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-white/10 rounded w-1/4" />
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/8 rounded w-full" />
                    <div className="h-3 bg-white/8 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F1E0A6]/5 border border-[rgba(241,224,166,0.1)] flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(241,224,166,0.4)" strokeWidth="1.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p
                className="text-white text-xl font-semibold mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                No events found
              </p>
              <p className="text-white/40 text-sm">
                {search ? `No results for "${search}".` : "Check back soon for upcoming events."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 text-xs font-semibold tracking-widest uppercase text-[#B7922B] hover:text-[#F1E0A6] underline underline-offset-4 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* ── Month-grouped event list ─────────────────────────── */}
          {filtered.length > 0 && (
            <div className="space-y-14">
              {grouped.map(([month, monthEvents]) => (
                <div key={month}>
                  {/* Month header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-px bg-[#B7922B]" />
                      <h2
                        className="text-[#F1E0A6] text-[22px] font-medium"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {month}
                      </h2>
                    </div>
                    <div className="flex-1 h-px bg-[rgba(241,224,166,0.07)]" />
                    <span className="text-white/25 text-xs font-semibold tracking-[0.1em] uppercase">
                      {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {monthEvents.map((ev) => (
                      <EventCard
                        key={ev.id}
                        event={ev}
                        onRsvp={handleRsvp}
                        rsvpLoading={rsvpLoadingId === ev.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom spacer */}
          <div className="h-20" />
        </div>
      </div>
    </>
  );
}
