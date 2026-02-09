"use client";

import Link from "next/link";
import { useTranslations } from "@/contexts/language-context";

export function HeroSection() {
  const t = useTranslations();
  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden min-w-0"
      style={{
        background:
          "linear-gradient(135deg, #1a365d 0%, #2a4a82 40%, #14b8a6 100%)",
      }}
    >
      {/* Animated background blur orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-40 sm:w-64 h-40 sm:h-64 bg-blue-600/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-24 sm:pt-32 pb-10 sm:pb-16 min-w-0">
        <div className="text-center min-w-0">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-5 sm:mb-8 max-w-[95vw] mx-auto">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate">
              {t.hero_badge}
            </span>
          </div>

          {/* Headline - fluid type for ideal scaling */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-6 tracking-tight px-1 text-center">
            {t.hero_title_1}
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              {t.hero_title_2}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/75 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2 break-words">
            {t.hero_subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-16 px-2 sm:px-0">
            <Link
              href="/register"
              className="group bg-white text-[#1a365d] min-h-[44px] px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-[0_8px_32px_rgba(255,255,255,0.25)] hover:shadow-[0_12px_48px_rgba(255,255,255,0.35)] active:scale-[0.98] sm:hover:scale-[1.02] transform transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation"
            >
              {t.hero_cta_primary}
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <button className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white min-h-[44px] px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold hover:bg-white/20 active:bg-white/25 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.hero_cta_secondary}
            </button>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 text-white/70">
            {[t.hero_feature_1, t.hero_feature_2, t.hero_feature_3].map(
              (f) => (
                <div key={f} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">{f}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
