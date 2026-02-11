"use client";

export default function SecuritySettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-1">
          Authentication, access control, and security policies.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Password Policy */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Password Policy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Minimum length</p>
                <p className="text-xs text-gray-500">Minimum characters required for passwords.</p>
              </div>
              <input type="number" defaultValue={8} className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Require special characters</p>
                <p className="text-xs text-gray-500">Must include at least one special character.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-500">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Password expiry (days)</p>
                <p className="text-xs text-gray-500">Force password change after N days. 0 = never.</p>
              </div>
              <input type="number" defaultValue={0} className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Session Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Session timeout (minutes)</p>
                <p className="text-xs text-gray-500">Auto-logout after inactivity.</p>
              </div>
              <input type="number" defaultValue={60} className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 text-center focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Two-factor authentication</p>
                <p className="text-xs text-gray-500">Require 2FA for admin accounts.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">API Keys</h2>
          <div className="text-center py-8">
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <p className="text-sm text-gray-500">No API keys generated yet.</p>
            <button type="button" className="mt-3 px-4 py-2 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
              Generate API Key
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
