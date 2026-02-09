"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/contexts/language-context";

function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Intersection Observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation
  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();
    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(value * ease);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplay(value);
    };
    requestAnimationFrame(animate);
  }, [hasAnimated, value, duration]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function StatCard({
  value,
  suffix = "",
  decimals = 0,
  label,
  sub,
  iconPath,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
  iconPath: string;
}) {
  return (
    <div className="text-center group px-2 sm:px-0">
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#14b8a6] text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d={iconPath}
          />
        </svg>
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </div>
      <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{label}</div>
      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">{sub}</div>
    </div>
  );
}

export function StatsSection() {
  const t = useTranslations();
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <p className="text-xs sm:text-sm font-semibold text-teal-600 uppercase tracking-wider mb-2 sm:mb-3">
            {t.stats_subtitle}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-6 px-2 sm:px-0">
            {t.stats_title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            {t.stats_description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatCard
            value={40}
            suffix="%"
            label={t.stats_time_label}
            sub={t.stats_time_sub}
            iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <StatCard
            value={3}
            suffix="x"
            label={t.stats_checkin_label}
            sub={t.stats_checkin_sub}
            iconPath="M13 10V3L4 14h7v7l9-11h-7z"
          />
          <StatCard
            value={99.9}
            suffix="%"
            decimals={1}
            label={t.stats_uptime_label}
            sub={t.stats_uptime_sub}
            iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
          <StatCard
            value={24}
            suffix="/7"
            label={t.stats_support_label}
            sub={t.stats_support_sub}
            iconPath="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </div>
      </div>
    </section>
  );
}
