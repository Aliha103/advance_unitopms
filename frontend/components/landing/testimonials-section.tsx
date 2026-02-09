"use client";

import { useTranslations } from "@/contexts/language-context";

function TestimonialCard({
  highlight,
  quote,
  author,
  role,
  location,
  propertyType,
  initials,
}: {
  highlight: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  propertyType: string;
  initials: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative min-w-0">
      {/* Result badge */}
      <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-teal-100">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        {highlight}
      </div>
      <blockquote className="text-gray-900 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a365d] via-[#2a4a82] to-[#14b8a6] flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">{role}</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location} &bull; {propertyType}
          </div>
        </div>
      </div>
    </div>
  );
}

const TRUST_SIGNALS = [
  { label: "GDPR Compliant", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { label: "256-bit SSL Encryption", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { label: "Cloud-Based", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "No Hidden Fees", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export function TestimonialsSection() {
  const t = useTranslations();
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <p className="text-xs sm:text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2 sm:mb-3">{t.testimonials_subtitle}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-6 px-2 sm:px-0">{t.testimonials_title}</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            {t.testimonials_description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 mb-10 sm:mb-16">
          <TestimonialCard highlight="40% time saved" quote="We reduced our booking management time by 40%. The AI-powered insights helped us optimize pricing strategies we never knew existed." author="Marco Bianchi" role="Owner, Hotel Bella Vista" location="Florence, Italy" propertyType="12-room Boutique Hotel" initials="MB" />
          <TestimonialCard highlight="7-minute setup" quote="Setup took exactly 7 minutes. Within a week, we had complete visibility over all our properties. The dashboard is incredibly intuitive." author="Anna M&uuml;ller" role="Property Portfolio Manager" location="Vienna, Austria" propertyType="8 Vacation Rentals" initials="AM" />
          <TestimonialCard highlight="18% occupancy increase" quote="The AI pricing recommendations helped us increase occupancy during slow months. It's like having a revenue manager on staff 24/7." author="Carlos Mendez" role="Operations Director" location="Lisbon, Portugal" propertyType="Aparthotel (24 units)" initials="CM" />
        </div>

        {/* Trust Signals */}
        <div className="border-t border-gray-100 pt-12">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 text-gray-600">
            {TRUST_SIGNALS.map((t) => (
              <div key={t.label} className="flex items-center gap-3 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                </svg>
                <span className="text-sm font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
