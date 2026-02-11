"use client";

import { cn } from "@/lib/utils";

const MOCK_SUBS = [
  { host: "Grand Hotel & Spa", plan: "Enterprise", status: "active", mrr: "$350", started: "Jun 2025", renewal: "Jun 2026" },
  { host: "Sunset Villas", plan: "Professional", status: "active", mrr: "$200", started: "Aug 2025", renewal: "Aug 2026" },
  { host: "Alpine Lodge Co.", plan: "Starter", status: "active", mrr: "$80", started: "Sep 2025", renewal: "Sep 2026" },
  { host: "Beach Resort Group", plan: "Enterprise", status: "past_due", mrr: "$350", started: "Jul 2025", renewal: "Jul 2026" },
  { host: "Mountain View Inn", plan: "Free Trial", status: "trialing", mrr: "$0", started: "Jan 2026", renewal: "Feb 2026" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  trialing: "bg-blue-50 text-blue-700 border-blue-200",
  past_due: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
};

const PLAN_COLORS: Record<string, string> = {
  "Free Trial": "bg-gray-100 text-gray-600",
  Starter: "bg-amber-100 text-amber-700",
  Professional: "bg-teal-100 text-teal-700",
  Enterprise: "bg-indigo-100 text-indigo-700",
};

export default function ActiveSubscriptionsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">
          All current host subscriptions and their statuses.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Active", value: "48", color: "text-gray-900" },
          { label: "Trialing", value: "5", color: "text-blue-600" },
          { label: "Past Due", value: "2", color: "text-red-600" },
          { label: "MRR", value: "$6,800", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Host</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Plan</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">MRR</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Started</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Renewal</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SUBS.map((sub) => (
              <tr key={sub.host} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4"><span className="text-sm font-medium text-gray-900">{sub.host}</span></td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex px-2 py-0.5 text-xs font-semibold rounded-md", PLAN_COLORS[sub.plan] || "bg-gray-100 text-gray-600")}>
                    {sub.plan}
                  </span>
                </td>
                <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{sub.mrr}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-500">{sub.started}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-500">{sub.renewal}</span></td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize", STATUS_STYLES[sub.status])}>
                    {sub.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
