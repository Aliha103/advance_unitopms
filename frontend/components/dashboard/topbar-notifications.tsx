"use client";

import { useState, useEffect, useRef } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  subscription: {
    color: "from-teal-500 to-emerald-500",
    icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  },
  payment: {
    color: "from-red-500 to-rose-500",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  },
  system: {
    color: "from-blue-500 to-blue-600",
    icon: "M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z",
  },
  info: {
    color: "from-gray-500 to-gray-600",
    icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TopbarNotifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const loaded = useNotificationStore((s) => s.loaded);
  const fetchNotifications = useNotificationStore((s) => s.fetch);
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll unread count every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button with 3D press effect */}
      <button
        type="button"
        className={cn(
          "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
          open
            ? "bg-gray-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
            : "text-gray-500 hover:text-gray-700 bg-white/60 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <svg
          className="w-[18px] h-[18px]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold text-white rounded-full ring-2 ring-white"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
              boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown with 3D depth */}
      <div
        className={cn(
          "absolute right-0 top-full mt-3 w-[360px] rounded-2xl overflow-hidden transition-all duration-200 origin-top-right z-50",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
          boxShadow:
            "0 25px 60px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {/* Header with subtle gradient */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(180deg, #f8fafc 0%, transparent 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center h-5 px-2 text-[10px] font-bold text-white rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[340px] overflow-y-auto px-2.5 pb-2.5">
          {!loaded ? (
            <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center">
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <p className="text-sm text-gray-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.info;
              return (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-3.5 px-3 py-3.5 cursor-pointer rounded-xl transition-all duration-200",
                    !notif.is_read
                      ? "bg-gradient-to-r from-blue-50/60 to-transparent hover:from-blue-50 hover:to-blue-25/50"
                      : "hover:bg-gray-50/80"
                  )}
                  onClick={() => {
                    if (!notif.is_read) markRead(notif.id);
                  }}
                >
                  {/* Icon with gradient background */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
                    <span className={cn("w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-white bg-gradient-to-br", config.color)}>
                      <svg
                        className="w-[18px] h-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={config.icon}
                        />
                      </svg>
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                            boxShadow: "0 0 6px rgba(59,130,246,0.5)",
                          }}
                        />
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                      {timeAgo(notif.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100/80">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full py-2 text-[12px] font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-[0.98]"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
}
