"use client";

import { useMemo } from "react";
import { MoreHorizontal } from "lucide-react";

import { BookingBlackoutPeriod } from "../../../types/membership";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disableSameDayIfPastNoon?: boolean;
  blackoutPeriods?: BookingBlackoutPeriod[];
}

export default function DatePicker({ value, onChange, disableSameDayIfPastNoon = false, blackoutPeriods = [] }: DatePickerProps) {
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    
    let startIndex = 0;
    if (disableSameDayIfPastNoon && today.getHours() >= 12) {
      startIndex = 1;
    }
    
    for (let i = startIndex; i < startIndex + 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      arr.push(date);
    }
    return arr;
  }, [disableSameDayIfPastNoon]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isBlackoutDate = (date: Date) => {
    return blackoutPeriods.some(period => {
      const start = new Date(period.start_date);
      const end = new Date(period.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  return (
    <div>
      <label className="font-label-uppercase text-label-uppercase text-text-secondary mb-2 block">
        Select Date
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide snap-x">
        {dates.map((date, idx) => {
          const isSelected = isSameDay(date, value);
          const isBlackout = isBlackoutDate(date);
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const dayNum = date.getDate();

          return (
            <button
              key={idx}
              onClick={() => !isBlackout && onChange(date)}
              disabled={isBlackout}
              title={isBlackout ? "Blackout period - not available" : undefined}
              className={`flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center snap-center relative transition-colors ${
                isSelected
                  ? "bg-primary-container border border-gold-light/50 shadow-md"
                  : isBlackout 
                  ? "bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed" 
                  : "bg-white border border-cream-dark hover:border-gold-light/30"
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                  isSelected ? "text-gold-light/70" : "text-text-muted"
                }`}
              >
                {dayName}
              </span>
              <span
                className={`font-h3 leading-none ${
                  isSelected
                    ? "text-gold-light text-h3"
                    : "text-text-primary text-[22px] font-medium"
                }`}
              >
                {dayNum}
              </span>
              {isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-gold-light rounded-full"></div>
              )}
            </button>
          );
        })}
        {/* Placeholder for more dates */}
        <button className="flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center text-primary-container">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
