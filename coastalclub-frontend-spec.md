# CoastalClub — Next.js Frontend Specification

## Project Setup

```bash
npx create-next-app@latest coastalclub-web
```

When prompted:
- **TypeScript** → Yes
- **ESLint** → Yes
- **Tailwind CSS** → Yes (or your preferred choice)
- **`src/` directory** → **No**
- **App Router** → **Yes**
- **Import alias** → Yes (`@/*`)

Install additional dependencies:

```bash
npm install @reduxjs/toolkit react-redux axios
npm install -D @types/node
```

---

## Folder Structure

```
coastalclub-web/
├── app/                        # Next.js App Router — all pages live here
│   └── ...                     # (pages to be added later)
│
├── services/                   # All API call logic
│   ├── api.ts                  # Axios instance (base URL, interceptors, token refresh)
│   ├── authService.ts          # Auth endpoints (register, verify-otp, login, google, logout)
│   └── profileService.ts       # Profile endpoints (get, update)
│
├── store/                      # Redux state management
│   ├── index.ts                # Store configuration
│   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   └── slices/
│       ├── authSlice.ts        # Auth state (user, tokens, pending_token, loading, error)
│       └── profileSlice.ts     # Profile state (profile data, loading, error)
│
├── public/
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_AUTH_API=http://localhost:81/api/auth
NEXT_PUBLIC_PROFILE_API=http://localhost:81/api/profiles
```

> **Note:** All variables exposed to the browser in Next.js must be prefixed with `NEXT_PUBLIC_`.

---

## Services

### `services/api.ts` — Axios Instance

Central Axios instance with base configuration, auth header injection, and automatic access token refresh on 401.

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

// Attach the access token to every request
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, attempt a token refresh then retry the original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh =
        typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_AUTH_API}/token/refresh/`,
            { refresh }
          );
          localStorage.setItem("access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          // Refresh failed — clear tokens; the app should redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### `services/authService.ts` — Authentication

All requests are relative to `NEXT_PUBLIC_AUTH_API`.

#### Types

```ts
export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  password_confirm: string;
  role?: "member" | "admin"; // defaults to "member"
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    pending_token: string;
    delivery: { email: boolean; sms: boolean };
  };
}

export interface VerifyOtpPayload {
  pending_token: string;
  code: string;
}

export interface AuthTokenResponse {
  success: boolean;
  message: string;
  data: {
    access: string;
    refresh: string;
    user: User;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GoogleAuthorizeResponse {
  success: boolean;
  message: string;
  data: { authorization_url: string };
}

export interface ResendOtpPayload {
  pending_token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  auth_provider: "email" | "google";
  role: "member" | "admin";
  is_verified: boolean;
  profile: UserProfile;
  created_at: string;
}

export interface UserProfile {
  gender: string;
  date_of_birth: string | null;
  age: number | null;
  phone_number: string;
  nationality: string;
  occupation: string;
  id_type: string;
  id_number: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region_state: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bio: string;
  is_profile_complete: boolean;
  missing_required_fields: string[];
  created_at: string;
  updated_at: string;
}
```

#### Functions

```ts
import api from "./api";
import type {
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  AuthTokenResponse,
  LoginPayload,
  GoogleAuthorizeResponse,
  ResendOtpPayload,
} from "./authService";

const BASE = process.env.NEXT_PUBLIC_AUTH_API;

// i. Register — creates account, triggers OTP delivery
export const register = (payload: RegisterPayload) =>
  api.post<RegisterResponse>(`${BASE}/register/`, payload);

// ii. Verify OTP — completes registration, returns JWT tokens
export const verifyOtp = (payload: VerifyOtpPayload) =>
  api.post<AuthTokenResponse>(`${BASE}/verify-otp/`, payload);

// iii. Resend OTP
export const resendOtp = (payload: ResendOtpPayload) =>
  api.post(`${BASE}/resend-otp/`, payload);

// iv. Email / password login
export const login = (payload: LoginPayload) =>
  api.post<AuthTokenResponse>(`${BASE}/login/`, payload);

// v. Get Google OAuth consent URL — then redirect the browser to authorization_url
export const getGoogleAuthorizeUrl = () =>
  api.get<GoogleAuthorizeResponse>(`${BASE}/google/`);

// vi. Send Google OAuth code to backend (production POST flow)
export const googleCallback = (code: string) =>
  api.post<AuthTokenResponse | RegisterResponse>(`${BASE}/google/callback/`, {
    code,
  });

// vii. Logout — blacklists the refresh token
export const logout = (refresh: string) =>
  api.post(`${BASE}/logout/`, { refresh });
```

---

### `services/profileService.ts` — Profile Management

```ts
import api from "./api";
import type { UserProfile } from "./authService";

const BASE = process.env.NEXT_PUBLIC_PROFILE_API;

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export type UpdateProfilePayload = Partial<
  Omit<UserProfile, "age" | "is_profile_complete" | "missing_required_fields" | "created_at" | "updated_at">
>;

// i. Get current user's profile
export const getProfile = () =>
  api.get<ProfileResponse>(`${BASE}/me/`);

// ii. Partially update current user's profile
export const updateProfile = (payload: UpdateProfilePayload) =>
  api.patch<ProfileResponse>(`${BASE}/me/`, payload);
```

---

## Store

### `store/index.ts` — Store Configuration

```ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### `store/hooks.ts` — Typed Hooks

```ts
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### `store/slices/authSlice.ts` — Auth State

Manages the full authentication lifecycle: registration → OTP pending → verified → logged in → logged out.

```ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";
import type {
  User,
  RegisterPayload,
  VerifyOtpPayload,
  LoginPayload,
} from "../../services/authService";

// ── State shape ────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  // Held between POST /register (or Google new-user) and POST /verify-otp
  pendingToken: string | null;
  // Which channels the OTP was sent to
  otpDelivery: { email: boolean; sms: boolean } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  access: typeof window !== "undefined" ? localStorage.getItem("access") : null,
  refresh:
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null,
  pendingToken: null,
  otpDelivery: null,
  loading: false,
  error: null,
};

// ── Helpers ────────────────────────────────────────────────────────────────

const persistTokens = (access: string, refresh: string) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ── Thunks ─────────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(payload);
      return data.data; // { pending_token, delivery }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || err.response?.data?.message || "Registration failed."
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.verifyOtp(payload);
      return data.data; // { access, refresh, user }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "OTP verification failed."
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (pendingToken: string, { rejectWithValue }) => {
    try {
      const { data } = await authService.resendOtp({ pending_token: pendingToken });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to resend OTP."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(payload);
      return data.data; // { access, refresh, user }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Login failed."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const refresh = state.auth.refresh;
    try {
      if (refresh) await authService.logout(refresh);
    } catch (err: any) {
      return rejectWithValue("Logout request failed.");
    }
  }
);

// Called after googleCallback() resolves in the component:
// - new user  → dispatch(setGooglePending({ pending_token, delivery }))
// - returning → dispatch(setCredentials({ access, refresh, user }))

// ── Slice ──────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ access: string; refresh: string; user: User }>
    ) {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;
      state.pendingToken = null;
      state.otpDelivery = null;
      persistTokens(action.payload.access, action.payload.refresh);
    },
    setGooglePending(
      state,
      action: PayloadAction<{
        pending_token: string;
        delivery: { email: boolean; sms: boolean };
      }>
    ) {
      state.pendingToken = action.payload.pending_token;
      state.otpDelivery = action.payload.delivery;
    },
    clearError(state) {
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.pendingToken = null;
      state.otpDelivery = null;
      clearTokens();
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingToken = action.payload.pending_token;
        state.otpDelivery = action.payload.delivery;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Verify OTP ──
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
        state.pendingToken = null;
        state.otpDelivery = null;
        persistTokens(action.payload.access, action.payload.refresh);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Resend OTP ──
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
        state.error = action.payload as string;
      });

    // ── Login ──
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
        persistTokens(action.payload.access, action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.pendingToken = null;
        state.otpDelivery = null;
        clearTokens();
      });
  },
});

