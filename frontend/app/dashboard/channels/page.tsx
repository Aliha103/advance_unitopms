"use client";

export default function ChannelsPage() {
  const channels = [
    { name: "Booking.com", logo: "B", color: "bg-blue-600" },
    { name: "Airbnb", logo: "A", color: "bg-rose-500" },
    { name: "Expedia", logo: "E", color: "bg-yellow-500" },
    { name: "VRBO", logo: "V", color: "bg-indigo-600" },
    { name: "Google Hotels", logo: "G", color: "bg-green-500" },
    { name: "TripAdvisor", logo: "T", color: "bg-emerald-600" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">OTA & Channels</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect and manage your distribution channels for synchronized availability and rates.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Connected", value: "0", color: "text-green-600" },
          { label: "Available", value: String(channels.length) },
          { label: "Sync Status", value: "—" },
          { label: "Last Sync", value: "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color || "text-gray-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Available Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch) => (
            <div key={ch.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 ${ch.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                {ch.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{ch.name}</p>
                <p className="text-xs text-gray-500">Not connected</p>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
