"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

// ── Helpers ─────────────────────────────────────────────────────────────────

function getHostBasePath(pathname: string, hostProfileId?: number): string {
  // Try to extract host_id from URL: /dashboard/{host_id}/...
  const parts = pathname.split("/");
  if (parts.length >= 3 && parts[1] === "dashboard" && parts[2]) {
    return `/dashboard/${parts[2]}`;
  }
  // Fallback to host profile id from store
  if (hostProfileId) {
    return `/dashboard/${hostProfileId}`;
  }
  return "/dashboard";
}

// ── SVG Icon Paths ──────────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
  grid: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  ticket: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  sparkle: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  team: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  moon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
  wallet: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  profile: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  "settings-inner": "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  ai: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
};

function SidebarIcon({ name, className }: { name: string; className?: string }) {
  const hasInner = name === "settings";
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
          d={ICONS["settings-inner"]}
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
  pathname,
}: {
  href: string;
  icon: string;
  label: string;
  isCollapsed: boolean;
  pathname: string;
}) {
  const isActive = pathname === href || pathname.startsWith(href + "/");

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
  const hostProfile = useAuthStore((s) => s.hostProfile);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const base = getHostBasePath(pathname, hostProfile?.id);
  const u = (suffix: string) => (suffix ? `${base}/${suffix}` : base);

  return (
    <aside
      className="h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0"
      style={{ width: isCollapsed ? 56 : 180 }}
    >
      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* ===== MAIN ===== */}
        <div className="mb-4">
          <SectionHeader label="Main" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("")} icon="grid" label="Overview" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("front-desk")} icon="ticket" label="Front Desk" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("calendar")} icon="calendar" label="Calendar" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== OPERATIONS ===== */}
        <div className="mb-4">
          <SectionHeader label="Operations" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("reservations")} icon="clipboard" label="Reservations" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("guests")} icon="users" label="Guests" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("housekeeping")} icon="sparkle" label="Housekeeping" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("properties")} icon="building" label="Properties" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("team")} icon="team" label="Team" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== FINANCE ===== */}
        <div className="mb-4">
          <SectionHeader label="Finance" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("night-audit")} icon="moon" label="Night Audit" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("billing")} icon="wallet" label="Billing" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("reports")} icon="chart" label="Reports" isCollapsed={isCollapsed} pathname={pathname} />
            <HostNavItem href={u("ai")} icon="ai" label="AI Insights" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>

        {/* ===== INTEGRATIONS ===== */}
        <div className="mb-4">
          <SectionHeader label="Integrations" isCollapsed={isCollapsed} />
          <div className="flex flex-col gap-0.5">
            <HostNavItem href={u("channels")} icon="link" label="Channels" isCollapsed={isCollapsed} pathname={pathname} />
          </div>
        </div>
      </nav>

      {/* Footer: Profile, Settings, Collapse */}
      <div className="px-2 py-2 border-t border-gray-100">
        <HostNavItem href={u("profile")} icon="profile" label="Profile" isCollapsed={isCollapsed} pathname={pathname} />
        <HostNavItem href={u("settings")} icon="settings" label="Settings" isCollapsed={isCollapsed} pathname={pathname} />

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed((v) => !v)}
          className={cn(
            "w-full mt-2 flex items-center gap-2.5 rounded-xl text-[13px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200",
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
