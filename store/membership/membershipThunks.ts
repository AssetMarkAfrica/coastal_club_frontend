import { createAsyncThunk } from "@reduxjs/toolkit";
import * as membershipService from "../../services/membership/MembershipService";
import {
  setPendingApplicationPayment,
  setPendingMembershipPayment,
} from "../payment/paymentSlice";
import type {
  AcceptMembershipContractPayload,
  ApproveMembershipApplicationPayload,
  SubmitMembershipApplicationPayload,
  CheckoutMaintenanceFeePayload,
  VerifyMaintenanceFeePayload
} from "../../types/membership";

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

export const fetchMembershipPlans = createAsyncThunk(
  "membership/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getMembershipPlans();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch membership plans.")
      );
    }
  }
);

export const submitMembershipApplication = createAsyncThunk(
  "membership/submitApplication",
  async (payload: SubmitMembershipApplicationPayload, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await membershipService.submitMembershipApplication(payload);
      dispatch(
        setPendingApplicationPayment({
          kind: "application_fee",
          application_id: data.data.application_id,
          application_fee_pesewas: data.data.application_fee_pesewas,
          authorization_url: data.data.authorization_url,
          reference: data.data.reference,
        })
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to submit membership application.")
      );
    }
  }
);

export const fetchAdminMembershipApplications = createAsyncThunk(
  "membership/fetchAdminApplications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getAdminMembershipApplications();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch membership applications.")
      );
    }
  }
);

export const fetchAdminMembershipApplicationDetail = createAsyncThunk(
  "membership/fetchAdminApplicationDetail",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const { data } =
        await membershipService.getAdminMembershipApplicationDetail(applicationId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch membership application detail.")
      );
    }
  }
);

export const approveMembershipApplication = createAsyncThunk(
  "membership/approveApplication",
  async (payload: ApproveMembershipApplicationPayload, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.approveMembershipApplication(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to approve membership application.")
      );
    }
  }
);

export const fetchMyMembershipContract = createAsyncThunk(
  "membership/fetchMyContract",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getMyMembershipContract();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch membership contract.")
      );
    }
  }
);

export const fetchMyMembership = createAsyncThunk(
  "membership/fetchMyMembership",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getMyMembership();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch your membership.")
      );
    }
  }
);

export const fetchMyMembershipStatus = createAsyncThunk(
  "membership/fetchMyMembershipStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getMyMembershipStatus();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch your membership status.")
      );
    }
  }
)

export const acceptMembershipContract = createAsyncThunk(
  "membership/acceptContract",
  async (
    {
      membershipContractId,
      payload,
    }: {
      membershipContractId: string;
      payload: AcceptMembershipContractPayload;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await membershipService.acceptMembershipContract(
        membershipContractId,
        payload
      );

      dispatch(
        setPendingMembershipPayment({
          kind: "membership_due",
          authorization_url: data.data.payment.authorization_url,
          reference: data.data.payment.reference,
          billing_cycle: data.data.payment.billing_cycle,
          cycle_dues_pesewas: data.data.payment.cycle_dues_pesewas,
          annual_dues_pesewas: data.data.payment.annual_dues_pesewas,
          signup_bonus_spend_credit_pesewas:
            data.data.payment.signup_bonus_spend_credit_pesewas,
          total_due_now_pesewas: data.data.payment.total_due_now_pesewas,
        })
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to accept membership contract.")
      );
    }
  }
);

export const fetchSubscriptions = createAsyncThunk(
  "membership/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getSubscriptions();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch subscriptions.")
      );
    }
  }
);

export const fetchSubscriptionDetail = createAsyncThunk(
  "membership/fetchSubscriptionDetail",
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getSubscriptionDetail(
        subscriptionId
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch subscription detail.")
      );
    }
  }
);

export const suspendSubscription = createAsyncThunk(
  "membership/suspendSubscription",
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.suspendSubscription(subscriptionId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to suspend subscription.")
      );
    }
  }
);

export const reactivateSubscription = createAsyncThunk(
  "membership/reactivateSubscription",
  async (subscriptionId: string, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.reactivateSubscription(subscriptionId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to reactivate subscription.")
      );
    }
  }
);

export const fetchAdminPaymentHistory = createAsyncThunk(
  "membership/fetchAdminPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getAdminPaymentHistory();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch payment history.")
      );
    }
  }
);

export const fetchAdminLatePayments = createAsyncThunk(
  "membership/fetchAdminLatePayments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.getAdminLatePayments();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch late payments.")
      );
    }
  }
);

export const checkoutMaintenanceFee = createAsyncThunk(
  "membership/checkoutMaintenanceFee",
  async (payload: CheckoutMaintenanceFeePayload, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.checkoutMaintenanceFee(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to initialize maintenance fee payment.")
      );
    }
  }
);

export const verifyMaintenanceFee = createAsyncThunk(
  "membership/verifyMaintenanceFee",
  async (payload: VerifyMaintenanceFeePayload, { rejectWithValue }) => {
    try {
      const { data } = await membershipService.verifyMaintenanceFee(payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to verify maintenance fee payment.")
      );
    }
  }
);