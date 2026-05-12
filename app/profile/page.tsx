"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeOnboarding } from "@/store/auth/authSlice";
import {
  selectCurrentUser,
  selectCurrentUserRole,
} from "@/store/auth/authSelectors";
import { logoutUser } from "@/store/auth/authThunks";
import {
  selectIsProfileComplete,
  selectProfile,
  selectProfileError,
  selectProfileLoading,
} from "@/store/profile/profileSelectors";
import { clearProfileError } from "@/store/profile/profileSlice";
import { fetchProfile, updateProfile } from "@/store/profile/profileThunks";
import type { UserProfile } from "@/types/auth";
import type { UpdateProfilePayload } from "@/types/profile";

type EditableProfileField = Exclude<
  keyof UserProfile,
  "age" | "is_profile_complete" | "missing_required_fields" | "created_at" | "updated_at"
>;

type ProfileDraft = Partial<Record<EditableProfileField, string>>;

const MEMBERSHIP_REQUIRED_FIELDS: EditableProfileField[] = [
  "gender",
  "date_of_birth",
  "phone_number",
  "address_line1",
  "city",
  "country",
];

const FIELD_LABELS: Record<string, string> = {
  gender: "Gender",
  date_of_birth: "Date of Birth",
  phone_number: "Phone Number",
  nationality: "Nationality",
  occupation: "Occupation",
  id_type: "ID Type",
  id_number: "ID Number",
  address_line1: "Address Line 1",
  address_line2: "Address Line 2",
  city: "City",
  region_state: "Region / State",
  postal_code: "Postal Code",
  country: "Country",
  emergency_contact_name: "Emergency Contact Name",
  emergency_contact_phone: "Emergency Contact Phone",
  bio: "Bio",
};

