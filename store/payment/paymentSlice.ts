import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  PaymentVerificationData,
  PendingApplicationPayment,
  PendingMembershipPayment,
  PendingPayment,
} from "../../types/payment";
import {
  verifyMembershipPaymentByReference,
  verifyPendingPayment,
} from "./paymentThunks";

export interface PaymentState {
  pendingPayment: PendingPayment | null;
  verificationResult: PaymentVerificationData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  pendingPayment: null,
  verificationResult: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPendingApplicationPayment(
      state,
      action: PayloadAction<PendingApplicationPayment>
    ) {
      state.pendingPayment = action.payload;
    },
    setPendingMembershipPayment(
      state,
      action: PayloadAction<PendingMembershipPayment>
    ) {
      state.pendingPayment = action.payload;
    },
    clearPendingPayment(state) {
      state.pendingPayment = null;
    },
    clearPaymentError(state) {
      state.error = null;
    },
    clearPaymentState(state) {
      state.pendingPayment = null;
      state.verificationResult = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyMembershipPaymentByReference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMembershipPaymentByReference.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationResult = action.payload;

        if (
          typeof action.payload === "object" &&
          action.payload !== null &&
          "status" in action.payload &&
          action.payload.status === "active"
        ) {
          state.pendingPayment = null;
        }
      })
      .addCase(verifyMembershipPaymentByReference.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to verify membership payment.";
      });

    builder
      .addCase(verifyPendingPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPendingPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationResult = action.payload;

        if (
          typeof action.payload === "object" &&
          action.payload !== null &&
          "status" in action.payload &&
          action.payload.status === "active"
        ) {
          state.pendingPayment = null;
        }
      })
      .addCase(verifyPendingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to verify membership payment.";
      });
  },
});

export const {
  setPendingApplicationPayment,
  setPendingMembershipPayment,
  clearPendingPayment,
  clearPaymentError,
  clearPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
