"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const MOCK_USERS: Record<string, { name: string; email: string; role: string; status: string; lastActive: string }[]> = {
  tenant: [
    { name: "Sarah Johnson", email: "sarah@grandhotel.com", role: "Front Desk Manager", status: "active", lastActive: "2m ago" },
    { name: "Mike Chen", email: "mike@sunsetvillas.com", role: "Housekeeping Lead", status: "active", lastActive: "1h ago" },
    { name: "Emily Davis", email: "emily@alpinelodge.com", role: "Revenue Manager", status: "inactive", lastActive: "3 days ago" },
  ],
  staff: [
    { name: "Alex Rodriguez", email: "alex@unitopms.com", role: "Support Agent", status: "active", lastActive: "Just now" },
    { name: "Priya Patel", email: "priya@unitopms.com", role: "Account Manager", status: "active", lastActive: "15m ago" },
    { name: "James Wilson", email: "james@unitopms.com", role: "Developer", status: "active", lastActive: "1h ago" },
  ],
};

function UsersContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "tenant";

  const isTenant = type === "tenant";
  const title = isTenant ? "Tenant Staff" : "Team Members";
  const subtitle = isTenant
    ? "Staff members employed by host properties."
    : "UnitoPMS internal team members.";
  const users = MOCK_USERS[type] || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: users.length, color: "text-gray-900" },
          { label: "Active", value: users.filter((u) => u.status === "active").length, color: "text-green-600" },
          { label: "Inactive", value: users.filter((u) => u.status === "inactive").length, color: "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-700">{user.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize",
                      user.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{user.lastActive}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <UsersContent />
    </Suspense>
  );
}
