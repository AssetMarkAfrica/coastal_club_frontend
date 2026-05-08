import type { RootState } from "../index";

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsNewUser = (state: RootState) => state.auth.isNewUser;
export const selectAccessToken = (state: RootState) => state.auth.access;
export const selectRefreshToken = (state: RootState) => state.auth.refresh;
export const selectPendingToken = (state: RootState) => state.auth.pendingToken;
export const selectOtpDelivery = (state: RootState) => state.auth.otpDelivery;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.access);
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === "admin";
export const selectIsMember = (state: RootState) =>
  state.auth.user?.role === "member";
