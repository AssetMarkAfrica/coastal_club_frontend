import api from "../utils/api";
import type { ProfileResponse, UpdateProfilePayload } from "../../types/profile";
export type { ProfileResponse, UpdateProfilePayload } from "../../types/profile";

const BASE = process.env.NEXT_PUBLIC_PROFILE_API;

export const getProfile = () => api.get<ProfileResponse>(`${BASE}/me/`);

export const updateProfile = (payload: UpdateProfilePayload) =>
  api.patch<ProfileResponse>(`${BASE}/me/`, payload);
