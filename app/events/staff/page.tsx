"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllEvents, deactivateEvent } from "@/store/event/eventThunks";
import {
  selectStaffEvents,
  selectEventLoading,
  selectEventError,
} from "@/store/event/eventSelectors";
import { clearEventError } from "@/store/event/eventSlice";
import type { ClubEvent } from "@/types/event";

/* â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m));
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

type FilterTab = "all" | "active" | "inactive";

/* â”€â”€ Status badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-text-secondary text-xs font-semibold tracking-wide border border-outline-variant">
      <span className="w-1.5 h-1.5 rounded-full bg-text-secondary" />
      Inactive
    </span>
  );
}

/* â”€â”€ RSVP Progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function RSVPProgress({ rsvpCount, maxAttendees }: { rsvpCount: number; maxAttendees: number }) {
  const pct = maxAttendees > 0 ? Math.min((rsvpCount / maxAttendees) * 100, 100) : 0;
  const barColor =
    pct >= 90 ? "bg-danger" : pct >= 60 ? "bg-gold-muted" : "bg-navy-deep";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-cream-dark rounded-full overflow-hidden w-24">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-navy-deep whitespace-nowrap">
        {rsvpCount}/{maxAttendees}
      </span>
    </div>
  );
}

/* â”€â”€ Confirm deactivate modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function DeactivateModal({
  event,
  onConfirm,
  onCancel,
  loading,
}: {
  event: ClubEvent;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gold-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B42318" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 className="font-semibold text-navy-deep text-lg leading-tight">Deactivate Event?</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          <span className="font-semibold text-navy-deep">{event.title}</span> will be deactivated and hidden from members. This action can be reversed by editing the event.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded border border-cream-dark text-text-secondary text-sm font-medium hover:border-gold-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : null}
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function StaffEventsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const events = useAppSelector(selectStaffEvents);
  const loading = useAppSelector(selectEventLoading);
  const error = useAppSelector(selectEventError);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [deactivatingEvent, setDeactivatingEvent] = useState<ClubEvent | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list = events;
    if (activeTab === "active") list = list.filter((e) => e.is_active);
    if (activeTab === "inactive") list = list.filter((e) => !e.is_active);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [events, activeTab, search]);

  const handleDeactivate = async () => {
    if (!deactivatingEvent) return;
    setIsDeactivating(true);
    try {
      await dispatch(deactivateEvent(deactivatingEvent.id)).unwrap();
    } finally {
      setIsDeactivating(false);
      setDeactivatingEvent(null);
    }
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Events" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <>
      {deactivatingEvent && (
        <DeactivateModal
          event={deactivatingEvent}
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivatingEvent(null)}
          loading={isDeactivating}
        />
      )}

      {/* â”€â”€ Top bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="flex justify-between items-center w-full px-6 lg:px-8 h-16 bg-white/95 backdrop-blur-md shadow-sm shadow-navy-deep/5 z-10 shrink-0 border-b border-gold-muted/15">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-cream border border-cream-dark text-text-primary rounded text-sm focus:outline-none focus:border-navy-deep transition-colors placeholder:text-text-muted"
            placeholder="Search events..."
          />
        </div>
        <div className="flex items-center gap-4 ml-4">
          <Link
            href="/events/staff/create"
            className="flex items-center gap-2 bg-navy-deep text-gold-light border border-gold-muted px-5 py-2 rounded text-xs font-semibold tracking-widest uppercase hover:bg-gold-light hover:text-navy-deep transition-colors shadow-md shadow-navy-deep/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Create Event
          </Link>
        </div>
      </header>

      {/* â”€â”€ Main canvas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Page header */}
          <div>
            <h1 className="text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
              Event Management
            </h1>
            <p className="text-sm text-text-muted mt-1">Manage club events, RSVPs, and schedules.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-error-container border border-danger/20 text-danger text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
              <button onClick={() => dispatch(clearEventError())} className="ml-auto text-danger/60 hover:text-danger">âœ•</button>
            </div>
          )}

          {/* Filter bar */}
          <div className="bg-white shadow-[0_4px_24px_rgba(30,58,95,0.08)] border border-gold-muted/20 rounded-lg p-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors border ${
                    activeTab === t.key
                      ? "bg-navy-deep text-white border-navy-deep"
                      : "bg-cream text-text-secondary border-cream-dark hover:border-gold-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Table */}
          <div className="bg-white shadow-[0_4px_24px_rgba(30,58,95,0.08)] border border-gold-muted/20 rounded-lg overflow-hidden">
            {loading && events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="h-8 w-8 rounded-full border-4 border-gold-muted/30 border-t-gold-muted animate-spin" />
                <p className="text-sm text-text-muted">Loading eventsâ€¦</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <p className="text-sm font-medium">No events found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-navy-deep to-primary-container text-gold-light text-xs font-semibold tracking-widest uppercase border-b-2 border-gold-muted">
                      <th className="p-4">Event Details</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">RSVPs</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((event, idx) => (
                      <tr
                        key={event.id}
                        className={`border-b border-cream-dark hover:bg-cream/40 transition-colors group ${idx % 2 === 0 ? "bg-white" : "bg-cream/10"}`}
                      >
                        {/* Event details */}
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-lg bg-cream-dark/40 flex items-center justify-center shrink-0 border border-gold-muted/20">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10243F" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                            <div>
                              <p className="font-semibold text-navy-deep text-[15px] leading-tight mb-0.5">{event.title}</p>
                              <p className="text-xs text-text-muted flex items-center gap-1">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                {event.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="p-4 align-middle">
                          <p className="font-medium text-navy-deep text-sm">{formatDate(event.event_date)}</p>
                          <p className="text-xs text-text-muted">{formatTime(event.event_time)}</p>
                        </td>

                        {/* RSVPs */}
                        <td className="p-4 align-middle min-w-[160px]">
                          <RSVPProgress rsvpCount={event.rsvp_count} maxAttendees={event.max_attendees} />
                        </td>

                        {/* Visibility */}
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cream border border-gold-muted/30 text-xs font-medium text-text-secondary">
                            {event.is_members_only ? (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                Members Only
                              </>
                            ) : (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                Public
                              </>
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4 align-middle">
                          <StatusBadge isActive={event.is_active} />
                        </td>

                        {/* Actions */}
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/events/staff/${event.id}`)}
                              title="View / Edit"
                              className="p-2 rounded text-text-muted hover:text-navy-deep hover:bg-cream transition-colors"
                            >
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </button>
                            {event.is_active && (
                              <button
                                onClick={() => setDeactivatingEvent(event)}
                                title="Deactivate"
                                className="p-2 rounded text-text-muted hover:text-danger hover:bg-error-container/30 transition-colors"
                              >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

