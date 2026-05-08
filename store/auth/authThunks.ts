import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/auth/authService";
import type {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from "../../types/auth";
import type { RootState } from "../index";

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

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration failed."));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.verifyOtp(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "OTP verification failed.")
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (pendingToken: string, { rejectWithValue }) => {
    try {
      const { data } = await authService.resendOtp({
        pending_token: pendingToken,
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to resend OTP."));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed."));
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("auth/logout", async (_, { getState }) => {
  const refresh = getState().auth.refresh;

  try {
    if (refresh) {
      await authService.logout(refresh);
    }
  } catch {
    // Local logout should still succeed even if the API call fails.
  }
});
