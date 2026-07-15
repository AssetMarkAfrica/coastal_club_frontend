export interface SearchPagination {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
}

export interface MemberSearchSubscription {
  status: string | null;
  is_active: boolean;
  plan_name: string | null;
  tier: string | null;
  maintenance_fee_status: string | null;
  spend_credit_remaining_pesewas?: number;
  monthly_spend_credit_pesewas?: number;
  fb_spend_this_month_pesewas?: number;
}

export interface MemberSearchCard {
  member_number: string | null;
  status: string | null;
  token: string | null;
}

export interface MemberSearchProfile {
  is_complete: boolean;
  city: string | null;
  country: string | null;
}

export interface MemberSearchResult {
  user_id: string;
  email: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  phone_number: string;
  id_number_last4: string;
  member_number: string;
  can_charge: boolean;
  subscription: MemberSearchSubscription;
  card: MemberSearchCard;
  profile: MemberSearchProfile;
  is_active: boolean;
  member_created_at: string;
  indexed_at: string;
}

export interface MemberSearchParams {
  q?: string;
  subscription_status?: string;
  plan_tier?: string;
  card_status?: string;
  is_active?: boolean | string;
  profile_complete?: boolean | string;
  page?: number | string;
  page_size?: number | string;
}

export interface MemberSearchResponse {
  success: boolean;
  pagination: SearchPagination;
  results: MemberSearchResult[];
}

export interface MemberSearchDetailResponse {
  success: boolean;
  message?: string;
  data: MemberSearchResult;
}

export interface ReservationDetails {
  date: string;
  status: string;
  expires_at: string;
  paid_at: string;
}

export interface PaymentDetails {
  intended_spend_pesewas: number;
  spend_credit_remaining_pesewas: number;
  paystack_reference: string;
}

export interface ReservationSearchResult {
  user_id: string;
  reservation_id: string;
  email: string;
  username: string;
  full_name: string;
  phone_number: string;
  is_confirmed: boolean;
  is_expired: boolean;
  reservation: ReservationDetails;
  payment: PaymentDetails;
  reservation_created_at: string;
  indexed_at: string;
}

export interface ReservationSearchParams {
  q?: string;
  status?: string;
  reservation_date?: string;
  reservation_date_from?: string;
  reservation_date_to?: string;
  has_credit_remaining?: boolean | string;
  page?: number | string;
  page_size?: number | string;
}

export interface ReservationSearchResponse {
  success: boolean;
  pagination: SearchPagination;
  results: ReservationSearchResult[];
}

export interface ReservationSearchDetailResponse {
  success: boolean;
  message?: string;
  data: ReservationSearchResult;
}
