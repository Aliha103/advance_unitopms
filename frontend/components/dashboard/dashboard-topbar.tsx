"use client";

import Link from "next/link";
import { TopbarSearch } from "./topbar-search";
import { TopbarNotifications } from "./topbar-notifications";
import { TopbarProfile } from "./topbar-profile";

// ── Main Component ──────────────────────────────────────────────────────────

export function DashboardTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <div className="sticky top-0 z-50">
      {/* Layered background for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 1px 0 0 rgba(0,0,0,0.05), 0 4px 16px -2px rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.04)",
        }}
      />
      {/* Subtle top highlight for 3D raised effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <header className="relative h-16 w-full">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* ─── LEFT: Mobile toggle + Logo ─── */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-95"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo with glow */}
            <Link
              href="/dashboard"
              className="shrink-0 flex items-center rounded-xl active:scale-[0.97] transition-all duration-200 group"
              aria-label="UnitoPMS Dashboard"
            >
              <div className="relative">
                <img
                  src="/assets/logo.png"
                  alt="UnitoPMS"
                  className="h-8 sm:h-9 w-auto relative z-10 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                />
                {/* Logo glow on hover */}
                <div className="absolute inset-0 rounded-xl bg-teal-400/0 group-hover:bg-teal-400/10 blur-lg transition-all duration-300" />
              </div>
            </Link>
          </div>

          {/* ─── CENTER: Search ─── */}
          <TopbarSearch />

          {/* ─── RIGHT: Actions ─── */}
          <div className="flex items-center gap-1 lg:gap-2 shrink-0">
            {/* Mobile search trigger */}
            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-95"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
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
            </button>

            {/* Notifications */}
            <TopbarNotifications />

            {/* Divider — vertical line with 3D inset */}
            <div className="hidden lg:flex items-center mx-1.5">
              <div className="h-7 w-px bg-gradient-to-b from-transparent via-gray-300/60 to-transparent" />
            </div>

            {/* Profile */}
            <TopbarProfile />
          </div>
        </div>
      </header>
    </div>
  );
}
