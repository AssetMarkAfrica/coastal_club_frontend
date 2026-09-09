import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Review } from "../../types/review";
import {
  fetchReviews,
  fetchReviewById,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
} from "./reviewThunks";

export interface ReviewState {
  reviews: Review[];
  currentReview: Review | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  currentReview: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError(state) {
      state.error = null;
    },
    clearCurrentReview(state) {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    // fetchReviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action: any) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.reviews = action.payload;
      } else if (action.payload && Array.isArray(action.payload.results)) {
        state.reviews = action.payload.results;
      } else {
        state.reviews = [];
      }
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch reviews";
    });

    // fetchReviewById
    builder.addCase(fetchReviewById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviewById.fulfilled, (state, action: PayloadAction<Review>) => {
      state.loading = false;
      state.currentReview = action.payload;
    });
    builder.addCase(fetchReviewById.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch review";
    });

    // createReview
    builder.addCase(createReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
      state.loading = false;
      state.reviews.unshift(action.payload);
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to create review";
    });

    // updateReview
    builder.addCase(updateReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateReview.fulfilled, (state, action: PayloadAction<Review>) => {
      state.loading = false;
      state.currentReview = action.payload;
      const index = state.reviews.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    });
    builder.addCase(updateReview.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to update review";
    });

    // deleteReview
    builder.addCase(deleteReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      if (state.currentReview?.id === action.payload) {
        state.currentReview = null;
      }
      state.reviews = state.reviews.filter(r => r.id !== action.payload);
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to delete review";
    });

    // voteReview
    builder.addCase(voteReview.pending, (state) => {
      state.error = null;
    });
    builder.addCase(voteReview.fulfilled, (state, action: PayloadAction<Review>) => {
      if (state.currentReview?.id === action.payload.id) {
        state.currentReview = action.payload;
      }
      const index = state.reviews.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    });
    builder.addCase(voteReview.rejected, (state, action) => {
      state.error = (action.payload as string) || "Failed to cast vote";
    });
  },
});

export const { clearReviewError, clearCurrentReview } = reviewSlice.actions;
export default reviewSlice.reducer;
