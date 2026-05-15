import api from "../utils/api";
import type {
  NotificationActionResponse,
  NotificationReadAllResponse,
  NotificationsResponse,
} from "../../types/notification";

export type {
  Notification,
  NotificationActionResponse,
  NotificationMetadata,
  NotificationPagination,
  NotificationReadAllData,
  NotificationReadAllResponse,
  NotificationsResponse,
  NotificationType,
} from "../../types/notification";

const BASE = process.env.NEXT_PUBLIC_NOTIFICATION_API;

export const getNotifications = () =>
  api.get<NotificationsResponse>(`${BASE}`);

export const readAllNotifications = () =>
  api.post<NotificationReadAllResponse>(`${BASE}/read-all/`);

export const readNotification = (notificationId: string) =>
  api.post<NotificationActionResponse>(`${BASE}/${notificationId}/read/`);

export const deleteNotification = (notificationId: string) =>
  api.delete<NotificationActionResponse>(`${BASE}/${notificationId}/delete/`);
