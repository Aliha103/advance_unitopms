"use client";

import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "welcome", name: "Welcome Email", desc: "Sent when a host account is activated.", status: "active", lastEdited: "Jan 15, 2026" },
  { id: "application-received", name: "Application Received", desc: "Confirmation sent to applicant.", status: "active", lastEdited: "Jan 10, 2026" },
  { id: "application-approved", name: "Application Approved", desc: "Sent when application is approved.", status: "active", lastEdited: "Jan 10, 2026" },
  { id: "application-rejected", name: "Application Rejected", desc: "Sent when application is rejected.", status: "draft", lastEdited: "Jan 8, 2026" },
  { id: "password-reset", name: "Set Password", desc: "Contains the set-password link.", status: "active", lastEdited: "Feb 1, 2026" },
  { id: "invoice", name: "Invoice", desc: "Monthly subscription invoice.", status: "active", lastEdited: "Dec 20, 2025" },
  { id: "payment-failed", name: "Payment Failed", desc: "Alert when payment processing fails.", status: "active", lastEdited: "Dec 15, 2025" },
  { id: "trial-ending", name: "Trial Ending Soon", desc: "Reminder 3 days before trial expires.", status: "draft", lastEdited: "Nov 30, 2025" },
];

export default function EmailTemplatesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage transactional email templates sent to hosts and guests.
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold uppercase rounded",
                tpl.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              )}>
                {tpl.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{tpl.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{tpl.desc}</p>
            <p className="text-[10px] text-gray-400 mt-3">Last edited: {tpl.lastEdited}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
