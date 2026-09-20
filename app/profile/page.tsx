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
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:bg-white/10 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none backdrop-blur-sm shadow-inner"
        style={{ colorScheme: type === 'date' ? 'dark' : undefined }}
      />
    </div>
  );
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-0.5 ml-1">
      {children}{required && <span className="text-gold-light"> *</span>}
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
    const t = setInterval(() => setActiveImg(i => (i + 1) % BG_IMAGES.length), 6000);
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
        
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%);  }
        }
        .animate-shimmer { animation: shimmer 1.5s ease forwards infinite; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-in-up { animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px rgba(0,0,0,0.5) inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <main className="relative flex min-h-screen antialiased bg-black selection:bg-gold-light/30">
        
        {/* Full screen slideshow background */}
        <div className="fixed inset-0 z-0 overflow-hidden bg-navy-deep">
          {BG_IMAGES.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: i === activeImg ? 1 : 0,
                transition: "opacity 2.5s ease-in-out",
              }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  transform: i === activeImg ? "scale(1.08)" : "scale(1)",
                  transition: "transform 10s ease-out",
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/80 to-navy-deep/50 z-10" />
        </div>

        {/* ── Page Body ── */}
        <div className="relative z-20 w-full flex flex-col min-h-screen">
          
          {/* ── Top Nav ── */}
          <nav className="border-b px-6 h-16 flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl border-white/10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Link href="/" className="text-xl font-bold tracking-tight text-gold-light drop-shadow-md" style={{ fontFamily: "var(--font-playfair)" }}>
              Estrella del Mar
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-[10px] font-semibold tracking-widest uppercase text-white/60 hover:text-gold-light transition-colors">
                Home
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-lg transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
                Logout
              </button>
            </div>
          </nav>

          <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* ── Profile Hero Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-2xl shadow-[0_0_24px_rgba(232,201,111,0.2)] bg-black/40 border-2 border-gold-muted/50 text-gold-light backdrop-blur-md">
                {initials}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-1 text-gold-light drop-shadow-md">
                  {role ?? "Member"} Account
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                  My Profile
                </h1>
                <p className="text-sm text-white/70">
                  {user?.email ?? ""}
                </p>
              </div>

              <div className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md ${isProfileComplete ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border border-amber-500/30 text-amber-400"}`}>
                <span className="material-symbols-outlined text-base">
                  {isProfileComplete ? "verified" : "warning"}
                </span>
                {isProfileComplete ? "Profile Complete" : `${missingFields.length} field(s) missing`}
              </div>
            </div>

            {/* ── Glassmorphic Form Card ── */}
            <div className="w-full bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row">
              
              {/* Left text column */}
              <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
                <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                  Complete your profile to begin your membership application
                </h2>
                <p className="text-sm leading-relaxed text-white/60 mb-8">
                  Once your profile is complete, you can select a membership plan and submit your application for review.
                </p>

                {!isProfileComplete && missingFields.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-[10px] font-semibold tracking-widest uppercase mb-3 text-gold-muted/80">
                      Required Fields Missing
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingFields.map(f => (
                        <span key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/90 font-medium">
                          {toDisplayLabel(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right form column */}
              <div className="w-full md:w-2/3 p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <FieldLabel htmlFor="gender" required>Gender</FieldLabel>
                      <div className="relative">
                        <select
                          id="gender"
                          required
                          value={getFieldValue("gender")}
                          onChange={(e) => setField("gender", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:bg-black/40 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none backdrop-blur-sm shadow-inner appearance-none"
                        >
                          <option value="" disabled className="text-black">Select gender</option>
                          <option value="male" className="text-black">Male</option>
                          <option value="female" className="text-black">Female</option>
                          <option value="other" className="text-black">Other</option>
                          <option value="prefer_not_to_say" className="text-black">Prefer Not To Say</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    <FieldInput id="date_of_birth" type="date" required value={getFieldValue("date_of_birth")} onChange={(v) => setField("date_of_birth", v)}>
                      <FieldLabel htmlFor="date_of_birth" required>Date of Birth</FieldLabel>
                    </FieldInput>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FieldInput id="phone_number" type="tel" required value={getFieldValue("phone_number")} onChange={(v) => setField("phone_number", v)} placeholder="+233 20 000 0000">
                      <FieldLabel htmlFor="phone_number" required>Phone Number</FieldLabel>
                    </FieldInput>
                    <FieldInput id="nationality" value={getFieldValue("nationality")} onChange={(v) => setField("nationality", v)}>
                      <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                    </FieldInput>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FieldInput id="occupation" value={getFieldValue("occupation")} onChange={(v) => setField("occupation", v)}>
                      <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
                    </FieldInput>
                    <FieldInput id="id_type" value={getFieldValue("id_type")} onChange={(v) => setField("id_type", v)} placeholder="Passport, National ID…">
                      <FieldLabel htmlFor="id_type">ID Type</FieldLabel>
                    </FieldInput>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                  <div className="pt-4 mt-6 border-t border-white/10">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 text-gold-muted">Emergency Contact</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FieldInput id="emergency_contact_name" value={getFieldValue("emergency_contact_name")} onChange={(v) => setField("emergency_contact_name", v)}>
                        <FieldLabel htmlFor="emergency_contact_name">Name</FieldLabel>
                      </FieldInput>
                      <FieldInput id="emergency_contact_phone" type="tel" value={getFieldValue("emergency_contact_phone")} onChange={(v) => setField("emergency_contact_phone", v)}>
                        <FieldLabel htmlFor="emergency_contact_phone">Phone</FieldLabel>
                      </FieldInput>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5 pt-4 mt-6 border-t border-white/10">
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <textarea
                      id="bio"
                      rows={4}
                      value={getFieldValue("bio")}
                      onChange={(e) => setField("bio", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/10 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none resize-none backdrop-blur-sm shadow-inner"
                      placeholder="Tell us a little about yourself…"
                    />
                  </div>

                  {/* Feedback */}
                  {error && (
                    <div className="bg-danger/20 border border-danger/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-danger">error_outline</span>
                      <p className="text-sm text-white">{error}</p>
                    </div>
                  )}
                  {status && (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                      <p className="text-sm text-white">{status}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-4 px-4 border-0 rounded-xl shadow-[0_4px_16px_rgba(232,201,111,0.2)] bg-gradient-to-r from-[#c9a84c] to-[#e8c96f] text-[#10243f] hover:shadow-[0_4px_24px_rgba(232,201,111,0.4)] disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-bold tracking-[0.2em] uppercase"
                    >
                      {loading ? "Saving Profile…" : "Save Profile"}
                      <span aria-hidden className="absolute inset-0 bg-white/30 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
