"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMyMembershipCard } from "@/store/membership/cardThunks";

/* ── helpers ─────────────────────────────────────────── */
const pesewasToGHS = (p: number) =>
  (p / 100).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const tierLabel = (tier: string) =>
  tier.charAt(0).toUpperCase() + tier.slice(1);

const maintenanceLabel = (status: string) => {
  if (status === "bonus_active") return "Bonus Active";
  if (status === "paid") return "Paid";
  if (status === "overdue") return "Overdue";
  return status.replace(/_/g, " ");
};

/* ── component ───────────────────────────────────────── */
export default function MemberCardPage() {
  const dispatch = useAppDispatch();
  const { card, loading, error } = useAppSelector((s) => s.card);
  const [flipped, setFlipped] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getMyMembershipCard());
  }, [dispatch]);

  useEffect(() => {
    if (!card || !progressRef.current) return;
    const used =
      card.monthly_spend_credit_pesewas - card.spend_credit_remaining_pesewas;
    const pct =
      card.monthly_spend_credit_pesewas > 0
        ? Math.min((used / card.monthly_spend_credit_pesewas) * 100, 100)
        : 0;
    const timer = setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    }, 600);
    return () => clearTimeout(timer);
  }, [card]);

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="flex-1 md:ml-[260px] min-h-screen bg-[#F7F3EC] flex flex-col">
        <MobileHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-10 p-8">
          <div className="w-full max-w-[420px] aspect-[1.6/1] rounded-2xl bg-navy-deep/10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <main className="flex-1 md:ml-[260px] min-h-screen bg-[#F7F3EC] flex flex-col">
        <MobileHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-danger" style={{ fontVariationSettings: "'FILL' 1" }}>
              error
            </span>
          </div>
          <p className="text-navy-deep/60 text-sm max-w-xs">{error}</p>
          <button
            onClick={() => dispatch(getMyMembershipCard())}
            className="px-6 py-2.5 border border-gold-muted text-gold-muted rounded text-xs font-semibold tracking-[0.14em] uppercase hover:bg-gold-muted hover:text-navy-deep transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!card) return null;

  const spendUsed =
    card.monthly_spend_credit_pesewas - card.spend_credit_remaining_pesewas;
  const spendPct =
    card.monthly_spend_credit_pesewas > 0
      ? Math.min((spendUsed / card.monthly_spend_credit_pesewas) * 100, 100)
      : 0;

  const isActive = card.status === "active";
  const isBonusActive = card.is_signup_bonus_active;

  return (
    <main
      className="flex-1 md:ml-[260px] min-h-screen flex flex-col"
      style={{ background: "#F7F3EC" }}
    >
      <MobileHeader />

      {/* ── Page header ── */}
      <div className="px-8 pt-10 pb-0 max-w-5xl mx-auto w-full">
        <p
          className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-2"
          style={{ color: "#B7922B", fontFamily: "var(--font-inter)" }}
        >
          Estrella del Mar
        </p>
        <h1
          className="text-4xl font-semibold text-navy-deep leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Digital Member Card
        </h1>
        <p className="mt-2 text-sm text-navy-deep/50 max-w-md leading-relaxed">
          Present for exclusive access, priority bookings, and member privileges
          across all Estrella del Mar properties.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center px-8 pt-10 pb-12 max-w-5xl mx-auto w-full gap-10">

        {/* ══════════════════════════════════════════
            FLIP CARD
        ══════════════════════════════════════════ */}
        <div
          className="relative w-full max-w-[460px] cursor-pointer select-none group"
          style={{ aspectRatio: "1.586 / 1", perspective: "2400px" }}
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Click to flip back" : "Click to reveal QR code"}
        >
          {/* Glow shadow beneath */}
          <div
            className="absolute inset-x-6 -bottom-4 h-10 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-60"
            style={{ background: "linear-gradient(90deg, #B7922B, #F1E0A6, #B7922B)" }}
          />

          <div
            className="w-full h-full relative transition-transform duration-[900ms]"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* ── FRONT ── */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                background: "linear-gradient(135deg, #B7922B 0%, #F1E0A6 22%, #C9A84C 44%, #F1E0A6 66%, #B7922B 100%)",
                padding: "1.5px",
                boxShadow: "0 32px 64px -12px rgba(2,36,72,0.45), 0 8px 24px -8px rgba(183,146,43,0.25)",
              }}
            >
              <div
                className="w-full h-full relative rounded-[14px] overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #0C1F3A 0%, #081628 55%, #0F2540 100%)",
                }}
              >
                {/* Subtle triangle pattern */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ opacity: 0.06 }}
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <pattern id="tri" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <polygon points="20,0 40,40 0,40" fill="#C9A84C" />
                      <polygon points="0,0 20,40 40,0" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#tri)" />
                </svg>

                {/* Gold shimmer sweep */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(241,224,166,0.09) 50%, transparent 65%)",
                    animation: "shimmer 4s ease-in-out infinite",
                  }}
                />

                <div className="relative z-10 h-full p-7 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex justify-between items-start">
                    <h3
                      className="italic text-[20px] font-semibold leading-none"
                      style={{ fontFamily: "var(--font-playfair)", color: "#C9A84C" }}
                    >
                      Estrella del Mar
                    </h3>
                    <div
                      className="w-9 h-9 rounded-full border flex items-center justify-center"
                      style={{ borderColor: "rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.08)" }}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ color: "#D4AF37", fontVariationSettings: "'FILL' 1" }}
                      >
                        workspace_premium
                      </span>
                    </div>
                  </div>

                  {/* Member number — vertical */}
                  <div
                    className="absolute right-5 top-1/2"
                    style={{ transform: "translateY(-50%) rotate(90deg)" }}
                  >
                    <p
                      className="font-mono text-[9px] tracking-[0.6em] uppercase whitespace-nowrap"
                      style={{ color: "rgba(201,168,76,0.22)" }}
                    >
                      {card.member_number}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="flex justify-between items-end gap-3">
                    <div>
                      <p
                        className="text-[10px] tracking-[0.28em] uppercase font-medium mb-2"
                        style={{ color: "rgba(201,168,76,0.55)", fontFamily: "var(--font-inter)" }}
                      >
                        {tierLabel(card.tier)} Member
                      </p>
                      <p
                        className="tracking-widest uppercase leading-none"
                        style={{
                          fontSize: "clamp(18px, 4vw, 24px)",
                          fontWeight: 800,
                          color: "#F1E0A6",
                          fontFamily: "var(--font-playfair)",
                          textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                        }}
                      >
                        {card.member_name}
                      </p>
                    </div>

                    {/* NFC / tap icon */}
                    <div style={{ color: "rgba(201,168,76,0.45)", flexShrink: 0 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" opacity=".25" />
                        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" opacity=".55" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity=".8" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BACK ── */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: "#FDFAF5",
                border: "1.5px solid rgba(201,168,76,0.25)",
                boxShadow: "0 32px 64px -12px rgba(2,36,72,0.35)",
              }}
            >
              {/* Magnetic stripe */}
              <div
                className="h-12 w-full mt-8"
                style={{ background: "linear-gradient(180deg, #0C1F3A 0%, #081628 100%)" }}
              />

              <div className="flex flex-col items-center justify-center gap-4 px-8 pt-5">
                <div
                  className="bg-white p-3 rounded-xl shadow-md"
                  style={{ border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.qr_image_url}
                    alt={`QR code for ${card.member_name}`}
                    className="w-28 h-28 object-contain mix-blend-multiply"
                  />
                </div>
                <p
                  className="text-[9px] tracking-[0.32em] text-center font-semibold uppercase"
                  style={{ color: "rgba(12,31,58,0.35)", fontFamily: "var(--font-inter)" }}
                >
                  Official Member Access Only
                </p>
                <p
                  className="text-[11px] font-mono tracking-widest"
                  style={{ color: "#0C1F3A" }}
                >
                  {card.member_number}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flip hint */}
        <p
          className="text-[11px] tracking-[0.18em] uppercase -mt-6 transition-all duration-300"
          style={{ color: "rgba(12,31,58,0.35)", fontFamily: "var(--font-inter)" }}
        >
          {flipped ? "← Click to flip back" : "Click to reveal QR code →"}
        </p>

        {/* ══════════════════════════════════════════
            METRICS GRID
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">

          {/* ── Membership Status ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(201,168,76,0.18)",
              boxShadow: "0 4px 24px rgba(12,31,58,0.06)",
            }}
          >
            {/* Card accent top */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #0C1F3A, #1e3a5f)" }}
            />

            <div className="p-6">
              <p
                className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-5"
                style={{ color: "#B7922B", fontFamily: "var(--font-inter)" }}
              >
                Membership Status
              </p>

              <div className="space-y-4">
                {/* Account standing */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "rgba(12,31,58,0.6)", fontFamily: "var(--font-inter)" }}
                  >
                    Account Standing
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border"
                    style={
                      isActive
                        ? {
                          background: "rgba(15,118,110,0.08)",
                          color: "#0f766e",
                          borderColor: "rgba(15,118,110,0.2)",
                        }
                        : {
                          background: "rgba(180,35,24,0.08)",
                          color: "#b42318",
                          borderColor: "rgba(180,35,24,0.2)",
                        }
                    }
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: isActive ? "#0f766e" : "#b42318" }}
                    />
                    {isActive ? "Active" : card.status}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(201,168,76,0.1)" }} />

                {/* Maintenance fee */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "rgba(12,31,58,0.6)", fontFamily: "var(--font-inter)" }}
                  >
                    Maintenance Fee
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border"
                    style={{
                      background: isBonusActive
                        ? "rgba(183,146,43,0.1)"
                        : "rgba(237,227,204,0.4)",
                      color: isBonusActive ? "#7a5200" : "#4a3a00",
                      borderColor: "rgba(183,146,43,0.22)",
                    }}
                  >
                    {maintenanceLabel(card.maintenance_fee_status)}
                  </span>
                </div>

                {/* Signup bonus */}
                {card.is_signup_bonus_active && card.signup_bonus_expires_on && (
                  <>
                    <div style={{ height: "1px", background: "rgba(201,168,76,0.1)" }} />
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "rgba(12,31,58,0.6)", fontFamily: "var(--font-inter)" }}
                      >
                        Signup Bonus
                      </span>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "rgba(12,31,58,0.45)", fontFamily: "var(--font-inter)" }}
                      >
                        Expires{" "}
                        {new Date(card.signup_bonus_expires_on).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </>
                )}

                {/* Due this month */}
                {card.maintenance_fee_due_pesewas > 0 &&
                  !card.is_maintenance_fee_paid_current_month && (
                    <>
                      <div style={{ height: "1px", background: "rgba(201,168,76,0.1)" }} />
                      <div
                        className="flex items-center justify-between rounded-lg px-4 py-3"
                        style={{ background: "rgba(180,35,24,0.05)", border: "1px solid rgba(180,35,24,0.12)" }}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{ color: "rgba(12,31,58,0.5)", fontFamily: "var(--font-inter)" }}
                        >
                          Due this month
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#b42318", fontFamily: "var(--font-playfair)" }}
                        >
                          GHS {pesewasToGHS(card.maintenance_fee_due_pesewas)}
                        </span>
                      </div>
                    </>
                  )}
              </div>

              {/* Member since */}
              <p
                className="mt-5 pt-4 text-[11px] tracking-wide border-t"
                style={{
                  color: "rgba(12,31,58,0.35)",
                  borderColor: "rgba(201,168,76,0.1)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Member since{" "}
                {new Date(card.issued_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* ── Dining & Spa Credit ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(201,168,76,0.18)",
              boxShadow: "0 4px 24px rgba(12,31,58,0.06)",
            }}
          >
            {/* Gold accent top */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #B7922B, #F1E0A6, #B7922B)" }}
            />

            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <p
                  className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: "#B7922B", fontFamily: "var(--font-inter)" }}
                >
                  Dining &amp; Spa Credit
                </p>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(183,146,43,0.1)",
                    color: "#7a5200",
                    border: "1px solid rgba(183,146,43,0.2)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  GHS {pesewasToGHS(card.spend_credit_remaining_pesewas)} left
                </span>
              </div>

              {/* Big number */}
              <div className="mb-1">
                <p
                  className="text-[36px] font-bold leading-none"
                  style={{ fontFamily: "var(--font-playfair)", color: "#0C1F3A" }}
                >
                  GHS {pesewasToGHS(spendUsed)}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(12,31,58,0.45)", fontFamily: "var(--font-inter)" }}
                >
                  spent of GHS {pesewasToGHS(card.monthly_spend_credit_pesewas)} monthly credit
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 mb-4">
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(201,168,76,0.12)" }}
                >
                  <div
                    ref={progressRef}
                    className="h-full rounded-full"
                    style={{
                      width: "0%",
                      transition: "width 1.6s cubic-bezier(0.4,0,0.2,1)",
                      background: "linear-gradient(90deg, #B7922B 0%, #F1E0A6 50%, #B7922B 100%)",
                      backgroundSize: "200% 100%",
                      animation: "gradientShift 3s ease infinite",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(12,31,58,0.35)", fontFamily: "var(--font-inter)" }}
                  >
                    0%
                  </span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: "#B7922B", fontFamily: "var(--font-inter)" }}
                  >
                    {spendPct.toFixed(0)}% used
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(12,31,58,0.35)", fontFamily: "var(--font-inter)" }}
                  >
                    100%
                  </span>
                </div>
              </div>

              {/* Resets note */}
              <p
                className="text-xs italic pt-4 border-t"
                style={{
                  color: "rgba(12,31,58,0.38)",
                  borderColor: "rgba(201,168,76,0.1)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Credit resets monthly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer keyframes injected globally */}
      <style jsx global>{`
        @keyframes shimmer {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}

/* ── Sub-components ───────────────────────────────────── */
function MobileHeader() {
  return (
    <header
      className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40 border-b backdrop-blur-md md:hidden"
      style={{
        background: "rgba(247,243,236,0.92)",
        borderColor: "rgba(201,168,76,0.18)",
      }}
    >
      <h1
        className="text-xl font-semibold tracking-tight text-navy-deep"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Estrella del Mar
      </h1>
      <div className="flex gap-1">
        <button className="p-2 rounded-lg text-navy-deep/50 hover:text-navy-deep hover:bg-navy-deep/5 transition-all">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="p-2 rounded-lg text-navy-deep/50 hover:text-navy-deep hover:bg-navy-deep/5 transition-all">
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
        </button>
      </div>
    </header>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{ background: "#FFFFFF", border: "1px solid rgba(201,168,76,0.15)" }}
    >
      <div className="h-3 w-1/3 rounded-full mb-6" style={{ background: "rgba(12,31,58,0.08)" }} />
      <div className="space-y-3">
        <div className="h-3 w-full rounded-full" style={{ background: "rgba(12,31,58,0.06)" }} />
        <div className="h-3 w-4/5 rounded-full" style={{ background: "rgba(12,31,58,0.06)" }} />
        <div className="h-3 w-3/5 rounded-full" style={{ background: "rgba(12,31,58,0.06)" }} />
      </div>
      <div className="h-2 w-full rounded-full mt-8" style={{ background: "rgba(201,168,76,0.12)" }} />
    </div>
  );
}