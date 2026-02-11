"use client";

import { cn } from "@/lib/utils";

const MOCK_DISPUTES = [
  { id: "DSP-042", guest: "Emma Wilson", host: "Beach Resort Group", reason: "Unclean room on arrival", amount: "$320", status: "open", date: "Feb 8, 2026" },
  { id: "DSP-041", guest: "Hans Mueller", host: "Alpine Lodge Co.", reason: "Amenities not as described", amount: "$180", status: "investigating", date: "Feb 5, 2026" },
  { id: "DSP-040", guest: "John Doe", host: "Sunset Villas", reason: "Noise complaint — construction", amount: "$450", status: "resolved", date: "Jan 30, 2026" },
  { id: "DSP-039", guest: "Maria Garcia", host: "Grand Hotel & Spa", reason: "Overcharged for minibar", amount: "$45", status: "resolved", date: "Jan 25, 2026" },
  { id: "DSP-038", guest: "Yuki Tanaka", host: "Mountain View Inn", reason: "Early check-out refund request", amount: "$220", status: "closed", date: "Jan 20, 2026" },
];

const STATUS_STYLES: Record<string, string> = {
  open: "bg-red-50 text-red-700 border-red-200",
  investigating: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function DisputesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Disputes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage guest complaints and dispute resolutions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Open", value: "1", color: "text-red-600" },
          { label: "Investigating", value: "1", color: "text-amber-600" },
          { label: "Resolved", value: "2", color: "text-green-600" },
          { label: "Avg Resolution", value: "4.2d", color: "text-gray-900" },
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">ID</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Guest</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Host</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Reason</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DISPUTES.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4"><span className="text-sm font-mono text-gray-700">{d.id}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-medium text-gray-900">{d.guest}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-gray-600">{d.host}</span></td>
                <td className="px-5 py-4"><span className="text-sm text-gray-700">{d.reason}</span></td>
                <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm font-semibold text-gray-900">{d.amount}</span></td>
                <td className="px-5 py-4">
                  <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize", STATUS_STYLES[d.status])}>
                    {d.status}
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
