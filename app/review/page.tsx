"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createReview } from "../../store/review/reviewThunks";
import ReviewSection from "../../components/review/ReviewSection";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ReviewPageContent() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const dispatch = useAppDispatch();
    const access = useAppSelector((state) => state.auth.access);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthenticated = mounted && !!access;

    const paramVenue = searchParams.get("venue");
    const memberResId = searchParams.get("member_reservation");
    const nonMemberResId = searchParams.get("non_member_reservation");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [venueType, setVenueType] = useState<string>(paramVenue || "skybar");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (paramVenue || memberResId || nonMemberResId) {
            if (paramVenue) setVenueType(paramVenue);
            setIsModalOpen(true);
        }
    }, [paramVenue, memberResId, nonMemberResId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await dispatch(
                createReview({
                    rating,
                    comment,
                    venue_type: venueType,
                    member_reservation: memberResId ? Number(memberResId) : null,
                    non_member_reservation: nonMemberResId ? Number(nonMemberResId) : null,
                })
            ).unwrap();

            setIsModalOpen(false);
            setComment("");
            setRating(5);
        } catch (err: any) {
            setError(err || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#0c1e35] min-h-screen text-text-primary antialiased" style={{ fontFamily: "var(--font-inter)" }}>
            {/* ── Top Header Bar ── */}
            <nav className="bg-navy-deep/90 backdrop-blur-md sticky top-0 z-50 border-b border-gold-muted/25 px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-semibold text-gold-light tracking-tight hover:opacity-80 transition-opacity" style={{ fontFamily: "var(--font-playfair)" }}>
                    Estrella del Mar
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-xs font-semibold tracking-widest uppercase text-white/80 hover:text-gold-light transition-colors">
                        Home
                    </Link>
                    {isAuthenticated ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gold-light text-navy-deep px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded hover:bg-gold-light/90 transition-all"
                        >
                            Leave a Review
                        </button>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-transparent text-gold-light border border-gold-muted/50 px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded hover:bg-gold-light hover:text-primary transition-all"
                        >
                            Sign In to Review
                        </Link>
                    )}
                </div>
            </nav>

            {/* ── Hero Banner ── */}
            <section className="relative py-20 px-6 text-center border-b border-gold-muted/20">
                <div className="max-w-4xl mx-auto">
                    <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-gold-muted block mb-4">
                        Authentic Feedback
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                        Club Reviews
                    </h1>
                    <p className="text-base text-cream/70 max-w-xl mx-auto leading-relaxed mb-8">
                        Discover what our guests have to say about their unforgettable moments at Estrella del Mar, or share your own experience with our community.
                    </p>

                    {isAuthenticated && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-gold-light text-navy-deep px-8 py-3.5 text-xs font-semibold tracking-widest uppercase rounded hover:bg-white transition-all shadow-lg shadow-gold-muted/20"
                        >
                            <span className="material-symbols-outlined text-sm">rate_review</span>
                            Share Your Experience
                        </button>
                    )}
                </div>
            </section>

            {/* ── Main Reviews Grid Section ── */}
            <ReviewSection isAuthenticated={isAuthenticated} />

            {/* ── Create Review Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div
                        className="relative w-full max-w-lg rounded-xl p-8 text-white shadow-2xl border border-gold-muted/30"
                        style={{ background: "#10243f" }}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="text-2xl font-semibold text-gold-light mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                            Leave a Review
                        </h3>
                        <p className="text-xs text-white/60 mb-6">
                            Share your rating and feedback for Estrella del Mar.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded text-red-200 text-xs">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Venue Selector */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-muted mb-2">
                                    Venue Experienced
                                </label>
                                <select
                                    value={venueType}
                                    onChange={(e) => setVenueType(e.target.value)}
                                    className="w-full bg-navy-deep border border-gold-muted/30 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-light"
                                >
                                    <option value="skybar">The Sky Bar</option>
                                    <option value="fine_dining">Fine Dining</option>
                                    <option value="executive_lounge">Executive Lounge</option>
                                    <option value="private_room">The Private Room</option>
                                </select>
                            </div>

                            {/* Star Rating */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-muted mb-2">
                                    Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <span
                                                className="material-symbols-outlined text-2xl"
                                                style={{ color: star <= rating ? "#e8c96f" : "rgba(255,255,255,0.2)" }}
                                            >
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-muted mb-2">
                                    Comments (Optional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Describe your dining or social experience..."
                                    className="w-full bg-navy-deep border border-gold-muted/30 rounded p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-light"
                                />
                            </div>

                            {/* Submit CTA */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white/70 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gold-light text-navy-deep px-6 py-2.5 text-xs font-semibold tracking-wider uppercase rounded hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Post Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="bg-[#0c1e35] min-h-screen flex items-center justify-center text-gold-light">
                <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
            </div>
        }>
            <ReviewPageContent />
        </Suspense>
    );
}
