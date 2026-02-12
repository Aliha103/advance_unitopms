"use client";

export default function PricingPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Set rates, manage seasonal pricing, and configure promotions.
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
          Add Rate Plan
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Rate Plans", value: "0" },
          { label: "Base Rate", value: "—" },
          { label: "Active Promotions", value: "0" },
          { label: "Avg. Nightly Rate", value: "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">No rate plans configured</p>
          <p className="text-xs text-gray-500">Set up your pricing strategy with base rates, seasonal adjustments, and promotions.</p>
        </div>
      </div>
    </div>
  );
}
