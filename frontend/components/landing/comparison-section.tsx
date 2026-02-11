"use client";

import { useTranslations } from "@/contexts/language-context";
import { useEffect, useRef, useState } from "react";

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const ROWS: [string, string, string | null][] = [
  ["Manual pricing based on guesswork", "AI-powered dynamic pricing", "AI"],
  ["Paper registration forms at check-in", "Digital guest registration online", null],
  ["Creating invoices in Word or Excel", "Professional branded invoices", null],
  ["Logging check-ins in a notebook", "Smart check-in/check-out system", null],
  ["Switching between email, WhatsApp, OTAs", "All messages in one unified inbox", null],
  ["Missing guest reviews entirely", "AI review monitoring & response", "AI"],
  ["Wall calendars and sticky notes", "Visual drag-and-drop calendar", null],
  ["No visibility into performance", "Real-time analytics dashboard", null],
];

export function ComparisonSection() {
  const t = useTranslations();
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
    <section
      ref={ref}
      id="platform"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      {/* ── Subtle background decoration ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/3 w-[500px] h-[400px] bg-slate-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-teal-100/30 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div
          className="text-center mb-10 sm:mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `all 0.7s ${SPRING}`,
          }}
        >
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t.comparison_badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-gray-900 mb-4 leading-[1.1]">
            {t.comparison_title}
          </h2>
          <p className="text-[15px] sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            {t.comparison_description}
          </p>
        </div>

        {/* ── Compact Comparison Table ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* ── Old Way Card ── */}
          <div
            className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: `all 0.8s ${SPRING} 0.2s`,
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">The Old Way</h3>
            </div>
            
            <div className="space-y-5">
              {ROWS.map(([oldText], i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-gray-500">{oldText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── UnitoPMS Way Card ── */}
          <div
            className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 overflow-hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: `all 0.8s ${SPRING} 0.3s`,
            }}
          >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">The UnitoPMS Way</h3>
              </div>

              <div className="space-y-5">
                {ROWS.map(([, newText, badge], i) => (
                  <div key={i} className="flex items-start gap-3.5 group">
                    <div className="mt-1 w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/30 transition-colors">
                      <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-[15px] font-medium text-slate-200">{newText}</span>
                      {badge && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400/10 text-teal-300 border border-teal-400/20">
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edge fades */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(249,250,251,0.8), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.8), transparent)" }} />
    </section>
  );
}
