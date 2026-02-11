"use client";

import { cn } from "@/lib/utils";

const STAR_DATA = [
  { stars: 5, count: 142, pct: 58 },
  { stars: 4, count: 63, pct: 26 },
  { stars: 3, count: 24, pct: 10 },
  { stars: 2, count: 10, pct: 4 },
  { stars: 1, count: 5, pct: 2 },
];

const RECENT_RATINGS = [
  { guest: "John D.", host: "Grand Hotel & Spa", rating: 5, comment: "Outstanding stay! Perfect service.", date: "Feb 9, 2026" },
  { guest: "Maria G.", host: "Sunset Villas", rating: 4, comment: "Beautiful property, minor noise issue.", date: "Feb 7, 2026" },
  { guest: "Hans M.", host: "Alpine Lodge Co.", rating: 5, comment: "Best mountain retreat experience!", date: "Feb 5, 2026" },
  { guest: "Emma W.", host: "Beach Resort Group", rating: 2, comment: "Room wasn't clean on arrival.", date: "Feb 3, 2026" },
  { guest: "Yuki T.", host: "Mountain View Inn", rating: 4, comment: "Lovely views, breakfast could improve.", date: "Feb 1, 2026" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={cn("w-4 h-4", i <= count ? "text-amber-400" : "text-gray-200")} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function GuestRatingsPage() {
  const avgRating = 4.4;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guest Ratings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform-wide guest satisfaction ratings and reviews.
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Average Rating</p>
          <p className="text-5xl font-bold text-gray-900">{avgRating}</p>
          <Stars count={Math.round(avgRating)} />
          <p className="text-xs text-gray-400 mt-2">244 total ratings</p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Distribution</h3>
          <div className="space-y-3">
            {STAR_DATA.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-12">{row.stars} star</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-500 w-16 text-right">{row.count} ({row.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Reviews</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_RATINGS.map((r, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{r.guest}</p>
                  <span className="text-xs text-gray-400">at {r.host}</span>
                </div>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <Stars count={r.rating} />
              <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
