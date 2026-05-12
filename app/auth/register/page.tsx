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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const passwordMismatch =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password !== passwordConfirm;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    if (password !== passwordConfirm) return;

    try {
      await dispatch(
        registerUser({
          first_name: firstName,
          last_name: lastName,
          gender,
          date_of_birth: dateOfBirth,
          phone_number: phoneNumber,
          username,
          email,
          password,
          password_confirm: passwordConfirm,
        })
      ).unwrap();
      router.push("/auth/verify-otp");
    } catch {
      // Slice handles error state.
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%);  }
        }
        .animate-shimmer { animation: shimmer 1.2s ease forwards; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease both; }
      `}</style>

      <main className="flex min-h-screen bg-cream text-text-primary antialiased">
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-navy-deep to-primary">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaienLFT5eqymFHGYCcsUqY9kMDYXaWwisWIi5P1HUOMoAoKZBcKhrlc3q3jz2UntYHe1xlxasg0ihVTIxaI7onQSEViG9ZVH9yK8eswxWIPN5-SVU5q4uM7YYYbO-0WV90v3r8Gp4KHRn_7ONSnSYNDMAHyvQxU5SyFOlsqKTNM5MULh84rMIKUVfktKPS3MkdlIgYM6X7E0TpTliT2IQg4fb7QpOHs7O1hodEe7UGqP2WF0DLJx-rhbzBwyXCKXBCiN2Gw4"
              alt="Luxury hotel interior"
              className="w-full h-full object-cover"
            />
          </div>

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
              Begin Your
              <br />
              Journey With Us
            </p>
          </div>

          <div className="absolute inset-6 border border-gold-muted/20 pointer-events-none rounded-lg" />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-2xl">
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
                Begin Your Journey With Us
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded border border-gold-muted/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] overflow-hidden animate-fade-in-up">
              <div className="p-6 border-b border-cream-dark text-center bg-cream/30">
                <h2
                  className="text-3xl font-semibold text-primary mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Create Account
                </h2>
                <p
                  className="text-base text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Join us to access exclusive member privileges.
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none text-lg">
                        person
                      </span>
                      <input
                        id="firstName"
                        type="text"
                        name="first_name"
                        autoComplete="given-name"
                        required
                        placeholder="First"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none text-lg">
                        person
                      </span>
                      <input
                        id="lastName"
                        type="text"
                        name="last_name"
                        autoComplete="family-name"
                        required
                        placeholder="Last"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-10 pr-3 py-3 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none text-lg">
                        wc
                      </span>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-10 pr-3 py-3 text-sm text-text-primary focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300 appearance-none"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none text-lg">
                        cake
                      </span>
                      <input
                        id="dateOfBirth"
                        type="date"
                        name="date_of_birth"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-10 pr-3 py-3 text-sm text-text-primary focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        phone
                      </span>
                      <input
                        id="phoneNumber"
                        type="tel"
                        name="phone_number"
                        autoComplete="tel"
                        required
                        placeholder="+233 20 000 0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="username"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        alternate_email
                      </span>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        required
                        placeholder="your_handle"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
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

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold tracking-widest uppercase text-text-primary mb-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold-muted/70 select-none">
                        lock
                      </span>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded border border-cream-dark bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:border-gold-muted focus:ring-4 focus:ring-gold-muted/30 focus:outline-none transition-all duration-300"
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="passwordConfirm"
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
                        id="passwordConfirm"
                        type="password"
                        name="passwordConfirm"
                        autoComplete="new-password"
                        required
                        placeholder="********"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className={`block w-full rounded border bg-cream pl-12 pr-4 py-3 text-text-primary placeholder:text-text-muted/60 focus:ring-4 focus:outline-none transition-all duration-300 ${
                          passwordMismatch
                            ? "border-danger focus:border-danger focus:ring-danger/20"
                            : "border-cream-dark focus:border-gold-muted focus:ring-gold-muted/30"
                        }`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      />
                    </div>
                    {passwordMismatch && (
                      <p
                        className="mt-1.5 text-xs text-danger flex items-center gap-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        <span className="material-symbols-outlined text-base leading-none">error</span>
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  {error && (
                    <p
                      className="md:col-span-2 text-sm text-danger"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {error}
                    </p>
                  )}

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading || passwordMismatch}
                      className="w-full flex justify-center py-3 px-4 border border-gold-muted rounded shadow-sm bg-primary text-gold-light hover:bg-gold-muted hover:text-primary disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-semibold tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"
                      />
                    </button>
                  </div>
                </form>

                <p
                  className="mt-6 text-center text-sm text-text-secondary"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Already a member?{" "}
                  <Link
                    href="/auth/login"
                    className="text-gold-muted hover:text-primary font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-gold-muted/20 via-gold-muted to-gold-muted/20" />
            </div>

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
