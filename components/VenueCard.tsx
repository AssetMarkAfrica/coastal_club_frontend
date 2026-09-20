"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Venue } from "./venueData";

export default function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (venue.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % venue.images.length);
    }, 4500 + index * 300);
    return () => clearInterval(interval);
  }, [venue.images.length, index]);

  return (
    <div className="pillar-card group relative rounded-xl overflow-hidden flex flex-col h-full" style={{ background: "#0c1e35", border: "1px solid rgba(193,160,76,0.18)", boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}>

      {/* ── Image slideshow area ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
        {venue.images.map((imgUrl, idx) => (
          <img
            key={imgUrl}
            src={imgUrl}
            alt={`${venue.title} — view ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: idx === currentSlide ? 1 : 0,
              transform: idx === currentSlide ? "scale(1.04)" : "scale(1)",
              transition: "opacity 1.2s ease, transform 6s ease",
            }}
          />
        ))}

        {/* Cinematic overlay — bottom-heavy gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(12,30,53,0.1) 0%, rgba(12,30,53,0.08) 40%, rgba(12,30,53,0.72) 100%)" }} />

        {/* Tag pill — top left */}
        <span className="absolute top-4 left-4 z-10 text-[10px] uppercase font-semibold tracking-[0.18em] px-3 py-1.5 rounded-full" style={{ background: "rgba(12,30,53,0.75)", border: "1px solid rgba(193,160,76,0.45)", color: "#e8c96f", backdropFilter: "blur(8px)" }}>
          {venue.tag}
        </span>

        {/* Slide dots — bottom right */}
        {venue.images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5">
            {venue.images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="cursor-pointer rounded-full transition-all duration-500"
                style={{
                  width: idx === currentSlide ? "24px" : "6px",
                  height: "4px",
                  background: idx === currentSlide ? "#e8c96f" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Text body ── */}
      <div className="flex flex-col flex-1 p-7" style={{ background: "#0c1e35" }}>
        {/* Icon + title row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(193,160,76,0.12)", border: "1px solid rgba(193,160,76,0.3)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#e8c96f" }}>{venue.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#f0dfa0" }}>
              {venue.title}
            </h3>
          </div>
        </div>

        <div className="w-10 h-px mb-4" style={{ background: "rgba(193,160,76,0.4)" }} />

        <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "rgba(240,223,160,0.62)" }}>
          {venue.description}
        </p>

        <Link
          href={venue.route}
          className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold tracking-[0.16em] uppercase transition-all duration-300 group-hover:gap-2.5"
          style={{ color: "#c9a84c" }}
        >
          Explore
          <span className="material-symbols-outlined" style={{ fontSize: "16px", transition: "transform 0.3s ease" }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
