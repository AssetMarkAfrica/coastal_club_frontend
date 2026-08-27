"use client";
import { Utensils, Sofa, DoorClosed, Sunset } from "lucide-react";
import type { VenueType } from "../../../types/booking";

const VENUES: { value: VenueType; label: string; sub: string; Icon: React.ElementType }[] = [
  { value: "fine_dining",      label: "Fine Dining",      sub: "Curated à la carte",    Icon: Utensils  },
  { value: "executive_lounge", label: "Executive Lounge", sub: "Members' retreat",       Icon: Sofa      },
  { value: "private_room",     label: "Private Room",     sub: "Parties & meetings",     Icon: DoorClosed },
  { value: "skybar",           label: "Skybar",           sub: "Rooftop cocktail bar",   Icon: Sunset    },
];

interface ExperienceSelectorProps {
  value: VenueType | null;
  onChange: (value: VenueType) => void;
}

export default function ExperienceSelector({ value, onChange }: ExperienceSelectorProps) {
  return (
    <section className="bg-surface rounded-xl p-card-padding border border-gold-light/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      <h2 className="font-h4 text-h4 text-primary-container mb-4 flex items-center gap-2">
        <Utensils className="text-gold-muted w-6 h-6" />
        Venue
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {VENUES.map(({ value: v, label, sub, Icon }) => {
          const active = value === v;
          return (
            <button
              key={v}
              id={`venue-${v}`}
              onClick={() => onChange(v)}
              className={`flex flex-col items-start gap-1 p-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gold-muted/60 relative overflow-hidden text-left ${
                active
                  ? "border-2 border-primary-container bg-primary-container/5"
                  : "border border-cream-dark bg-white hover:border-gold-light/50"
              }`}
            >
              <Icon
                className={`w-7 h-7 mb-1 transition-transform active:scale-95 ${
                  active ? "text-primary-container" : "text-surface-tint"
                }`}
              />
              <span
                className={`font-label-uppercase text-label-uppercase leading-tight ${
                  active ? "text-primary-container" : "text-text-primary"
                }`}
              >
                {label}
              </span>
              <span className="text-xs text-text-muted leading-tight">{sub}</span>
              {active && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
