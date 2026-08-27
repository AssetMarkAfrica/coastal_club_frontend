"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchReviews, voteReview } from "../../store/review/reviewThunks";
import { selectReviews, selectReviewLoading } from "../../store/review/reviewSelectors";

interface ReviewSectionProps {
  isAuthenticated: boolean;
  venueType?: string;
  minRating?: number;
  showViewMore?: boolean;
  limit?: number;
}

export default function ReviewSection({
  isAuthenticated,
  venueType,
  minRating,
  showViewMore = false,
  limit,
}: ReviewSectionProps) {
  const dispatch = useAppDispatch();
  const rawReviews = useAppSelector(selectReviews);
  let reviews = Array.isArray(rawReviews) ? rawReviews : [];
  const loading = useAppSelector(selectReviewLoading);

  if (minRating) {
    reviews = reviews.filter((r) => r.rating >= minRating);
  }

  if (limit) {
    reviews = reviews.slice(0, limit);
  }

  useEffect(() => {
    dispatch(fetchReviews(venueType));
  }, [dispatch, venueType]);

  const handleVote = (reviewId: number, vote: 1 | -1) => {
    if (!isAuthenticated) return;
    dispatch(voteReview({ id: reviewId, payload: { vote } }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{
              fontSize: "14px",
              color: i < rating ? "#e8c96f" : "rgba(193,160,76,0.2)"
            }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatVenue = (vt: string | null) => {
    if (!vt) return 'Club Experience';
    return vt.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getRatingFallback = (rating: number): string => {
    switch (rating) {
      case 1:
        return "I visited Estrella del Mar and wanted to share my honest thoughts. There is room to grow, and I hope my feedback helps shape an even better experience for future guests.";
      case 2:
        return "My visit had its moments, though I felt there were some areas that could use a little more polish. I appreciated the setting and remain hopeful about what this wonderful place is becoming.";
      case 3:
        return "A pleasant visit overall — I enjoyed the atmosphere and the quality of service. A good experience that I would be happy to build upon with a return visit.";
      case 4:
        return "Truly a remarkable experience. The ambiance, the attention to detail, and the warmth of the staff left a lasting impression. I will certainly be back.";
      case 5:
        return "An absolutely exceptional visit from start to finish. Estrella del Mar delivered on every level — a world-class experience I will treasure and recommend without hesitation.";
      default:
        return "An unforgettable experience at Estrella del Mar.";
    }
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#0c1e35" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(193,160,76,0.06) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px" style={{ background: "linear-gradient(to right, transparent, rgba(193,160,76,0.35), transparent)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="block text-[11px] font-semibold tracking-[0.22em] uppercase mb-4" style={{ color: "#c9a84c" }}>Guest Experiences</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#f0dfa0" }}>Words from Our Members</h2>
          <div className="mx-auto mb-6" style={{ width: "64px", height: "1.5px", background: "rgba(193,160,76,0.5)" }} />
        </div>

        {loading && reviews.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl" style={{ color: "#e8c96f" }}>refresh</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => {
              const firstName = review.user?.first_name || "Valued";
              const lastName = review.user?.last_name || "Patron";
              const initials = `${firstName[0] || "V"}${lastName[0] || "P"}`;

              return (
                <div
                  key={review.id}
                  className="group relative rounded-xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: "rgba(16,36,63,0.6)",
                    border: "1px solid rgba(193,160,76,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                  }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center uppercase font-bold text-sm shadow-inner" style={{ background: "rgba(193,160,76,0.15)", color: "#e8c96f", border: "1px solid rgba(193,160,76,0.3)" }}>
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{firstName} {lastName}</div>
                        <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(193,160,76,0.6)" }}>
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <div className="flex-1 mb-8">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(240,223,160,0.72)", fontStyle: "italic", fontFamily: "var(--font-playfair)", fontSize: "1.05rem" }}>
                      "{review.comment?.trim() ? review.comment : getRatingFallback(review.rating)}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: "rgba(193,160,76,0.15)" }}>
                    <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#c9a84c" }}>
                      {formatVenue(review.venue_type)}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleVote(review.id, 1)}
                        className={`flex items-center gap-1.5 transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ color: review.user_vote === 1 ? "#e8c96f" : "rgba(255,255,255,0.35)" }}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? "Login to vote" : "Upvote"}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: review.user_vote === 1 ? "'FILL' 1" : "'FILL' 0" }}>thumb_up</span>
                        <span className="text-xs font-mono">{review.upvotes}</span>
                      </button>

                      <button
                        onClick={() => handleVote(review.id, -1)}
                        className={`flex items-center gap-1.5 transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        style={{ color: review.user_vote === -1 ? "#e8c96f" : "rgba(255,255,255,0.35)" }}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? "Login to vote" : "Downvote"}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: review.user_vote === -1 ? "'FILL' 1" : "'FILL' 0" }}>thumb_down</span>
                        <span className="text-xs font-mono">{review.downvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {reviews.length === 0 && !loading && (
          <div className="text-center text-white/50 text-sm py-12 italic">
            No reviews yet. Be the first to share your experience!
          </div>
        )}

        {showViewMore && (
          <div className="mt-14 text-center">
            <Link
              href="/review"
              className="inline-flex items-center gap-2 border border-gold-muted/40 bg-navy-deep/80 px-8 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase text-gold-light hover:bg-gold-light hover:text-navy-deep transition-all duration-300 rounded shadow-lg"
            >
              View More Reviews
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px" style={{ background: "linear-gradient(to right, transparent, rgba(193,160,76,0.35), transparent)" }} />
    </section>
  );
}
