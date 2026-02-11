"use client";

import { cn } from "@/lib/utils";

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const CHURN_RATES = [3.2, 2.8, 3.5, 2.1, 1.8, 1.5];
const MAX = Math.max(...CHURN_RATES);

export default function ChurnAnalysisPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Churn Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and analyze host subscription churn rates.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Monthly Churn Rate", value: "1.5%", change: "-0.3%", good: true },
          { label: "Churned This Month", value: "2", change: "-1", good: true },
          { label: "Revenue Lost", value: "$420", change: "-$180", good: true },
          { label: "At Risk Hosts", value: "4", change: "+1", good: false },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p className={cn("text-xs font-medium mt-1", kpi.good ? "text-green-600" : "text-red-600")}>
              {kpi.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Churn Rate Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-6">Churn Rate Trend (%)</h2>
        <div className="flex items-end gap-4 h-40">
          {CHURN_RATES.map((val, i) => (
            <div key={MONTHS[i]} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">{val}%</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-red-400 to-orange-300 transition-all"
                style={{ height: `${(val / MAX) * 100}%` }}
              />
              <span className="text-xs text-gray-500">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Churn Reasons */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Churn Reasons</h2>
        <div className="space-y-3">
          {[
            { reason: "Switched to competitor", count: 3, pct: 38 },
            { reason: "Too expensive", count: 2, pct: 25 },
            { reason: "Missing features", count: 2, pct: 25 },
            { reason: "Business closed", count: 1, pct: 12 },
          ].map((row) => (
            <div key={row.reason} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{row.reason}</span>
                  <span className="text-xs font-medium text-gray-500">{row.count} hosts ({row.pct}%)</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-red-400" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
