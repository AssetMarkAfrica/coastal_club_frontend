"use client";
import { Utensils, Wine, Sparkles } from "lucide-react";

interface ExperienceSelectorProps {
  value: "dining" | "spa";
  onChange: (value: "dining" | "spa") => void;
}

export default function ExperienceSelector({
  value,
  onChange,
}: ExperienceSelectorProps) {
  return (
    <section className="bg-surface rounded-xl p-card-padding border border-gold-light/25 shadow-[0_4px_24px_rgba(30,58,95,0.08)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
      <h2 className="font-h4 text-h4 text-primary-container mb-4 flex items-center gap-2">
        <Utensils className="text-gold-muted w-6 h-6" />
        Experience
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange("dining")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all focus:ring-2 focus:ring-gold-muted/60 relative overflow-hidden group ${
            value === "dining"
              ? "border-2 border-primary-container bg-primary-container/5"
              : "border border-cream-dark bg-white hover:border-gold-light/50 text-text-secondary"
          }`}
        >
          <Wine
            className={`w-8 h-8 mb-2 group-active:scale-95 transition-transform ${
              value === "dining" ? "text-primary-container" : "text-surface-tint"
            }`}
          />
          <span
            className={`font-label-uppercase text-label-uppercase ${
              value === "dining" ? "text-primary-container" : "text-text-secondary"
            }`}
          >
            Dining
          </span>
          {value === "dining" && (
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-gold-light rounded-full mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity"></div>
          )}
        </button>
        <button
          onClick={() => onChange("spa")}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all focus:ring-2 focus:ring-gold-muted/60 relative overflow-hidden group ${
            value === "spa"
              ? "border-2 border-primary-container bg-primary-container/5"
              : "border border-cream-dark bg-white hover:border-gold-light/50 text-text-secondary"
          }`}
        >
          <Sparkles
            className={`w-8 h-8 mb-2 group-active:scale-95 transition-transform ${
              value === "spa" ? "text-primary-container" : "text-surface-tint"
            }`}
          />
          <span
            className={`font-label-uppercase text-label-uppercase ${
              value === "spa" ? "text-primary-container" : "text-text-secondary"
            }`}
          >
            Spa
          </span>
          {value === "spa" && (
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-gold-light rounded-full mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity"></div>
          )}
        </button>
      </div>
    </section>
  );
}
