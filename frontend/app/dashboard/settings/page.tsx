"use client";

import { useState } from "react";

export default function GeneralSettingsPage() {
  const [platformName, setPlatformName] = useState("UnitoPMS");
  const [supportEmail, setSupportEmail] = useState("support@unitopms.com");
  const [timezone, setTimezone] = useState("UTC");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Core platform configuration and preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Platform Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Berlin">Berlin</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Maintenance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Temporarily disable access for all hosts.</p>
            </div>
            <button type="button" onClick={() => setMaintenanceMode(!maintenanceMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-gray-200"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="button" className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
