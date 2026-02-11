"use client";

import { cn } from "@/lib/utils";

const MOCK_PAYOUTS = [
  { id: "PAY-001", host: "Grand Hotel & Spa", amount: "$2,450.00", date: "Feb 1, 2026", status: "completed", method: "Bank Transfer" },
  { id: "PAY-002", host: "Sunset Villas", amount: "$1,830.00", date: "Feb 1, 2026", status: "completed", method: "Bank Transfer" },
  { id: "PAY-003", host: "Alpine Lodge Co.", amount: "$980.00", date: "Feb 1, 2026", status: "pending", method: "Stripe" },
  { id: "PAY-004", host: "Beach Resort Group", amount: "$3,200.00", date: "Jan 15, 2026", status: "completed", method: "Bank Transfer" },
  { id: "PAY-005", host: "Mountain View Inn", amount: "$720.00", date: "Jan 15, 2026", status: "failed", method: "Stripe" },
];

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export default function PayoutsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track host payout history and pending disbursements.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Paid Out", value: "$9,180", color: "text-gray-900" },
          { label: "Pending", value: "$980", color: "text-amber-600" },
          { label: "Failed", value: "$720", color: "text-red-600" },
          { label: "This Month", value: "$5,260", color: "text-green-600" },
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Payout ID</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Host</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Method</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYOUTS.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4"><span className="text-sm font-mono text-gray-700">{p.id}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-gray-900">{p.host}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{p.amount}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-600">{p.method}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-500">{p.date}</span></td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize", STATUS_STYLES[p.status])}>
                    {p.status}
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
