import { createSlice } from "@reduxjs/toolkit";
import type {
  AcceptMembershipContractData,
  ApproveMembershipApplicationData,
  MembershipApplicationDetail,
  MembershipApplication,
  MembershipApplicationSubmission,
  MembershipContract,
  MembershipPlan,
  MyMembership,
  MyMembershipStatus,
  SubscriptionDetail,
  SubscriptionListItem,
  MembershipPaymentHistory,
  AdminLatePaymentsData,
} from "../../types/membership";
import {
  acceptMembershipContract,
  approveMembershipApplication,
  fetchAdminMembershipApplications,
  fetchAdminMembershipApplicationDetail,
  fetchMembershipPlans,
  fetchMyMembership,
  fetchMyMembershipContract,
  fetchMyMembershipStatus,
  fetchSubscriptions,
  fetchSubscriptionDetail,
  submitMembershipApplication,
  suspendSubscription,
  reactivateSubscription,
  fetchAdminPaymentHistory,
  fetchAdminLatePayments
} from "./membershipThunks";

export interface MembershipState {
  plans: MembershipPlan[];
  application: MembershipApplicationSubmission | null;
  myMembershipStatus: MyMembershipStatus | null;
  adminApplications: MembershipApplication[];
  adminApplicationDetail: MembershipApplicationDetail | null;
  approvalResult: ApproveMembershipApplicationData | null;
  myContract: MembershipContract | null;
  myMembership: MyMembership | null;
  contractAcceptance: AcceptMembershipContractData | null;
  subscriptions: SubscriptionListItem[];
  subscriptionDetail: SubscriptionDetail | null;
  paymentHistory: MembershipPaymentHistory[];
  latePayments: AdminLatePaymentsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: MembershipState = {
  plans: [],
  application: null,
  myMembershipStatus: null,
  adminApplications: [],
  adminApplicationDetail: null,
  approvalResult: null,
  myContract: null,
  myMembership: null,
  contractAcceptance: null,
  subscriptions: [],
  subscriptionDetail: null,
  paymentHistory: [],
  latePayments: null,
  loading: false,
  error: null,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    clearMembershipError(state) {
      state.error = null;
    },
    clearMembershipState(state) {
      state.plans = [];
      state.application = null;
      state.myMembershipStatus = null;
      state.adminApplications = [];
      state.adminApplicationDetail = null;
      state.approvalResult = null;
      state.myContract = null;
      state.myMembership = null;
      state.contractAcceptance = null;
      state.subscriptions = [];
      state.subscriptionDetail = null;
      state.paymentHistory = [];
      state.latePayments = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembershipPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchMembershipPlans.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch membership plans.";
      });

    builder
      .addCase(submitMembershipApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMembershipApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(submitMembershipApplication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          "Failed to submit membership application.";
      });

    builder
      .addCase(fetchAdminMembershipApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMembershipApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.adminApplications = action.payload;
      })
      .addCase(fetchAdminMembershipApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          "Failed to fetch membership applications.";
      });

    builder
      .addCase(fetchAdminMembershipApplicationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.adminApplicationDetail = null;
      })
      .addCase(fetchAdminMembershipApplicationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.adminApplicationDetail = action.payload;
      })
      .addCase(fetchAdminMembershipApplicationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          "Failed to fetch membership application detail.";
      });

    builder
      .addCase(approveMembershipApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveMembershipApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalResult = action.payload;
        state.myContract = action.payload.contract;
      })
      .addCase(approveMembershipApplication.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          "Failed to approve membership application.";
      });

    builder
      .addCase(fetchMyMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.myMembership = action.payload;
      })
      .addCase(fetchMyMembership.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch your membership.";
      });

    builder
      .addCase(fetchMyMembershipContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMembershipContract.fulfilled, (state, action) => {
        state.loading = false;
        state.myContract = action.payload;
      })
      .addCase(fetchMyMembershipContract.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch membership contract.";
      });

    builder
      .addCase(acceptMembershipContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptMembershipContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contractAcceptance = action.payload;

        if (state.myContract) {
          state.myContract.status = action.payload.contract.status;
          state.myContract.paystack_reference =
            action.payload.contract.paystack_reference;
          state.myContract.payment_authorization_url =
            action.payload.contract.payment_authorization_url;
          state.myContract.accepted_terms = action.payload.contract.accepted_terms;
          state.myContract.accepted_privacy =
            action.payload.contract.accepted_privacy;
          state.myContract.accepted_club_rules =
            action.payload.contract.accepted_club_rules;
          state.myContract.accepted_at = action.payload.contract.accepted_at;
        }
      })
      .addCase(acceptMembershipContract.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to accept membership contract.";
      });

    builder
      .addCase(fetchMyMembershipStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyMembershipStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.myMembershipStatus = action.payload;
      })
      .addCase(fetchMyMembershipStatus.rejected, (state, action) => {
        state.loading = false;
        state.myMembershipStatus = null;
        const errorMsg = action.payload as string;
        if (errorMsg && !errorMsg.toLowerCase().includes("no application found")) {
          state.error = errorMsg;
        }
      });

    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch subscriptions.";
      });

    builder
      .addCase(fetchSubscriptionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscriptionDetail = null;
      })
      .addCase(fetchSubscriptionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionDetail = action.payload;
      })
      .addCase(fetchSubscriptionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch subscription detail.";
      });

    builder
      .addCase(suspendSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendSubscription.fulfilled, (state, action) => {
        state.loading = false;
        // Update subscription detail if it's the one currently viewed
        if (state.subscriptionDetail?.id === action.payload.id) {
          state.subscriptionDetail = action.payload;
        }
        // Also update in the list if it exists there
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index].status = action.payload.status;
          state.subscriptions[index].is_active = action.payload.is_active;
        }
        // Update myMembership if it matches (in case it's an admin looking at their own, or something like that)
        if (state.myMembership?.id === action.payload.id) {
          state.myMembership = action.payload;
        }
      })
      .addCase(suspendSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to suspend subscription.";
      });

    builder
      .addCase(reactivateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (state.subscriptionDetail?.id === action.payload.id) {
          state.subscriptionDetail = action.payload;
        }
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index].status = action.payload.status;
          state.subscriptions[index].is_active = action.payload.is_active;
        }
        if (state.myMembership?.id === action.payload.id) {
          state.myMembership = action.payload;
        }
      })
      .addCase(reactivateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to reactivate subscription.";
      });

    builder
      .addCase(fetchAdminPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchAdminPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch payment history.";
      });

    builder
      .addCase(fetchAdminLatePayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminLatePayments.fulfilled, (state, action) => {
        state.loading = false;
        state.latePayments = action.payload;
      })
      .addCase(fetchAdminLatePayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch late payments.";
      });
  },
});

export const { clearMembershipError, clearMembershipState } =
  membershipSlice.actions;

export default membershipSlice.reducer;