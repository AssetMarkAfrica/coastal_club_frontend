import { createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationService from "../../services/notification/NotificationService";
import type {
  NotificationActionResponse,
  NotificationReadAllResponse,
  NotificationsResponse,
} from "../../types/notification";

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: {
      data?: {
        detail?: string;
        message?: string;
      };
    };
  };

  return err.response?.data?.detail ?? err.response?.data?.message ?? fallback;
};

export const fetchNotifications = createAsyncThunk<
  NotificationsResponse,
  void,
  { rejectValue: string }
>("notification/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const { data } = await notificationService.getNotifications();
    return data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to fetch notifications.")
    );
  }
});

export const markAllNotificationsAsRead = createAsyncThunk<
  NotificationReadAllResponse,
  void,
  { rejectValue: string }
>("notification/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    const { data } = await notificationService.readAllNotifications();
    return data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to mark all notifications as read.")
    );
  }
});

export const markNotificationAsRead = createAsyncThunk<
  {
    notificationId: string;
    response: NotificationActionResponse;
  },
  string,
  { rejectValue: string }
>("notification/markAsRead", async (notificationId, { rejectWithValue }) => {
  try {
    const { data } = await notificationService.readNotification(notificationId);
    return { notificationId, response: data };
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to mark notification as read.")
    );
  }
});

export const deleteNotificationById = createAsyncThunk<
  {
    notificationId: string;
    response: NotificationActionResponse;
  },
  string,
  { rejectValue: string }
>("notification/deleteById", async (notificationId, { rejectWithValue }) => {
  try {
    const { data } = await notificationService.deleteNotification(notificationId);
    return { notificationId, response: data };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete notification."));
  }
});
