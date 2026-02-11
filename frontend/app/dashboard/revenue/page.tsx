"use client";

import { cn } from "@/lib/utils";

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const MRR_DATA = [4200, 4800, 5100, 5600, 6200, 6800];
const ARR_DATA = MRR_DATA.map((v) => v * 12);
const MAX = Math.max(...MRR_DATA);

export default function RevenuePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">MRR & ARR</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monthly and annual recurring revenue metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Current MRR", value: "$6,800", change: "+9.7%", up: true },
          { label: "Current ARR", value: "$81,600", change: "+9.7%", up: true },
          { label: "Avg Revenue / Host", value: "$142", change: "+3.2%", up: true },
          { label: "Net Revenue Retention", value: "108%", change: "+2.1%", up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p className={cn("text-xs font-medium mt-1", kpi.up ? "text-green-600" : "text-red-600")}>
              {kpi.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* MRR Chart (bar chart) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-6">MRR Trend</h2>
        <div className="flex items-end gap-4 h-48">
          {MRR_DATA.map((val, i) => (
            <div key={MONTHS[i]} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">${(val / 1000).toFixed(1)}K</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-teal-400 transition-all"
                style={{ height: `${(val / MAX) * 100}%` }}
              />
              <span className="text-xs text-gray-500">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ARR Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ARR by Plan</h2>
        <div className="space-y-4">
          {[
            { plan: "Enterprise", arr: "$42,000", pct: 51, color: "bg-indigo-500" },
            { plan: "Professional", arr: "$28,800", pct: 35, color: "bg-teal-500" },
            { plan: "Starter", arr: "$10,800", pct: 14, color: "bg-amber-400" },
          ].map((row) => (
            <div key={row.plan}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{row.plan}</span>
                <span className="text-sm font-semibold text-gray-900">{row.arr}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
