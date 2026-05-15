export type NotificationType = "MEMBERSHIP" | "SECURITY" | "MAINTENANCE" | string;

export interface NotificationMetadata {
  status?: string;
  plan_tier?: string;
  subscription_id?: string;
  card_id?: string;
  member_number?: string;
  contract_id?: string;
  application_id?: string;
  paystack_reference?: string;
  signup_bonus_expires_on?: string;
  monthly_spend_credit_pesewas?: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  metadata: NotificationMetadata;
  is_read: boolean;
  timestamp: string;
}

export interface NotificationPagination {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
}

export interface NotificationsResponse {
  success: boolean;
  pagination: NotificationPagination;
  results: Notification[];
}

export interface NotificationReadAllData {
  updated_count: number;
}

export interface NotificationReadAllResponse {
  success: boolean;
  message: string;
  data: NotificationReadAllData;
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
}
