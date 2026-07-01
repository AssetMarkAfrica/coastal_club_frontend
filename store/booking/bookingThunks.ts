import { createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../../services/booking/BookingService";
import type {
  CreateReservationPayload,
  LogSpendPayload,
  VerifyReservationPayload,
  VerifySpendPayload,
} from "../../types/booking";

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

export const createReservation = createAsyncThunk(
  "booking/createReservation",
  async (payload: CreateReservationPayload, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.createReservation(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create reservation."));
    }
  }
);

export const verifyReservationPayment = createAsyncThunk(
  "booking/verifyReservationPayment",
  async (payload: VerifyReservationPayload, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.verifyReservationPayment(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to verify reservation payment."));
    }
  }
);

export const getMyReservations = createAsyncThunk(
  "booking/getMyReservations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getMyReservations();
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch your reservations."));
    }
  }
);

export const getMyReservationById = createAsyncThunk(
  "booking/getMyReservationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getMyReservationById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch your reservation details."));
    }
  }
);

export const getAllReservations = createAsyncThunk(
  "booking/getAllReservations",
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getAllReservations(params);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch all reservations."));
    }
  }
);

export const getReservationById = createAsyncThunk(
  "booking/getReservationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getReservationById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch reservation details."));
    }
  }
);

export const getAllSpendEntries = createAsyncThunk(
  "booking/getAllSpendEntries",
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getAllSpendEntries(params);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch spend entries."));
    }
  }
);

export const getSpendEntryById = createAsyncThunk(
  "booking/getSpendEntryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.getSpendEntryById(id);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch spend entry details."));
    }
  }
);

export const logSpendEntry = createAsyncThunk(
  "booking/logSpendEntry",
  async (payload: LogSpendPayload, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.logSpendEntry(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to log spend entry."));
    }
  }
);

export const verifySpendPayment = createAsyncThunk(
  "booking/verifySpendPayment",
  async (payload: VerifySpendPayload, { rejectWithValue }) => {
    try {
      const { data } = await bookingService.verifySpendPayment(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to verify spend payment."));
    }
  }
);
