import api from "../utils/api";
import type {
  AuthTokenResponse,
  GoogleAuthorizeResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  VerifyOtpPayload,
} from "../../types/auth";
export type {
  AuthTokenData,
  AuthTokenResponse,
  GoogleAuthorizeData,
  GoogleAuthorizeResponse,
  LoginPayload,
  OtpDelivery,
  PendingOtpData,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  User,
  UserProfile,
  VerifyOtpPayload,
} from "../../types/auth";

const BASE = process.env.NEXT_PUBLIC_AUTH_API;

export const register = (payload: RegisterPayload) =>
  api.post<RegisterResponse>(`${BASE}/register/`, payload);

export const verifyOtp = (payload: VerifyOtpPayload) =>
  api.post<AuthTokenResponse>(`${BASE}/verify-otp/`, payload);

export const resendOtp = (payload: ResendOtpPayload) =>
  api.post(`${BASE}/resend-otp/`, payload);

export const login = (payload: LoginPayload) =>
  api.post<AuthTokenResponse>(`${BASE}/login/`, payload);

export const getGoogleAuthorizeUrl = () =>
  api.get<GoogleAuthorizeResponse>(`${BASE}/google/`);

export const googleCallback = (code: string) =>
  api.post<AuthTokenResponse | RegisterResponse>(`${BASE}/google/callback/`, {
    code,
  });

export const logout = (refresh: string) =>
  api.post(`${BASE}/logout/`, { refresh });
