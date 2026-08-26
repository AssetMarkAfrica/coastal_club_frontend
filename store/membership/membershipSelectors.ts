import type { RootState } from "../index";

export const selectMembershipState = (state: RootState) => state.membership;
export const selectMembershipPlans = (state: RootState) => state.membership.plans;
export const selectMembershipApplication = (state: RootState) =>
  state.membership.application;
export const selectAdminMembershipApplications = (state: RootState) =>
  state.membership.adminApplications;
export const selectAdminMembershipApplicationDetail = (state: RootState) =>
  state.membership.adminApplicationDetail;
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
export const selectMyMembershipStatus = (state: RootState) =>
  state.membership.myMembershipStatus;
export const selectSubscriptions = (state: RootState) =>
  state.membership.subscriptions;
export const selectSubscriptionDetail = (state: RootState) =>
  state.membership.subscriptionDetail;
export const selectAdminPaymentHistory = (state: RootState) =>
  state.membership.paymentHistory;
export const selectAdminLatePayments = (state: RootState) =>
  state.membership.latePayments;
export const selectMaintenanceFeeLoading = (state: RootState) =>
  state.membership.maintenanceFeeLoading;