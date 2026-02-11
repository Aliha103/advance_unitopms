"use client";

import Image from "next/image";
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
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
      <header className="h-14 w-full">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* ─── LEFT: Mobile toggle + Logo + Breadcrumbs ─── */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              className="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo only — no text */}
            <Link href="/dashboard" className="shrink-0">
              <Image
                src="/assets/logo.png"
                alt="UnitoPMS"
                width={30}
                height={30}
                className="rounded-lg"
              />
            </Link>
          </div>

          {/* ─── CENTER: Search ─── */}
          <TopbarSearch />

          {/* ─── RIGHT: Actions ─── */}
          <div className="flex items-center gap-1 lg:gap-2 shrink-0">
            {/* Mobile search trigger */}
            <button
              type="button"
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Search"
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            {/* Notifications */}
            <TopbarNotifications />

            {/* Divider */}
            <div className="hidden lg:block h-6 w-px bg-gray-200 mx-1" />

            {/* Profile */}
            <TopbarProfile />
          </div>
        </div>
      </header>
    </div>
  );
}
