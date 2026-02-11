"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function TopbarProfile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hostProfile = useAuthStore((s) => s.hostProfile);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
  const userEmail = user?.email || "";
  const role = user?.is_host ? "Host" : "Admin";

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

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/login");
  };

  const menuItems = [
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label: "Subscription",
      href: "/dashboard/subscription",
      icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center outline-none"
        aria-label="User menu"
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-200 ring-2",
            open
              ? "ring-teal-500 shadow-lg shadow-teal-500/20"
              : "ring-transparent hover:ring-gray-200"
          )}
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
          }}
        >
          {userInitials}
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all origin-top-right z-50",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        )}
      >
        {/* User info header */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-white shadow-md"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
              }}
            >
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{userEmail}</p>
              <span className="inline-flex items-center mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-600">
                {role}
                {hostProfile?.company_name && (
                  <span className="ml-1 text-gray-400 font-normal">
                    &middot; {hostProfile.company_name}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Menu links */}
        <div className="px-2 py-1.5 border-t border-gray-100">
          {menuItems.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={icon}
                />
              </svg>
              {label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="px-2 py-1.5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] text-red-600 hover:bg-red-50 transition-colors"
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
