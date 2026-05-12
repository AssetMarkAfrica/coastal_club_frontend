import { createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentService from "../../services/payment/PaymentService";
import type { PaymentVerificationData } from "../../types/payment";
import type { RootState } from "../index";

const isReferenceNotFound = (error: unknown) => {
  const err = error as {
    response?: {
      status?: number;
      data?: {
        detail?: string;
        message?: string;
      };
    };
  };

  const message =
    err.response?.data?.detail?.toLowerCase() ??
    err.response?.data?.message?.toLowerCase() ??
    "";

  return err.response?.status === 404 || message.includes("reference not found");
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: {
      data?: {
        detail?: string;
        message?: string;
      };
    };
  };

  return err.response?.data?.detail ?? err.response?.data?.message ?? fallback;
};

export const verifyMembershipPaymentByReference = createAsyncThunk<
  PaymentVerificationData,
  string,
  { rejectValue: string }
>(
  "payment/verifyMembershipPaymentByReference",
  async (reference: string, { rejectWithValue }) => {
    try {
      const { data } = await paymentService.verifyApplicationFeePayment({
        reference,
      });
      return data.data;
    } catch (error) {
      if (isReferenceNotFound(error)) {
        try {
          const { data } = await paymentService.verifyMembershipPayment({
            reference,
          });
          return data.data;
        } catch (fallbackError) {
          return rejectWithValue(
            getErrorMessage(
              fallbackError,
              "Failed to verify membership payment."
            )
          );
        }
      }

      return rejectWithValue(
        getErrorMessage(error, "Failed to verify membership payment.")
      );
    }
  }
);

export const verifyPendingPayment = createAsyncThunk<
  PaymentVerificationData,
  void,
  { state: RootState; rejectValue: string }
>("payment/verifyPendingPayment", async (_, { getState, rejectWithValue }) => {
  const pendingPayment = getState().payment.pendingPayment;
  const reference = pendingPayment?.reference;

  if (!reference) {
    return rejectWithValue("No pending payment reference found.");
  }

  try {
    const { data } =
      pendingPayment?.kind === "application_fee"
        ? await paymentService.verifyApplicationFeePayment({ reference })
        : await paymentService.verifyMembershipPayment({ reference });
    return data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to verify membership payment.")
    );
  }
});
