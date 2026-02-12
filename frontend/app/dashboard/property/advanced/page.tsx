"use client";

import Link from "next/link";

export default function AdvancedSettingsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">Property Settings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Advanced Settings</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          VAT separation, custom VAT rates, and advanced fiscal configuration.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Configure VAT separation rules for breakfast services, set custom VAT rates for room charges, extras, cleaning fees, and city tax. Override company-level defaults with property-specific fiscal settings.
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
