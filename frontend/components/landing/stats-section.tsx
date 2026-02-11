"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/contexts/language-context";

/* ── Easing ── */
const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ── Animated counter ── */
function useCountUp(end: number, decimals = 0, duration = 2200, enabled = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // quartic ease-out for snappy feel
      setVal(parseFloat((end * eased).toFixed(decimals)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, decimals, duration, enabled]);
  return val;
}

/* ── Stat colors ── */
const PALETTE = {
  teal:   { glow: "rgba(13,148,136,0.15)", text: "#0d9488", ring: "rgba(13,148,136,0.1)" },   // Teal-600
  blue:   { glow: "rgba(37,99,235,0.15)", text: "#2563eb", ring: "rgba(37,99,235,0.1)" },    // Blue-600
  violet: { glow: "rgba(124,58,237,0.15)", text: "#7c3aed", ring: "rgba(124,58,237,0.1)" }, // Violet-600
  rose:   { glow: "rgba(225,29,72,0.15)", text: "#e11d48", ring: "rgba(225,29,72,0.1)" },   // Rose-600
} as const;

type PaletteKey = keyof typeof PALETTE;

/* ── Stat item ── */
function StatItem({
  value,
  suffix,
  decimals,
  label,
  accent,
  visible,
  delay,
}: {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  accent: PaletteKey;
  visible: boolean;
  delay: number;
}) {
  const count = useCountUp(value, decimals, 2200, visible);
  const c = PALETTE[accent];

  return (
    <div
      className="group relative flex flex-col items-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(36px) scale(0.95)",
        transition: `all 0.9s ${SPRING} ${delay}s`,
      }}
    >
      {/* Glow halo behind number */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
          opacity: visible ? 0.6 : 0,
        }}
      />

      {/* Number */}
      <div
        className="relative z-10 transition-transform duration-500 group-hover:scale-110"
        style={{ perspective: "500px" }}
      >
        <span
          className="block text-5xl sm:text-6xl lg:text-[5rem] font-black tracking-[-0.06em] tabular-nums leading-none select-none"
          style={{ color: c.text }}
        >
          {count.toFixed(decimals)}
          <span style={{ color: c.text, opacity: 0.7 }}>{suffix}</span>
        </span>
      </div>

      {/* Label */}
      <div className="relative z-10 mt-3 sm:mt-4 text-[13px] sm:text-sm font-semibold tracking-[0.12em] uppercase text-gray-500 group-hover:text-gray-800 transition-colors duration-500">
        {label}
      </div>

      {/* Subtle underline accent */}
      <div
        className="relative z-10 mt-3 h-[2px] w-8 rounded-full origin-center transition-all duration-500 scale-x-0 group-hover:scale-x-100 group-hover:w-12"
        style={{ background: c.text }}
      />
    </div>
  );
}

export function StatsSection() {
  const t = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats: { value: number; suffix: string; decimals: number; label: string; accent: PaletteKey }[] = [
    { value: 40, suffix: "%", decimals: 0, label: t.stats_time_label, accent: "teal" },
    { value: 3, suffix: "x", decimals: 0, label: t.stats_checkin_label, accent: "blue" },
    { value: 99.9, suffix: "%", decimals: 1, label: t.stats_uptime_label, accent: "violet" },
    { value: 24, suffix: "/7", decimals: 0, label: t.stats_support_label, accent: "rose" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 lg:py-36 overflow-hidden bg-gray-50"
    >
      {/* ── Ambient background effects ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Aurora-like gradient mesh */}
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-30 blur-[100px]"
          style={{ background: "radial-gradient(ellipse, rgba(45,212,191,0.2) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.2) 0%, transparent 70%)" }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `all 0.8s ${SPRING}`,
          }}
        >
          <span className="inline-block text-[13px] sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-5 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            {t.stats_subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.04em] text-gray-900 mb-5 sm:mb-6 leading-[1.1]">
            {t.stats_title}
          </h2>
          <p className="text-[15px] sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
            {t.stats_description}
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-14 lg:gap-8">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              {...stat}
              visible={visible}
              delay={0.1 + i * 0.12}
            />
          ))}
        </div>
      </div>

      {/* ── Top/bottom edge fade ── */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(249,250,251,0.8), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(249,250,251,0.8), transparent)" }} />
    </section>
  );
}
