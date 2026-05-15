import { createSlice } from "@reduxjs/toolkit";
import type { Notification, NotificationPagination } from "../../types/notification";
import {
  deleteNotificationById,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notificationThunks";

export interface NotificationState {
  notifications: Notification[];
  pagination: NotificationPagination | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  pagination: null,
  loading: false,
  error: null,
  message: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError(state) {
      state.error = null;
    },
    clearNotificationMessage(state) {
      state.message = null;
    },
    clearNotificationState(state) {
      state.notifications = [];
      state.pagination = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch notifications.";
      });

    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }));
        state.message = action.payload.message;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to mark all notifications as read.";
      });

    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload.notificationId
            ? { ...notification, is_read: true }
            : notification
        );
        state.message = action.payload.response.message;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to mark notification as read.";
      });

    builder
      .addCase(deleteNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload.notificationId
        );

        if (state.pagination) {
          state.pagination = {
            ...state.pagination,
            count: Math.max(0, state.pagination.count - 1),
          };
        }

        state.message = action.payload.response.message;
      })
      .addCase(deleteNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete notification.";
      });
  },
});

export const {
  clearNotificationError,
  clearNotificationMessage,
  clearNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
