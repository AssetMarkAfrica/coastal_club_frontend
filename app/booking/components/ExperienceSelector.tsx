"use client";
import { Utensils, Sofa, DoorClosed, Sunset, ImageOff } from "lucide-react";
import type { VenueType } from "../../../types/booking";

const VENUES: {
  value: VenueType;
  label: string;
  tagline: string;
  image: string | null;
  Icon: React.ElementType;
  placeholderBg: string;
}[] = [
  {
    value: "fine_dining",
    label: "Fine Dining",
    tagline: "An exquisite à la carte dining journey",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787761397/FineDining7_fepbsb.png",
    Icon: Utensils,
    placeholderBg: "linear-gradient(135deg, #1a2744 0%, #0a1628 100%)",
  },
  {
    value: "executive_lounge",
    label: "Executive Lounge",
    tagline: "An exclusive sanctuary for our members",
    image: null,
    Icon: Sofa,
    placeholderBg: "linear-gradient(135deg, #1E3A5F 0%, #10243F 100%)",
  },
  {
    value: "private_room",
    label: "Private Room",
    tagline: "Intimate parties & private gatherings",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787758507/PrivateRoom1_eihid3.png",
    Icon: DoorClosed,
    placeholderBg: "linear-gradient(135deg, #2a1a0a 0%, #1a0f05 100%)",
  },
  {
    value: "skybar",
    label: "Skybar",
    tagline: "Cocktails beneath an open sky",
    image: "https://res.cloudinary.com/dqwub0fhb/image/upload/v1787757506/Skybar1_akorqw.png",
    Icon: Sunset,
    placeholderBg: "linear-gradient(135deg, #0d2030 0%, #050d18 100%)",
  },
];

interface Props {
  value: VenueType | null;
  onChange: (value: VenueType) => void;
}

export default function ExperienceSelector({ value, onChange }: Props) {
  const selected = VENUES.find((v) => v.value === value) ?? VENUES[0];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Cinematic hero ── */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(10,22,40,0.28)]"
        style={{ height: "280px" }}
      >
        {/* Background */}
        {selected.image ? (
          <img
            key={selected.value}
            src={selected.image}
            alt={selected.label}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: "opacity 0.5s ease" }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: selected.placeholderBg }}
          >
            <selected.Icon className="w-20 h-20 text-white/[0.07]" />
          </div>
        )}

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Top-left: brand pill */}
        <div className="absolute top-4 left-4">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse" />
            <span className="text-gold-light text-[10px] font-bold uppercase tracking-[0.2em]">
              Coastal Club
            </span>
          </div>
        </div>

        {/* Top-right: "photo soon" badge for lounge */}
        {!selected.image && (
          <div className="absolute top-4 right-4">
            <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
              <ImageOff className="w-3 h-3 text-white/40" />
              <span className="text-white/40 text-[9px] font-medium uppercase tracking-wider">
                Photo soon
              </span>
            </div>
          </div>
        )}

        {/* Bottom: venue info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <selected.Icon className="w-3.5 h-3.5 text-gold-light/70" />
            <span className="text-gold-light/60 text-[9px] font-bold uppercase tracking-[0.18em]">
              Selected Venue
            </span>
          </div>
          <h3 className="text-white text-[26px] font-bold leading-tight tracking-tight">
            {selected.label}
          </h3>
          <p className="text-white/55 text-sm mt-0.5 font-light">{selected.tagline}</p>
        </div>
      </div>

      {/* ── Thumbnail selector strip ── */}
      <div className="grid grid-cols-4 gap-2">
        {VENUES.map(({ value: v, label, image, Icon, placeholderBg }) => {
          const active = value === v;
          return (
            <button
              key={v}
              id={`venue-${v}`}
              onClick={() => onChange(v)}
              aria-label={`Select ${label}`}
              className={`relative overflow-hidden rounded-xl focus:outline-none transition-all duration-200 ${
                active
                  ? "ring-2 ring-gold-light ring-offset-2 ring-offset-white shadow-[0_0_18px_rgba(212,175,55,0.45)]"
                  : "opacity-55 hover:opacity-85 hover:ring-1 hover:ring-gold-light/30 hover:ring-offset-1"
              }`}
              style={{ aspectRatio: "1" }}
            >
              {/* Image or placeholder */}
              {image ? (
                <img
                  src={image}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: placeholderBg }}
                >
                  <Icon className="w-5 h-5 text-white/25" />
                </div>
              )}

              {/* Overlay gradient for label legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 px-1 pb-1.5">
                <span className="block text-white text-[9px] font-semibold text-center leading-tight">
                  {label}
                </span>
              </div>

              {/* Active dot */}
              {active && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-light shadow-[0_0_6px_rgba(212,175,55,0.9)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
