import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthTokenData, OtpDelivery, User } from "../../types/auth";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "./authThunks";

export interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isNewUser: boolean;
  pendingToken: string | null;
  otpDelivery: OtpDelivery | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  access: "access",
  refresh: "refresh",
  user: "auth_user",
  isNewUser: "is_new_user",
  pendingToken: "pending_token",
  otpDelivery: "otp_delivery",
} as const;

const getStoredString = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

const getStoredJson = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const persistSession = ({ access, refresh, user }: AuthTokenData) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.access, access);
  localStorage.setItem(STORAGE_KEYS.refresh, refresh);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.removeItem(STORAGE_KEYS.pendingToken);
  localStorage.removeItem(STORAGE_KEYS.otpDelivery);
};

const persistPendingOtp = (pending_token: string, delivery: OtpDelivery) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.pendingToken, pending_token);
  localStorage.setItem(STORAGE_KEYS.otpDelivery, JSON.stringify(delivery));
};

const clearPersistedAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.access);
  localStorage.removeItem(STORAGE_KEYS.refresh);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.isNewUser);
  localStorage.removeItem(STORAGE_KEYS.pendingToken);
  localStorage.removeItem(STORAGE_KEYS.otpDelivery);
};

const persistIsNewUser = (isNewUser: boolean) => {
  if (typeof window === "undefined") return;
  if (isNewUser) {
    localStorage.setItem(STORAGE_KEYS.isNewUser, "1");
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.isNewUser);
};

const initialState: AuthState = {
  user: getStoredJson<User>(STORAGE_KEYS.user),
  access: getStoredString(STORAGE_KEYS.access),
  refresh: getStoredString(STORAGE_KEYS.refresh),
  isNewUser: getStoredString(STORAGE_KEYS.isNewUser) === "1",
  pendingToken: getStoredString(STORAGE_KEYS.pendingToken),
  otpDelivery: getStoredJson<OtpDelivery>(STORAGE_KEYS.otpDelivery),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthTokenData>) {
      const { access, refresh, user } = action.payload;
      state.access = access;
      state.refresh = refresh;
      state.user = user;
      state.isNewUser = false;
      state.pendingToken = null;
      state.otpDelivery = null;
      persistSession(action.payload);
      persistIsNewUser(false);
    },
    setGooglePending(
      state,
      action: PayloadAction<{
        pending_token: string;
        delivery: OtpDelivery;
      }>
    ) {
      state.pendingToken = action.payload.pending_token;
      state.otpDelivery = action.payload.delivery;
      persistPendingOtp(action.payload.pending_token, action.payload.delivery);
    },
    clearError(state) {
      state.error = null;
    },
    completeOnboarding(state) {
      state.isNewUser = false;
      persistIsNewUser(false);
    },
    clearAuth(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isNewUser = false;
      state.pendingToken = null;
      state.otpDelivery = null;
      clearPersistedAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingToken = action.payload.pending_token;
        state.otpDelivery = action.payload.delivery;
        persistPendingOtp(action.payload.pending_token, action.payload.delivery);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Registration failed.";
      });

    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = action.payload.user;
        state.isNewUser = true;
        state.pendingToken = null;
        state.otpDelivery = null;
        persistSession(action.payload);
        persistIsNewUser(true);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "OTP verification failed.";
      });

    builder
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to resend OTP.";
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = action.payload.user;
        state.isNewUser = false;
        persistSession(action.payload);
        persistIsNewUser(false);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Login failed.";
      });

    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.isNewUser = false;
        state.pendingToken = null;
        state.otpDelivery = null;
        clearPersistedAuth();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Logout request failed.";
      });
  },
});

export const {
  setCredentials,
  setGooglePending,
  clearError,
  completeOnboarding,
  clearAuth,
} =
  authSlice.actions;

export default authSlice.reducer;
