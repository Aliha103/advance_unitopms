"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const user = useAuthStore((s) => s.user);
  const isHost = user?.is_host;

  // Host view: empty state (no mock data)
  if (isHost) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your property&apos;s guest profiles and history.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Guests", value: "0" },
            { label: "Returning", value: "0", color: "text-teal-600" },
            { label: "In-House", value: "0", color: "text-blue-600" },
            { label: "VIP", value: "0", color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={cn("text-xl font-bold mt-1", s.color || "text-gray-900")}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-900 mb-1">No guests yet</p>
            <p className="text-xs text-gray-500">Guest profiles are created automatically when you receive bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin view: platform-wide guest list
  const MOCK_GUESTS = [
    { id: 1, name: "John Doe", email: "john@email.com", phone: "+1 555-0101", stays: 12, totalSpent: "$4,280", lastStay: "Jan 15, 2026", vip: true },
    { id: 2, name: "Maria Garcia", email: "maria@email.com", phone: "+34 612-345", stays: 8, totalSpent: "$2,930", lastStay: "Jan 28, 2026", vip: true },
    { id: 3, name: "Hans Mueller", email: "hans@email.com", phone: "+49 171-2345", stays: 3, totalSpent: "$890", lastStay: "Feb 2, 2026", vip: false },
    { id: 4, name: "Yuki Tanaka", email: "yuki@email.com", phone: "+81 80-1234", stays: 5, totalSpent: "$1,750", lastStay: "Dec 20, 2025", vip: false },
    { id: 5, name: "Emma Wilson", email: "emma@email.com", phone: "+44 7911-123", stays: 1, totalSpent: "$320", lastStay: "Feb 8, 2026", vip: false },
  ];

  const filtered = search
    ? MOCK_GUESTS.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase())
      )
    : MOCK_GUESTS;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guests (Global)</h1>
        <p className="text-sm text-gray-500 mt-1">
          All guests across all host properties on the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Guests", value: "1,284", color: "text-gray-900" },
          { label: "VIP Guests", value: "47", color: "text-amber-600" },
          { label: "Avg. Stays", value: "3.2", color: "text-teal-600" },
          { label: "Lifetime Revenue", value: "$182K", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Guest</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Phone</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Stays</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Total Spent</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Last Stay</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((guest) => (
              <tr key={guest.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {guest.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                        {guest.vip && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded">VIP</span>}
                      </div>
                      <p className="text-xs text-gray-500">{guest.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-700">{guest.phone}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-gray-900">{guest.stays}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm font-medium text-green-600">{guest.totalSpent}</span></td>
                <td className="px-5 py-4 hidden lg:table-cell"><span className="text-sm text-gray-500">{guest.lastStay}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
