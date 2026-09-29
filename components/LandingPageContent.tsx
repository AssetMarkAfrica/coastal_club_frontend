"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
import ReviewSection from "./review/ReviewSection";
import SharedNavbar from "./SharedNavbar";
import { VENUES } from "./venueData";
import VenueCard from "./VenueCard";

/* ── Hero video carousel ── */
const HERO_VIDEOS = [
  {
    src: "https://res.cloudinary.com/dqwub0fhb/video/upload/v1787758127/PrivateRoomVideo_ex7xik.mp4",
    label: "The Private Room",
  },
  {
    src: "https://res.cloudinary.com/dqwub0fhb/video/upload/v1789925589/Fine_Dining_sonwgo.mp4",
    label: "Fine Dining",
  },
  {
    src: "https://res.cloudinary.com/dqwub0fhb/video/upload/v1787758817/SkybarVideo_zarrv5.mp4",
    label: "The Sky Bar",
  },
  {
    src: "https://res.cloudinary.com/dqwub0fhb/video/upload/v1789927472/SunsetBarVideo_wtmj1l.mp4",
    label: "Sunset Bar",
  },
];

function HeroVideoCarousel() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // When a video ends, crossfade to the next
  const handleEnded = useCallback((idx: number) => {
    if (idx !== active) return; // stale closure guard
    setFading(true);
    setTimeout(() => {
      const next = (idx + 1) % HERO_VIDEOS.length;
      setActive(next);
      setFading(false);
      // play the next video
      const nextVid = videoRefs.current[next];
      if (nextVid) {
        nextVid.currentTime = 0;
        nextVid.play().catch(() => { });
      }
    }, 600); // half the CSS transition duration
  }, [active]);

  // Pause all except the active one on mount / change
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      } else {
        vid.pause();
      }
    });
  }, [active]);

  return (
    <div className="absolute inset-0 z-0">
      {HERO_VIDEOS.map((video, i) => (
        <video
          key={video.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          onEnded={() => handleEnded(i)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === active ? (fading ? 0 : 0.65) : 0,
            transition: "opacity 1.2s ease",
            pointerEvents: "none",
          }}
        >
          <source src={video.src} type="video/mp4" />
        </video>
      ))}

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(16,36,63,0.55) 0%, rgba(16,36,63,0.2) 35%, rgba(16,36,63,0.3) 60%, rgba(16,36,63,0.97) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(16,36,63,0.35) 0%, transparent 50%, rgba(16,36,63,0.35) 100%)" }} />

      {/* Video progress indicator — top-right */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-1.5">
        {HERO_VIDEOS.map((video, i) => (
          <button
            key={video.src}
            onClick={() => setActive(i)}
            className="flex items-center gap-2 group"
            aria-label={`Switch to ${video.label}`}
          >
            <span
              className="text-[9px] font-semibold tracking-widest uppercase transition-all duration-500"
              style={{ color: i === active ? "#e8c96f" : "rgba(255,255,255,0.35)" }}
            >
              {video.label}
            </span>
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: i === active ? "28px" : "6px",
                height: "3px",
                background: i === active ? "#e8c96f" : "rgba(255,255,255,0.3)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}


/* ── Tiny hook: fires once when element enters viewport ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

/* ── Fade up wrapper ── */
function FadeUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Slide in from side ── */
function SlideIn({ children, from = "left", delay = 0, className = "" }: { children: ReactNode; from?: "left" | "right"; delay?: number; className?: string }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : `translateX(${from === "left" ? "-48px" : "48px"})`,
      transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const step = Math.ceil(end / 60);
    const t = setInterval(() => { n = Math.min(n + step, end); setCount(n); if (n >= end) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [visible, end]);
  return <span ref={ref}>{count}{suffix}</span>;
}




export default function LandingPageContent({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @keyframes wordDrop { from { opacity:0; transform:translateY(-24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes scrollBounce { 0%,100% { transform:translateY(0); opacity:1; } 50% { transform:translateY(8px); opacity:.4; } }
        .hero-word { display:inline-block; opacity:0; animation:wordDrop 0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
        .gold-shimmer { background:linear-gradient(90deg,#c9a84c 0%,#e8c96f 35%,#f5e0a0 50%,#e8c96f 65%,#c9a84c 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
        .scroll-bounce { animation:scrollBounce 1.8s ease-in-out infinite; }

        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #c9a84c;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-link-active {
          position: relative;
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #c9a84c;
          transform: scaleX(1);
        }

        .pillar-card { transition:transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .pillar-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(201,168,76,.18); border-color:rgba(201,168,76,.5); }
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .pillar-card:hover .pillar-icon { animation:iconFloat 1.2s ease-in-out infinite; }
      `}</style>

      <div className="bg-cream text-text-primary antialiased" style={{ fontFamily: "var(--font-inter)" }}>

        <SharedNavbar />

        {/* ── Hero Video Section ── */}
        <section className="relative w-full flex flex-col overflow-hidden bg-black" style={{ minHeight: "100vh" }}>
          {/* Background video carousel */}
          <HeroVideoCarousel />

          {/* ── Main hero content — centred vertically ── */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
            {/* Eyebrow label */}


            {/* Main headline */}
            <h1 className="font-bold text-white leading-[1.08] mb-6" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(3rem, 8vw, 6.5rem)", animation: "wordDrop 0.7s ease 300ms both", textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
              Where Excellence
              <br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: "#e8c96f" }}>Meets the Horizon</span>
            </h1>

            {/* Tagline */}
            <p className="max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(240,223,160,0.82)", animation: "wordDrop 0.7s ease 550ms both" }}>
              An exclusive coastal sanctuary of haute cuisine, rooftop cocktail artistry,<br className="hidden md:block" />
              rare spirits, and bespoke private events — right on the shores of Laboma Beach.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14" style={{ animation: "wordDrop 0.6s ease 750ms both" }}>
              <Link
                href="/booking"
                className="group flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase rounded transition-all duration-300"
                style={{ background: "#c9a84c", color: "#10243f", boxShadow: "0 0 32px rgba(201,168,76,0.3)" }}
              >
                Reserve a Table
                <span className="material-symbols-outlined" style={{ fontSize: "16px", transition: "transform 0.3s" }}>arrow_right_alt</span>
              </Link>
              <Link
                href="/membership/plans"
                className="flex items-center justify-center gap-2 px-9 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase rounded transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(193,160,76,0.45)", color: "#f0dfa0", backdropFilter: "blur(8px)" }}
              >
                Explore Membership
              </Link>
            </div>

            {/* Inline stats row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-14" style={{ animation: "wordDrop 0.6s ease 950ms both" }}>
              {[
                { v: "5", label: "Curated Venues" },
                { v: "3", label: "Membership Tiers" },
                { v: "100%", label: "Private & Exclusive" },
                { v: "1", label: "Coastal Location" },
              ].map(({ v, label }) => (
                <div key={label} className="text-center">
                  <div className="font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#e8c96f" }}>{v}</div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(193,160,76,0.65)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom venue quick-nav bar ── */}
          <div className="relative z-10 w-full" style={{ borderTop: "1px solid rgba(193,160,76,0.2)", background: "rgba(16,36,63,0.75)", backdropFilter: "blur(16px)" }}>
            <div className="max-w-7xl mx-auto px-6 py-0 grid grid-cols-2 md:grid-cols-5 divide-x" style={{ borderColor: "rgba(193,160,76,0.15)" }}>
              {[
                { label: "The Sky Bar", tag: "Rooftop Terrace", href: "/skybar", icon: "roofing" },
                { label: "Sunset Bar", tag: "Glass Canopy", href: "/sunset-bar", icon: "local_bar" },
                { label: "Fine Dining", tag: "Ground Floor", href: "/fine-dining", icon: "restaurant" },
                { label: "Executive Lounge", tag: "Members Only", href: "/executive-lounge", icon: "diamond" },
                { label: "The Private Room", tag: "Exclusive Hire", href: "/private-room", icon: "meeting_room" },
              ].map(({ label, tag, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-3 px-6 py-5 transition-all duration-300"
                  style={{ borderColor: "rgba(193,160,76,0.15)" }}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: "rgba(193,160,76,0.1)", border: "1px solid rgba(193,160,76,0.3)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#c9a84c" }}>{icon}</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold leading-tight group-hover:text-gold-light transition-colors" style={{ color: "#f0dfa0", fontFamily: "var(--font-playfair)" }}>{label}</div>
                    <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(193,160,76,0.55)" }}>{tag}</div>
                  </div>
                  <span className="material-symbols-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: "16px", color: "#c9a84c" }}>chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        </section>



        {/* ── The 4 Main Lounges & Venues (With Automated Slideshow Cards) ── */}
        <section className="relative overflow-hidden" style={{ background: "#0c1e35", padding: "100px 0" }}>
          {/* Subtle decorative backdrop */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(193,160,76,0.06) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px" style={{ background: "linear-gradient(to right, transparent, rgba(193,160,76,0.35), transparent)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Section header */}
            <FadeUp className="text-center mb-16">
              <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase mb-4" style={{ color: "#c9a84c" }}>Estrella del Mar</span>
              <h2 className="text-4xl md:text-5xl font-semibold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#f0dfa0" }}>Our Exclusive Destinations</h2>
              <div className="mx-auto mb-6" style={{ width: "64px", height: "1.5px", background: "rgba(193,160,76,0.5)" }} />
              <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(240,223,160,0.6)", lineHeight: "1.75" }}>
                Five distinct culinary and social destinations — each architected for an unforgettable experience.
              </p>
            </FadeUp>

            {/* 2×2 even grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {VENUES.map((venue, i) => (
                <FadeUp key={venue.title} delay={i * 120}>
                  <VenueCard venue={venue} index={i} />
                </FadeUp>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px" style={{ background: "linear-gradient(to right, transparent, rgba(193,160,76,0.25), transparent)" }} />
        </section>

        {/* ── Location / Sanctuary ── */}
        <section className="py-24 bg-white border-y border-gold-muted/20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideIn from="left" className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 border border-gold-muted/20 rounded-lg -rotate-2" />
              <div className="absolute -inset-4 border border-gold-muted/20 rounded-lg rotate-2" />
              <div className="relative bg-cream-dark p-2 rounded-lg shadow-xl">
                <div className="bg-navy-deep rounded overflow-hidden relative h-[500px] w-full flex items-center justify-center">
                  <img
                    src="https://res.cloudinary.com/dqwub0fhb/image/upload/v1789925574/FineDining3_zpycce.png"
                    alt="Estrella del Mar Main Hall"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                  <div className="text-center z-10 px-8 absolute bottom-12">
                    <span className="material-symbols-outlined text-4xl text-gold-light mb-3 block">location_on</span>
                    <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Laboma Beach</h3>
                    <p className="text-cream/70 text-sm">Accra, Ghana</p>
                    <div className="mt-6 border border-gold-muted/30 p-3 inline-block bg-white/5 backdrop-blur-sm rounded">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-light">Coordinates</p>
                      <p className="text-white font-mono text-xs mt-0.5">5.5401° N, 0.1345° W</p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn from="right" delay={150} className="order-1 lg:order-2">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-muted mb-4 block">The Sanctuary</span>
              <h2 className="text-4xl font-semibold text-navy-deep mb-6" style={{ fontFamily: "var(--font-playfair)" }}>A World Above the Atlantic</h2>
              <p className="text-base text-text-secondary mb-8 leading-relaxed">
                Nestled along the pristine shores of Laboma Beach, Estrella del Mar offers a sanctuary of uncompromised taste.
                From our elegant dining hall to the open-air Sky Bar terrace, every space is architected for distinction.
              </p>
              <ul className="space-y-4 mb-10">
                {["15 minutes from Kotoka International Airport", "Private valet & secure access roads", "Helipad & yacht arrival concierge"].map((item, i) => (
                  <FadeUp key={item} delay={i * 100}>
                    <li className="flex items-start">
                      <span className="material-symbols-outlined text-gold-muted mr-3 mt-1">check_circle</span>
                      <span className="text-base text-text-primary">{item}</span>
                    </li>
                  </FadeUp>
                ))}
              </ul>
              <Link href="/booking" className="border border-navy-deep text-navy-deep px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-navy-deep hover:text-white transition-all duration-300 rounded inline-flex items-center group">
                Reserve Your Experience <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">east</span>
              </Link>
            </SlideIn>
          </div>
        </section>

        {/* ── Guest Reviews ── */}
        <ReviewSection isAuthenticated={isAuthenticated} minRating={4} showViewMore={true} />

        {/* ── Membership CTA ── */}
        <section className="navy-gradient-bg py-24 relative overflow-hidden bg-[#10243F]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-muted/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          <FadeUp className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <span className="material-symbols-outlined text-gold-light text-5xl mb-6 block">workspace_premium</span>
            <h2 className="text-4xl font-semibold text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Elevate Your World</h2>
            <p className="text-lg text-cream/80 mb-10 max-w-2xl mx-auto">
              Membership at Estrella del Mar provides priority access across all four venues, dedicated concierge service, and invitation-only events.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/membership/plans" className="bg-gold-light text-navy-deep border border-gold-light px-10 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-transparent hover:text-gold-light transition-all duration-300 rounded w-full sm:w-auto shadow-lg shadow-gold-muted/20">
                Explore Membership Tiers
              </Link>
              <Link href="/contact" className="bg-transparent text-white border border-white/30 px-10 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-white/10 transition-all duration-300 rounded w-full sm:w-auto">
                Contact Concierge
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-navy-deep w-full py-12 border-t border-gold-muted/30 flex flex-col items-center justify-center text-center space-y-6 px-6">
          <div className="text-2xl font-semibold text-gold-light mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Estrella del Mar</div>
          <div className="flex flex-wrap justify-center gap-8 mb-4">
            {[
              { label: "The Sky Bar", href: "/skybar" },
              { label: "Sunset Bar", href: "/sunset-bar" },
              { label: "Fine Dining", href: "/fine-dining" },
              { label: "Executive Lounge", href: "/executive-lounge" },
              { label: "The Private Room", href: "/private-room" },
              { label: "Membership", href: "/membership/plans" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="nav-link text-gold-muted/80 hover:text-gold-light transition-colors text-xs font-semibold tracking-widest uppercase py-1">
                {label}
              </Link>
            ))}
          </div>
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gold-muted/30 to-transparent" />
          <p className="text-xs text-gold-muted opacity-80 uppercase tracking-widest">© {new Date().getFullYear()} Estrella del Mar. All rights reserved. Laboma Beach, Accra.</p>
        </footer>

      </div>
    </>
  );
}