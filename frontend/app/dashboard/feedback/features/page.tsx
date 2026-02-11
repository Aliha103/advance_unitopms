"use client";

import { cn } from "@/lib/utils";

const FEATURES = [
  { id: 1, title: "Google Calendar Sync", votes: 24, status: "planned", category: "Integrations", date: "Jan 2026" },
  { id: 2, title: "Multi-currency support", votes: 19, status: "in_review", category: "Billing", date: "Dec 2025" },
  { id: 3, title: "Guest messaging / chat", votes: 17, status: "planned", category: "Communication", date: "Jan 2026" },
  { id: 4, title: "Mobile app for hosts", votes: 15, status: "in_review", category: "Platform", date: "Nov 2025" },
  { id: 5, title: "Advanced revenue reports", votes: 12, status: "completed", category: "Analytics", date: "Oct 2025" },
  { id: 6, title: "Automated pricing rules", votes: 11, status: "in_review", category: "Revenue", date: "Jan 2026" },
  { id: 7, title: "Custom email templates", votes: 9, status: "planned", category: "Communication", date: "Feb 2026" },
  { id: 8, title: "Bulk reservation import", votes: 7, status: "completed", category: "Operations", date: "Dec 2025" },
];

const STATUS_STYLES: Record<string, string> = {
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function FeatureRequestsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and prioritize features requested by hosts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Requests", value: FEATURES.length, color: "text-gray-900" },
          { label: "Planned", value: FEATURES.filter((f) => f.status === "planned").length, color: "text-blue-600" },
          { label: "In Review", value: FEATURES.filter((f) => f.status === "in_review").length, color: "text-amber-600" },
          { label: "Completed", value: FEATURES.filter((f) => f.status === "completed").length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Feature List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {FEATURES.map((feat) => (
            <div key={feat.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
              {/* Votes */}
              <div className="flex flex-col items-center w-12 shrink-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                <span className="text-sm font-bold text-gray-900">{feat.votes}</span>
                <span className="text-[10px] text-gray-400">votes</span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{feat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{feat.category}</span>
                  <span className="text-gray-300">&middot;</span>
                  <span className="text-xs text-gray-400">{feat.date}</span>
                </div>
              </div>
              {/* Status */}
              <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize shrink-0", STATUS_STYLES[feat.status])}>
                {feat.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
