import api from "../utils/api";
import type { Review, ReviewPayload, VotePayload } from "../../types/review";

const BASE = process.env.NEXT_PUBLIC_REVIEW_API;

export const getReviews = (venueType?: string) => {
  const params = venueType ? { venue_type: venueType } : {};
  return api.get<Review[]>(`${BASE}/`, { params });
};

export const getReview = (id: number) =>
  api.get<Review>(`${BASE}/${id}/`);

export const createReview = (payload: ReviewPayload) =>
  api.post<Review>(`${BASE}/`, payload);

export const updateReview = (id: number, payload: Partial<ReviewPayload>) =>
  api.patch<Review>(`${BASE}/${id}/`, payload);

export const deleteReview = (id: number) =>
  api.delete(`${BASE}/${id}/`);

export const voteReview = (id: number, payload: VotePayload) =>
  api.post<Review>(`${BASE}/${id}/vote/`, payload);
