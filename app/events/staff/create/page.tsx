"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createEvent } from "@/store/event/eventThunks";
import { selectEventLoading, selectEventError } from "@/store/event/eventSelectors";
import { clearEventError } from "@/store/event/eventSlice";
import type { CreateEventPayload } from "@/types/event";

/* â”€â”€ Form helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ Toggle Switch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ Section Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function CreateEventPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectEventLoading);
  const serverError = useAppSelector(selectEventError);

  /* form state */
  const [form, setForm] = useState<{
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    max_attendees: string;
    is_members_only: boolean;
    is_active: boolean;
  }>({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    max_attendees: "",
    is_members_only: false,
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  /* â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "Event title is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.event_date) newErrors.event_date = "Event date is required.";
    if (!form.event_time) newErrors.event_time = "Event time is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    const cap = parseInt(form.max_attendees, 10);
    if (!form.max_attendees || isNaN(cap) || cap < 1)
      newErrors.max_attendees = "Must be at least 1.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateEventPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      event_date: form.event_date,
      event_time: form.event_time.length === 5 ? `${form.event_time}:00` : form.event_time,
      location: form.location.trim(),
      max_attendees: parseInt(form.max_attendees, 10),
      is_members_only: form.is_members_only,
      is_active: form.is_active,
      image: imageFile ?? null,
    };

    try {
      dispatch(clearEventError());
      await dispatch(createEvent(payload)).unwrap();
      router.push("/events/staff");
    } catch {
      // error shown via serverError selector
    }
  };

  /* â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-cream">
      {/* â”€â”€ Top Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="flex justify-between items-center px-6 lg:px-8 h-16 bg-white/95 backdrop-blur-md shadow-sm shadow-navy-deep/5 z-10 shrink-0 border-b border-gold-muted/15">
        <Link
          href="/events/staff"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-text-muted hover:text-navy-deep transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Events
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/events/staff"
            className="px-5 py-2 rounded border border-gold-muted text-gold-muted text-xs font-semibold tracking-widest uppercase hover:bg-gold-light/10 transition-colors"
          >
            Cancel
          </Link>
          <button
            form="create-event-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded bg-navy-deep border border-gold-muted text-gold-light text-xs font-semibold tracking-widest uppercase hover:bg-gold-light hover:text-navy-deep transition-colors shadow-md disabled:opacity-60"
          >
            {loading ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-gold-light/30 border-t-gold-light animate-spin" />
            ) : null}
            Create Event
          </button>
        </div>
      </header>

      {/* â”€â”€ Main Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24 lg:pb-8">
        <div className="max-w-3xl mx-auto relative">

          {/* Atmospheric gradient */}
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-gold-light/10 blur-3xl pointer-events-none" />

          {/* Page heading */}
          <div className="mb-8 pb-4 border-b border-gold-muted/25">
            <h1 className="text-3xl font-semibold text-navy-deep" style={{ fontFamily: "var(--font-playfair)" }}>
              Create New Event
            </h1>
            <p className="text-sm text-text-muted mt-1">Fill in the details below to publish a new club event.</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-error-container border border-danger/20 text-danger text-sm">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{serverError}</span>
              <button onClick={() => dispatch(clearEventError())} className="ml-auto text-danger/60 hover:text-danger shrink-0">âœ•</button>
            </div>
          )}

          <form id="create-event-form" onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* â”€â”€ Basic Information â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
              title="Basic Information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="title">Event Title *</FieldLabel>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={inputCls(!!errors.title)}
                    placeholder="e.g. Summer Gala Dinner"
                  />
                  {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="description">Description *</FieldLabel>
                  <textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className={inputCls(!!errors.description)}
                    placeholder="Describe the event in detailâ€¦"
                  />
                  {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <FieldLabel htmlFor="location">Location *</FieldLabel>
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className={inputCls(!!errors.location)}
                    placeholder="e.g. The Grand Ballroom"
                  />
                  {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
                </div>
              </div>
            </SectionCard>

            {/* â”€â”€ Date & Capacity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
              title="Date, Time & Capacity"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Date */}
                <div>
                  <FieldLabel htmlFor="event_date">Event Date *</FieldLabel>
                  <input
                    id="event_date"
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setField("event_date", e.target.value)}
                    className={inputCls(!!errors.event_date)}
                  />
                  {errors.event_date && <p className="text-xs text-danger mt-1">{errors.event_date}</p>}
                </div>

                {/* Time */}
                <div>
                  <FieldLabel htmlFor="event_time">Start Time *</FieldLabel>
                  <input
                    id="event_time"
                    type="time"
                    value={form.event_time}
                    onChange={(e) => setField("event_time", e.target.value)}
                    className={inputCls(!!errors.event_time)}
                  />
                  {errors.event_time && <p className="text-xs text-danger mt-1">{errors.event_time}</p>}
                </div>

                {/* Max Attendees */}
                <div>
                  <FieldLabel htmlFor="max_attendees">Max Attendees *</FieldLabel>
                  <input
                    id="max_attendees"
                    type="number"
                    min={1}
                    value={form.max_attendees}
                    onChange={(e) => setField("max_attendees", e.target.value)}
                    className={inputCls(!!errors.max_attendees)}
                    placeholder="e.g. 150"
                  />
                  {errors.max_attendees && <p className="text-xs text-danger mt-1">{errors.max_attendees}</p>}
                </div>
              </div>
            </SectionCard>

            {/* â”€â”€ Image Upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
              title="Event Image"
            >
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-gold-muted/20 mb-4 h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-navy-deep/70 text-white hover:bg-danger transition-colors"
                  >
                    âœ•
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-cream-dark hover:border-gold-muted rounded-lg py-10 flex flex-col items-center gap-3 text-text-muted hover:text-navy-deep transition-colors group"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="group-hover:scale-110 transition-transform"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs mt-0.5">PNG, JPG, WEBP up to 10 MB</p>
                  </div>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </SectionCard>

            {/* â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <SectionCard
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
              title="Settings"
            >
              <Toggle
                id="is_members_only"
                checked={form.is_members_only}
                onChange={(v) => setField("is_members_only", v)}
                label="Members Only"
                description="Restrict this event to club members exclusively."
              />
              <Toggle
                id="is_active"
                checked={form.is_active}
                onChange={(v) => setField("is_active", v)}
                label="Publish Immediately"
                description="Make this event visible to eligible guests right away."
              />
            </SectionCard>

          </form>
        </div>
      </main>
    </div>
  );
}

