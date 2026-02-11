"use client";

/**
 * Dashboard Navbar — Full-featured top bar for UnitoPMS Admin & Host Dashboard.
 *
 * Features:
 *  - Mobile sidebar toggle
 *  - Logo icon + breadcrumbs from pathname
 *  - Centered command menu / search trigger (⌘K)
 *  - Quick actions dropdown (search reservations, find guest, check room)
 *  - Help button
 *  - Notifications bell with unread badge + dropdown
 *  - Profile avatar (initials) with dropdown (settings, subscription, logout)
 *  - Click-outside to close all dropdowns
 *  - Keyboard: Escape closes all
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

// ── Breadcrumb helpers ──────────────────────────────────────────────────────

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Overview",
  users: "Users",
  hosts: "Hosts",
  inbox: "Inbox",
  revenue: "Revenue",
  subscriptions: "Subscriptions",
  settings: "Settings",
  integrations: "Integrations",
  audit: "Audit Log",
  feedback: "Feedback",
  reputation: "Reputation",
  applications: "Applications",
  guests: "Guests",
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? capitalize(seg.replace(/-/g, " ")),
    isLast: i === segments.length - 1,
  }));
}

// ── Main Component ──────────────────────────────────────────────────────────

export function DashboardTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Dropdown states
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Refs for click-outside
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Derived
  const breadcrumbs = getBreadcrumbs(pathname);
  const unreadCount = 3; // TODO: wire to real data

  const userInitials = user?.full_name
    ? user.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const userName = user?.full_name || "Admin";
  const userEmail = user?.email || "admin@unitopms.com";

  // Close all dropdowns
  const closeAll = useCallback(() => {
    setShowSearch(false);
    setShowNotifications(false);
    setShowProfile(false);
  }, []);

  // Escape key closes all
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
      // ⌘K or Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowNotifications(false);
        setShowProfile(false);
        setShowSearch((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeAll]);

  // Click outside closes dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    closeAll();
    logout();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <header className="h-16 w-full">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* ─── LEFT: Logo & Breadcrumbs ─── */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile toggle */}
            <button
              type="button"
              className="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo icon */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group outline-none min-w-0"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-lg shadow-sm group-hover:bg-black transition-colors">
                <span className="text-white text-xs font-bold">U</span>
              </div>

              {/* Separator + breadcrumbs */}
              <div className="h-4 w-px bg-gray-200 rotate-12 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-1.5 overflow-hidden text-sm">
                <span className="font-medium text-gray-900">Unito</span>
                {breadcrumbs.map(({ label, isLast }, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-gray-400">/</span>
                    <span
                      className={
                        isLast
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </Link>
          </div>

          {/* ─── CENTER: Command Menu Trigger ─── */}
          <div
            ref={searchRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
          >
            <button
              type="button"
              className="w-80 h-9 flex items-center justify-between px-3 bg-white border border-gray-200 hover:border-gray-300 hover:ring-2 hover:ring-gray-100 text-gray-500 hover:text-gray-700 rounded-lg shadow-sm transition-all duration-200 group"
              onClick={() => {
                setShowNotifications(false);
                setShowProfile(false);
                setShowSearch((v) => !v);
              }}
            >
              <span className="flex items-center gap-2.5">
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <span className="text-[13px] font-medium pt-0.5 text-gray-500 group-hover:text-gray-800">
                  Search everything...
                </span>
              </span>
              <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 text-[10px] font-medium text-gray-400 group-hover:text-gray-600 bg-gray-50 border border-gray-200 rounded shadow-sm font-sans transition-colors">
                ⌘K
              </kbd>
            </button>

            {/* Quick Actions Dropdown */}
            <div
              className={cn(
                "absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 transition-all origin-top z-50",
                showSearch
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}
            >
              <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Quick Actions
              </div>
              <div className="space-y-0.5">
                {[
                  {
                    label: "Search reservations...",
                    color: "violet",
                    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                  },
                  {
                    label: "Find guest...",
                    color: "blue",
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  },
                  {
                    label: "Check room status...",
                    color: "emerald",
                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map(({ label, color, icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-left transition-colors group/item"
                    onClick={() => setShowSearch(false)}
                  >
                    <span
                      className={cn(
                        "p-1.5 rounded-md transition-colors",
                        color === "violet" &&
                          "bg-violet-50 text-violet-600 group-hover/item:bg-violet-100",
                        color === "blue" &&
                          "bg-blue-50 text-blue-600 group-hover/item:bg-blue-100",
                        color === "emerald" &&
                          "bg-emerald-50 text-emerald-600 group-hover/item:bg-emerald-100"
                      )}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={icon}
                        />
                      </svg>
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Actions ─── */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Help button */}
            <button
              type="button"
              className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Help & Support"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </button>

            {/* ── Notifications ── */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                className={cn(
                  "relative w-8 h-8 flex items-center justify-center rounded-md transition-colors focus:outline-none",
                  showNotifications
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => {
                  setShowSearch(false);
                  setShowProfile(false);
                  setShowNotifications((v) => !v);
                }}
                aria-label="Notifications"
              >
                <svg
                  className="w-[18px] h-[18px]"
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
                  <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              {/* Notifications dropdown */}
              <div
                className={cn(
                  "absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all origin-top-right z-50",
                  showNotifications
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                )}
              >
                <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 text-xs uppercase tracking-wide">
                    Notifications
                  </h3>
                  <button
                    type="button"
                    className="text-[10px] font-medium text-gray-500 hover:text-gray-900"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* Notification items */}
                  {[
                    {
                      title: "New Reservation #2929",
                      desc: "Added by John Doe just now",
                      color: "bg-blue-500",
                    },
                    {
                      title: "Host Application Received",
                      desc: "Grand Hotel & Spa — 2 min ago",
                      color: "bg-teal-500",
                    },
                    {
                      title: "Payment Failed",
                      desc: "Invoice #1847 for Sunset Villas — 1h ago",
                      color: "bg-red-500",
                    },
                  ].map(({ title, desc, color }) => (
                    <div
                      key={title}
                      className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                            color
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                  <button
                    type="button"
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </div>

            {/* ── Profile ── */}
            <div className="relative pl-1" ref={profileRef}>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 transition-all"
                onClick={() => {
                  setShowSearch(false);
                  setShowNotifications(false);
                  setShowProfile((v) => !v);
                }}
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center text-white text-xs font-medium">
                  {userInitials}
                </div>
              </button>

              {/* Profile dropdown */}
              <div
                className={cn(
                  "absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all origin-top-right z-50 divide-y divide-gray-100",
                  showProfile
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                )}
              >
                {/* User info */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>

                {/* Menu links */}
                <div className="py-1">
                  <Link
                    href="/dashboard/settings/profile"
                    onClick={() => setShowProfile(false)}
                    className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/subscription"
                    onClick={() => setShowProfile(false)}
                    className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Subscription
                  </Link>
                </div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
