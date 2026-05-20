"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { passwordResetConfirm } from "@/store/auth/authThunks";
import { clearError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";

function PasswordResetConfirmForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const uid = searchParams.get("uid") || searchParams.get("uidb64");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());
    setSuccessMsg("");

    if (!uid || !token) {
      return;
    }

    if (newPassword !== confirmPassword) {
      // Not handling custom local errors elegantly yet, but dispatch clearError
      alert("Passwords do not match.");
      return;
    }

    try {
      const result = await dispatch(
        passwordResetConfirm({ uid, token, new_password: newPassword })
      ).unwrap();
      
      setSuccessMsg(result.message || "Password has been reset successfully.");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch {
      // Error handled by slice
    }
  };

  if (!uid || !token) {
    return (
      <div className="text-center">
        <p className="text-danger mb-4" style={{ fontFamily: "var(--font-inter)" }}>
          Invalid or missing password reset token.
        </p>
        <Link
          href="/auth/password/reset/request"
          className="text-sm font-semibold text-primary hover:text-gold-muted transition-colors uppercase tracking-wider"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="newPassword"
          className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          New Password
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
            lock
          </span>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
            lock_reset
          </span>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-danger" style={{ fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
      {successMsg && (
        <p className="text-sm text-success" style={{ fontFamily: "var(--font-inter)" }}>
          {successMsg}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || successMsg.length > 0}
          className="w-full flex justify-center py-3 px-4 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary disabled:opacity-60 transition-all duration-300 relative overflow-hidden text-xs font-semibold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
}

export default function PasswordResetConfirmPage() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');`}</style>
      <main className="flex min-h-screen bg-cream text-text-primary antialiased">
        <div className="w-full flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <Link
                href="/"
                className="text-4xl font-bold tracking-tight mb-2 text-primary hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Estrella del Mar
              </Link>
            </div>

            <div className="bg-surface-container-lowest rounded border border-gold-muted/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-cream-dark text-center bg-cream/30">
                <h2
                  className="text-3xl font-semibold text-primary mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Set New Password
                </h2>
                <p
                  className="text-base text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Please enter your new password below.
                </p>
              </div>

              <div className="p-6">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                  <PasswordResetConfirmForm />
                </Suspense>

                <div className="mt-6 text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-primary hover:text-gold-muted transition-colors uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-gold-muted/20 via-gold-muted to-gold-muted/20" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
