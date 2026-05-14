"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMyMembershipCard } from "@/store/membership/cardThunks";

/* ── helpers ─────────────────────────────────────────── */
const pesewasToGHS = (p: number) => (p / 100).toFixed(2);

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

  /* Animate the spend-credit progress bar after card data arrives */
  useEffect(() => {
    if (!card || !progressRef.current) return;
    const used =
      card.monthly_spend_credit_pesewas - card.spend_credit_remaining_pesewas;
    const pct =
      card.monthly_spend_credit_pesewas > 0
        ? Math.min((used / card.monthly_spend_credit_pesewas) * 100, 100)
        : 0;

    const timer = setTimeout(() => {
      if (progressRef.current)
        progressRef.current.style.width = `${pct}%`;
    }, 400);
    return () => clearTimeout(timer);
  }, [card]);

  /* ── Loading skeleton ─────────────────────────────── */
  if (loading) {
    return (
      <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
        <MobileHeader />
        <div className="p-6 md:p-10 flex-1 flex flex-col items-center justify-center gap-10">
          <div className="w-full max-w-[420px] aspect-[1.6/1] rounded-xl bg-navy-deep/20 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
    );
  }

  /* ── Error state ──────────────────────────────────── */
  if (error) {
    return (
      <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
        <MobileHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <span
            className="material-symbols-outlined text-5xl text-danger"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
          <p className="font-body-lg text-body-lg text-navy-deep/70">{error}</p>
          <button
            onClick={() => dispatch(getMyMembershipCard())}
            className="px-6 py-2 border border-gold-muted text-gold-muted rounded hover:bg-gold-muted hover:text-navy-deep transition-colors duration-300 font-label-uppercase text-label-uppercase"
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
    <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col">
      <MobileHeader />

      <div className="p-6 md:p-10 max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-12">
        {/* ── Page header ─────────────────────────────── */}
        <div className="text-center w-full max-w-2xl">
          <h2
            className="text-[36px] font-[600] leading-[1.3] text-navy-deep mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Digital Member Card
          </h2>
          <p className="font-body-lg text-body-lg text-navy-deep/70">
            Present this card for exclusive access, priority bookings, and
            member privileges across all Estrella del Mar properties.
          </p>
        </div>

        {/* ── 3-D Flip Card ───────────────────────────── */}
        <div
          className="relative w-full max-w-[420px] cursor-pointer select-none"
          style={{ aspectRatio: "1.6 / 1", perspective: "2000px" }}
          onClick={() => setFlipped((f) => !f)}
          title={flipped ? "Click to flip back" : "Click to reveal QR code"}
        >
          <div
            className="w-full h-full relative transition-transform duration-[900ms] ease-in-out"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ── FRONT ──────────────────────────────── */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                background:
                  "linear-gradient(135deg, #B7922B 0%, #F1E0A6 25%, #B7922B 50%, #F1E0A6 75%, #B7922B 100%)",
                padding: "2px",
                boxShadow:
                  "0 30px 60px -12px rgba(2,36,72,0.4), 0 18px 36px -18px rgba(183,146,43,0.3)",
              }}
            >
              <div
                className="w-full h-full relative rounded-[10px] overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #10243F 0%, #0A1A2F 60%, #1e3a5f 100%)",
                }}
              >
                {/* diagonal pattern overlay */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,175,55,0.08) 10px, rgba(212,175,55,0.08) 20px)",
                  }}
                />

                <div className="relative z-10 h-full p-7 flex flex-col justify-between">
                  {/* Top row */}
                  <div className="flex justify-between items-start">
                    <h3
                      className="italic tracking-[0.05em] select-none text-[22px] font-[600]"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        color: "#B7922B",
                      }}
                    >
                      Estrella del Mar
                    </h3>
                    <span
                      className="material-symbols-outlined text-[30px]"
                      style={{
                        color: "#D4AF37",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      workspace_premium
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <p
                        className="tracking-widest uppercase mb-1"
                        style={{
                          fontSize: "26px",
                          fontWeight: 800,
                          color: "#F1E0A6",
                          textShadow:
                            "0.5px 0.5px 0px rgba(0,0,0,0.5), -0.5px -0.5px 0px rgba(255,255,255,0.1)",
                          fontFamily: "var(--font-playfair)",
                        }}
                      >
                        {card.member_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-8 h-8 flex items-center justify-center border rounded text-xs font-bold"
                          style={{
                            borderColor: "rgba(212,175,55,0.4)",
                            color: "#D4AF37",
                          }}
                        >
                          CC
                        </span>
                        <span
                          className="text-[10px] tracking-[0.25em] uppercase font-semibold"
                          style={{ color: "rgba(183,146,43,0.7)" }}
                        >
                          Coastal Club
                        </span>
                      </div>
                    </div>

                    <div
                      className="px-5 py-2 rounded-lg border"
                      style={{
                        background: "#111827",
                        borderColor: "#B7922B",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      <p
                        className="text-[12px] tracking-[0.25em] uppercase font-bold"
                        style={{ color: "#F1E0A6" }}
                      >
                        {tierLabel(card.tier)} Member
                      </p>
                    </div>
                  </div>

                  {/* Vertical member number */}
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ transform: "translateY(-50%) rotate(90deg)" }}
                  >
                    <p
                      className="font-mono text-[10px] tracking-[0.5em] uppercase whitespace-nowrap"
                      style={{ color: "rgba(183,146,43,0.3)" }}
                    >
                      {card.member_number}
                    </p>
                  </div>

                  {/* Shine on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[10px]"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── BACK ───────────────────────────────── */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden bg-surface-container-lowest border"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderColor: "rgba(212,175,55,0.2)",
                boxShadow:
                  "0 30px 60px -12px rgba(2,36,72,0.4), 0 18px 36px -18px rgba(183,146,43,0.3)",
              }}
            >
              {/* magnetic stripe */}
              <div className="h-14 bg-navy-deep w-full mt-6 mb-4" />

              <div className="flex flex-col items-center justify-center gap-4 px-8">
                <div
                  className="bg-white p-3 rounded-lg shadow-sm border"
                  style={{ borderColor: "var(--color-surface-variant)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.qr_image_url}
                    alt={`QR code for ${card.member_name}`}
                    className="w-28 h-28 mix-blend-multiply object-contain"
                  />
                </div>
                <p
                  className="text-[10px] tracking-[0.3em] text-center"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  OFFICIAL MEMBER ACCESS ONLY
                </p>
                <p
                  className="text-[11px] font-mono tracking-widest"
                  style={{ color: "var(--color-navy-deep)" }}
                >
                  {card.member_number}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-center -mt-6 text-navy-deep/50">
          {flipped ? "Click to flip back" : "Click to reveal QR code"}
        </p>

        {/* ── Metrics grid ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Status Card */}
          <div
            className="rounded-xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(183,146,43,0.2)",
            }}
          >
            <h4
              className="mb-4 border-b pb-2 tracking-widest uppercase text-[13px] font-semibold"
              style={{
                color: "var(--color-navy-deep)",
                borderColor: "rgba(183,146,43,0.1)",
              }}
            >
              Membership Status
            </h4>

            {/* Account Standing */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[16px] text-primary">
                Account Standing
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border"
                style={
                  isActive
                    ? {
                        background: "rgba(15,118,110,0.1)",
                        color: "var(--color-success)",
                        borderColor: "rgba(15,118,110,0.2)",
                      }
                    : {
                        background: "rgba(180,35,24,0.1)",
                        color: "var(--color-danger)",
                        borderColor: "rgba(180,35,24,0.2)",
                      }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isActive
                      ? "var(--color-success)"
                      : "var(--color-danger)",
                  }}
                />
                {isActive ? "Active" : card.status}
              </span>
            </div>

            {/* Maintenance fee */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-[16px] text-primary">
                Maintenance Fee
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border"
                style={{
                  background: isBonusActive
                    ? "rgba(183,146,43,0.12)"
                    : "rgba(237,227,204,0.5)",
                  color: isBonusActive ? "#8a6000" : "#574500",
                  borderColor: "rgba(183,146,43,0.25)",
                }}
              >
                {maintenanceLabel(card.maintenance_fee_status)}
              </span>
            </div>

            {/* Signup bonus */}
            {card.is_signup_bonus_active && card.signup_bonus_expires_on && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[16px] text-primary">
                  Signup Bonus
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Expires{" "}
                  {new Date(card.signup_bonus_expires_on).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}
                </span>
              </div>
            )}

            {/* Maintenance due amount */}
            {card.maintenance_fee_due_pesewas > 0 &&
              !card.is_maintenance_fee_paid_current_month && (
                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: "rgba(183,146,43,0.1)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Due this month
                  </span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--color-danger)" }}
                  >
                    GHS {pesewasToGHS(card.maintenance_fee_due_pesewas)}
                  </span>
                </div>
              )}
          </div>

          {/* Spend Credit Card */}
          <div
            className="rounded-xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(183,146,43,0.2)",
              borderTop: "4px solid var(--color-navy-deep)",
            }}
          >
            <h4
              className="mb-4 border-b pb-2 flex justify-between tracking-widest uppercase text-[13px] font-semibold"
              style={{
                color: "var(--color-navy-deep)",
                borderColor: "rgba(183,146,43,0.1)",
              }}
            >
              <span>Dining &amp; Spa Credit</span>
              <span style={{ color: "#B7922B" }}>
                GHS {pesewasToGHS(card.spend_credit_remaining_pesewas)} left
              </span>
            </h4>

            <div className="mb-3 flex justify-between items-end">
              <span
                className="text-[22px] font-bold"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--color-primary)",
                }}
              >
                GHS {pesewasToGHS(spendUsed)}
              </span>
              <span
                className="text-sm"
                style={{ color: "rgba(16,36,63,0.65)" }}
              >
                of GHS {pesewasToGHS(card.monthly_spend_credit_pesewas)} used
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="w-full h-2.5 rounded-full overflow-hidden border"
              style={{
                background: "rgba(237,227,204,0.4)",
                borderColor: "rgba(183,146,43,0.1)",
              }}
            >
              <div
                ref={progressRef}
                className="h-full rounded-full"
                style={{
                  width: "0%",
                  transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
                  background: "linear-gradient(to right, #B7922B, #F1E0A6)",
                  boxShadow: "0 0 8px rgba(183,146,43,0.5)",
                }}
              />
            </div>

            <p
              className="text-[13px] italic mt-4"
              style={{ color: "rgba(16,36,63,0.55)" }}
            >
              {spendPct.toFixed(0)}% of monthly credit used. Resets monthly.
            </p>

            {/* Issued at */}
            <p
              className="mt-3 text-[11px] tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
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
      </div>
    </main>
  );
}

