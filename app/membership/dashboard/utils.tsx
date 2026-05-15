import {
    IconConcierge,
    IconEvents, IconSpa,
    IconFork,
} from "./icons";

export const formatMoney = (pesewas: number) =>
  `$${(pesewas / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value)
  );
};

export const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");




/* ── Quick services ── */
export const QUICK_SERVICES = [
  { label: "Dining\nReservation", icon: <IconFork />, href: "#" },
  { label: "Spa\nBooking", icon: <IconSpa />, href: "#" },
  { label: "Private\nEvents", icon: <IconEvents />, href: "#" },
  { label: "Concierge\nRequest", icon: <IconConcierge />, href: "#" },
];
