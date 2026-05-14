import { createSlice } from "@reduxjs/toolkit";
import type {
  AcceptMembershipContractData,
  ApproveMembershipApplicationData,
  MembershipApplication,
  MembershipApplicationSubmission,
  MembershipContract,
  MembershipPlan,
  MyMembership,
} from "../../types/membership";
import {
  acceptMembershipContract,
  approveMembershipApplication,
  fetchAdminMembershipApplications,
  fetchMembershipPlans,
  fetchMyMembership,
  fetchMyMembershipContract,
  submitMembershipApplication,
} from "./membershipThunks";

export interface MembershipState {
  plans: MembershipPlan[];
  application: MembershipApplicationSubmission | null;
  adminApplications: MembershipApplication[];
  approvalResult: ApproveMembershipApplicationData | null;
  myContract: MembershipContract | null;
  myMembership: MyMembership | null;
  contractAcceptance: AcceptMembershipContractData | null;
  loading: boolean;
  error: string | null;
}

const initialState: MembershipState = {
  plans: [],
  application: null,
  adminApplications: [],
  approvalResult: null,
  myContract: null,
  myMembership: null,
  contractAcceptance: null,
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
      state.adminApplications = [];
      state.approvalResult = null;
      state.myContract = null;
      state.myMembership = null;
      state.contractAcceptance = null;
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
  },
});

export const { clearMembershipError, clearMembershipState } =
  membershipSlice.actions;

export default membershipSlice.reducer;