/* ── Sub-components ───────────────────────────────────── */
function MobileHeader() {
  return (
    <header className="flex justify-between items-center w-full px-6 h-16 bg-surface/95 sticky top-0 z-40 border-b backdrop-blur-md shadow-sm md:hidden"
      style={{ borderColor: "rgba(183,146,43,0.2)" }}
    >
      <h1
        className="text-[22px] font-bold tracking-tight text-primary"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Estrella del Mar
      </h1>
      <div className="flex gap-2 text-primary">
        <button className="hover:bg-cream/10 p-2 rounded transition-all duration-300">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="hover:bg-cream/10 p-2 rounded transition-all duration-300">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-6 animate-pulse"
      style={{
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(183,146,43,0.15)",
      }}
    >
      <div
        className="h-4 w-1/2 rounded mb-5"
        style={{ background: "rgba(16,36,63,0.1)" }}
      />
      <div
        className="h-3 w-full rounded mb-3"
        style={{ background: "rgba(16,36,63,0.07)" }}
      />
      <div
        className="h-3 w-4/5 rounded mb-3"
        style={{ background: "rgba(16,36,63,0.07)" }}
      />
      <div
        className="h-2.5 w-full rounded-full mt-5"
        style={{ background: "rgba(183,146,43,0.15)" }}
      />
    </div>
  );
}
