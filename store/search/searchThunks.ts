import { createAsyncThunk } from "@reduxjs/toolkit";
import * as searchService from "../../services/search/SearchService";
import type {
  MemberSearchParams,
  MemberSearchResponse,
  MemberSearchResult,
  ReservationSearchParams,
  ReservationSearchResponse,
  ReservationSearchResult,
} from "../../types/search";

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: {
      data?: {
        detail?: string;
        message?: string;
      };
    };
  };

  return err.response?.data?.detail ?? err.response?.data?.message ?? fallback;
};

export const searchMembers = createAsyncThunk<
  MemberSearchResponse,
  MemberSearchParams | undefined,
  { rejectValue: string }
>("search/searchMembers", async (params, { rejectWithValue }) => {
  try {
    const { data } = await searchService.searchMembers(params);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to search members."));
  }
});

export const getMemberSearchDetail = createAsyncThunk<
  MemberSearchResult,
  string,
  { rejectValue: string }
>("search/getMemberSearchDetail", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await searchService.getMemberSearchDetail(userId);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch member details."));
  }
});

export const searchReservations = createAsyncThunk<
  ReservationSearchResponse,
  ReservationSearchParams | undefined,
  { rejectValue: string }
>("search/searchReservations", async (params, { rejectWithValue }) => {
  try {
    const { data } = await searchService.searchReservations(params);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to search reservations."));
  }
});

export const getReservationSearchDetail = createAsyncThunk<
  ReservationSearchResult,
  string,
  { rejectValue: string }
>("search/getReservationSearchDetail", async (reservationId, { rejectWithValue }) => {
  try {
    const { data } = await searchService.getReservationSearchDetail(reservationId);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch reservation details."));
  }
});
