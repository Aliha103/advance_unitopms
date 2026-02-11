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
      {/* Avatar button with 3D depth */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center outline-none group"
        aria-label="User menu"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold transition-all duration-200",
            open
              ? "shadow-[0_4px_16px_rgba(13,148,136,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] scale-[1.02]"
              : "shadow-[0_2px_8px_rgba(13,148,136,0.2)] group-hover:shadow-[0_4px_16px_rgba(13,148,136,0.3)] group-hover:scale-[1.02] group-active:scale-95"
          )}
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
          }}
        >
          {userInitials}
          {/* Inner highlight for 3D sphere effect */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
            }}
          />
        </div>
        {/* Online indicator with glow */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            boxShadow: "0 0 6px rgba(16,185,129,0.5)",
          }}
        />
      </button>

      {/* Dropdown with deep shadows */}
      <div
        className={cn(
          "absolute right-0 top-full mt-3 w-72 rounded-2xl overflow-hidden transition-all duration-200 origin-top-right z-50",
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
        {/* User info header with gradient card */}
        <div className="p-4">
          <div
            className="flex items-center gap-3.5 p-3.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 50%, #eef2ff 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 relative"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
                boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
              }}
            >
              {userInitials}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{userEmail}</p>
              <span
                className="inline-flex items-center mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full text-white"
                style={{
                  background: role === "Host"
                    ? "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: role === "Host"
                    ? "0 2px 6px rgba(13,148,136,0.3)"
                    : "0 2px 6px rgba(99,102,241,0.3)",
                }}
              >
                {role}
                {hostProfile?.company_name && (
                  <span className="ml-1 opacity-80 font-normal">
                    &middot; {hostProfile.company_name}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Menu links */}
        <div className="px-2.5 py-1.5 border-t border-gray-100/80">
          {menuItems.map(({ label, href, icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-[0.98]"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100/80">
                <svg
                  className="w-4 h-4 text-gray-500"
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
              </div>
              {label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="px-2.5 py-2 border-t border-gray-100/80">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-all duration-200 active:scale-[0.98]"
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(239,68,68,0.08)" }}
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
            </div>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
