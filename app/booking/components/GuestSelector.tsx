"use client";
import { Minus, Plus } from "lucide-react";

interface GuestSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export default function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const increment = () => {
    if (value < 20) onChange(value + 1);
  };

  const decrement = () => {
    if (value > 1) onChange(value - 1);
  };

  return (
    <div className="flex items-center justify-between bg-cream rounded-lg p-3 border border-cream-dark mb-4">
      <span className="font-label-uppercase text-label-uppercase text-text-secondary">
        Guests
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={decrement}
          disabled={value <= 1}
          className="w-8 h-8 rounded-full bg-white border border-cream-dark flex items-center justify-center text-primary-container hover:bg-gold-light/10 active:scale-95 transition-all disabled:opacity-50"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="font-h4 text-h4 text-primary-container w-4 text-center">
          {value}
        </span>
        <button
          onClick={increment}
          disabled={value >= 20}
          className="w-8 h-8 rounded-full bg-white border border-cream-dark flex items-center justify-center text-primary-container hover:bg-gold-light/10 active:scale-95 transition-all disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
