import type { RootState } from "../index";

export const selectPaymentState = (state: RootState) => state.payment;
export const selectPendingPayment = (state: RootState) =>
  state.payment.pendingPayment;
export const selectPaymentVerificationResult = (state: RootState) =>
  state.payment.verificationResult;
export const selectPaymentLoading = (state: RootState) => state.payment.loading;
export const selectPaymentError = (state: RootState) => state.payment.error;
export const selectPendingPaymentReference = (state: RootState) =>
  state.payment.pendingPayment?.reference ?? null;
export const selectPendingPaymentAuthorizationUrl = (state: RootState) =>
  state.payment.pendingPayment?.authorization_url ?? null;
