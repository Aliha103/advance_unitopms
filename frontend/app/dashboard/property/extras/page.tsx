"use client";

import Link from "next/link";

export default function ExtrasPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">Property Settings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Extras</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Extras</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure add-on services and extras that guests can book.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Add property extras like cleaning fees, airport transfers, breakfast packages, late check-out, and other add-on services that guests can book with their reservation.
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
