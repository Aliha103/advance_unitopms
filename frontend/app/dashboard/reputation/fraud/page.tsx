"use client";

import { cn } from "@/lib/utils";

const MOCK_ALERTS = [
  { id: "FRD-012", type: "Suspicious booking pattern", host: "Beach Resort Group", severity: "high", detail: "15 bookings from same IP in 2 hours", date: "Feb 10, 2026", status: "new" },
  { id: "FRD-011", type: "Payment chargeback", host: "Grand Hotel & Spa", severity: "high", detail: "Guest disputed $890 charge with bank", date: "Feb 8, 2026", status: "investigating" },
  { id: "FRD-010", type: "Duplicate accounts", host: "Sunset Villas", severity: "medium", detail: "2 guest accounts with same phone number", date: "Feb 5, 2026", status: "resolved" },
  { id: "FRD-009", type: "Fake review detected", host: "Alpine Lodge Co.", severity: "low", detail: "Review language matches known spam pattern", date: "Feb 2, 2026", status: "resolved" },
  { id: "FRD-008", type: "Payment chargeback", host: "Mountain View Inn", severity: "high", detail: "Guest disputed $320 charge", date: "Jan 28, 2026", status: "resolved" },
];

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-red-50 text-red-700 border-red-200",
  investigating: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
};

export default function FraudAlertsPage() {
  const newAlerts = MOCK_ALERTS.filter((a) => a.status === "new").length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Fraud Alerts</h1>
          {newAlerts > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {newAlerts} new
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and investigate suspicious activities across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "New Alerts", value: newAlerts, color: "text-red-600" },
          { label: "Investigating", value: MOCK_ALERTS.filter((a) => a.status === "investigating").length, color: "text-amber-600" },
          { label: "Resolved (30d)", value: MOCK_ALERTS.filter((a) => a.status === "resolved").length, color: "text-green-600" },
          { label: "High Severity", value: MOCK_ALERTS.filter((a) => a.severity === "high").length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn("text-xl font-bold mt-1", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {MOCK_ALERTS.map((alert) => (
            <div key={alert.id} className={cn("px-5 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors", alert.status === "new" && "bg-red-50/30")}>
              {/* Severity indicator */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                alert.severity === "high" ? "bg-red-100" : alert.severity === "medium" ? "bg-amber-100" : "bg-blue-100"
              )}>
                <svg className={cn("w-5 h-5", alert.severity === "high" ? "text-red-600" : alert.severity === "medium" ? "text-amber-600" : "text-blue-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-gray-400">{alert.id}</span>
                  <span className={cn("inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded border", SEVERITY_STYLES[alert.severity])}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">{alert.host} &mdash; {alert.detail}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.date}</p>
              </div>
              {/* Status */}
              <span className={cn("inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize shrink-0", STATUS_STYLES[alert.status])}>
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
