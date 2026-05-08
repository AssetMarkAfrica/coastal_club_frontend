import type { ApiResponse } from "./api";
import type { UserProfile } from "./auth";

export type ProfileResponse = ApiResponse<UserProfile>;

export type UpdateProfilePayload = Partial<
  Omit<
    UserProfile,
    | "age"
    | "is_profile_complete"
    | "missing_required_fields"
    | "created_at"
    | "updated_at"
  >
>;
