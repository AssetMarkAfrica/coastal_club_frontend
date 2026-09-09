import type { RootState } from "../index";

export const selectReviews = (state: RootState) => state.review.reviews;
export const selectCurrentReview = (state: RootState) => state.review.currentReview;
export const selectReviewLoading = (state: RootState) => state.review.loading;
export const selectReviewError = (state: RootState) => state.review.error;
