export type VenueType =
  | 'fine_dining'
  | 'executive_lounge'
  | 'private_room'
  | 'skybar';

export const VENUE_OPTIONS: { value: VenueType; label: string }[] = [
  { value: 'fine_dining',      label: 'Fine Dining' },
  { value: 'executive_lounge', label: 'Executive Lounge' },
  { value: 'private_room',     label: 'Private Room' },
  { value: 'skybar',           label: 'Skybar' },
];

export interface Reservation {
  id: string;
  user_id?: string;
  user_email?: string;
  user_full_name?: string;
  venue_type: VenueType | null;
  reservation_date: string;
  reservation_time: string | null;
  number_of_guests: number;
  notes: string;
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

export interface MemberReservation {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  card_token?: string;
  venue_type: VenueType | null;
  reservation_date: string;
  reservation_time: string | null;
  number_of_guests: number;
  notes: string;
  status: 'confirmed' | 'cancelled';
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
  venue_type: VenueType;
  reservation_date: string;
  reservation_time?: string;
  number_of_guests?: number;
  notes?: string;
  intended_spend_pesewas: number;
  callback_url: string;
}

export interface CreateMemberReservationPayload {
  venue_type: VenueType;
  reservation_date: string;
  reservation_time?: string;
  number_of_guests?: number;
  notes?: string;
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
  card_token?: string;
  amount_spent_pesewas: number;
  callback_url?: string;
}

export interface VerifySpendPayload {
  reference: string;
}
