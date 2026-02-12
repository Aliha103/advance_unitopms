"use client";

export default function AlloggiatiPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alloggiati</h1>
        <p className="text-sm text-gray-500 mt-1">
          Italian police registration (Alloggiati Web) for guest check-in compliance.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pending Submissions", value: "0", color: "text-amber-600" },
          { label: "Submitted Today", value: "0", color: "text-green-600" },
          { label: "Failed", value: "0", color: "text-red-600" },
          { label: "Total (MTD)", value: "0" },
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">Alloggiati not configured</p>
          <p className="text-xs text-gray-500">Connect your Alloggiati Web credentials in Settings to enable automatic guest registration submissions.</p>
        </div>
      </div>
    </div>
  );
}
