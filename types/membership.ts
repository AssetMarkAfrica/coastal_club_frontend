import type { ApiResponse } from "./api";

export type MembershipPlanTier = string;

export interface MembershipBenefit {
  id: number;
  benefit_type: string;
  title: string;
  description: string;
  festive_name: string;
  festive_start_date: string | null;
  festive_end_date: string | null;
  sort_order: number;
  is_active: boolean;
  is_currently_available: boolean;
}

export interface MembershipPlan {
  id: number;
  tier: MembershipPlanTier;
  name: string;
  annual_fee_pesewas: number;
  club_maintenance_fee_pesewas: number;
  signup_bonus_spend_credit_pesewas: number;
  initiation_fee_pesewas: number;
  fb_minimum_pesewas: number;
  points_multiplier: string;
  guest_passes_per_visit: number;
  benefits?: MembershipBenefit[];
}

export type MembershipPlansResponse = ApiResponse<MembershipPlan[]>;

export interface SubmitMembershipApplicationPayload {
  plan_tier: MembershipPlanTier;
  callback_url: string;
}

export interface MembershipApplicationSubmission {
  application_id: string;
  application_fee_pesewas: number;
  authorization_url: string;
  reference: string;
}

export type SubmitMembershipApplicationResponse = ApiResponse<MembershipApplicationSubmission>;

export interface MembershipApplicationApplicant {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface MembershipPlanSummary {
  id: number;
  tier: MembershipPlanTier;
  name: string;
}

export interface MembershipApplication {
  id: string;
  status: string;
  application_fee_reference: string;
  application_fee_paid_at: string | null;
  approved_at: string | null;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  applicant: MembershipApplicationApplicant;
  plan: MembershipPlanSummary;
}

export type AdminMembershipApplicationsResponse = ApiResponse<MembershipApplication[]>;

export interface ApproveMembershipApplicationPayload {
  application_id: string;
  callback_url: string;
  admin_notes?: string;
}

export interface MembershipContract {
  id: string;
  status: string;
  contract_version: string;
  currency: string;
  application_fee_paid_pesewas: string | number;
  initiation_fee_pesewas: string | number;
  annual_fee_pesewas: string | number;
  total_due_now_pesewas: string | number;
  monthly_maintenance_fee_pesewas: string | number;
  accepted_terms: boolean;
  accepted_privacy: boolean;
  accepted_club_rules: boolean;
  accepted_at: string | null;
  paystack_reference?: string;
  payment_authorization_url?: string;
}

export interface ApprovedApplicationSummary {
  id: string;
  status: string;
  contract_id: string;
  contract_status: string;
  approved_at: string;
  admin_notes: string;
}

export interface ApproveMembershipApplicationData {
  application: ApprovedApplicationSummary;
  contract: MembershipContract;
}

export type ApproveMembershipApplicationResponse = ApiResponse<ApproveMembershipApplicationData>;

export type MyMembershipContractResponse = ApiResponse<MembershipContract>;

export interface AcceptMembershipContractPayload {
  accept_terms: boolean;
  accept_privacy: boolean;
  accept_club_rules: boolean;
}

export interface MembershipContractPaymentDetails {
  authorization_url: string;
  reference: string;
  billing_cycle: string;
  cycle_dues_pesewas: number;
  annual_dues_pesewas: number;
  signup_bonus_spend_credit_pesewas: number;
  total_due_now_pesewas: number;
}

export interface ContractAcceptanceContractSummary {
  id: string;
  status: string;
  paystack_reference: string;
  payment_authorization_url: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
  accepted_club_rules: boolean;
  accepted_at: string;
}

export interface AcceptMembershipContractData {
  contract: ContractAcceptanceContractSummary;
  payment: MembershipContractPaymentDetails;
}

export type AcceptMembershipContractResponse = ApiResponse<AcceptMembershipContractData>;
