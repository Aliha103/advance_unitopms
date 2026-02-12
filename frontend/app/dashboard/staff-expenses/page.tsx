"use client";

export default function StaffExpensesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and approve staff expense claims and reimbursements.
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pending Approval", value: "0", color: "text-amber-600" },
          { label: "Approved (MTD)", value: "$0" },
          { label: "Reimbursed", value: "$0", color: "text-green-600" },
          { label: "Total (YTD)", value: "$0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color || "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">No staff expenses</p>
          <p className="text-xs text-gray-500">Staff expense claims will appear here for review and approval.</p>
        </div>
      </div>
    </div>
  );
}
