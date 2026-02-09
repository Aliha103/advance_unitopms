"use client";

import { useTranslations } from "@/contexts/language-context";

const OLD_WAY = [
  "Manual pricing based on guesswork",
  "Paper registration forms at check-in",
  "Creating invoices in Word or Excel",
  "Logging check-ins in a notebook",
  "Switching between email, WhatsApp, OTAs",
  "Missing guest reviews entirely",
  "Wall calendars and sticky notes",
  "No visibility into performance",
];

const NEW_WAY: [string, string | null][] = [
  ["AI-powered dynamic pricing", "AI"],
  ["Digital guest registration online", null],
  ["Professional branded invoices", null],
  ["Smart check-in/check-out system", null],
  ["All messages in one unified inbox", null],
  ["AI review monitoring & response", "AI"],
  ["Visual drag-and-drop calendar", null],
  ["Real-time analytics dashboard", null],
];

export function ComparisonSection() {
  const t = useTranslations();
  return (
    <section id="platform" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 max-w-[95vw] mx-auto">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="truncate">{t.comparison_badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 px-2 sm:px-0">
            {t.comparison_title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            {t.comparison_description}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
          {/* The Old Way */}
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 relative mb-6 md:mb-0 min-w-0">
            <div className="absolute -top-3 sm:-top-4 left-4 sm:left-8 bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              The Old Way
            </div>
            <div className="space-y-4 mt-6">
              {OLD_WAY.map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-500">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm lg:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The UnitoPMS Way */}
          <div className="bg-gradient-to-br from-[#1a365d] to-[#0f766e] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white relative shadow-2xl min-w-0">
            <div className="absolute -top-3 sm:-top-4 left-4 sm:left-8 bg-teal-400 text-slate-900 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
              The UnitoPMS Way
            </div>
            <div className="space-y-4 mt-6">
              {NEW_WAY.map(([text, badge]) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm lg:text-base">{text}</span>
                  {badge && (
                    <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
                      {badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bounce arrow */}
        <div className="flex justify-center mb-10 sm:mb-16">
          <div className="bg-white rounded-full shadow-lg p-4 border border-gray-100 animate-bounce">
            <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
