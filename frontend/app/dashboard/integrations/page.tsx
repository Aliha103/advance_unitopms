"use client";

import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  { name: "Stripe", desc: "Payment processing and subscription billing.", status: "connected", category: "Payments", color: "from-indigo-500 to-purple-600" },
  { name: "Booking.com", desc: "Channel manager for Booking.com listings.", status: "available", category: "Channels", color: "from-blue-500 to-blue-600" },
  { name: "Airbnb", desc: "Sync listings with Airbnb platform.", status: "available", category: "Channels", color: "from-rose-500 to-pink-500" },
  { name: "Expedia", desc: "Distribute inventory to Expedia network.", status: "available", category: "Channels", color: "from-amber-500 to-yellow-500" },
  { name: "Google Calendar", desc: "Two-way calendar synchronization.", status: "coming_soon", category: "Productivity", color: "from-green-500 to-emerald-500" },
  { name: "Mailchimp", desc: "Email marketing automation.", status: "available", category: "Marketing", color: "from-yellow-500 to-amber-500" },
  { name: "Slack", desc: "Team notifications and alerts.", status: "available", category: "Communication", color: "from-purple-500 to-violet-600" },
  { name: "QuickBooks", desc: "Accounting and financial reporting.", status: "coming_soon", category: "Accounting", color: "from-green-600 to-teal-500" },
];

const STATUS_LABEL: Record<string, { text: string; style: string }> = {
  connected: { text: "Connected", style: "bg-green-50 text-green-700 border-green-200" },
  available: { text: "Available", style: "bg-gray-50 text-gray-600 border-gray-200" },
  coming_soon: { text: "Coming Soon", style: "bg-blue-50 text-blue-600 border-blue-200" },
};

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect third-party services to extend UnitoPMS functionality.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {INTEGRATIONS.map((int) => {
          const badge = STATUS_LABEL[int.status];
          return (
            <div key={int.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold", int.color)}>
                  {int.name[0]}
                </div>
                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full border", badge.style)}>
                  {badge.text}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{int.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{int.desc}</p>
              <p className="text-[10px] text-gray-400 mt-2">{int.category}</p>
              {int.status === "connected" ? (
                <button type="button" className="mt-3 w-full py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
                  Configure
                </button>
              ) : int.status === "available" ? (
                <button type="button" className="mt-3 w-full py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
                  Connect
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
