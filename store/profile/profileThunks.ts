import { createAsyncThunk } from "@reduxjs/toolkit";
import * as profileService from "../../services/profile/ProfileService";
import type { UpdateProfilePayload } from "../../types/profile";

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

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await profileService.getProfile();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load profile.")
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const { data } = await profileService.updateProfile(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update profile.")
      );
    }
  }
);
