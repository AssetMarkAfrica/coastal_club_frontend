"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  completeOnboarding,
} from "@/store/auth/authSlice";
import {
  selectCurrentUser,
  selectCurrentUserRole,
} from "@/store/auth/authSelectors";
import { logoutUser } from "@/store/auth/authThunks";
import {
  selectProfile,
  selectProfileError,
  selectProfileLoading,
} from "@/store/profile/profileSelectors";
import { fetchProfile, updateProfile } from "@/store/profile/profileThunks";
import type { UpdateProfilePayload } from "@/types/profile";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentUserRole);
  const profile = useAppSelector(selectProfile);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);

  const [draft, setDraft] = useState<UpdateProfilePayload>({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    try {
      await dispatch(
        updateProfile({
          phone_number: draft.phone_number ?? profile?.phone_number ?? "",
          city: draft.city ?? profile?.city ?? "",
          country: draft.country ?? profile?.country ?? "",
          bio: draft.bio ?? profile?.bio ?? "",
        })
      ).unwrap();
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

  const phoneNumber = draft.phone_number ?? profile?.phone_number ?? "";
  const city = draft.city ?? profile?.city ?? "";
  const country = draft.country ?? profile?.country ?? "";
  const bio = draft.bio ?? profile?.bio ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
            <p className="mt-1 text-sm text-slate-600">
              Signed in as {user?.email ?? "Unknown user"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Role:{" "}
              <span className="font-semibold text-slate-900">
                {role ?? "unknown"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {role === "admin" ? (
            <>
              <h2 className="text-sm font-semibold text-slate-900">
                Admin Controls
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                You can manage members, review onboarding progress, and monitor
                profile completion stats.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-slate-900">
                Member Space
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep your profile updated to unlock personalized club features
                and smoother support.
              </p>
            </>
          )}
        </section>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm text-slate-700">
            Phone number
            <input
              type="text"
              value={phoneNumber}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  phone_number: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm text-slate-700">
              City
              <input
                type="text"
                value={city}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    city: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-700">
              Country
              <input
                type="text"
                value={country}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    country: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm text-slate-700">
            Bio
            <textarea
              value={bio}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  bio: event.target.value,
                }))
              }
              rows={4}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {status ? <p className="text-sm text-emerald-700">{status}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </main>
  );
}
