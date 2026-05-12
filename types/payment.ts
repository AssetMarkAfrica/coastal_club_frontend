import type { ApiResponse } from "./api";
import type { MembershipPlanSummary } from "./membership";

export interface VerifyMembershipPaymentPayload {
  reference: string;
}

export interface MembershipActivation {
  id: string;
  status: string;
  is_active: boolean;
  billing_cycle: string;
  current_period_start: string;
  current_period_end: string;
  fb_spend_this_month_pesewas: number;
  monthly_spend_credit_pesewas: number;
  spend_credit_remaining_pesewas: number;
  maintenance_fee_due_pesewas: number;
  maintenance_fee_status: string;
  is_maintenance_fee_paid_current_month: boolean;
  is_signup_bonus_active: boolean;
  signup_bonus_expires_on: string | null;
  maintenance_fee_paid_through_month: string | null;
  maintenance_fee_paid_at: string | null;
  created_at: string;
  plan: MembershipPlanSummary;
}

export type PaymentVerificationData = MembershipActivation | Record<string, unknown>;

export type VerifyMembershipPaymentResponse = ApiResponse<PaymentVerificationData>;

export interface PendingApplicationPayment {
  kind: "application_fee";
  application_id: string;
  application_fee_pesewas: number;
  authorization_url: string;
  reference: string;
}

export interface PendingMembershipPayment {
  kind: "membership_due";
  authorization_url: string;
  reference: string;
  billing_cycle: string;
  cycle_dues_pesewas: number;
  annual_dues_pesewas: number;
  signup_bonus_spend_credit_pesewas: number;
  total_due_now_pesewas: number;
}

export type PendingPayment = PendingApplicationPayment | PendingMembershipPayment;
