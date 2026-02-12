"use client";

import Link from "next/link";

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

interface SectionCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  status: "active" | "placeholder" | "redirect";
}

interface SectionGroup {
  label: string;
  cards: SectionCard[];
}

const SECTIONS: SectionGroup[] = [
  {
    label: "General",
    cards: [
      {
        title: "Property Settings",
        description: "Name, type, contact, address, timezone, currency, and VAT details.",
        href: "/dashboard/property/settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        bgColor: "bg-teal-50",
        iconColor: "text-teal-600",
        status: "active",
      },
      {
        title: "Content",
        description: "Public name, description, images, and logo for your property listing.",
        href: "/dashboard/property/content",
        icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        status: "active",
      },
      {
        title: "Bureaucracy & Self Check-in",
        description: "City tax configuration, tourist tax rules, and self check-in settings.",
        href: "/dashboard/property/bureaucracy",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Inventory & Pricing",
    cards: [
      {
        title: "Units & Rates",
        description: "Manage unit categories, individual units, rate plans, and derivation rules.",
        href: "/dashboard/inventory",
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600",
        status: "redirect",
      },
      {
        title: "Extras",
        description: "Configure cleaning fees, breakfast packages, and other add-on services.",
        href: "/dashboard/property/extras",
        icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
        bgColor: "bg-rose-50",
        iconColor: "text-rose-600",
        status: "placeholder",
      },
      {
        title: "Costs",
        description: "Track property-level costs and per-unit operational costs.",
        href: "/dashboard/property/costs",
        icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Booking & Policies",
    cards: [
      {
        title: "Booking Settings & Policies",
        description: "Min stay, check-in/out times, pet policy, smoking, privacy and T&C.",
        href: "/dashboard/property/booking-settings",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
        bgColor: "bg-cyan-50",
        iconColor: "text-cyan-600",
        status: "placeholder",
      },
      {
        title: "Promotions",
        description: "Create early-bird discounts, last-minute deals, and loyalty rewards.",
        href: "/dashboard/property/promotions",
        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
        status: "placeholder",
      },
      {
        title: "No-Show Detection",
        description: "Automatic detection and flagging of guest no-shows.",
        href: "/dashboard/property/no-show",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        bgColor: "bg-red-50",
        iconColor: "text-red-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Communication",
    cards: [
      {
        title: "Message Templates",
        description: "Automated messages for booking confirmations, reminders, and more.",
        href: "/dashboard/property/message-templates",
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        bgColor: "bg-violet-50",
        iconColor: "text-violet-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Connections & Payments",
    cards: [
      {
        title: "Channel Connections",
        description: "Connect to Booking.com, Airbnb, Expedia, and other OTAs.",
        href: "/dashboard/channels",
        icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
        bgColor: "bg-sky-50",
        iconColor: "text-sky-600",
        status: "redirect",
      },
      {
        title: "Booking Payment Methods",
        description: "Set up Stripe, bank transfers, and other payment providers.",
        href: "/dashboard/property/payment-methods",
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Operations",
    cards: [
      {
        title: "Housekeeping Settings",
        description: "Cleaning schedules, checklists, and staff assignments.",
        href: "/dashboard/cleaning",
        icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
        bgColor: "bg-orange-50",
        iconColor: "text-orange-600",
        status: "redirect",
      },
      {
        title: "Contracts",
        description: "Manage guest contracts and rental agreement templates.",
        href: "/dashboard/property/contracts",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        bgColor: "bg-slate-50",
        iconColor: "text-slate-600",
        status: "placeholder",
      },
    ],
  },
  {
    label: "Finance",
    cards: [
      {
        title: "Accounting Series",
        description: "Numbering sequences for invoices, receipts, and documents.",
        href: "/dashboard/property/accounting",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        bgColor: "bg-lime-50",
        iconColor: "text-lime-600",
        status: "placeholder",
      },
      {
        title: "Advanced Settings",
        description: "VAT separation, custom VAT rates, and fiscal configuration.",
        href: "/dashboard/property/advanced",
        icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
        bgColor: "bg-gray-100",
        iconColor: "text-gray-600",
        status: "placeholder",
      },
    ],
  },
];

export default function PropertyHubPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Property Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure and manage all aspects of your property.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.label} className="mb-8">
          <div className="mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {section.label}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon d={card.icon} className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.description}</p>
                  {card.status === "placeholder" && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                      Coming Soon
                    </span>
                  )}
                  {card.status === "redirect" && (
                    <span className="inline-block mt-2 text-[10px] font-medium text-teal-600">
                      Opens existing page &rarr;
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
