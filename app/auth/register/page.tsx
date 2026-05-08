"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/auth/authThunks";
import { clearError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    if (password !== passwordConfirm) {
      return;
    }

    try {
      await dispatch(
        registerUser({
          name,
          email,
          password,
          password_confirm: passwordConfirm,
          role: "member",
        })
      ).unwrap();
      router.push("/auth/verify-otp");
    } catch {
      // Slice handles error state.
    }
  };

  const passwordMismatch =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password !== passwordConfirm;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm text-slate-700">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-700">
            Confirm password
            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          {passwordMismatch ? (
            <p className="text-sm text-red-600">Passwords do not match.</p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || passwordMismatch}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/auth/login" className="text-slate-700 underline">
            Already have an account?
          </Link>
          <Link href="/auth" className="text-slate-700 underline">
            Back
          </Link>
        </div>
      </section>
    </main>
  );
}
