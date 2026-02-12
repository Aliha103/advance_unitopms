"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ── Helpers ─────────────────────────────────────────────────────────────────

const DASHBOARD_BASE = "/dashboard";

// ── SVG Icon Paths ──────────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
  grid: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  bookings: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  cleaning: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  reviews: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  team: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  gallery: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  maintenance: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  "maintenance-inner": "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  staffExpenses: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
  payments: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  invoices: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  expenses: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  pricing: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  "settings-inner": "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  forecasting: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  channels: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  alloggiati: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  appUsers: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
};

function SidebarIcon({ name, className }: { name: string; className?: string }) {
  const hasInner = name === "settings" || name === "maintenance";
  const innerKey = name === "maintenance" ? "maintenance-inner" : "settings-inner";
  return (
    <svg
      className={cn("w-[18px] h-[18px] flex-shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={ICONS[name] ?? ICONS.grid}
      />
      {hasInner && (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={ICONS[innerKey]}
        />
      )}
    </svg>
  );
}

// ── Nav Item ────────────────────────────────────────────────────────────────

function HostNavItem({
  href,
  icon,
  label,
  isCollapsed,
  exact,
  pathname,
}: {
  href: string;
  icon: string;
  label: string;
  isCollapsed: boolean;
  exact?: boolean;
  pathname: string;
}) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative overflow-hidden",
        isCollapsed ? "justify-center px-2 py-2" : "px-2.5 py-2",
        isActive
          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <SidebarIcon
        name={icon}
        className={isActive ? "text-white" : "text-gray-400"}
      />
      {!isCollapsed && (
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({
  label,
  isCollapsed,
}: {
  label: string;
  isCollapsed: boolean;
}) {
  if (isCollapsed) return null;
  return (
    <div className="px-2 mb-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function HostSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const u = (suffix: string) =>
    suffix ? `${DASHBOARD_BASE}/${suffix}` : DASHBOARD_BASE;

  return (
    <aside
      className="h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0"
      style={{ width: isCollapsed ? 56 : 180 }}
    >
      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* ===== OVERVIEW ===== */}
        <div className="mb-4">
          <SectionHeader label="Overview" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("")} icon="grid" label="Dashboard" exact isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("calendar")} icon="calendar" label="Calendar" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("guests")} icon="users" label="Guests" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== OPERATIONS ===== */}
        <div className="mb-4">
          <SectionHeader label="Operations" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("bookings")} icon="bookings" label="Bookings" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("cleaning")} icon="cleaning" label="Cleaning" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("reviews")} icon="reviews" label="Reviews" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("team")} icon="team" label="Team" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("gallery")} icon="gallery" label="Gallery" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== PROPERTY ===== */}
        <div className="mb-4">
          <SectionHeader label="Property" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("inventory")} icon="inventory" label="Inventory" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("maintenance")} icon="maintenance" label="Maintenance" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("staff-expenses")} icon="staffExpenses" label="Staff Expenses" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== FINANCE ===== */}
        <div className="mb-4">
          <SectionHeader label="Finance" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("payments")} icon="payments" label="Payments" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("invoices")} icon="invoices" label="Invoices" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("expenses")} icon="expenses" label="Expenses" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("pricing")} icon="pricing" label="Pricing" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== SETTINGS ===== */}
        <div className="mb-4">
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("settings")} icon="settings" label="Settings" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== ANALYTICS ===== */}
        <div className="mb-4">
          <SectionHeader label="Analytics" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("reports")} icon="chart" label="Reports" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("forecasting")} icon="forecasting" label="Forecasting" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== OTA & CHANNELS ===== */}
        <div className="mb-4">
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("channels")} icon="channels" label="OTA & Channels" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== ALLOGGIATI ===== */}
        <div className="mb-4">
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("alloggiati")} icon="alloggiati" label="Alloggiati" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== APP USERS ===== */}
        <div className="mb-4">
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("app-users")} icon="appUsers" label="App Users" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>
      </nav>

      {/* Footer: Collapse */}
      <div className="px-2 py-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsCollapsed((v) => !v)}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200",
            isCollapsed ? "justify-center px-2 py-2" : "px-2.5 py-2"
          )}
        >
          <svg
            className="w-[18px] h-[18px] transition-transform duration-300"
            style={{ transform: isCollapsed ? "rotate(180deg)" : undefined }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
