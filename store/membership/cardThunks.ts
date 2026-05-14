import {createAsyncThunk} from "@reduxjs/toolkit";
import * as cardService from "../../services/membership/CardService";

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

export const getMyMembershipCard = createAsyncThunk(
  "membership/getMyCard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cardService.getMembershipCard();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch membership card."));
    }
  }
);