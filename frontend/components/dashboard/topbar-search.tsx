"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  section: string;
  icon: string;
}

// Dashboard pages the command palette can navigate to
const ADMIN_PAGES: NavItem[] = [
  { label: "Overview", href: "/dashboard", section: "Core", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { label: "Inbox", href: "/dashboard/inbox", section: "Core", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
  { label: "Hosts", href: "/dashboard/hosts", section: "Clientele", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Applications", href: "/dashboard/applications", section: "Clientele", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Users", href: "/dashboard/users", section: "Clientele", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Revenue", href: "/dashboard/revenue", section: "Growth", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { label: "Subscriptions", href: "/dashboard/subscriptions", section: "Growth", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Settings", href: "/dashboard/settings", section: "System", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { label: "Integrations", href: "/dashboard/integrations", section: "System", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { label: "Audit Log", href: "/dashboard/audit", section: "System", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
];

const HOST_PAGES: NavItem[] = [
  { label: "Overview", href: "/dashboard", section: "Main", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
  { label: "Front Desk", href: "/dashboard/front-desk", section: "Main", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
  { label: "Calendar", href: "/dashboard/calendar", section: "Main", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Reservations", href: "/dashboard/reservations", section: "Operations", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { label: "Guests", href: "/dashboard/guests", section: "Operations", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { label: "Housekeeping", href: "/dashboard/housekeeping", section: "Operations", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { label: "Properties", href: "/dashboard/properties", section: "Operations", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Team", href: "/dashboard/team", section: "Operations", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Night Audit", href: "/dashboard/night-audit", section: "Finance", icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
  { label: "Billing", href: "/dashboard/billing", section: "Finance", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
  { label: "Reports", href: "/dashboard/reports", section: "Finance", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Settings", href: "/dashboard/settings", section: "System", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export function TopbarSearch() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHost = user?.is_host ?? false;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pages = isHost ? HOST_PAGES : ADMIN_PAGES;

  const filtered = query
    ? pages.filter(
        (p) =>
          p.label.toLowerCase().includes(query.toLowerCase()) ||
          p.section.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  // Group by section
  const grouped = filtered.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flatList = Object.values(grouped).flat();

  // Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

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

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatList.length) % flatList.length);
    } else if (e.key === "Enter" && flatList[activeIndex]) {
      e.preventDefault();
      navigate(flatList[activeIndex].href);
    }
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      {/* Search trigger with 3D inset effect */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 h-10 px-4 rounded-xl transition-all duration-200 group",
          open
            ? "w-72 bg-white ring-1 ring-gray-900/10"
            : "w-64 bg-white/60 hover:bg-white active:scale-[0.98]"
        )}
        style={{
          boxShadow: open
            ? "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "inset 0 1px 2px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <svg
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <span className="text-[13px] text-gray-400 flex-1 text-left font-medium">
          Go to...
        </span>
        <kbd
          className="inline-flex items-center h-5 px-1.5 text-[10px] font-bold text-gray-400 rounded-md font-mono"
          style={{
            background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Command palette dropdown with depth */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-[380px] mt-3 rounded-2xl overflow-hidden z-50"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
            boxShadow:
              "0 25px 60px -12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Search input with inset depth */}
          <div
            className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100"
            style={{
              background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            }}
          >
            <svg
              className="w-4 h-4 text-teal-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages..."
              className="flex-1 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent font-medium"
            />
            <kbd
              className="text-[10px] font-bold text-gray-400 px-1.5 py-0.5 rounded-md"
              style={{
                background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Results grouped by section */}
          <div className="max-h-[340px] overflow-y-auto p-2">
            {flatList.length === 0 ? (
              <div className="px-2 py-8 text-[13px] text-gray-400 text-center">
                No pages found
              </div>
            ) : (
              Object.entries(grouped).map(([section, items]) => (
                <div key={section} className="mb-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {section}
                  </div>
                  {items.map((item) => {
                    const idx = flatList.indexOf(item);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150",
                          isActive
                            ? "text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        style={
                          isActive
                            ? {
                                background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
                              }
                            : undefined
                        }
                        onClick={() => navigate(item.href)}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors",
                            isActive ? "bg-white/10" : "bg-gray-100/80"
                          )}
                        >
                          <svg
                            className={cn(
                              "w-4 h-4 shrink-0",
                              isActive ? "text-gray-300" : "text-gray-400"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d={item.icon}
                            />
                          </svg>
                        </div>
                        <span className="flex-1 text-left font-medium">
                          {item.label}
                        </span>
                        {isActive && (
                          <kbd
                            className="text-[10px] font-bold text-gray-500 px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.1)" }}
                          >
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hint with 3D keys */}
          <div
            className="px-4 py-2.5 border-t border-gray-100/80 flex items-center gap-4 text-[10px] text-gray-400 font-medium"
            style={{
              background: "linear-gradient(180deg, transparent 0%, #f8fafc 100%)",
            }}
          >
            <span className="flex items-center gap-1.5">
              <kbd
                className="px-1 py-0.5 rounded font-mono font-bold"
                style={{
                  background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd
                className="px-1 py-0.5 rounded font-mono font-bold"
                style={{
                  background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                ↵
              </kbd>
              open
            </span>
            <span className="flex items-center gap-1.5">
              <kbd
                className="px-1 py-0.5 rounded font-mono font-bold"
                style={{
                  background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                esc
              </kbd>
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
