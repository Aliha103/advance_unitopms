"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = ["All", "Unread", "Flagged", "Archived"];

const MOCK_MESSAGES = [
  {
    id: 1,
    from: "Grand Hotel & Spa",
    subject: "Question about property import",
    preview: "Hi, I'm trying to import our room inventory and...",
    time: "2m ago",
    unread: true,
    flagged: false,
  },
  {
    id: 2,
    from: "Sunset Villas",
    subject: "Billing inquiry for February",
    preview: "We noticed a discrepancy in our latest invoice...",
    time: "1h ago",
    unread: true,
    flagged: true,
  },
  {
    id: 3,
    from: "Alpine Lodge Co.",
    subject: "Feature request: Calendar sync",
    preview: "Would it be possible to add Google Calendar...",
    time: "3h ago",
    unread: false,
    flagged: false,
  },
  {
    id: 4,
    from: "Beach Resort Group",
    subject: "Integration setup assistance",
    preview: "We need help connecting our Booking.com channel...",
    time: "Yesterday",
    unread: false,
    flagged: false,
  },
  {
    id: 5,
    from: "Mountain View Inn",
    subject: "Account upgrade request",
    preview: "We'd like to upgrade from Starter to Professional...",
    time: "2 days ago",
    unread: false,
    flagged: true,
  },
];

export default function InboxPage() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = MOCK_MESSAGES.filter((m) => {
    if (tab === "Unread") return m.unread;
    if (tab === "Flagged") return m.flagged;
    return true;
  });

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
        <p className="text-sm text-gray-500 mt-1">
          Messages and communications from hosts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t}
            {t === "Unread" && (
              <span className="ml-1.5 bg-teal-100 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {MOCK_MESSAGES.filter((m) => m.unread).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18z" />
            </svg>
            <p className="text-sm text-gray-500">No messages.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                type="button"
                onClick={() => setSelected(msg.id)}
                className={cn(
                  "w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/80",
                  selected === msg.id && "bg-teal-50/50",
                  msg.unread && "bg-blue-50/30"
                )}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
                  {msg.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-sm truncate", msg.unread ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
                      {msg.from}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                  </div>
                  <p className={cn("text-sm truncate mt-0.5", msg.unread ? "font-semibold text-gray-800" : "text-gray-600")}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{msg.preview}</p>
                </div>
                {/* Indicators */}
                <div className="flex flex-col items-center gap-1.5 pt-1 shrink-0">
                  {msg.unread && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  {msg.flagged && (
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 6l3-3h8l3 3v8l-3 3H6l-3-3V6z" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
