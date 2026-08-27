import { createAsyncThunk } from "@reduxjs/toolkit";
import * as ReviewService from "../../services/review/ReviewService";
import type { ReviewPayload, VotePayload } from "../../types/review";
import type { AxiosError } from "axios";

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async (venueType: string | undefined, { rejectWithValue }) => {
    try {
      const response = await ReviewService.getReviews(venueType);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string; non_field_errors?: string[] }>;
      return rejectWithValue(
        err.response?.data?.detail || 
        err.response?.data?.non_field_errors?.[0] || 
        "Failed to fetch reviews"
      );
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "review/fetchReviewById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ReviewService.getReview(id);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch review");
    }
  }
);

export const createReview = createAsyncThunk(
  "review/createReview",
  async (payload: ReviewPayload, { rejectWithValue }) => {
    try {
      const response = await ReviewService.createReview(payload);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      return rejectWithValue(err.response?.data?.detail || "Failed to create review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ id, payload }: { id: number; payload: Partial<ReviewPayload> }, { rejectWithValue }) => {
    try {
      const response = await ReviewService.updateReview(id, payload);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      return rejectWithValue(err.response?.data?.detail || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (id: number, { rejectWithValue }) => {
    try {
      await ReviewService.deleteReview(id);
      return id;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      return rejectWithValue(err.response?.data?.detail || "Failed to delete review");
    }
  }
);

export const voteReview = createAsyncThunk(
  "review/voteReview",
  async ({ id, payload }: { id: number; payload: VotePayload }, { rejectWithValue }) => {
    try {
      const response = await ReviewService.voteReview(id, payload);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      return rejectWithValue(err.response?.data?.detail || "Failed to cast vote");
    }
  }
);
