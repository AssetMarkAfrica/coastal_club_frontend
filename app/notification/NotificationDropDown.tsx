"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteNotificationById,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/store/notification/notificationThunks";
import {
  clearNotificationError,
  clearNotificationMessage,
} from "@/store/notification/notificationSlice";

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getTypeBadgeClass = (type: string) => {
  if (type === "SECURITY") return "border-blue-300 text-blue-700 bg-blue-50";
  if (type === "MAINTENANCE") return "border-amber-300 text-amber-800 bg-amber-50";
  if (type === "MEMBERSHIP") return "border-gold-muted/60 text-primary bg-gold-muted/10";
  return "border-emerald-300 text-emerald-800 bg-emerald-50";
};

export default function NotificationDropDown() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notifications, loading, error } = useAppSelector((state) => state.notification);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    return () => {
      dispatch(clearNotificationMessage());
      dispatch(clearNotificationError());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
    } catch {
      // Error state is handled in the slice.
    }
  };

  const onRefresh = () => {
    dispatch(fetchNotifications());
  };

  const onMarkSingleRead = async (notificationId: string) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch {
      // Error state is handled in the slice.
    }
  };

  const onDeleteNotification = async (notificationId: string) => {
    try {
      await dispatch(deleteNotificationById(notificationId)).unwrap();
    } catch {
      // Error state is handled in the slice.
    }
  };

  const onMembershipNotificationClick = async (notificationId: string, isRead: boolean) => {
    // Mark as read first if not already, then navigate
    if (!isRead) {
      try {
        await dispatch(markNotificationAsRead(notificationId)).unwrap();
      } catch {
        // Navigate regardless
      }
    }
    setOpen(false);
    router.push("/membership/contract");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="relative p-2 rounded-lg transition-all hover:bg-white/60"
        style={{ color: "rgba(16,36,63,0.7)" }}
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(94vw,24rem)] rounded-xl border border-gold-muted/25 bg-white shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold-muted/20">
            <div>
              <p
                className="text-sm font-semibold text-primary"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Notifications
              </p>
              <p className="text-[11px] text-text-secondary mt-0.5">
                {unreadCount} unread
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[11px] font-semibold text-gold-muted hover:text-primary transition-colors disabled:opacity-50"
                onClick={onMarkAllRead}
                disabled={loading || unreadCount === 0}
              >
                Mark all read
              </button>
              <button
                type="button"
                className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors"
                onClick={onRefresh}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-3 mt-3 rounded border border-danger/40 bg-error-container px-3 py-2 text-xs text-danger">
              {error}
            </div>
          )}

          <div className="max-h-88 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-secondary">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-text-secondary">No notifications yet.</p>
            ) : (
              notifications.map((item) => {
                const isMembership = item.notification_type === "MEMBERSHIP";

                return (
                  <article
                    key={item.id}
                    onClick={
                      isMembership
                        ? () => onMembershipNotificationClick(item.id, item.is_read)
                        : undefined
                    }
                    className={[
                      "px-4 py-3 border-b border-gold-muted/15 last:border-b-0",
                      item.is_read ? "bg-white" : "bg-gold-muted/5",
                      isMembership
                        ? "cursor-pointer hover:bg-gold-muted/10 transition-colors"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-primary truncate">
                            {item.title}
                          </p>
                          {!item.is_read && (
                            <span className="inline-block h-2 w-2 rounded-full bg-red-600 shrink-0" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-text-secondary leading-5">
                          {item.message}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${getTypeBadgeClass(
                              item.notification_type
                            )}`}
                          >
                            {item.notification_type}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {formatTimestamp(item.timestamp)}
                          </span>
                          {isMembership && (
                            <span className="text-[10px] font-semibold text-gold-muted">
                              View contract →
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stop propagation on action buttons so clicking them
                          doesn't also trigger the membership route */}
                      <div
                        className="flex shrink-0 flex-col items-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!item.is_read && (
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-gold-muted hover:text-primary transition-colors"
                            onClick={() => onMarkSingleRead(item.id)}
                            disabled={loading}
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-danger hover:opacity-80 transition-opacity"
                          onClick={() => onDeleteNotification(item.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}