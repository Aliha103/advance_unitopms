"use client";

import { cn } from "@/lib/utils";

const MOCK_LOGS = [
  { id: 1, action: "Application approved", user: "admin@unitopms.com", target: "Grand Hotel & Spa", ip: "192.168.0.15", timestamp: "Feb 10, 2026 14:32:05" },
  { id: 2, action: "Application rejected", user: "admin@unitopms.com", target: "BadHost LLC", ip: "192.168.0.15", timestamp: "Feb 10, 2026 14:28:11" },
  { id: 3, action: "Settings updated", user: "admin@unitopms.com", target: "General Settings", ip: "192.168.0.15", timestamp: "Feb 9, 2026 11:15:22" },
  { id: 4, action: "Host suspended", user: "admin@unitopms.com", target: "Beach Resort Group", ip: "192.168.0.15", timestamp: "Feb 8, 2026 09:42:33" },
  { id: 5, action: "User login", user: "admin@unitopms.com", target: "—", ip: "192.168.0.15", timestamp: "Feb 8, 2026 09:30:01" },
  { id: 6, action: "Password reset link generated", user: "admin@unitopms.com", target: "Sunset Villas", ip: "192.168.0.15", timestamp: "Feb 7, 2026 16:05:48" },
  { id: 7, action: "Subscription plan changed", user: "admin@unitopms.com", target: "Alpine Lodge Co.", ip: "192.168.0.15", timestamp: "Feb 7, 2026 10:20:15" },
  { id: 8, action: "User login", user: "admin@unitopms.com", target: "—", ip: "203.0.113.42", timestamp: "Feb 6, 2026 08:15:22" },
  { id: 9, action: "Integration connected", user: "admin@unitopms.com", target: "Stripe", ip: "192.168.0.15", timestamp: "Feb 5, 2026 15:45:09" },
  { id: 10, action: "Database backup completed", user: "system", target: "unitopms_backup_20260205.sql.gz", ip: "—", timestamp: "Feb 5, 2026 03:00:00" },
];

const ACTION_COLORS: Record<string, string> = {
  "Application approved": "bg-green-100 text-green-700",
  "Application rejected": "bg-red-100 text-red-700",
  "Host suspended": "bg-orange-100 text-orange-700",
  "Settings updated": "bg-blue-100 text-blue-700",
  "User login": "bg-gray-100 text-gray-600",
  "Password reset link generated": "bg-teal-100 text-teal-700",
  "Subscription plan changed": "bg-indigo-100 text-indigo-700",
  "Integration connected": "bg-purple-100 text-purple-700",
  "Database backup completed": "bg-cyan-100 text-cyan-700",
};

export default function AuditLogPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete record of administrative actions and system events.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Action</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">User</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Target</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">IP Address</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-md", ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600")}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="text-sm text-gray-700">{log.user}</span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-sm text-gray-600">{log.target}</span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-sm font-mono text-gray-500">{log.ip}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
