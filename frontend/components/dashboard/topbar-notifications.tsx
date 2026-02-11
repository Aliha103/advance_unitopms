"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// TODO: Replace with real notifications from API
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Reservation #2929",
    desc: "Added by John Doe just now",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "text-blue-600 bg-blue-50",
    unread: true,
    time: "Just now",
  },
  {
    id: "2",
    title: "Host Application Received",
    desc: "Grand Hotel & Spa applied",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    color: "text-teal-600 bg-teal-50",
    unread: true,
    time: "2m ago",
  },
  {
    id: "3",
    title: "Payment Failed",
    desc: "Invoice #1847 — Sunset Villas",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    color: "text-red-600 bg-red-50",
    unread: false,
    time: "1h ago",
  },
];

export function TopbarNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    );
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        type="button"
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
          open
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all origin-top-right z-50",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-teal-700 bg-teal-100 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50",
                notif.unread && "bg-teal-50/30"
              )}
            >
              {/* Icon */}
              <span
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg shrink-0 mt-0.5",
                  notif.color
                )}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={notif.icon}
                  />
                </svg>
              </span>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {notif.desc}
                </p>
              </div>
              {/* Time + unread dot */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-gray-400">{notif.time}</span>
                {notif.unread && (
                  <span className="w-2 h-2 bg-teal-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
}
