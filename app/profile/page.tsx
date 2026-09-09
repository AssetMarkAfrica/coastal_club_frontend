"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeOnboarding } from "@/store/auth/authSlice";
import { selectCurrentUser, selectCurrentUserRole } from "@/store/auth/authSelectors";
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
  "gender", "date_of_birth", "phone_number", "address_line1", "city", "country",
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

const BG_IMAGES = [
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757507/Skybar2_wt66as.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758506/PrivateRoom2_gcowvn.png",
];

const toDisplayLabel = (field: string) => FIELD_LABELS[field] ?? field;

function FieldInput({
  id, type = "text", value, onChange, placeholder, required, children
}: {
  id: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {children}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(193,160,76,0.25)",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid rgba(193,160,76,0.65)";
          e.target.style.background = "rgba(255,255,255,0.1)";
          e.target.style.boxShadow = "0 0 0 3px rgba(193,160,76,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(193,160,76,0.25)";
          e.target.style.background = "rgba(255,255,255,0.07)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "rgba(193,160,76,0.8)" }}>
      {children}{required && <span style={{ color: "#e8c96f" }}> *</span>}
    </label>
  );
}

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
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    const t = setInterval(() => setActiveImg(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const getFieldValue = (field: EditableProfileField): string => {
    const draftValue = draft[field];
    if (draftValue !== undefined) return draftValue;
    const profileValue = profile?.[field];
    if (typeof profileValue === "string") return profileValue;
    return "";
  };

  const missingFields = profile?.missing_required_fields?.length
    ? profile.missing_required_fields
    : MEMBERSHIP_REQUIRED_FIELDS.filter((field) => !getFieldValue(field));

  const setField = (key: EditableProfileField, value: string) =>
    setDraft(prev => ({ ...prev, [key]: value }));

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
      router.push("/membership/plans");
    } catch {
      setStatus("");
    }
  };

  const onLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/auth/login");
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "ME";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.7s ease forwards; }
        .profile-input:focus { outline: none; }
      `}</style>

      <main className="min-h-screen antialiased" style={{ background: "#0c1e35", fontFamily: "var(--font-inter)" }}>

        {/* ── Decorative background images (left panel) ── */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {BG_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === activeImg ? 0.12 : 0 }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(12,30,53,0.6) 0%, rgba(12,30,53,0.98) 60%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(193,160,76,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* ── Top Nav ── */}
        <nav className="relative z-20 sticky top-0 border-b px-6 h-16 flex items-center justify-between" style={{ background: "rgba(12,30,53,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(193,160,76,0.2)" }}>
          <Link href="/" className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-playfair)", color: "#e8c96f" }}>
            Estrella del Mar
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-semibold tracking-widest uppercase hover:text-gold-light transition-colors" style={{ color: "rgba(255,255,255,0.6)" }}>
              Home
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(193,160,76,0.12)", border: "1px solid rgba(193,160,76,0.3)", color: "#e8c96f" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>logout</span>
              Logout
            </button>
          </div>
        </nav>

        {/* ── Page Body ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Profile Hero Header ── */}
          <div className="fade-in flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-2xl shadow-xl" style={{ background: "rgba(193,160,76,0.15)", border: "2px solid rgba(193,160,76,0.5)", color: "#e8c96f" }}>
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "#c9a84c" }}>
                {role ?? "Member"} Account
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                My Profile
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {user?.email ?? ""}
              </p>
            </div>

            {/* Completion badge */}
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{
              background: isProfileComplete ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
              border: `1px solid ${isProfileComplete ? "rgba(52,211,153,0.4)" : "rgba(251,191,36,0.4)"}`,
              color: isProfileComplete ? "#34d399" : "#fbbf24",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                {isProfileComplete ? "verified" : "warning"}
              </span>
              {isProfileComplete ? "Profile Complete" : `${missingFields.length} field(s) missing`}
            </div>
          </div>

          {/* ── Two-column layout: left = background card, right = form ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 fade-in">

            {/* ── Left: Lounge backdrop card ── */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden relative" style={{ minHeight: "420px", border: "1px solid rgba(193,160,76,0.2)" }}>
              {BG_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                  style={{ opacity: i === activeImg ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,30,53,0.95) 0%, rgba(12,30,53,0.4) 50%, rgba(12,30,53,0.2) 100%)" }} />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex gap-2 mb-4">
                  {BG_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === activeImg ? "24px" : "6px",
                        height: "4px",
                        background: i === activeImg ? "#e8c96f" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "#c9a84c" }}>
                  Estrella del Mar
                </p>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  Complete your profile to unlock full membership privileges
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Access priority bookings, exclusive events, and concierge services across all four of our venues.
                </p>

                {!isProfileComplete && missingFields.length > 0 && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(193,160,76,0.2)" }}>
                    <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(193,160,76,0.7)" }}>
                      Still needed
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingFields.map(f => (
                        <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                          {toDisplayLabel(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ background: "rgba(16,36,63,0.7)", border: "1px solid rgba(193,160,76,0.15)", backdropFilter: "blur(12px)" }}>
              {/* Form header */}
              <div className="px-8 py-6 border-b" style={{ borderColor: "rgba(193,160,76,0.15)" }}>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  Personal Details
                </h3>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Fields marked with <span style={{ color: "#e8c96f" }}>*</span> are required for membership
                </p>
              </div>

              <form onSubmit={onSubmit} className="px-8 py-6 space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="gender" required>Gender</FieldLabel>
                    <select
                      id="gender"
                      required
                      value={getFieldValue("gender")}
                      onChange={(e) => setField("gender", e.target.value)}
                      className="mt-1.5 w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(193,160,76,0.25)", color: getFieldValue("gender") ? "white" : "rgba(255,255,255,0.3)" }}
                    >
                      <option value="" disabled style={{ background: "#10243f" }}>Select gender</option>
                      <option value="male" style={{ background: "#10243f" }}>Male</option>
                      <option value="female" style={{ background: "#10243f" }}>Female</option>
                      <option value="other" style={{ background: "#10243f" }}>Other</option>
                      <option value="prefer_not_to_say" style={{ background: "#10243f" }}>Prefer Not To Say</option>
                    </select>
                  </div>
                  <FieldInput id="date_of_birth" type="date" required value={getFieldValue("date_of_birth")} onChange={(v) => setField("date_of_birth", v)}>
                    <FieldLabel htmlFor="date_of_birth" required>Date of Birth</FieldLabel>
                  </FieldInput>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput id="phone_number" type="tel" required value={getFieldValue("phone_number")} onChange={(v) => setField("phone_number", v)} placeholder="+233 20 000 0000">
                    <FieldLabel htmlFor="phone_number" required>Phone Number</FieldLabel>
                  </FieldInput>
                  <FieldInput id="nationality" value={getFieldValue("nationality")} onChange={(v) => setField("nationality", v)}>
                    <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  </FieldInput>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput id="occupation" value={getFieldValue("occupation")} onChange={(v) => setField("occupation", v)}>
                    <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
                  </FieldInput>
                  <FieldInput id="id_type" value={getFieldValue("id_type")} onChange={(v) => setField("id_type", v)} placeholder="Passport, National ID…">
                    <FieldLabel htmlFor="id_type">ID Type</FieldLabel>
                  </FieldInput>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput id="id_number" value={getFieldValue("id_number")} onChange={(v) => setField("id_number", v)}>
                    <FieldLabel htmlFor="id_number">ID Number</FieldLabel>
                  </FieldInput>
                  <FieldInput id="country" required value={getFieldValue("country")} onChange={(v) => setField("country", v)}>
                    <FieldLabel htmlFor="country" required>Country</FieldLabel>
                  </FieldInput>
                </div>

                {/* Address */}
                <FieldInput id="address_line1" required value={getFieldValue("address_line1")} onChange={(v) => setField("address_line1", v)}>
                  <FieldLabel htmlFor="address_line1" required>Address Line 1</FieldLabel>
                </FieldInput>
                <FieldInput id="address_line2" value={getFieldValue("address_line2")} onChange={(v) => setField("address_line2", v)}>
                  <FieldLabel htmlFor="address_line2">Address Line 2</FieldLabel>
                </FieldInput>

                {/* Row 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FieldInput id="city" required value={getFieldValue("city")} onChange={(v) => setField("city", v)}>
                    <FieldLabel htmlFor="city" required>City</FieldLabel>
                  </FieldInput>
                  <FieldInput id="region_state" value={getFieldValue("region_state")} onChange={(v) => setField("region_state", v)}>
                    <FieldLabel htmlFor="region_state">Region / State</FieldLabel>
                  </FieldInput>
                  <FieldInput id="postal_code" value={getFieldValue("postal_code")} onChange={(v) => setField("postal_code", v)}>
                    <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
                  </FieldInput>
                </div>

                {/* Emergency Contact */}
                <div className="pt-2 border-t" style={{ borderColor: "rgba(193,160,76,0.12)" }}>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(193,160,76,0.6)" }}>Emergency Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldInput id="emergency_contact_name" value={getFieldValue("emergency_contact_name")} onChange={(v) => setField("emergency_contact_name", v)}>
                      <FieldLabel htmlFor="emergency_contact_name">Name</FieldLabel>
                    </FieldInput>
                    <FieldInput id="emergency_contact_phone" type="tel" value={getFieldValue("emergency_contact_phone")} onChange={(v) => setField("emergency_contact_phone", v)}>
                      <FieldLabel htmlFor="emergency_contact_phone">Phone</FieldLabel>
                    </FieldInput>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <textarea
                    id="bio"
                    rows={4}
                    value={getFieldValue("bio")}
                    onChange={(e) => setField("bio", e.target.value)}
                    className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none resize-none transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(193,160,76,0.25)" }}
                    placeholder="Tell us a little about yourself…"
                  />
                </div>

                {/* Feedback */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>error</span>
                    {error}
                  </div>
                )}
                {status && (
                  <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>
                    {status}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-xs font-semibold tracking-[0.18em] uppercase rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "#c9a84c", color: "#0c1e35", boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}
                >
                  {loading ? "Saving Profile…" : "Save Profile"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
