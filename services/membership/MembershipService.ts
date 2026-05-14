import api from "../utils/api";
import type {
  AcceptMembershipContractPayload,
  AcceptMembershipContractResponse,
  AdminMembershipApplicationsResponse,
  ApproveMembershipApplicationPayload,
  ApproveMembershipApplicationResponse,
  MembershipPlansResponse,
  MyMembershipContractResponse,
  MyMembershipResponse,
  SubmitMembershipApplicationPayload,
  SubmitMembershipApplicationResponse,
} from "../../types/membership";

export type {
  AcceptMembershipContractData,
  AcceptMembershipContractPayload,
  AcceptMembershipContractResponse,
  AdminMembershipApplicationsResponse,
  ApproveMembershipApplicationData,
  ApproveMembershipApplicationPayload,
  ApproveMembershipApplicationResponse,
  MembershipApplication,
  MembershipApplicationSubmission,
  MembershipBenefit,
  MembershipContract,
  MembershipContractPaymentDetails,
  MembershipPlan,
  MembershipPlanSummary,
  MembershipPlanTier,
  MembershipPlansResponse,
  MyMembership,
  MyMembershipContractResponse,
  MyMembershipResponse,
  SubmitMembershipApplicationPayload,
  SubmitMembershipApplicationResponse,
} from "../../types/membership";

const BASE = process.env.NEXT_PUBLIC_MEMBERSHIP_API;

export const getMembershipPlans = () =>
  api.get<MembershipPlansResponse>(`${BASE}/plans/`);

export const submitMembershipApplication = (
  payload: SubmitMembershipApplicationPayload
) => api.post<SubmitMembershipApplicationResponse>(`${BASE}/applications/`, payload);

export const getAdminMembershipApplications = () =>
  api.get<AdminMembershipApplicationsResponse>(`${BASE}/admin/applications/`);

export const approveMembershipApplication = (
  payload: ApproveMembershipApplicationPayload
) =>
  api.post<ApproveMembershipApplicationResponse>(
    `${BASE}/admin/applications/approve/`,
    payload
  );

export const getMyMembership = () =>
  api.get<MyMembershipResponse>(`${BASE}/me/`);

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