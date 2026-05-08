"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/auth/authSlice";
import { resendOtp, verifyOtp } from "@/store/auth/authThunks";
import {
  selectAuthError,
  selectAuthLoading,
  selectOtpDelivery,
  selectPendingToken,
} from "@/store/auth/authSelectors";

export default function VerifyOtpPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const pendingToken = useAppSelector(selectPendingToken);
  const otpDelivery = useAppSelector(selectOtpDelivery);
  const [code, setCode] = useState("");
  const [info, setInfo] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingToken) return;

    dispatch(clearError());
    setInfo("");

    try {
      await dispatch(
        verifyOtp({
          pending_token: pendingToken,
          code,
        })
      ).unwrap();
      router.push("/profile");
    } catch {
      // Slice handles errors.
    }
  };

  const onResend = async () => {
    if (!pendingToken) return;
    dispatch(clearError());
    setInfo("");

    try {
      await dispatch(resendOtp(pendingToken)).unwrap();
      setInfo("A new OTP has been sent.");
    } catch {
      // Slice handles errors.
    }
  };

  if (!pendingToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            No pending verification
          </h1>
          <p className="mt-2 text-slate-600">
            Start registration first, then come back here to verify your OTP.
          </p>
          <Link
            href="/auth/register"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Go to register
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Verify OTP</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the one-time code we sent
          {otpDelivery?.email ? " by email" : ""}
          {otpDelivery?.email && otpDelivery?.sms ? " and " : ""}
          {otpDelivery?.sms ? " by SMS" : ""}.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm text-slate-700">
            Code
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-700">{info}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>

        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="mt-4 text-sm text-slate-700 underline disabled:opacity-60"
        >
          Resend OTP
        </button>
      </section>
    </main>
  );
}
