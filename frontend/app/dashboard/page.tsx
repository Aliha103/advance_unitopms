"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

// ── Property type helpers ────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  hotel: "Hotel",
  boutique_hotel: "Boutique Hotel",
  resort: "Resort",
  motel: "Motel",
  hostel: "Hostel",
  "bed_&_breakfast": "Bed & Breakfast",
  vacation_rental: "Vacation Rental",
  serviced_apartment: "Serviced Apartment",
  "apart-hotel": "Apart-Hotel",
  villa: "Villa",
  guesthouse: "Guesthouse",
  lodge: "Lodge",
  other: "Other",
};

type PropertyCategory = "hotel" | "rental" | "apartment";

function getPropertyCategory(propertyType: string): PropertyCategory {
  const rentalTypes = ["vacation_rental", "villa", "guesthouse", "bed_&_breakfast"];
  const apartmentTypes = ["serviced_apartment", "apart-hotel"];
  if (rentalTypes.includes(propertyType)) return "rental";
  if (apartmentTypes.includes(propertyType)) return "apartment";
  return "hotel";
}

const UNIT_LABEL: Record<PropertyCategory, string> = {
  hotel: "Rooms",
  rental: "Units",
  apartment: "Apartments",
};

// Maps stored upper-bound values back to the range labels used in the registration form
const UNITS_RANGE_LABELS: Record<number, string> = {
  10: "1–10",
  25: "11–25",
  50: "26–50",
  100: "51–100",
  250: "101–250",
  500: "250+",
};
function unitsRangeLabel(n: number, unitWord: string): string {
  const range = UNITS_RANGE_LABELS[n];
  return range ? `${range} ${unitWord.toLowerCase()}` : `${n} ${unitWord.toLowerCase()}`;
}

// ── SVG helpers ──────────────────────────────────────────────────────────────

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

// ── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ userName }: { userName: string }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening across UnitoPMS today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Hosts", value: "—", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { label: "Active Properties", value: "—", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { label: "MRR", value: "—", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Pending Applications", value: "—", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Icon d={stat.icon} className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Host Applications</h2>
          <div className="text-sm text-gray-500 text-center py-8">No recent applications.</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-3">
            {["Backend API", "Database", "Redis", "Celery Worker"].map((service) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{service}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Operational
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Host Dashboard ───────────────────────────────────────────────────────────

function HostDashboard({
  userName,
  hostProfile,
}: {
  userName: string;
  hostProfile: {
    company_name: string;
    status: string;
    onboarding_step: string;
    subscription_plan: string;
    property_type: string;
    num_properties: number;
    num_units: number;
  };
}) {
  const category = getPropertyCategory(hostProfile.property_type);
  const unitLabel = UNIT_LABEL[category];
  const typeLabel = PROPERTY_TYPE_LABELS[hostProfile.property_type] || hostProfile.property_type;
  const isNewAccount = hostProfile.onboarding_step === "email_verified" || hostProfile.status === "active";

  // Stats config per category
  const statsConfig = {
    hotel: [
      { label: "Occupancy", value: "—", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "teal" },
      { label: "Check-ins Today", value: "0", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1", color: "blue" },
      { label: "Check-outs Today", value: "0", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1", color: "amber" },
      { label: "Revenue (MTD)", value: "—", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "green" },
    ],
    rental: [
      { label: "Active Bookings", value: "0", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "teal" },
      { label: "Upcoming Arrivals", value: "0", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1", color: "blue" },
      { label: "Pending Reviews", value: "0", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "amber" },
      { label: "Revenue (MTD)", value: "—", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "green" },
    ],
    apartment: [
      { label: "Occupied Units", value: "—", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "teal" },
      { label: "Move-ins This Week", value: "0", icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1", color: "blue" },
      { label: "Move-outs This Week", value: "0", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1", color: "amber" },
      { label: "Revenue (MTD)", value: "—", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "green" },
    ],
  };

  const stats = statsConfig[category];

  // Quick actions per category
  const actionsConfig = {
    hotel: [
      { label: "New Booking", href: "/dashboard/bookings", icon: "M12 4v16m8-8H4", color: "teal" },
      { label: "Calendar", href: "/dashboard/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "blue" },
      { label: "Cleaning", href: "/dashboard/cleaning", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "purple" },
      { label: "OTA & Channels", href: "/dashboard/channels", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color: "gray" },
    ],
    rental: [
      { label: "New Booking", href: "/dashboard/bookings", icon: "M12 4v16m8-8H4", color: "teal" },
      { label: "Calendar", href: "/dashboard/calendar", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "blue" },
      { label: "Reviews", href: "/dashboard/reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "purple" },
      { label: "OTA & Channels", href: "/dashboard/channels", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color: "gray" },
    ],
    apartment: [
      { label: "New Booking", href: "/dashboard/bookings", icon: "M12 4v16m8-8H4", color: "teal" },
      { label: "Manage Tenants", href: "/dashboard/guests", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "blue" },
      { label: "Cleaning", href: "/dashboard/cleaning", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "purple" },
      { label: "OTA & Channels", href: "/dashboard/channels", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color: "gray" },
    ],
  };

  const quickActions = actionsConfig[category];

  // Setup steps — single property onboarding flow
  const onboardingOrder = ["registered", "email_verified", "profile_completed", "property_added", "payment_configured", "onboarding_complete"];
  const currentStep = onboardingOrder.indexOf(hostProfile.onboarding_step);
  const setupSteps = [
    { label: "Account created", done: true },
    { label: "Password set", done: hostProfile.status === "active" || currentStep >= 1 },
    { label: "Complete property info", done: currentStep >= 2, href: "/dashboard/inventory" },
    { label: "Connect an OTA channel", done: currentStep >= 3, href: "/dashboard/channels" },
    { label: "Create your first booking", done: currentStep >= 4, href: "/dashboard/bookings" },
  ];

  const completedSteps = setupSteps.filter((s) => s.done).length;
  const progressPct = Math.round((completedSteps / setupSteps.length) * 100);

  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    teal: { bg: "bg-teal-50", text: "text-teal-600", iconBg: "bg-teal-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-purple-100" },
    gray: { bg: "bg-gray-50", text: "text-gray-600", iconBg: "bg-gray-100" },
  };

  return (
    <>
      {/* Header with property summary */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {hostProfile.company_name} &middot; {typeLabel} &middot;{" "}
          {unitsRangeLabel(hostProfile.num_units, unitLabel)}
        </p>
      </div>

      {/* Onboarding banner (show if setup is incomplete) */}
      {isNewAccount && completedSteps < setupSteps.length && (
        <div className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-lg">Get started with UnitoPMS</h2>
              <p className="text-teal-100 text-sm mt-0.5">
                Complete these steps to start managing your {unitLabel.toLowerCase()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{progressPct}%</span>
              <p className="text-teal-100 text-xs">complete</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Steps */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {setupSteps.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                {s.done ? (
                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-white/50 flex-shrink-0" />
                )}
                {s.href && !s.done ? (
                  <Link href={s.href} className="text-sm text-white hover:underline">
                    {s.label}
                  </Link>
                ) : (
                  <span className={`text-sm ${s.done ? "text-teal-100 line-through" : "text-white"}`}>
                    {s.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const c = colorMap[stat.color];
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                  <Icon d={stat.icon} className={`w-4 h-4 ${c.text}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const c = colorMap[action.color];
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon d={action.icon} className={`w-5 h-5 ${c.text}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            {category === "hotel" ? "Today's Activity" : "Upcoming"}
          </h2>
          <div className="text-sm text-gray-500 text-center py-8">
            {category === "hotel"
              ? "No check-ins or check-outs scheduled for today."
              : category === "rental"
              ? "No upcoming arrivals or departures."
              : "No upcoming move-ins or move-outs."}
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Property Overview</h2>
            <Link href="/dashboard/inventory" className="text-xs font-medium text-teal-600 hover:text-teal-500">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Property Type</span>
              <span className="text-sm font-medium text-gray-900">{typeLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{unitLabel}</span>
              <span className="text-sm font-medium text-gray-900">{unitsRangeLabel(hostProfile.num_units, unitLabel)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Plan</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {hostProfile.subscription_plan.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Status</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                hostProfile.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  hostProfile.status === "active" ? "bg-green-500" : "bg-amber-500"
                }`} />
                {hostProfile.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const user = useAuthStore((s) => s.user);
  const hostProfile = useAuthStore((s) => s.hostProfile);

  return (
    <div className="p-6">
      {user?.is_host && hostProfile ? (
        <HostDashboard
          userName={user.full_name || "Host"}
          hostProfile={hostProfile}
        />
      ) : (
        <AdminDashboard userName={user?.full_name || "Admin"} />
      )}
    </div>
  );
}