export const { setCredentials, setGooglePending, clearError, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
```

---

### `store/slices/profileSlice.ts` — Profile State

```ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as profileService from "../../services/profileService";
import type {
  UserProfile,
  UpdateProfilePayload,
} from "../../services/profileService";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await profileService.getProfile();
      return data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to load profile."
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
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update profile."
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    clearProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
```

---

## Redux Provider Setup

Wrap the app in the Redux `Provider` inside `app/layout.tsx`:

```tsx
// app/layout.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
```

---

## Google OAuth Flow — Implementation Notes

The Google OAuth flow has two distinct states after hitting `/google/callback/`:

| Response status | Meaning | What to do |
|---|---|---|
| `201 Created` | Brand-new account — OTP required | Store `pending_token`, redirect to OTP verification page |
| `200 OK` | Existing account — signed in | Store tokens, redirect to dashboard |

```ts
// Example usage in a component
const handleGoogleSignIn = async () => {
  const { data } = await authService.getGoogleAuthorizeUrl();
  window.location.href = data.data.authorization_url;
};

// In the OAuth callback page (app/auth/google/callback/page.tsx)
// Next.js will receive ?code=... as a query param
const handleGoogleCallback = async (code: string) => {
  const { data, status } = await authService.googleCallback(code);
  if (status === 201) {
    // New user — needs OTP
    dispatch(setGooglePending(data.data));
    router.push("/auth/verify-otp");
  } else {
    // Returning user — fully signed in
    dispatch(setCredentials(data.data));
    router.push("/dashboard");
  }
};
```

---

## Auth Flow Summary

```
Register
  POST /register/  →  { pending_token, delivery }
        ↓
  POST /verify-otp/  →  { access, refresh, user }
        ↓
      Signed in

Login
  POST /login/  →  { access, refresh, user }
        ↓
      Signed in

Google (new account)
  GET  /google/  →  redirect to authorization_url
        ↓  (Google redirects back with ?code=)
  POST /google/callback/  [201]  →  { pending_token, delivery }
        ↓
  POST /verify-otp/  →  { access, refresh, user }
        ↓
      Signed in

Google (existing account)
  GET  /google/  →  redirect to authorization_url
        ↓
  POST /google/callback/  [200]  →  { access, refresh, user }
        ↓
      Signed in
```
