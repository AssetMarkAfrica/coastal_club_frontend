import type { RootState } from "../index";

export const selectProfileState = (state: RootState) => state.profile;
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectIsProfileComplete = (state: RootState) =>
  Boolean(state.profile.profile?.is_profile_complete);
