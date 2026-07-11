export interface Reservation {
  id: string;
  user_id?: string;
  user_email?: string;
  user_full_name?: string;
  reservation_date: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'expired';
  intended_spend_pesewas: number;
  spend_credit_remaining_pesewas: number;
  paystack_reference: string | null;
  payment_authorization_url: string | null;
  expires_at: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpendEntry {
  id: string;
  customer_type: 'member' | 'non_member';
  customer_id?: string;
  customer_email?: string;
  customer_full_name?: string;
  staff_user_id: string;
  staff_user_email: string;
  staff_full_name?: string;
  member_subscription: string | null;
  non_member_reservation: string | null;
  amount_spent_pesewas: number;
  credit_applied_pesewas: number;
  amount_due_pesewas: number;
  status: 'pending_payment' | 'settled';
  paystack_reference: string | null;
  payment_authorization_url: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationPayload {
  reservation_date: string;
  intended_spend_pesewas: number;
  callback_url: string;
}

export interface CreateReservationResponse {
  reservation_id: string;
  reservation_date: string;
  intended_spend_pesewas: number;
  authorization_url: string;
  reference: string;
  expires_at: string;
}

export interface VerifyReservationPayload {
  reference: string;
}

export interface LogSpendPayload {
  customer_type: 'member' | 'non_member';
  reservation_id?: string;
  member_subscription_id?: string;
  amount_spent_pesewas: number;
  callback_url?: string;
}

export interface VerifySpendPayload {
  reference: string;
}