const toDisplayLabel = (field: string) => FIELD_LABELS[field] ?? field;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentUserRole);
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);
  const isProfileComplete = useAppSelector(selectIsProfileComplete);

  const [draft, setDraft] = useState<ProfileDraft>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  const getFieldValue = (field: EditableProfileField): string => {
    const draftValue = draft[field];
    if (draftValue !== undefined) {
      return draftValue;
    }

    const profileValue = profile?.[field];
    if (typeof profileValue === "string") {
      return profileValue;
    }

    return "";
  };

  const missingFields = profile?.missing_required_fields?.length
    ? profile.missing_required_fields
    : MEMBERSHIP_REQUIRED_FIELDS.filter((field) => !getFieldValue(field));

  const setField = (key: EditableProfileField, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    dispatch(clearProfileError());

    const payload: UpdateProfilePayload = {
      gender: getFieldValue("gender"),
      date_of_birth: getFieldValue("date_of_birth") || null,
      phone_number: getFieldValue("phone_number"),
      nationality: getFieldValue("nationality"),
      occupation: getFieldValue("occupation"),
      id_type: getFieldValue("id_type"),
      id_number: getFieldValue("id_number"),
      address_line1: getFieldValue("address_line1"),
      address_line2: getFieldValue("address_line2"),
      city: getFieldValue("city"),
      region_state: getFieldValue("region_state"),
      postal_code: getFieldValue("postal_code"),
      country: getFieldValue("country"),
      emergency_contact_name: getFieldValue("emergency_contact_name"),
      emergency_contact_phone: getFieldValue("emergency_contact_phone"),
      bio: getFieldValue("bio"),
    };

    try {
      await dispatch(updateProfile(payload)).unwrap();
      dispatch(completeOnboarding());
      setStatus("Profile updated successfully.");
    } catch {
      setStatus("");
    }
  };

  const onLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/auth/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
      `}</style>

      <main className="min-h-screen bg-cream text-text-primary antialiased">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:py-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className="text-4xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                My Profile
              </h1>
              <p
                className="mt-2 text-sm text-text-secondary"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Signed in as {user?.email ?? "Unknown user"}
              </p>
              <p
                className="mt-1 text-sm text-text-secondary"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Role: <span className="font-semibold text-primary">{role ?? "unknown"}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded border border-primary/30 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-primary hover:bg-primary/5 transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Home
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="rounded border border-gold-muted bg-primary px-4 py-2 text-xs font-semibold tracking-widest uppercase text-gold-light hover:bg-gold-muted hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Logout
              </button>
            </div>
          </div>

          <section className="rounded border border-gold-muted/25 bg-surface-container-lowest shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden">
            <div className="border-b border-cream-dark bg-cream/30 px-6 py-6 sm:px-8">
              <h2
                className="text-3xl font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Complete Your Membership Profile
              </h2>
              <p
                className="mt-2 text-sm text-text-secondary"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Fill out your personal details to keep your account membership-ready.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="mb-6 rounded border border-gold-muted/30 bg-cream px-4 py-3 text-sm">
                <p
                  className="font-semibold text-primary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Profile status: {isProfileComplete ? "Complete" : "Incomplete"}
                </p>
                {!isProfileComplete && (
                  <p
                    className="mt-1 text-text-secondary"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Missing required fields for membership application:{" "}
                    {missingFields.map(toDisplayLabel).join(", ")}
                  </p>
                )}
              </div>

              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="gender" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Gender *
                  </label>
                  <select id="gender" required value={getFieldValue("gender")} onChange={(event) => setField("gender", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }}>
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer Not To Say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Date of Birth *
                  </label>
                  <input id="date_of_birth" type="date" required value={getFieldValue("date_of_birth")} onChange={(event) => setField("date_of_birth", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="phone_number" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Phone Number *
                  </label>
                  <input id="phone_number" type="tel" required value={getFieldValue("phone_number")} onChange={(event) => setField("phone_number", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} placeholder="+233 20 000 0000" />
                </div>

                <div>
                  <label htmlFor="nationality" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Nationality
                  </label>
                  <input id="nationality" type="text" value={getFieldValue("nationality")} onChange={(event) => setField("nationality", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="occupation" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Occupation
                  </label>
                  <input id="occupation" type="text" value={getFieldValue("occupation")} onChange={(event) => setField("occupation", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="id_type" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    ID Type
                  </label>
                  <input id="id_type" type="text" value={getFieldValue("id_type")} onChange={(event) => setField("id_type", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} placeholder="Passport, National ID, Driver's License" />
                </div>

                <div>
                  <label htmlFor="id_number" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    ID Number
                  </label>
                  <input id="id_number" type="text" value={getFieldValue("id_number")} onChange={(event) => setField("id_number", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="country" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Country *
                  </label>
                  <input id="country" type="text" required value={getFieldValue("country")} onChange={(event) => setField("country", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address_line1" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Address Line 1 *
                  </label>
                  <input id="address_line1" type="text" required value={getFieldValue("address_line1")} onChange={(event) => setField("address_line1", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address_line2" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Address Line 2
                  </label>
                  <input id="address_line2" type="text" value={getFieldValue("address_line2")} onChange={(event) => setField("address_line2", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="city" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    City *
                  </label>
                  <input id="city" type="text" required value={getFieldValue("city")} onChange={(event) => setField("city", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="region_state" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Region / State
                  </label>
                  <input id="region_state" type="text" value={getFieldValue("region_state")} onChange={(event) => setField("region_state", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="postal_code" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Postal Code
                  </label>
                  <input id="postal_code" type="text" value={getFieldValue("postal_code")} onChange={(event) => setField("postal_code", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="emergency_contact_name" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Emergency Contact Name
                  </label>
                  <input id="emergency_contact_name" type="text" value={getFieldValue("emergency_contact_name")} onChange={(event) => setField("emergency_contact_name", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div>
                  <label htmlFor="emergency_contact_phone" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Emergency Contact Phone
                  </label>
                  <input id="emergency_contact_phone" type="tel" value={getFieldValue("emergency_contact_phone")} onChange={(event) => setField("emergency_contact_phone", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="mb-2 block text-xs font-semibold tracking-widest uppercase text-text-primary" style={{ fontFamily: "var(--font-inter)" }}>
                    Bio
                  </label>
                  <textarea id="bio" rows={5} value={getFieldValue("bio")} onChange={(event) => setField("bio", event.target.value)} className="block w-full rounded border border-cream-dark bg-cream px-4 py-3 text-sm text-text-primary focus:border-gold-muted focus:outline-none focus:ring-4 focus:ring-gold-muted/30" style={{ fontFamily: "var(--font-inter)" }} />
                </div>

                {error && (
                  <p className="md:col-span-2 text-sm text-danger" style={{ fontFamily: "var(--font-inter)" }}>
                    {error}
                  </p>
                )}

                {status && (
                  <p className="md:col-span-2 text-sm text-success" style={{ fontFamily: "var(--font-inter)" }}>
                    {status}
                  </p>
                )}

                <div className="md:col-span-2 pt-2">
                  <button type="submit" disabled={loading} className="w-full rounded border border-gold-muted bg-primary px-4 py-3 text-xs font-semibold tracking-widest uppercase text-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-muted hover:text-primary disabled:opacity-60" style={{ fontFamily: "var(--font-inter)" }}>
                    {loading ? "Saving profile..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
