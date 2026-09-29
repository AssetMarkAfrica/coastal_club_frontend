import api from "../utils/api";
import type {
  AcceptMembershipContractPayload,
  AcceptMembershipContractResponse,
  AdminMembershipApplicationDetailResponse,
  AdminMembershipApplicationsResponse,
  ApproveMembershipApplicationPayload,
  ApproveMembershipApplicationResponse,
  MembershipPlansResponse,
  MembershipPlanDetailResponse,
  MyMembershipContractResponse,
  MyMembershipResponse,
  MyMembershipStatusResponse,
  SubmitMembershipApplicationPayload,
  SubmitMembershipApplicationResponse,
  SubscriptionDetailResponse,
  SubscriptionsListResponse,
  SuspendSubscriptionResponse,
  ReactivateSubscriptionResponse,
  AdminPaymentHistoryResponse,
  AdminLatePaymentsResponse,
  AdminFulfillSwagResponse,
  AdminAssignAccountManagerResponse,
  AssignAccountManagerPayload,
  BlackoutPeriodsResponse,
  CreateBlackoutPeriodResponse,
  CreateBlackoutPeriodPayload,
  AllowedVenuesResponse,
} from "../../types/membership";

export type {
  AcceptMembershipContractData,
  AcceptMembershipContractPayload,
  AcceptMembershipContractResponse,
  AdminMembershipApplicationDetailResponse,
  AdminMembershipApplicationsResponse,
  MembershipApplicationDetail,
  ApproveMembershipApplicationData,
  ApproveMembershipApplicationPayload,
  ApproveMembershipApplicationResponse,
  MembershipApplication,
  MembershipApplicationSubmission,
  MembershipBenefit,
  MembershipContract,
  MembershipContractPaymentDetails,
  MembershipPlan,
  MembershipPlanDetailResponse,
  MembershipPlanSummary,
  MembershipPlanTier,
  MembershipPlansResponse,
  PlanSwagItem,
  MyMembership,
  MyMembershipContractResponse,
  MyMembershipResponse,
  MyMembershipStatus,
  MyMembershipStatusResponse,
  SubmitMembershipApplicationPayload,
  SubmitMembershipApplicationResponse,
  MembershipPaymentHistory,
  AdminPaymentHistoryResponse,
  AdminLatePaymentsData,
  AdminLatePaymentsResponse,
  BookingBlackoutPeriod,
  BlackoutPeriodsResponse,
  CreateBlackoutPeriodPayload,
  CreateBlackoutPeriodResponse,
  AllowedVenuesResponse,
  AssignAccountManagerPayload,
  AdminFulfillSwagResponse,
  AdminAssignAccountManagerResponse,
} from "../../types/membership";

const BASE = process.env.NEXT_PUBLIC_MEMBERSHIP_API;
const BOOKING_BASE = process.env.NEXT_PUBLIC_BOOKING_API;

export const getMembershipPlans = () =>
  api.get<MembershipPlansResponse>(`${BASE}/plans/`);

export const getMembershipPlanById = (planId: number) =>
  api.get<MembershipPlanDetailResponse>(`${BASE}/plans/${planId}/`);

export const submitMembershipApplication = (
  payload: SubmitMembershipApplicationPayload
) => api.post<SubmitMembershipApplicationResponse>(`${BASE}/applications/`, payload);

export const getAdminMembershipApplications = () =>
  api.get<AdminMembershipApplicationsResponse>(`${BASE}/admin/applications/`);

export const getAdminMembershipApplicationDetail = (applicationId: string) =>
  api.get<AdminMembershipApplicationDetailResponse>(
    `${BASE}/admin/applications/${applicationId}/`
  );

export const approveMembershipApplication = (
  payload: ApproveMembershipApplicationPayload
) =>
  api.post<ApproveMembershipApplicationResponse>(
    `${BASE}/admin/applications/approve/`,
    payload
  );

export const getMyMembership = () =>
  api.get<MyMembershipResponse>(`${BASE}/me/`);

export const getMyMembershipStatus = () =>
  api.get<MyMembershipStatusResponse>(`${BASE}/me/status`);

export const getMyMembershipContract = () =>
  api.get<MyMembershipContractResponse>(`${BASE}/contracts/me/`);

export const acceptMembershipContract = (
  membershipContractId: string,
  payload: AcceptMembershipContractPayload
) =>
  api.post<AcceptMembershipContractResponse>(
    `${BASE}/contracts/${membershipContractId}/accept/`,
    payload
  );

export const getSubscriptions = () =>
  api.get<SubscriptionsListResponse>(`${BASE}/staff/subscriptions/`);

export const getSubscriptionDetail = (subscriptionId: string) =>
  api.get<SubscriptionDetailResponse>(`${BASE}/staff/subscriptions/${subscriptionId}/`);

export const suspendSubscription = (subscriptionId: string) =>
  api.post<SuspendSubscriptionResponse>(`${BASE}/admin/subscriptions/${subscriptionId}/suspend/`);

export const reactivateSubscription = (subscriptionId: string) =>
  api.post<ReactivateSubscriptionResponse>(`${BASE}/admin/subscriptions/${subscriptionId}/reactivate/`);

export const getAdminPaymentHistory = () =>
  api.get<AdminPaymentHistoryResponse>(`${BASE}/admin/payments/`);

export const getAdminLatePayments = () =>
  api.get<AdminLatePaymentsResponse>(`${BASE}/admin/late-payments/`);

// ---------------------------------------------------------------------------
// Swag & Account Manager (new endpoints)
// ---------------------------------------------------------------------------

export const fulfillSwag = (subscriptionId: string) =>
  api.patch<AdminFulfillSwagResponse>(`${BASE}/admin/subscriptions/${subscriptionId}/fulfill-swag/`);

export const assignAccountManager = (
  subscriptionId: string,
  payload: AssignAccountManagerPayload
) =>
  api.patch<AdminAssignAccountManagerResponse>(
    `${BASE}/admin/subscriptions/${subscriptionId}/assign-account-manager/`,
    payload
  );

// ---------------------------------------------------------------------------
// Blackout Periods (new endpoints)
// ---------------------------------------------------------------------------

export const getBlackoutPeriods = () =>
  api.get<BlackoutPeriodsResponse>(`${BOOKING_BASE}/staff/blackout-periods/`);

export const createBlackoutPeriod = (payload: CreateBlackoutPeriodPayload) =>
  api.post<CreateBlackoutPeriodResponse>(`${BOOKING_BASE}/staff/blackout-periods/`, payload);

// ---------------------------------------------------------------------------
// Allowed Venues (new endpoint)
// ---------------------------------------------------------------------------

export const getMyAllowedVenues = () =>
  api.get<AllowedVenuesResponse>(`${BOOKING_BASE}/members/me/allowed-venues/`);