"use client";

export default function ForecastingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Forecasting</h1>
        <p className="text-sm text-gray-500 mt-1">
          Revenue and occupancy predictions based on historical data and market trends.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Projected Occupancy", value: "—" },
          { label: "Projected Revenue", value: "—" },
          { label: "Demand Trend", value: "—" },
          { label: "Confidence", value: "—" },
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">Not enough data yet</p>
          <p className="text-xs text-gray-500">Forecasting requires at least 30 days of booking history. Start accepting bookings to unlock predictions.</p>
        </div>
      </div>
    </div>
  );
}
