"use client";

import Link from "next/link";

export default function BureaucracyPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">Property Settings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Bureaucracy & Self Check-in</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bureaucracy & Self Check-in</h1>
        <p className="text-sm text-gray-500 mt-1">
          City tax configuration, tourist tax rules, and self check-in settings.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Configure city tax rates, tourist tax collection, exemptions by age group, and self check-in flows including document collection, selfie verification, and smart lock integrations.
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
