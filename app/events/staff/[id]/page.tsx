"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getStaffEventById,
  updateEvent,
  deactivateEvent,
} from "@/store/event/eventThunks";
import {
  selectCurrentEvent,
  selectEventLoading,
  selectEventError,
} from "@/store/event/eventSelectors";
import { clearEventError, clearCurrentEvent } from "@/store/event/eventSlice";
import type { UpdateEventPayload } from "@/types/event";

/* ── helpers ─────────────────────────────────────────── */
function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
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

/* ── Field components ─────────────────────────────────── */
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-text-secondary mb-2"
    >
      {children}
    </label>
  );
}

function inputCls(error?: boolean) {
  return `w-full bg-cream border ${error ? "border-danger" : "border-cream-dark"} rounded px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-navy-deep focus:ring-2 focus:ring-navy-deep/10 transition-colors placeholder:text-text-muted`;
}

function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-cream-dark last:border-0">
      <div>
        <p className="text-sm font-medium text-navy-deep">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-muted ${
          checked ? "bg-navy-deep border-navy-deep" : "bg-cream-dark border-cream-dark"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ${
            checked ? "translate-x-5 bg-gold-light" : "translate-x-0.5 bg-white"
          } mt-0.5`}
        />
      </button>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gold-muted/20 shadow-[0_4px_24px_rgba(30,58,95,0.07)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-muted/50">
      <h2
        className="flex items-center gap-2 text-xl font-medium text-navy-deep mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <span className="text-gold-muted">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ── Deactivate Modal ─────────────────────────────────── */
function DeactivateModal({
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
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
          <span className="font-semibold text-navy-deep">{title}</span> will be hidden from members. You can reactivate it by toggling the status below.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded border border-cream-dark text-text-secondary text-sm font-medium hover:border-gold-muted transition-colors">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Success toast ────────────────────────────────────── */
function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-navy-deep text-gold-light px-5 py-3 rounded-full shadow-2xl border border-gold-muted/30 text-sm font-medium">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      {message}
      <button onClick={onDismiss} className="ml-2 text-gold-muted hover:text-gold-light">✕</button>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function StaffEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const event = useAppSelector(selectCurrentEvent);
  const loading = useAppSelector(selectEventLoading);
  const serverError = useAppSelector(selectEventError);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    max_attendees: "",
    is_members_only: false,
    is_active: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) dispatch(getStaffEventById(id));
    return () => { dispatch(clearCurrentEvent()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        event_time: event.event_time.slice(0, 5),
        location: event.location,
        max_attendees: String(event.max_attendees),
        is_members_only: event.is_members_only,
        is_active: event.is_active,
      });
    }
  }, [event]);

  const setField = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setFieldErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof fieldErrors = {};
    if (!form.title.trim()) e.title = "Required.";
    if (!form.description.trim()) e.description = "Required.";
    if (!form.event_date) e.event_date = "Required.";
    if (!form.event_time) e.event_time = "Required.";
    if (!form.location.trim()) e.location = "Required.";
    const n = parseInt(form.max_attendees, 10);
    if (!form.max_attendees || isNaN(n) || n < 1) e.max_attendees = "Must be ≥ 1.";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const payload: UpdateEventPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      event_date: form.event_date,
      event_time: form.event_time.length === 5 ? `${form.event_time}:00` : form.event_time,
      location: form.location.trim(),
      max_attendees: parseInt(form.max_attendees, 10),
      is_members_only: form.is_members_only,
      is_active: form.is_active,
      image: imageFile ?? undefined,
    };

    try {
      dispatch(clearEventError());
      await dispatch(updateEvent({ id, payload })).unwrap();
      setSuccessMsg("Event updated successfully.");
      setImageFile(null);
      setImagePreview(null);
    } catch {
      // shown via serverError
    }
  };

  const handleDeactivate = async () => {
    if (!id) return;
    setIsDeactivating(true);
    try {
      await dispatch(deactivateEvent(id)).unwrap();
      setShowDeactivateModal(false);
      setSuccessMsg("Event deactivated.");
    } finally {
      setIsDeactivating(false);
    }
  };

  if (loading && !event) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-gold-muted/30 border-t-gold-muted animate-spin" />
          <p className="text-sm text-text-muted">Loading event…</p>
        </div>
      </div>
    );
  }

  if (!event && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-cream gap-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B7922B" strokeWidth="1.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <p className="text-navy-deep font-semibold">Event not found.</p>
        <Link href="/events/staff" className="text-sm text-gold-muted hover:text-navy-deep underline">← Back to Events</Link>
      </div>
    );
  }

  const rsvpPct = event
    ? Math.min(Math.round((event.rsvp_count / event.max_attendees) * 100), 100)
    : 0;

  return (
    <>
      {showDeactivateModal && event && (
        <DeactivateModal
          title={event.title}
          onConfirm={handleDeactivate}
          onCancel={() => setShowDeactivateModal(false)}
          loading={isDeactivating}
        />
      )}
      {successMsg && (
        <SuccessToast message={successMsg} onDismiss={() => setSuccessMsg(null)} />
      )}

      {/* ── Top Bar ─────────────────────────────────── */}
      <header className="flex justify-between items-center px-6 lg:px-8 h-16 bg-white/95 backdrop-blur-md shadow-sm shadow-navy-deep/5 z-10 shrink-0 border-b border-gold-muted/15">
        <Link
          href="/events/staff"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-text-muted hover:text-navy-deep transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Events
        </Link>
        <div className="flex items-center gap-3">
          {event?.is_active && (
            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="px-5 py-2 rounded border border-danger/50 text-danger text-xs font-semibold tracking-widest uppercase hover:bg-error-container/40 transition-colors"
            >
              Deactivate
            </button>
          )}
          <button
            form="edit-event-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded bg-navy-deep border border-gold-muted text-gold-light text-xs font-semibold tracking-widest uppercase hover:bg-gold-light hover:text-navy-deep transition-colors shadow-md disabled:opacity-60"
          >
            {loading && <span className="h-3.5 w-3.5 rounded-full border-2 border-gold-light/30 border-t-gold-light animate-spin" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* ── Main Canvas ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24 lg:pb-8 bg-cream">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Page heading */}
          <div className="pb-4 border-b border-gold-muted/25 flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-semibold text-navy-deep leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {event?.title}
              </h1>
              <p className="text-xs text-text-muted mt-1 tracking-wide">
                {event ? formatDate(event.event_date) : ""} · {event ? formatTime(event.event_time) : ""}
              </p>
            </div>
            {event && (
              <span
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
                  event.is_active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-surface-variant text-text-secondary border-outline-variant"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${event.is_active ? "bg-emerald-500" : "bg-text-secondary"}`} />
                {event.is_active ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          {/* RSVP overview */}
          {event && (
            <div className="bg-white rounded-xl border border-gold-muted/20 shadow-[0_4px_24px_rgba(30,58,95,0.07)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-widest uppercase text-navy-deep">RSVP Overview</span>
                <span className="text-sm font-semibold text-gold-muted">{event.rsvp_count} / {event.max_attendees}</span>
              </div>
              <div className="w-full h-2.5 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${rsvpPct >= 90 ? "bg-danger" : rsvpPct >= 60 ? "bg-gold-muted" : "bg-navy-deep"}`}
                  style={{ width: `${rsvpPct}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted mt-2 text-right">{rsvpPct}% capacity filled</p>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-error-container border border-danger/20 text-danger text-sm">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{serverError}</span>
              <button onClick={() => dispatch(clearEventError())} className="ml-auto text-danger/60 hover:text-danger shrink-0">✕</button>
            </div>
          )}

          {/* Edit form */}
          <form id="edit-event-form" onSubmit={handleUpdate} className="space-y-6" noValidate>

            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
              title="Basic Information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="edit-title">Event Title *</FieldLabel>
                  <input id="edit-title" type="text" value={form.title} onChange={(e) => setField("title", e.target.value)} className={inputCls(!!fieldErrors.title)} placeholder="Event title" />
                  {fieldErrors.title && <p className="text-xs text-danger mt-1">{fieldErrors.title}</p>}
                </div>
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="edit-description">Description *</FieldLabel>
                  <textarea id="edit-description" rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} className={inputCls(!!fieldErrors.description)} placeholder="Describe the event…" />
                  {fieldErrors.description && <p className="text-xs text-danger mt-1">{fieldErrors.description}</p>}
                </div>
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="edit-location">Location *</FieldLabel>
                  <input id="edit-location" type="text" value={form.location} onChange={(e) => setField("location", e.target.value)} className={inputCls(!!fieldErrors.location)} placeholder="e.g. The Grand Ballroom" />
                  {fieldErrors.location && <p className="text-xs text-danger mt-1">{fieldErrors.location}</p>}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
              title="Date, Time & Capacity"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <FieldLabel htmlFor="edit-date">Event Date *</FieldLabel>
                  <input id="edit-date" type="date" value={form.event_date} onChange={(e) => setField("event_date", e.target.value)} className={inputCls(!!fieldErrors.event_date)} />
                  {fieldErrors.event_date && <p className="text-xs text-danger mt-1">{fieldErrors.event_date}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="edit-time">Start Time *</FieldLabel>
                  <input id="edit-time" type="time" value={form.event_time} onChange={(e) => setField("event_time", e.target.value)} className={inputCls(!!fieldErrors.event_time)} />
                  {fieldErrors.event_time && <p className="text-xs text-danger mt-1">{fieldErrors.event_time}</p>}
                </div>
                <div>
                  <FieldLabel htmlFor="edit-capacity">Max Attendees *</FieldLabel>
                  <input id="edit-capacity" type="number" min={1} value={form.max_attendees} onChange={(e) => setField("max_attendees", e.target.value)} className={inputCls(!!fieldErrors.max_attendees)} placeholder="e.g. 150" />
                  {fieldErrors.max_attendees && <p className="text-xs text-danger mt-1">{fieldErrors.max_attendees}</p>}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
              title="Event Image"
            >
              {event?.image && !imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-gold-muted/20 mb-4 h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-navy-deep/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => fileRef.current?.click()} className="bg-white/90 text-navy-deep text-xs font-semibold px-4 py-2 rounded">Replace Image</button>
                  </div>
                </div>
              )}
              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border border-gold-muted/20 mb-4 h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="New preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-navy-deep/70 text-white hover:bg-danger transition-colors">✕</button>
                </div>
              )}
              {!event?.image && !imagePreview && (
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-cream-dark hover:border-gold-muted rounded-lg py-10 flex flex-col items-center gap-3 text-text-muted hover:text-navy-deep transition-colors group">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  <div className="text-center"><p className="text-sm font-medium">Click to upload image</p><p className="text-xs mt-0.5">PNG, JPG, WEBP up to 10 MB</p></div>
                </button>
              )}
              {event?.image && !imagePreview && (
                <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-gold-muted hover:text-navy-deep underline mt-2">Upload new image</button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setImageFile(f);
                if (f) setImagePreview(URL.createObjectURL(f));
              }} />
            </SectionCard>

            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
              title="Settings"
            >
              <Toggle
                id="edit-members-only"
                checked={form.is_members_only}
                onChange={(v) => setField("is_members_only", v)}
                label="Members Only"
                description="Restrict this event to club members exclusively."
              />
              <Toggle
                id="edit-active"
                checked={form.is_active}
                onChange={(v) => setField("is_active", v)}
                label="Active / Visible"
                description="Make this event visible to eligible guests."
              />
            </SectionCard>

          </form>
        </div>
      </main>
    </>
  );
}
