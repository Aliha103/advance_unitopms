"use client";

import { useSubscriptionStore } from "@/stores/subscription-store";
import { useAuthStore } from "@/stores/auth-store";

const PLANS = [
  {
    key: "free_trial",
    name: "Free Trial",
    price: "Free",
    period: "14 days",
    features: ["Up to 2 OTA connections", "Basic property management", "Limited reporting"],
    color: "border-gray-200",
    bg: "bg-white",
  },
  {
    key: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["Up to 5 OTA connections", "Full property management", "Guest check-in", "Basic reporting"],
    color: "border-teal-200",
    bg: "bg-teal-50/30",
  },
  {
    key: "professional",
    name: "Professional",
    price: "$79",
    period: "/month",
    features: ["Unlimited OTA connections", "Advanced reporting & analytics", "Guest check-in + messaging", "Priority support"],
    color: "border-indigo-200",
    bg: "bg-indigo-50/30",
    popular: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Professional", "Dedicated account manager", "Custom integrations", "SLA guarantee"],
    color: "border-gray-200",
    bg: "bg-white",
  },
];

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const isHost = user?.is_host ?? false;

  const plan = useSubscriptionStore((s) => s.subscriptionPlan);
  const status = useSubscriptionStore((s) => s.subscriptionStatus);
  const daysLeft = useSubscriptionStore((s) => s.trialDaysRemaining);
  const isExpired = useSubscriptionStore((s) => s.isTrialExpired);
  const isLocked = useSubscriptionStore((s) => s.isPortalLocked);
  const loaded = useSubscriptionStore((s) => s.loaded);

  const planLabel = PLANS.find((p) => p.key === plan)?.name || plan;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    trialing: { label: "Trialing", color: "text-teal-700", bg: "bg-teal-50" },
    active: { label: "Active", color: "text-green-700", bg: "bg-green-50" },
    past_due: { label: "Past Due", color: "text-red-700", bg: "bg-red-50" },
    cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50" },
    paused: { label: "Paused", color: "text-yellow-700", bg: "bg-yellow-50" },
  };

  const sc = statusConfig[status] || statusConfig.trialing;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your subscription plan and billing.
        </p>
      </div>

      {/* Current plan card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current Plan</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{planLabel}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color} ${sc.bg}`}>
                {sc.label}
              </span>
              {isHost && status === "trialing" && !isExpired && (
                <span className="text-xs text-gray-500">
                  {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
                </span>
              )}
            </div>
          </div>
          {isHost && status === "trialing" && !isExpired && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Trial ends</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{daysLeft} days</p>
              <div className="w-32 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(5, (daysLeft / 14) * 100)}%`,
                    background: daysLeft <= 3
                      ? "linear-gradient(135deg, #ef4444, #f97316)"
                      : "linear-gradient(135deg, #0d9488, #0891b2)",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Alert for locked states */}
        {isLocked && (
          <div
            className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3 text-[13px]"
            style={{
              background: "linear-gradient(135deg, #fef2f2, #fff1f2)",
              border: "1px solid #fecaca",
            }}
          >
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="font-semibold text-red-800">
                {status === "past_due"
                  ? "Payment failed — services suspended"
                  : "Your trial has expired"}
              </p>
              <p className="text-red-600 mt-0.5">
                {status === "past_due"
                  ? "You can still view OTA bookings, but all editing and guest check-in is disabled."
                  : "Upgrade to restore full access to your property management tools."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Plan comparison */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`relative rounded-xl border-2 p-5 ${p.color} ${p.bg} ${
                p.key === plan ? "ring-2 ring-teal-500 ring-offset-2" : ""
              }`}
            >
              {p.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white rounded-full"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  Most Popular
                </span>
              )}
              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">{p.price}</span>
                {p.period && <span className="text-sm text-gray-500">{p.period}</span>}
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              {p.key === plan ? (
                <div className="mt-4 py-2 text-center text-xs font-semibold text-teal-600 bg-teal-50 rounded-lg">
                  Current Plan
                </div>
              ) : (
                <button className="mt-4 w-full py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Contact Us
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: "linear-gradient(135deg, #f0fdfa, #ecfeff, #eef2ff)",
          border: "1px solid #ccfbf1",
        }}
      >
        <h3 className="text-sm font-bold text-gray-900">Need to upgrade or have questions?</h3>
        <p className="text-xs text-gray-500 mt-1">
          Contact our team at{" "}
          <a href="mailto:support@unitopms.com" className="text-teal-600 hover:underline font-medium">
            support@unitopms.com
          </a>{" "}
          and we'll help you find the right plan.
        </p>
      </div>
    </div>
  );
}
