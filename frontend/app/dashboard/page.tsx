"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function DashboardOverview() {
  const user = useAuthStore((s) => s.user);
  const hostProfile = useAuthStore((s) => s.hostProfile);

  return (
    <div className="p-6">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name || "Admin"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening across UnitoPMS today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Hosts", value: "—", change: null, icon: "building" },
          { label: "Active Properties", value: "—", change: null, icon: "home" },
          { label: "MRR", value: "—", change: null, icon: "dollar" },
          { label: "Pending Applications", value: "—", change: null, icon: "clock" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Recent Host Applications
          </h2>
          <div className="text-sm text-gray-500 text-center py-8">
            No recent applications.
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            System Health
          </h2>
          <div className="space-y-3">
            {["Backend API", "Database", "Redis", "Celery Worker"].map(
              (service) => (
                <div key={service} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{service}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Operational
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Host profile card (if logged in as host) */}
      {hostProfile && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Your Host Profile
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Company</p>
              <p className="font-medium text-gray-900">{hostProfile.company_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-gray-900 capitalize">
                {hostProfile.status.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Plan</p>
              <p className="font-medium text-gray-900 capitalize">
                {hostProfile.subscription_plan.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Properties</p>
              <p className="font-medium text-gray-900">
                {hostProfile.num_properties} ({hostProfile.num_units} units)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
