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
  inbox: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
  building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  card: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  "settings-inner": "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  plug: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  file: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

function SidebarIcon({ name }: { name: string }) {
  const hasInner = name === "settings";
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
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

// ── Section Header ──────────────────────────────────────────────────────────

function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <div className="px-3 pt-4 pb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

// ── Nav Item (non-expandable) ───────────────────────────────────────────────

function NavItem({
  href,
  icon,
  label,
  badge,
  exact,
  pathname,
}: {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  exact?: boolean;
  pathname: string;
}) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200",
        isActive
          ? "bg-teal-50 text-teal-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <SidebarIcon name={icon} />
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">
          {badge}
        </span>
      )}
    </Link>
  );
}

// ── Expandable Item ─────────────────────────────────────────────────────────

function ExpandableItem({
  icon,
  label,
  defaultOpen = false,
  children,
}: {
  icon: string;
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200 text-left",
          expanded
            ? "bg-teal-50/50 text-teal-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <SidebarIcon name={icon} />
        <span className="flex-1">{label}</span>
        <svg
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200",
            !expanded && "-rotate-90"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          expanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-3 pl-3 mt-1 border-l border-gray-200 flex flex-col gap-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Sub Item (inside expandable) ────────────────────────────────────────────

function SubItem({
  href,
  label,
  badge,
  badgeType = "count",
  pathname,
}: {
  href: string;
  label: string;
  badge?: number;
  badgeType?: "count" | "alert";
  pathname: string;
}) {
  // Match ignoring query params
  const basePath = href.split("?")[0];
  const isActive = pathname === basePath || pathname.startsWith(basePath + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-all duration-200",
        isActive
          ? "bg-teal-50 text-teal-700"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      )}
    >
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span
          className={cn(
            "px-1.5 py-0.5 text-[10px] font-semibold text-white rounded",
            badgeType === "alert" ? "bg-red-500" : "bg-amber-500"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

// ── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="my-2 mx-3 border-t border-gray-200" />;
}

// ── Main Sidebar Component ──────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();

  const u = (suffix: string) =>
    suffix ? `${DASHBOARD_BASE}${suffix}` : DASHBOARD_BASE;

  return (
    <aside className="h-full w-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Scrollable navigation */}
      <nav className="flex-1 p-2.5 overflow-y-auto">
        {/* ===== CORE ===== */}
        <SidebarSection label="Core">
          <NavItem href={u("")} icon="grid" label="Overview" exact pathname={pathname} />
          <NavItem href={u("/inbox")} icon="inbox" label="Inbox" badge={1} pathname={pathname} />
        </SidebarSection>

        <Divider />

        {/* ===== CLIENTELE ===== */}
        <SidebarSection label="Clientele">
          <ExpandableItem icon="building" label="Hosts" defaultOpen>
            <SubItem href={u("/hosts")} label="Directory" pathname={pathname} />
            <SubItem href={u("/applications")} label="Applications" pathname={pathname} />
            <SubItem href={u("/hosts/at-risk")} label="At Risk" pathname={pathname} />
            <SubItem href={u("/hosts?status=suspended")} label="Suspended" pathname={pathname} />
          </ExpandableItem>
          <ExpandableItem icon="users" label="User Registry">
            <SubItem href={u("/users?type=tenant")} label="Tenant Staff" pathname={pathname} />
            <SubItem href={u("/guests")} label="Guests (Global)" pathname={pathname} />
            <SubItem href={u("/users?type=staff")} label="Team Members" pathname={pathname} />
          </ExpandableItem>
        </SidebarSection>

        <Divider />

        {/* ===== GROWTH ===== */}
        <SidebarSection label="Growth">
          <ExpandableItem icon="trending" label="Revenue" defaultOpen>
            <SubItem href={u("/revenue")} label="MRR & ARR" pathname={pathname} />
            <SubItem href={u("/revenue/churn")} label="Churn Analysis" pathname={pathname} />
            <SubItem href={u("/revenue/payouts")} label="Payouts" pathname={pathname} />
          </ExpandableItem>
          <ExpandableItem icon="card" label="Subscriptions">
            <SubItem href={u("/subscriptions/plans")} label="Plans & Tiers" pathname={pathname} />
            <SubItem href={u("/subscriptions")} label="Active" pathname={pathname} />
            <SubItem href={u("/subscriptions/invoices")} label="Invoices" pathname={pathname} />
          </ExpandableItem>
        </SidebarSection>

        <Divider />

        {/* ===== QUALITY ===== */}
        <SidebarSection label="Quality">
          <ExpandableItem icon="star" label="Feedback">
            <SubItem href={u("/feedback/nps")} label="NPS Scores" pathname={pathname} />
            <SubItem href={u("/feedback/features")} label="Feature Requests" pathname={pathname} />
          </ExpandableItem>
          <ExpandableItem icon="shield" label="Reputation">
            <SubItem href={u("/reputation/ratings")} label="Guest Ratings" pathname={pathname} />
            <SubItem href={u("/reputation/disputes")} label="Disputes" pathname={pathname} />
            <SubItem href={u("/reputation/fraud")} label="Fraud Alerts" badge={2} badgeType="alert" pathname={pathname} />
          </ExpandableItem>
        </SidebarSection>

        <Divider />

        {/* ===== SYSTEM ===== */}
        <SidebarSection label="System">
          <ExpandableItem icon="settings" label="Settings">
            <SubItem href={u("/settings")} label="General" pathname={pathname} />
            <SubItem href={u("/settings/localization")} label="Localization" pathname={pathname} />
            <SubItem href={u("/settings/billing")} label="Billing" pathname={pathname} />
            <SubItem href={u("/settings/security")} label="Security" pathname={pathname} />
            <SubItem href={u("/settings/notifications")} label="Notifications" pathname={pathname} />
            <SubItem href={u("/settings/email")} label="Email Templates" pathname={pathname} />
          </ExpandableItem>
          <NavItem href={u("/integrations")} icon="plug" label="Integrations" pathname={pathname} />
          <NavItem href={u("/audit")} icon="file" label="Audit Log" pathname={pathname} />
        </SidebarSection>
      </nav>

      {/* UCI Active Indicator */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-[11px] font-medium text-gray-500">UCI Active</span>
        </div>
      </div>
    </aside>
  );
}
