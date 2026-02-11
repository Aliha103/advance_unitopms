"use client";

import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free Trial",
    price: "$0",
    period: "14 days",
    hosts: 5,
    color: "from-gray-400 to-gray-500",
    features: ["Up to 5 units", "Basic reports", "Email support", "Single user"],
  },
  {
    name: "Starter",
    price: "$80",
    period: "/month",
    hosts: 18,
    color: "from-amber-400 to-orange-500",
    features: ["Up to 20 units", "Standard reports", "Email support", "3 team members"],
  },
  {
    name: "Professional",
    price: "$200",
    period: "/month",
    hosts: 20,
    color: "from-teal-500 to-cyan-500",
    features: ["Up to 100 units", "Advanced analytics", "Priority support", "10 team members", "API access", "Channel manager"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$350",
    period: "/month",
    hosts: 5,
    color: "from-indigo-500 to-purple-600",
    features: ["Unlimited units", "Custom reports", "Dedicated support", "Unlimited team", "Full API", "White-label", "SLA guarantee"],
  },
];

export default function PlansPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Plans & Tiers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage subscription plans and view tier distribution.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md",
              plan.popular ? "border-teal-300 ring-1 ring-teal-200" : "border-gray-200"
            )}
          >
            {plan.popular && (
              <div className="bg-teal-500 text-white text-center text-[10px] font-bold uppercase tracking-wider py-1">
                Most Popular
              </div>
            )}
            <div className="p-5">
              {/* Header */}
              <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3", plan.color)}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{plan.hosts} active hosts</p>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
