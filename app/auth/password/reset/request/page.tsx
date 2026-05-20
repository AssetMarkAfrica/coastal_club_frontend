"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { passwordResetRequest } from "@/store/auth/authThunks";
import { clearError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";

export default function PasswordResetRequestPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());
    setSuccessMsg("");

    try {
      const result = await dispatch(passwordResetRequest({ email })).unwrap();
      setSuccessMsg(result.message || "Password reset link sent.");
      setEmail("");
    } catch {
      // Error handled by slice
    }
  };

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
                  Reset Password
                </h2>
                <p
                  className="text-base text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Enter your email address to receive a password reset link.
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        mail
                      </span>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="member@estrelladelmar.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary disabled:opacity-60 transition-all duration-300 relative overflow-hidden text-xs font-semibold tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
                
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
