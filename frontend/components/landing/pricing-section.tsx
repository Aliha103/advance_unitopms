"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    description: "Perfect for single properties or small portfolios.",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      "Up to 5 units",
      "Essential Channel Manager",
      "Basic Booking Calendar",
      "Unified Inbox",
      "Standard Support",
    ],
    highlight: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    description: "For growing businesses needing automation.",
    monthlyPrice: 79,
    yearlyPrice: 65,
    features: [
      "Up to 20 units",
      "Advanced Channel Manager",
      "AI Guest Communication",
      "Automated Reviews",
      "Financial Reports",
      "Priority Support",
      "Multi-user Access",
    ],
    highlight: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    description: "Full control for large scale operations.",
    monthlyPrice: 199,
    yearlyPrice: 165,
    features: [
      "Unlimited units",
      "AI Dynamic Pricing",
      "Custom API Access",
      "Dedicated Account Manager",
      "White-label Invoices",
      "SLA Guarantee",
      "Custom Onboarding",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
];

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="pricing" className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gray-50/80 rounded-full blur-[100px] -z-10" />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-12 sm:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `all 0.8s ${SPRING}`,
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your business. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isAnnual ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>
              Yearly
              <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-teal-600 bg-teal-50 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
                plan.highlight
                  ? "bg-slate-900 text-white shadow-xl scale-105"
                  : "bg-white text-gray-900 border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1"
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.8s ${SPRING} ${0.1 * index}s`,
              }}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlight ? "text-slate-300" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    ${isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-slate-400" : "text-gray-500"}`}>
                    /month
                  </span>
                </div>
                {isAnnual && (
                  <p className={`text-xs mt-2 ${plan.highlight ? "text-teal-400" : "text-teal-600"}`}>
                    Billed annually (${plan.yearlyPrice * 12}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? "text-teal-400" : "text-teal-500"}`} />
                    <span className={plan.highlight ? "text-slate-200" : "text-gray-600"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                  plan.highlight
                    ? "bg-teal-500 text-white hover:bg-teal-400 shadow-[0_4px_14px_rgba(20,184,166,0.4)]"
                    : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
