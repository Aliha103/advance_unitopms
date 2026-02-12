"use client";

import Link from "next/link";

export default function NoShowPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">Property Settings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">No-Show Detection</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">No-Show Detection</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure automatic detection and handling of guest no-shows.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Configure automatic detection of guest no-shows based on check-in deadlines, and define actions like automatic cancellation, penalty charges, or notification alerts.
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              Planned Feature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
