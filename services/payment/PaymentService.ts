import api from "../utils/api";
import type {
  VerifyMembershipPaymentPayload,
  VerifyMembershipPaymentResponse,
} from "../../types/payment";

export type {
  MembershipActivation,
  PaymentVerificationData,
  PendingApplicationPayment,
  PendingMembershipPayment,
  PendingPayment,
  VerifyMembershipPaymentPayload,
  VerifyMembershipPaymentResponse,
} from "../../types/payment";

const BASE = process.env.NEXT_PUBLIC_MEMBERSHIP_API;

export const verifyApplicationFeePayment = ({
  reference,
}: VerifyMembershipPaymentPayload) =>
  api.get<VerifyMembershipPaymentResponse>(
    `${BASE}/applications/verify/?${new URLSearchParams({ reference }).toString()}`
  );

export const verifyMembershipPayment = ({ reference }: VerifyMembershipPaymentPayload) =>
  api.get<VerifyMembershipPaymentResponse>(
    `${BASE}/verify/?${new URLSearchParams({ reference }).toString()}`
  );
