"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/auth/authThunks";
import { clearError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";
import * as authService from "@/services/auth/AuthService";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push("/");
    } catch {
      // Slice state already contains human-readable error.
    }
  };

  const onGoogleSignIn = async () => {
    dispatch(clearError());

    try {
      const { data } = await authService.getGoogleAuthorizeUrl();
      window.location.href = data.data.authorization_url;
    } catch {
      // Keep this simple for now; standard error state remains for login flow.
    }
  };

  return (
    <>
      {/*
        Material Symbols are loaded via an inline <style> tag so we can
        keep the icon font without adding a <link> in the shared layout.
        The eslint comment suppresses the next/no-page-custom-font rule.
      */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');`}</style>

      <main className="flex min-h-screen bg-cream text-text-primary antialiased">

        {/* ── Left brand panel (desktop only) ── */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-navy-deep to-primary">
          {/* Subtle background image */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaienLFT5eqymFHGYCcsUqY9kMDYXaWwisWIi5P1HUOMoAoKZBcKhrlc3q3jz2UntYHe1xlxasg0ihVTIxaI7onQSEViG9ZVH9yK8eswxWIPN5-SVU5q4uM7YYYbO-0WV90v3r8Gp4KHRn_7ONSnSYNDMAHyvQxU5SyFOlsqKTNM5MULh84rMIKUVfktKPS3MkdlIgYM6X7E0TpTliT2IQg4fb7QpOHs7O1hodEe7UGqP2WF0DLJx-rhbzBwyXCKXBCiN2Gw4"
              alt="Luxury hotel interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Brand copy */}
          <div className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg animate-fade-in-up">
            <Link
              href="/"
              className="text-6xl font-bold italic tracking-tight drop-shadow-lg mb-6 text-gold-light hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Estrella del Mar
            </Link>
            <div className="w-24 h-px mb-6 bg-gold-muted/50" />
            <p
              className="text-3xl font-semibold opacity-90 leading-snug text-cream-dark"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Where Excellence
              <br />
              Meets Distinction
            </p>
          </div>

          {/* Decorative inset border */}
          <div className="absolute inset-6 border border-gold-muted/20 pointer-events-none rounded-lg" />
        </div>

        {/* ── Right login panel ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">

            {/* Mobile brand header */}
            <div className="lg:hidden text-center mb-10">
              <Link
                href="/"
                className="text-4xl font-bold tracking-tight mb-2 text-primary hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Estrella del Mar
              </Link>
              <p
                className="text-base italic text-gold-muted"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Where Excellence Meets Distinction
              </p>
            </div>

            {/* ── Login card ── */}
            <div className="bg-surface-container-lowest rounded border border-gold-muted/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden animate-fade-in-up">

              {/* Card header */}
              <div className="p-6 border-b border-cream-dark text-center bg-cream/30">
                <h2
                  className="text-3xl font-semibold text-primary mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Member Login
                </h2>
                <p
                  className="text-base text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Please enter your credentials to access your account.
                </p>
              </div>

              {/* Form area */}
              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">

                  {/* Email field */}
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

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold tracking-widest uppercase text-text-primary"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Password
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-gold-muted hover:text-primary transition-colors"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        lock
                      </span>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  {/* Auth error */}
                  {error && (
                    <p
                      className="text-sm text-danger"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-semibold tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {loading ? "Signing in…" : "Sign In"}
                      {/* Shimmer highlight on hover */}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"
                      />
                    </button>
                  </div>
                </form>

                {/* Create Account button */}
                <div className="mt-4">
                  <Link
                    href="/auth/register"
                    className="w-full flex justify-center py-3 px-4 border border-primary/40 rounded text-primary hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5 text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Create Account
                  </Link>
                </div>

                {/* Divider */}
                <div className="mt-6 relative">
                  <div aria-hidden className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cream-dark" />
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="px-4 bg-surface-container-lowest text-xs font-semibold tracking-widest uppercase text-text-muted"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google SSO */}
                <div className="mt-6">
                  <button
                    id="google-signin-btn"
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gold-muted/50 rounded bg-transparent text-primary hover:bg-gold-muted/10 disabled:opacity-60 transition-colors text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              {/* Gold accent footer bar */}
              <div className="h-1 w-full bg-gradient-to-r from-gold-muted/20 via-gold-muted to-gold-muted/20" />
            </div>

            {/* Footer links */}
            <div className="mt-8 text-center flex justify-center gap-6 flex-wrap">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact Concierge", href: "#" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
