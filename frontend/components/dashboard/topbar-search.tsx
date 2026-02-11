"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    label: "Search reservations",
    shortcut: "R",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    color: "text-violet-500 bg-violet-50",
  },
  {
    label: "Find guest",
    shortcut: "G",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    color: "text-blue-500 bg-blue-50",
  },
  {
    label: "Check room status",
    shortcut: "S",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    label: "View reports",
    shortcut: "P",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    color: "text-amber-500 bg-amber-50",
  },
];

export function TopbarSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K toggle
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

  const filtered = query
    ? QUICK_ACTIONS.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
      )
    : QUICK_ACTIONS;

  return (
    <div ref={ref} className="relative hidden md:block">
      {/* Search trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 h-[38px] px-3.5 rounded-full transition-all duration-200 group",
          open
            ? "w-72 bg-white shadow-sm ring-1 ring-gray-900/10"
            : "w-60 bg-gray-100/80 hover:bg-gray-200/60"
        )}
      >
        <svg
          className="w-[15px] h-[15px] text-gray-400 shrink-0"
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
        <span className="text-[13px] text-gray-500 flex-1 text-left">
          Search...
        </span>
        <kbd className="inline-flex items-center h-5 px-1.5 text-[10px] font-medium text-gray-400 bg-gray-200/60 rounded-md font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Command palette dropdown */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[360px] mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50">
          {/* Search input */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
            <svg
              className="w-[15px] h-[15px] text-gray-400 shrink-0"
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
              placeholder="Type a command or search..."
              className="flex-1 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
            />
            <kbd className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Quick actions */}
          <div className="p-2">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Quick Actions
            </div>
            {filtered.length === 0 ? (
              <div className="px-2 py-6 text-[13px] text-gray-400 text-center">
                No results found
              </div>
            ) : (
              filtered.map(({ label, shortcut, icon, color }) => (
                <button
                  key={label}
                  type="button"
                  className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group/action"
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-xl transition-colors shrink-0",
                      color
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
                        d={icon}
                      />
                    </svg>
                  </span>
                  <span className="flex-1 text-left font-medium">{label}</span>
                  <kbd className="text-[10px] text-gray-300 font-mono group-hover/action:text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                    {shortcut}
                  </kbd>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
