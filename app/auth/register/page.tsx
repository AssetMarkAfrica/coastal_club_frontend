"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/auth/authThunks";
import { clearError } from "@/store/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
} from "@/store/auth/authSelectors";

const AUTH_IMAGES = [
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759411/FineDining3_ulq0dx.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
  "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787759412/FineDining1_bmcrtp.png"
];

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % AUTH_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none text-sm backdrop-blur-sm shadow-inner";
  const selectClass = "w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:bg-black/60 focus:border-gold-muted/50 focus:ring-1 focus:ring-gold-muted/50 transition-all outline-none text-sm backdrop-blur-sm shadow-inner appearance-none";
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
        
        /* Auto-fill fix for dark inputs */
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
          {/* Cinematic gradients to make text readable */}
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
              Become Part of <br/> 
              <span className="text-gold-light italic font-light">The Legacy</span>
            </h2>
            
            <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12" style={{ fontFamily: "var(--font-inter)" }}>
              Join our exclusive coastal sanctuary. Priority access, dedicated concierge, and a world of uncompromised taste await you 54 floors above the Atlantic.
            </p>

            <div className="flex gap-4 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-light shadow-[0_0_12px_rgba(232,201,111,0.8)]" />
              <div className="w-2 h-2 rounded-full bg-gold-light/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-gold-light/20" />
            </div>
          </div>

          {/* Right Form Area */}
          <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-16 my-auto">
            
            <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              
              {/* Mobile Brand Header */}
              <div className="lg:hidden p-8 pb-0 text-center">
                <Link href="/" className="inline-block mb-2">
                  <h1 className="text-3xl font-bold italic tracking-tight text-gold-light drop-shadow-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                    Estrella del Mar
                  </h1>
                </Link>
                <div className="w-12 h-px mx-auto mb-4 bg-gold-muted/50" />
              </div>

              {/* Card Header */}
              <div className="p-8 sm:p-10 border-b border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-muted to-transparent opacity-50" />
                 <h3 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Create Account</h3>
                 <p className="text-white/60 text-sm" style={{ fontFamily: "var(--font-inter)" }}>Enter your details to begin your membership application.</p>
              </div>

              {/* Form */}
              <div className="p-8 sm:p-10">
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <div className="relative group">
                      <span className={iconClass}>person</span>
                      <input id="firstName" name="first_name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="First" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <div className="relative group">
                      <span className={iconClass}>person</span>
                      <input id="lastName" name="last_name" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Last" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="gender" className={labelClass}>Gender</label>
                    <div className="relative group">
                      <span className={iconClass}>wc</span>
                      <select id="gender" name="gender" value={gender} onChange={e => setGender(e.target.value)} required className={selectClass}>
                        <option value="" disabled className="text-black">Select Gender</option>
                        <option value="male" className="text-black">Male</option>
                        <option value="female" className="text-black">Female</option>
                        <option value="other" className="text-black">Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
                    <div className="relative group">
                      <span className={iconClass}>cake</span>
                      <input id="dateOfBirth" name="date_of_birth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required className={inputClass} style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="phoneNumber" className={labelClass}>Phone Number</label>
                    <div className="relative group">
                      <span className={iconClass}>phone</span>
                      <input id="phoneNumber" name="phone_number" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required placeholder="+233 20 000 0000" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="username" className={labelClass}>Username</label>
                    <div className="relative group">
                      <span className={iconClass}>alternate_email</span>
                      <input id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="your_handle" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="email" className={labelClass}>Email Address</label>
                    <div className="relative group">
                      <span className={iconClass}>mail</span>
                      <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="member@estrelladelmar.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <div className="relative group">
                      <span className={iconClass}>lock</span>
                      <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="passwordConfirm" className={labelClass}>Confirm Password</label>
                    <div className="relative group">
                      <span className={iconClass}>lock_reset</span>
                      <input 
                        id="passwordConfirm" 
                        name="passwordConfirm" 
                        type="password" 
                        value={passwordConfirm} 
                        onChange={e => setPasswordConfirm(e.target.value)} 
                        required 
                        placeholder="••••••••" 
                        className={`w-full bg-white/5 border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:ring-1 transition-all outline-none text-sm backdrop-blur-sm shadow-inner ${
                          passwordMismatch
                            ? "border-danger focus:border-danger focus:ring-danger/50"
                            : "border-white/10 focus:border-gold-muted/50 focus:ring-gold-muted/50"
                        }`}
                      />
                    </div>
                    {passwordMismatch && (
                      <p className="mt-1.5 text-xs text-danger flex items-center gap-1 shadow-black drop-shadow-md">
                        <span className="material-symbols-outlined text-base leading-none">error</span>
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="md:col-span-2 bg-danger/20 border border-danger/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                      <span className="material-symbols-outlined text-danger">error_outline</span>
                      <p className="text-sm text-white">{error}</p>
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      disabled={loading || passwordMismatch}
                      className="w-full flex justify-center py-4 px-4 border-0 rounded-xl shadow-[0_4px_16px_rgba(232,201,111,0.2)] bg-gradient-to-r from-[#c9a84c] to-[#e8c96f] text-[#10243f] hover:shadow-[0_4px_24px_rgba(232,201,111,0.4)] disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group text-xs font-bold tracking-[0.2em] uppercase"
                    >
                      {loading ? "Processing..." : "Submit Application"}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-white/30 -translate-x-full group-hover:animate-shimmer pointer-events-none"
                      />
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-sm text-white/50" style={{ fontFamily: "var(--font-inter)" }}>
                    Already a member?{" "}
                    <Link href="/auth/login" className="text-gold-light hover:text-white font-semibold transition-colors duration-300">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-gold-muted/30 via-gold-light to-gold-muted/30" />
            </div>

            {/* Footer Links */}
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
