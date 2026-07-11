"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../../../store/hooks";
import { verifyReservationPayment } from "../../../../store/booking/bookingThunks";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function VerifyPaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [reservationId, setReservationId] = useState("");

    const reference = searchParams?.get("reference");

    useEffect(() => {
        if (!reference) {
            setStatus("error");
            setErrorMessage("No payment reference found in the URL.");
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await dispatch(verifyReservationPayment({ reference })).unwrap();
                if (response && response.id) {
                    setStatus("success");
                    setReservationId(response.id);
                    // Automatically redirect to the detail page after a short delay
                    setTimeout(() => {
                        router.push(`/booking/customer/reservations/${response.id}`);
                    }, 2000);
                } else {
                    setStatus("error");
                    setErrorMessage("Payment verification returned an invalid response.");
                }
            } catch (err: any) {
                setStatus("error");
                setErrorMessage(err || "An error occurred while verifying the payment.");
            }
        };

        verifyPayment();
    }, [reference, dispatch, router]);

    return (
        <div className="max-w-md mx-auto px-6 py-20 w-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-surface p-8 rounded-xl border border-gold-light/20 shadow-lg shadow-navy-deep/5 text-center w-full animate-fade-in-up">
                {status === "loading" && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-gold-muted mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-navy-deep mb-2">
                            Verifying Payment...
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Please wait while we confirm your transaction with Paystack. Do not close this window.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-navy-deep mb-2">
                            Payment Successful!
                        </h2>
                        <p className="text-text-secondary text-sm mb-6">
                            Your reservation is now confirmed. Redirecting you to your reservation details...
                        </p>
                        <button
                            onClick={() => router.push(`/booking/customer/reservations/${reservationId}`)}
                            className="w-full bg-navy-deep text-gold-light border border-gold-muted py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-gold-light hover:text-navy-deep transition-all text-sm"
                        >
                            View Reservation Now
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-navy-deep mb-2">
                            Verification Failed
                        </h2>
                        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm mb-6 flex items-start text-left">
                            <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-red-600" />
                            {errorMessage}
                        </div>
                        <button
                            onClick={() => router.push("/booking/customer/reservations")}
                            className="w-full bg-navy-deep text-gold-light border border-gold-muted py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-gold-light hover:text-navy-deep transition-all text-sm"
                        >
                            Go to My Reservations
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerifyPaymentPage() {
    return (
        <Suspense fallback={<div>Loading verification...</div>}>
            <VerifyPaymentContent />
        </Suspense>
    );
}
