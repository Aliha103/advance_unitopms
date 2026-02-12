"use client";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analyze performance with occupancy, revenue, and operational reports.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Occupancy Rate", value: "—" },
          { label: "RevPAR", value: "—" },
          { label: "ADR", value: "—" },
          { label: "Revenue (MTD)", value: "$0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: "Occupancy Report", desc: "Daily, weekly, and monthly occupancy trends." },
          { title: "Revenue Report", desc: "Revenue breakdown by source, room type, and period." },
          { title: "Guest Report", desc: "Guest demographics, repeat rates, and satisfaction." },
          { title: "Channel Performance", desc: "Bookings and revenue by OTA channel." },
        ].map((r) => (
          <div key={r.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{r.title}</h3>
            <p className="text-xs text-gray-500">{r.desc}</p>
            <div className="mt-4 h-24 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">Data will appear after your first bookings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
