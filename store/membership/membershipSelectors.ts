import type { RootState } from "../index";

export const selectMembershipState = (state: RootState) => state.membership;
export const selectMembershipPlans = (state: RootState) => state.membership.plans;
export const selectMembershipApplication = (state: RootState) =>
  state.membership.application;
export const selectAdminMembershipApplications = (state: RootState) =>
  state.membership.adminApplications;
export const selectMembershipApprovalResult = (state: RootState) =>
  state.membership.approvalResult;
export const selectMyMembershipContract = (state: RootState) =>
  state.membership.myContract;
export const selectMyMembership = (state: RootState) =>
  state.membership.myMembership;
export const selectMembershipContractAcceptance = (state: RootState) =>
  state.membership.contractAcceptance;
export const selectMembershipLoading = (state: RootState) =>
  state.membership.loading;
export const selectMembershipError = (state: RootState) => state.membership.error;
