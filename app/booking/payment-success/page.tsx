"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const reference = searchParams?.get("reference");

    return (
        <div className="min-h-screen bg-[#F7F5F0] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_24px_64px_rgba(16,36,63,0.12)] border border-gold-muted/20 text-center animate-fade-in-up">
                
                <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-100 flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-navy-deep mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    Payment Complete
                </h1>
                
                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                    Your transaction has been processed successfully. Please inform the staff member serving you so they can verify the payment on their system.
                </p>
                
                {reference && (
                    <div className="bg-navy-deep/5 rounded-xl p-4 mb-8 border border-navy-deep/10 text-left">
                        <p className="text-[10px] font-bold text-navy-deep/60 uppercase tracking-widest mb-1">
                            Transaction Reference
                        </p>
                        <p className="font-mono text-sm text-navy-deep break-all">
                            {reference}
                        </p>
                    </div>
                )}
                
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-lg border border-emerald-100 mb-8">
                    <ShieldCheck className="w-4 h-4" /> Secure Payment Verified by Paystack
                </div>

                <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-navy-deep/20 bg-white px-5 py-3.5 text-xs font-bold tracking-[0.15em] uppercase text-navy-deep hover:bg-navy-deep hover:text-gold-light transition-all shadow-sm"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
