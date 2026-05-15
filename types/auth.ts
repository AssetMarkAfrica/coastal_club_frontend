import type { ApiResponse } from "./api";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface OtpDelivery {
  email: boolean;
  sms: boolean;
}

export interface PendingOtpData {
  pending_token: string;
  delivery: OtpDelivery;
}

export type RegisterResponse = ApiResponse<PendingOtpData>;

export interface VerifyOtpPayload {
  pending_token: string;
  code: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResendOtpPayload {
  pending_token: string;
}

export interface GoogleAuthorizeData {
  authorization_url: string;
}

export type GoogleAuthorizeResponse = ApiResponse<GoogleAuthorizeData>;

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
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

export interface AuthTokenData {
  access: string;
  refresh: string;
  user: User;
}

export type AuthTokenResponse = ApiResponse<AuthTokenData>;
