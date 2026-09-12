"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUserRole } from "@/store/auth/authSelectors";
import { loginUser } from "@/store/auth/authThunks";
import { clearError, setError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";
import * as authService from "@/services/auth/AuthService";

const AUTH_IMAGES = [
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining3_ulq0dx.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining1_bmcrtp.png"
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const role = useAppSelector(selectCurrentUserRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(clearError());

    try {
      // unwrap() returns the fulfilled action payload — use it directly
      const result = await dispatch(loginUser({ email, password })).unwrap();

      if (result.user.role === "admin") {
        router.push("/membership/view-applications");
      }
      else if (result.user.role === "staff") {
        router.push("/booking/staff/reservations")
      }
      else {
        router.push("/");
      }
    } catch {
      // Slice state already contains human-readable error.
    }
  };


  const onGoogleSignIn = async () => {
    dispatch(clearError());
    setGoogleLoading(true);

    try {
      const response = await authService.getGoogleAuthorizeUrl();
      const authUrl = response.data?.data?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        dispatch(setError("Failed to get Google authorization URL from server."));
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { detail?: string; message?: string } }; message?: string };
      const errorMessage =
        errorObj.response?.data?.detail ||
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Failed to connect to Google OAuth service. Please try again.";
      dispatch(setError(errorMessage));
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % AUTH_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none text-sm backdrop-blur-sm shadow-inner";
  const labelClass = "block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-2 ml-1";
  const iconClass = "material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none transition-colors group-focus-within:text-gold-light";

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
          {AUTH_IMAGES.map((src, index) => (
            <div
              key={src}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: index === currentImageIndex ? 1 : 0,
                transition: "opacity 2.5s ease-in-out",
              }}
            >
              <img
                src={src}
                alt="Estrella del Mar Background"
                className="w-full h-full object-cover"
                style={{
                  transform: index === currentImageIndex ? "scale(1.08)" : "scale(1)",
                  transition: "transform 10s ease-out",
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/70 to-navy-deep/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 flex flex-col lg:flex-row w-full min-h-screen">
          
          {/* Left Brand Area */}
          <div className="hidden lg:flex flex-col justify-center w-5/12 p-16 xl:p-24 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Link href="/" className="inline-block mb-12 group">
              <h1 className="text-5xl xl:text-6xl font-bold italic tracking-tight text-white group-hover:text-gold-light transition-colors duration-500 drop-shadow-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
                Estrella del Mar
              </h1>
            </Link>
            
            <div className="w-16 h-px mb-8 bg-gradient-to-r from-gold-muted to-transparent" />
            
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight text-white mb-6 drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              Welcome Back <br/> 
              <span className="text-gold-light italic font-light">to Excellence</span>
            </h2>
            
            <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12" style={{ fontFamily: "var(--font-inter)" }}>
              Sign in to access your portal, manage reservations, and explore exclusive privileges.
            </p>

            <div className="flex gap-4 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-light shadow-[0_0_12px_rgba(232,201,111,0.8)]" />
              <div className="w-2 h-2 rounded-full bg-gold-light/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-light/20" />
            </div>
          </div>

          {/* Right Form Area */}
          <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16 my-auto">
            
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              
              <div className="lg:hidden p-8 pb-0 text-center">
                <Link href="/" className="inline-block mb-2">
                  <h1 className="text-3xl font-bold italic tracking-tight text-gold-light drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                    Estrella del Mar
                  </h1>
                </Link>
                <div className="w-12 h-px mx-auto mb-4 bg-gold-muted/50" />
              </div>

              <div className="p-8 sm:p-10 border-b border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-muted to-transparent opacity-50" />
                 <h3 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Member Login</h3>
                 <p className="text-white/60 text-sm" style={{ fontFamily: "var(--font-inter)" }}>Please enter your credentials to access your account.</p>
              </div>

              <div className="p-8 sm:p-10">
                <form onSubmit={onSubmit} className="space-y-6">
                  
                  <div className="space-y-1.5">
                    <label htmlFor="email" className={labelClass}>Email Address</label>
                    <div className="relative group">
                      <span className={iconClass}>mail</span>
                      <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="member@estrelladelmar.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 ml-1">Password</label>
                      <Link href="/auth/password/reset/request" className="text-[11px] font-semibold tracking-wider text-gold-muted hover:text-gold-light transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <span className={iconClass}>lock</span>
                      <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-danger/20 border border-danger/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                      <span className="material-symbols-outlined text-danger">error_outline</span>
                      <p className="text-sm text-white">{error}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-4 px-4 border-0 rounded-xl shadow-[0_4px_16px_rgba(232,201,111,0.2)] bg-gradient-to-r from-[#c9a84c] to-[#e8c96f] text-[#10243f] hover:shadow-[0_4px_24px_rgba(232,201,111,0.4)] disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-bold tracking-[0.2em] uppercase"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                      <span aria-hidden className="absolute inset-0 bg-white/30 -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <Link
                    href="/auth/register"
                    className="w-full flex justify-center py-4 px-4 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 text-xs font-bold tracking-[0.2em] uppercase shadow-inner"
                  >
                    Create Account
                  </Link>
                </div>

                <div className="mt-8 relative">
                  <div aria-hidden className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-5 py-1.5 bg-black/20 backdrop-blur-md text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 rounded-full border border-white/5">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={loading || googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-white/10 rounded-xl bg-white/5 text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 text-xs font-bold tracking-[0.2em] uppercase shadow-inner"
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {googleLoading ? "Connecting..." : "Google"}
                  </button>
                </div>
              </div>

              <div className="h-1.5 w-full bg-gradient-to-r from-gold-muted/30 via-gold-light to-gold-muted/30" />
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center flex justify-center gap-8 flex-wrap z-30 pointer-events-none">
              <div className="pointer-events-auto flex gap-8">
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Contact Concierge", href: "#" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-xs tracking-wider uppercase text-white/40 hover:text-gold-light transition-colors duration-300"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
