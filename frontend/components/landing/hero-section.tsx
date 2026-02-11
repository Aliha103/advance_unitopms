"use client";

import Link from "next/link";
import { useTranslations } from "@/contexts/language-context";
import { useEffect, useState, useRef } from "react";

/* ── Easing ── */
const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ── Icons ── */
function ArrowRight() {
  return (
    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M8.5 7l5 3-5 3V7z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function CheckCircle() {
  return (
    <svg className="w-[18px] h-[18px] text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M6.5 10.5l2 2 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeroSection() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const anim = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.7s ${SPRING} ${delay}s`,
  });

  return (
    <section
      className="relative h-[100dvh] min-h-[600px] max-h-[1000px] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0c1222 0%, #151d33 25%, #162544 50%, #0f3d3e 80%, #0d3331 100%)",
      }}
    >
      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Radial glows */}
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(300px, 50vw, 700px)",
            height: "clamp(300px, 50vw, 700px)",
            background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 65%)",
            top: "-5%", left: "5%",
            animation: "heroGlow 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(250px, 40vw, 600px)",
            height: "clamp(250px, 40vw, 600px)",
            background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%)",
            bottom: "0%", right: "0%",
            animation: "heroGlow 12s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(200px, 30vw, 450px)",
            height: "clamp(200px, 30vw, 450px)",
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)",
            top: "40%", right: "25%",
            animation: "heroGlow 14s ease-in-out 4s infinite",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/25 to-transparent" />
        {/* Bottom fade for seamless transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c1222]/50 to-transparent" />

        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        <div className="text-center">

          {/* Badge */}
          <div style={anim(0.05)}>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 border border-white/[0.1] bg-white/[0.05] backdrop-blur-md text-[13px] sm:text-sm font-medium text-white/80 tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              </span>
              {t.hero_badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-6 sm:mt-8 text-[2.25rem] leading-[1.1] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-[-0.04em] text-white"
            style={anim(0.12)}
          >
            {t.hero_title_1}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span
              className="bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 100%",
                animation: visible ? "heroShimmer 5s ease-in-out infinite" : "none",
              }}
            >
              {t.hero_title_2}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-4 sm:mt-5 text-[15px] sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed tracking-[-0.01em]"
            style={anim(0.2)}
          >
            {t.hero_subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-6 sm:px-0"
            style={anim(0.28)}
          >
            <Link
              href="/register"
              className="group relative overflow-hidden bg-white text-gray-900 min-h-[48px] px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[15px] font-bold shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)] active:scale-[0.97] sm:hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              style={{ transitionTimingFunction: SPRING }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {t.hero_cta_primary}
                <ArrowRight />
              </span>
            </Link>
            <button
              className="group bg-white/[0.07] backdrop-blur-md border border-white/[0.12] text-white min-h-[48px] px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[15px] font-semibold hover:bg-white/[0.12] hover:border-white/20 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 w-full sm:w-auto"
              style={{ transitionTimingFunction: SPRING }}
            >
              <PlayIcon />
              {t.hero_cta_secondary}
            </button>
          </div>

          {/* Trust signals */}
          <div
            className="mt-7 sm:mt-9 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 sm:gap-x-7"
            style={anim(0.38)}
          >
            {[t.hero_feature_1, t.hero_feature_2, t.hero_feature_3].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle />
                <span className="text-[13px] sm:text-sm text-white/45 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-4 sm:bottom-7 left-1/2 -translate-x-1/2"
        style={{
          opacity: visible ? 0.6 : 0,
          transition: `opacity 1s ${SPRING} 0.7s`,
        }}
      >
        <div className="w-[22px] h-[34px] rounded-full border-[1.5px] border-white/25 flex justify-center pt-1.5">
          <div className="w-[3px] h-[7px] bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
