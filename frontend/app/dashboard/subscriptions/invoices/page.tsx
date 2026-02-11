"use client";

import { cn } from "@/lib/utils";

const MOCK_INVOICES = [
  { id: "INV-2026-001", host: "Grand Hotel & Spa", amount: "$350.00", date: "Feb 1, 2026", due: "Feb 15, 2026", status: "paid" },
  { id: "INV-2026-002", host: "Sunset Villas", amount: "$200.00", date: "Feb 1, 2026", due: "Feb 15, 2026", status: "paid" },
  { id: "INV-2026-003", host: "Alpine Lodge Co.", amount: "$80.00", date: "Feb 1, 2026", due: "Feb 15, 2026", status: "pending" },
  { id: "INV-2026-004", host: "Beach Resort Group", amount: "$350.00", date: "Jan 1, 2026", due: "Jan 15, 2026", status: "overdue" },
  { id: "INV-2025-048", host: "Mountain View Inn", amount: "$80.00", date: "Jan 1, 2026", due: "Jan 15, 2026", status: "paid" },
  { id: "INV-2025-047", host: "Grand Hotel & Spa", amount: "$350.00", date: "Jan 1, 2026", due: "Jan 15, 2026", status: "paid" },
];

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  void: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function InvoicesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage billing invoices for all host subscriptions.
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Invoiced", value: "$1,410", color: "text-gray-900" },
          { label: "Paid", value: "$1,060", color: "text-green-600" },
          { label: "Pending", value: "$80", color: "text-amber-600" },
          { label: "Overdue", value: "$350", color: "text-red-600" },
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Invoice</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Host</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Due</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4"><span className="text-sm font-mono text-gray-700">{inv.id}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-gray-900">{inv.host}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{inv.amount}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-500">{inv.date}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-500">{inv.due}</span></td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize", STATUS_STYLES[inv.status])}>
                    {inv.status}
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
