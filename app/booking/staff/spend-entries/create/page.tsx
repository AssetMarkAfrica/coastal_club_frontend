"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  logSpendEntry,
  verifySpendPayment,
} from "../../../../../store/booking/bookingThunks";
import { clearCurrentSpendEntry } from "../../../../../store/booking/bookingSlice";
import type { RootState } from "../../../../../store";
import type { ReservationSearchResult, MemberSearchResult } from "../../../../../types/search";
import { getReservationSearchDetail } from "../../../../../store/search/searchThunks";
import ReservationSearchInput from "../../../../../components/search/ReservationSearchInput";
import MemberSearchInput from "../../../../../components/search/MemberSearchInput";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ReceiptText,
  Delete,
  X,
  Lock,
  ExternalLink,
  RefreshCcw,
  Users,
  UserCheck,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  ShortfallPaymentModal                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
interface ShortfallModalProps {
  billAmount: number;
  creditApplied: number;
  amountDue: number;
  paymentUrl: string;
  reference: string;
  onVerify: () => void;
  onCancel: () => void;
  verifying: boolean;
  verified: boolean;
}

function ShortfallPaymentModal({
  billAmount,
  creditApplied,
  amountDue,
  paymentUrl,
  reference,
  onVerify,
  onCancel,
  verifying,
  verified,
}: ShortfallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10243F]/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-[#F1E0A6]/50 animate-fade-in-up opacity-0">
        {/* Header */}
        <div
          className="p-6 text-center relative border-b border-[#F1E0A6]/30"
          style={{ background: "linear-gradient(135deg, #10243F 0%, #1E3A5F 100%)" }}
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-[#F1E0A6]/70 hover:text-[#F1E0A6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-2 border-[#F1E0A6] shadow-lg">
            {verified ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-500" />
            )}
          </div>
          <h3
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {verified ? "Payment Confirmed!" : "Insufficient Credit"}
          </h3>
          <p className="text-[#8aa4cf] mt-2 text-sm">
            {verified
              ? "The shortfall has been settled. Spend entry is confirmed."
              : "The bill exceeds the guest's available balance."}
          </p>
        </div>

        {/* Body */}
        {!verified && (
          <div className="p-6 bg-[#F8F1DF] space-y-6">
            {/* Financials */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#EDE3CC] pb-2">
                <span className="text-[#4A4A4A] text-sm">Bill Amount</span>
                <span className="font-medium text-[#10243F]">
                  GHS {billAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#EDE3CC] pb-2">
                <span className="text-[#4A4A4A] text-sm">Credit Applied</span>
                <span className="font-medium text-emerald-600">
                  −GHS {creditApplied.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded border border-red-200 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  Shortfall to Cover
                </span>
                <span className="text-xl font-bold text-red-600">
                  GHS {amountDue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-4">
                Present this QR code to the guest — they scan it on their phone to pay the
                remaining balance.
              </p>
              <div className="inline-block bg-white p-4 rounded-lg border border-[#EDE3CC] shadow-md mb-3">
                <QRCodeSVG
                  value={paymentUrl}
                  size={192}
                  bgColor="#ffffff"
                  fgColor="#10243F"
                  level="M"
                />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#10243F] text-sm font-medium mb-3">
                <Lock className="w-4 h-4 text-[#B7922B]" />
                Secure Payment Gateway
              </div>
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#B7922B] hover:text-[#10243F] underline transition-colors"
              >
                Open link directly
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-[10px] text-[#6B7280] mt-2 font-mono break-all">{reference}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onVerify}
                disabled={verifying}
                className="w-full relative overflow-hidden bg-[#10243F] text-[#F1E0A6] border border-[#F1E0A6] py-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  <><RefreshCcw className="w-4 h-4" /> Verify Payment &amp; Proceed</>
                )}
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-transparent text-[#10243F] border border-[#B7922B]/50 py-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-[#B7922B]/10 transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        )}

        {/* Verified success state */}
        {verified && (
          <div className="p-8 bg-[#F8F1DF] text-center">
            <p className="text-[#4A4A4A] text-sm mb-6">
              The transaction has been settled. The spend entry is now recorded.
            </p>
            <button
              onClick={onCancel}
              className="w-full bg-[#10243F] text-[#F1E0A6] border border-[#F1E0A6] py-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-[#F1E0A6] hover:text-[#10243F] transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  LogSpendEntryPage                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
function LogSpendEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { currentSpendEntry, loading, error } = useAppSelector(
    (state: RootState) => state.booking,
  );

  /* ── local state ── */
  const [customerType, setCustomerType] = useState<"non_member" | "member">("non_member");
  const [selectedReservation, setSelectedReservation] = useState<ReservationSearchResult | null>(null);
  const [selectedMember, setSelectedMember] = useState<MemberSearchResult | null>(null);
  // Pre-selected member injected via URL params (from member-reservations pages)
  const [preselectedMember, setPreselectedMember] = useState<{ cardToken: string; name: string; email: string } | null>(null);
  const [inputString, setInputString] = useState("0");
  const [showShortfallModal, setShowShortfallModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── pre-select reservation from URL param ── */
  useEffect(() => {
    dispatch(clearCurrentSpendEntry());
  }, [dispatch]);

  useEffect(() => {
    const type = searchParams?.get("type");
    if (type === "member") {
      setCustomerType("member");
    }
    const cardToken = searchParams?.get("cardToken");
    const userName = searchParams?.get("userName");
    const userEmail = searchParams?.get("userEmail");
    if (cardToken) {
      setPreselectedMember({
        cardToken,
        name: userName || userEmail || "Member",
        email: userEmail || "",
      });
      setCustomerType("member");
    }
  }, [searchParams]);

  useEffect(() => {
    const rid = searchParams?.get("reservationId");
    if (rid) {
      dispatch(getReservationSearchDetail(rid)).then((res) => {
        if (getReservationSearchDetail.fulfilled.match(res)) {
          setSelectedReservation(res.payload);
        }
      });
    }
  }, [searchParams, dispatch]);

  /* ── derived values ── */
  const amountGhs = parseFloat(inputString || "0");
  // Resolve the active card token: preselection (from URL) takes priority, then selected-from-search
  const activeMemberCardToken = preselectedMember?.cardToken ?? selectedMember?.card?.token ?? null;
  const creditGhs = customerType === "non_member"
    ? (selectedReservation?.payment.spend_credit_remaining_pesewas || 0) / 100
    : (selectedMember?.subscription?.spend_credit_remaining_pesewas || 0) / 100;
  const appliedCredit = Math.min(amountGhs, creditGhs);
  const shortfall = Math.max(0, amountGhs - creditGhs);
  const hasShortfall = shortfall > 0;
  const canSubmit =
    amountGhs > 0 &&
    (customerType === "non_member"
      ? !!selectedReservation
      : !!(activeMemberCardToken));

  /* ── keypad handlers ── */
  const appendNumber = useCallback((num: string) => {
    setInputString((prev) => {
      if (prev === "0" && num !== ".") return num;
      if (num === "." && prev.includes(".")) return prev;
      if (prev.includes(".")) {
        const dec = prev.split(".")[1];
        if (dec && dec.length >= 2) return prev;
      }
      if (prev.length > 8) return prev;
      return prev + num;
    });
  }, []);

  const deleteNumber = useCallback(() => {
    setInputString((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  }, []);

  const clearAmount = () => setInputString("0");

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitError(null);

    const callbackUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/booking/staff/spend-entries`
        : "";

    const result = await dispatch(
      logSpendEntry({
        customer_type: customerType,
        reservation_id: customerType === "non_member" ? selectedReservation!.reservation_id : undefined,
        card_token: customerType === "member" ? activeMemberCardToken! : undefined,
        amount_spent_pesewas: Math.round(amountGhs * 100),
        callback_url: callbackUrl,
      }),
    );

    if (logSpendEntry.fulfilled.match(result)) {
      if (result.payload.status === "pending_payment") {
        setShowShortfallModal(true);
      } else {
        // settled immediately — navigate to list
        router.push("/booking/staff/spend-entries");
      }
    } else {
      setSubmitError(result.payload as string ?? "Failed to log spend entry.");
    }
  };

  /* ── verify shortfall payment ── */
  const handleVerify = async () => {
    if (!currentSpendEntry?.paystack_reference) return;
    setVerifying(true);
    const result = await dispatch(
      verifySpendPayment({ reference: currentSpendEntry.paystack_reference }),
    );
    setVerifying(false);
    if (verifySpendPayment.fulfilled.match(result)) {
      setVerified(true);
    }
  };

  /* ── dismiss shortfall modal ── */
  const handleDismissModal = () => {
    setShowShortfallModal(false);
    if (verified) {
      router.push("/booking/staff/spend-entries");
    } else {
      dispatch(clearCurrentSpendEntry());
    }
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Shortfall modal */}
      {showShortfallModal && currentSpendEntry?.payment_authorization_url && (
        <ShortfallPaymentModal
          billAmount={currentSpendEntry.amount_spent_pesewas / 100}
          creditApplied={currentSpendEntry.credit_applied_pesewas / 100}
          amountDue={currentSpendEntry.amount_due_pesewas / 100}
          paymentUrl={currentSpendEntry.payment_authorization_url}
          reference={currentSpendEntry.paystack_reference ?? ""}
          onVerify={handleVerify}
          onCancel={handleDismissModal}
          verifying={verifying}
          verified={verified}
        />
      )}

      <div className="min-h-screen bg-[#faf9fc]">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between px-4 py-4 sticky top-0 z-30 bg-[#10243F] lg:hidden shadow-lg">
          <button
            onClick={() => router.back()}
            className="text-[#F1E0A6] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[#F1E0A6] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Log Spend
          </h1>
          <button
            onClick={() => router.push("/booking/staff/spend-entries")}
            className="text-[#F1E0A6]/70 hover:text-[#F1E0A6] transition-colors"
          >
            <ReceiptText className="w-5 h-5" />
          </button>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 lg:py-10 flex flex-col gap-8">
          {/* Desktop header */}
          <header className="hidden lg:flex justify-between items-end border-b border-[#EDE3CC] pb-4">
            <div>
              <h1
                className="text-4xl font-bold text-[#10243F]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Log a Spend
              </h1>
              <p className="text-[#6B7280] mt-1">Tableside bill entry and validation.</p>
            </div>
            <button
              onClick={() => router.push("/booking/staff/spend-entries")}
              className="hidden sm:flex items-center gap-1.5 text-[#B7922B] hover:text-[#10243F] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <ReceiptText className="w-4 h-4" />
              Recent Bills
            </button>
          </header>

          {/* Error */}
          {(error || submitError) && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
              <p className="text-sm">{submitError || error}</p>
            </div>
          )}

          {/* Search section */}
          <section className="flex flex-col gap-3">
            {/* Tabs */}
            <div className="flex gap-1 mb-2 bg-white border border-[#B7922B]/25 rounded-lg p-1 w-fit shadow-sm">
              <button
                onClick={() => {
                  setCustomerType("non_member");
                  setSelectedMember(null);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  customerType === "non_member"
                    ? "bg-[#10243F] text-[#F1E0A6] shadow-sm"
                    : "text-[#B7922B] hover:bg-[#F8F1DF]"
                }`}
              >
                <Users className="w-4 h-4" />
                Non-Members
              </button>
              <button
                onClick={() => {
                  setCustomerType("member");
                  setSelectedReservation(null);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  customerType === "member"
                    ? "bg-[#10243F] text-[#F1E0A6] shadow-sm"
                    : "text-[#B7922B] hover:bg-[#F8F1DF]"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Members
              </button>
            </div>

            {customerType === "non_member" ? (
              <ReservationSearchInput onSelect={setSelectedReservation} />
            ) : preselectedMember ? (
              /* Member pre-selected via URL — show locked card, no search needed */
              <div className="flex items-center gap-3 bg-[#F8F1DF] border border-[#EDE3CC] rounded-lg px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-[#10243F] flex items-center justify-center text-[#F1E0A6] font-bold text-xs flex-shrink-0">
                  {preselectedMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#10243F] truncate">{preselectedMember.name}</p>
                  {preselectedMember.email && <p className="text-xs text-[#6B7280] truncate">{preselectedMember.email}</p>}
                </div>
                <button
                  onClick={() => {
                    setPreselectedMember(null);
                    setCustomerType("member");
                  }}
                  className="text-[#6B7280] hover:text-red-500 transition-colors flex-shrink-0"
                  title="Clear pre-selected member"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <MemberSearchInput onSelect={setSelectedMember} />
            )}

            {/* Selected reservation card */}
            {customerType === "non_member" && selectedReservation && (
              <div className="bg-white border border-[#F1E0A6]/40 rounded-xl p-4 flex items-center justify-between shadow-sm hover:-translate-y-[2px] transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#10243F] flex items-center justify-center text-[#F1E0A6] font-bold text-sm flex-shrink-0">
                    {(selectedReservation.full_name || selectedReservation.email)?.slice(0, 2).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <h3 className="text-[#10243F] font-semibold">{selectedReservation.full_name || selectedReservation.email}</h3>
                    <p className="text-xs text-[#6B7280] font-mono">{selectedReservation.reservation_id.slice(0, 12)}…</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Available Credit</p>
                  <p className="text-xl font-bold text-[#0F766E]">
                    GHS {(selectedReservation.payment.spend_credit_remaining_pesewas / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Selected member card — shown when selected via search (not URL preselection) */}
            {customerType === "member" && !preselectedMember && selectedMember && (
              <div className="bg-white border border-[#F1E0A6]/40 rounded-xl p-4 flex items-center justify-between shadow-sm hover:-translate-y-[2px] transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#10243F] flex items-center justify-center text-[#F1E0A6] font-bold text-sm flex-shrink-0">
                    {(selectedMember.full_name || selectedMember.email)?.slice(0, 2).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <h3 className="text-[#10243F] font-semibold">{selectedMember.full_name || selectedMember.email}</h3>
                    <p className="text-xs text-[#6B7280] font-mono">{selectedMember.member_number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-xl font-bold text-[#0F766E] flex items-center justify-end gap-1">
                    <CreditCard className="w-5 h-5" /> Tokenized Card
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Amount entry + summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* ── Keypad ── */}
            <section className="flex flex-col items-center">
              {/* Display */}
              <div className="w-full bg-white border-b-2 border-[#F1E0A6]/50 py-8 mb-6 relative rounded-t-lg">
                <p className="absolute top-2 left-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                  Amount Spent
                </p>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#6B7280]" style={{ fontFamily: "'Playfair Display', serif" }}>GHS</span>
                  <span
                    className="text-5xl font-bold text-[#10243F] tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {formatCurrency(amountGhs)}
                  </span>
                </div>
              </div>

              {/* Keypad grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                  <button
                    key={n}
                    onClick={() => appendNumber(n)}
                    className="h-16 bg-white border border-[#EDE3CC] rounded shadow-[0_2px_8px_rgba(30,58,95,0.05)] hover:border-[#F1E0A6] hover:shadow-md hover:-translate-y-px transition-all text-2xl font-semibold text-[#10243F] flex items-center justify-center active:scale-95 select-none"
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => appendNumber(".")}
                  className="h-16 bg-[#faf9fc] border border-transparent rounded text-2xl font-semibold text-[#6B7280] flex items-center justify-center hover:bg-[#EDE3CC]/30 transition-colors select-none"
                >
                  .
                </button>
                <button
                  onClick={() => appendNumber("0")}
                  className="h-16 bg-white border border-[#EDE3CC] rounded shadow-[0_2px_8px_rgba(30,58,95,0.05)] hover:border-[#F1E0A6] hover:shadow-md hover:-translate-y-px transition-all text-2xl font-semibold text-[#10243F] flex items-center justify-center active:scale-95 select-none"
                >
                  0
                </button>
                <button
                  onClick={deleteNumber}
                  className="h-16 bg-[#faf9fc] border border-transparent rounded text-[#6B7280] flex items-center justify-center hover:bg-[#EDE3CC]/30 hover:text-red-500 transition-colors select-none"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>

              {/* Clear */}
              {inputString !== "0" && (
                <button
                  onClick={clearAmount}
                  className="mt-3 text-xs text-[#6B7280] hover:text-red-500 transition-colors uppercase tracking-wider flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </section>

            {/* ── Summary card ── */}
            <section className="sticky top-[72px] lg:top-8">
              <div
                className="rounded-2xl p-6 border border-[#F1E0A6]/25 shadow-xl relative overflow-hidden flex flex-col min-h-[320px]"
                style={{ background: "linear-gradient(135deg, #10243F 0%, #1E3A5F 100%)" }}
              >
                {/* Atmospheric glow */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #F1E0A6 0%, transparent 50%)" }}
                />
                <div className="absolute -right-12 -top-12 w-32 h-32 border border-[#F1E0A6]/20 rounded-full opacity-20" />

                <h3 className="text-white font-semibold text-base border-b border-[#F1E0A6]/20 pb-3 mb-5 flex items-center gap-2 relative z-10">
                  <ReceiptText className="w-4 h-4 text-[#F1E0A6]" />
                  Transaction Summary
                </h3>

                <div className="flex-1 flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-center text-white/80">
                    <span className="text-sm">Amount Spent</span>
                    <span className="font-semibold">GHS {formatCurrency(amountGhs)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Credit Applied
                    </span>
                    <span className="font-semibold">
                      −GHS {formatCurrency(appliedCredit)}
                    </span>
                  </div>
                  <div className="h-px bg-[#F1E0A6]/20 my-1" />
                  <div className="flex justify-between items-end mt-auto mb-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#F1E0A6]/90">
                        {hasShortfall ? "Shortfall Due" : "Amount Due"}
                      </span>
                      <p className="text-[10px] text-white/50 mt-0.5">
                        {hasShortfall && customerType === "member" ? "To be charged to member's card" : "To be settled by guest"}
                      </p>
                    </div>
                    <span className={`text-2xl font-bold transition-colors ${hasShortfall ? "text-[#F1E0A6]" : "text-white"}`}>
                      GHS {formatCurrency(shortfall)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className={`relative z-10 w-full py-4 rounded font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_12px_rgba(241,224,166,0.15)] ${
                    canSubmit && !loading
                      ? hasShortfall
                        ? "bg-[#F1E0A6] text-[#10243F] hover:bg-white hover:-translate-y-0.5"
                        : "bg-[#F1E0A6] text-[#10243F] hover:bg-white hover:-translate-y-0.5"
                      : "bg-[#F1E0A6]/30 text-[#F1E0A6]/50 cursor-not-allowed opacity-60"
                  }`}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : hasShortfall ? (
                    <><CreditCard className="w-4 h-4" /> Log &amp; Generate Shortfall QR</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Confirm Spend</>
                  )}
                </button>
              </div>

              {/* Mobile hint */}
              {!selectedReservation && !selectedMember && (
                <p className="text-center text-xs text-[#6B7280] mt-3">
                  Search and select a {customerType === "member" ? "member" : "guest reservation"} above to begin.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LogSpendEntryPage() {
  return (
    <Suspense fallback={<div>Loading spend entry...</div>}>
      <LogSpendEntryContent />
    </Suspense>
  );
}
