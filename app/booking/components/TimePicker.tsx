"use client";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  availableTimes: string[];
}

export default function TimePicker({ value, onChange, availableTimes }: TimePickerProps) {
  return (
    <div>
      <label className="font-label-uppercase text-label-uppercase text-text-secondary mb-2 block">
        Select Time
      </label>
      <div className="grid grid-cols-3 gap-2">
        {availableTimes.map((time) => {
          const isSelected = value === time;

          return (
            <button
              key={time}
              onClick={() => onChange(time)}
              className={`py-3 px-2 rounded transition-colors text-sm ${
                isSelected
                  ? "border-2 border-primary-container bg-primary-container/5 text-center text-primary-container font-semibold shadow-sm relative"
                  : "border border-cream-dark bg-white text-center text-text-secondary font-medium hover:border-gold-light/40"
              }`}
            >
              {time}
              {isSelected && (
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-gold-muted rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
