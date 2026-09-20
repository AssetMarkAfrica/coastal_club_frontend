"use client";

import React from "react";
import { VENUES } from "./venueData";
import VenueCard from "./VenueCard";

export default function OtherLounges({ currentRoute }: { currentRoute: string }) {
  const otherVenues = VENUES.filter((venue) => venue.route !== currentRoute);

  return (
    <div className="relative py-24 bg-[#0a1628] flex flex-col justify-center items-center px-6 sm:px-12 [transform:translateZ(0)] z-10 border-t border-[#F1E0A6]/10 w-full">
      <style>{`
        .pillar-card { transition:transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
        .pillar-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(201,168,76,.18); border-color:rgba(201,168,76,.5); }
      `}</style>
      <div className="max-w-7xl w-full">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center space-x-3 mb-6">
            <span className="w-8 h-px bg-[#F1E0A6]" />
            <span className="text-[13px] uppercase tracking-[0.08em] font-semibold text-[#F1E0A6]">
              Discover More
            </span>
            <span className="w-8 h-px bg-[#F1E0A6]" />
          </div>
          <h2
            className="text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Explore <span className="italic text-[#F1E0A6]">Estrella del Mar</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherVenues.map((venue, index) => (
            <VenueCard key={venue.route} venue={venue} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
