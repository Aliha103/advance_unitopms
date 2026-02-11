"use client";

import { cn } from "@/lib/utils";

const NPS_BREAKDOWN = [
  { label: "Promoters (9-10)", count: 32, pct: 64, color: "bg-green-500" },
  { label: "Passives (7-8)", count: 12, pct: 24, color: "bg-amber-400" },
  { label: "Detractors (0-6)", count: 6, pct: 12, color: "bg-red-400" },
];

const RECENT_RESPONSES = [
  { host: "Grand Hotel & Spa", score: 10, comment: "Excellent platform, very intuitive!", date: "Feb 8, 2026" },
  { host: "Sunset Villas", score: 9, comment: "Love the calendar view. Would appreciate more integrations.", date: "Feb 6, 2026" },
  { host: "Alpine Lodge Co.", score: 7, comment: "Good overall, reporting could be more detailed.", date: "Feb 4, 2026" },
  { host: "Beach Resort Group", score: 4, comment: "Slow response times on support tickets.", date: "Feb 1, 2026" },
  { host: "Mountain View Inn", score: 10, comment: "Best PMS we've used. The team feature is amazing.", date: "Jan 28, 2026" },
];

export default function NPSPage() {
  const npsScore = 64 - 12; // Promoters% - Detractors%

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NPS Scores</h1>
        <p className="text-sm text-gray-500 mt-1">
          Net Promoter Score tracking and feedback analysis.
        </p>
      </div>

      {/* NPS Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">NPS Score</p>
          <p className={cn("text-5xl font-bold", npsScore >= 50 ? "text-green-600" : npsScore >= 0 ? "text-amber-600" : "text-red-600")}>
            {npsScore}
          </p>
          <p className="text-xs text-gray-400 mt-1">50 responses total</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Breakdown</h3>
          <div className="space-y-4">
            {NPS_BREAKDOWN.map((seg) => (
              <div key={seg.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{seg.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{seg.count} ({seg.pct}%)</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", seg.color)} style={{ width: `${seg.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Responses */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Responses</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_RESPONSES.map((r) => (
            <div key={r.host + r.date} className="px-5 py-4 flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0",
                r.score >= 9 ? "bg-green-500" : r.score >= 7 ? "bg-amber-400" : "bg-red-400"
              )}>
                {r.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{r.host}</p>
                  <span className="text-xs text-gray-400 shrink-0">{r.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
