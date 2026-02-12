"use client";

import Link from "next/link";

export default function PaymentMethodsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/property" className="hover:text-teal-600 transition-colors">Property Settings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Booking Payment Methods</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Payment Methods</h1>
        <p className="text-sm text-gray-500 mt-1">
          Set up payment providers and configure guest payment options.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Connect payment providers like Stripe, configure bank transfers, set up deposit rules, and manage the payment methods available on your booking engine.
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
