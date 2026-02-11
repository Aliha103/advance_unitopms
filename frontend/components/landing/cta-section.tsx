"use client";

import { useEffect, useRef, useState } from "react";

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export function CtaSection() {
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

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #0a0f1e 0%, #0d1429 35%, #111b38 60%, #0e1a30 100%)",
      }}
    >
      {/* ── Animated aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 60%)",
            animation: "ctaGlow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 60%)",
            animation: "ctaGlow 10s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[350px] h-[250px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 60%)",
            animation: "ctaGlow 12s ease-in-out 4s infinite",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 text-center">
        {/* Badge */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.7s ${SPRING}`,
          }}
        >
          <span className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-full px-4 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.5)]" />
            </span>
            <span className="text-sm text-white/70 font-medium">Get started in minutes</span>
          </span>
        </div>

        {/* Headline */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-5 sm:mb-6 leading-[1.1] tracking-[-0.04em]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `all 0.7s ${SPRING} 0.1s`,
          }}
        >
          Ready to Simplify Your
          <br />
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
            Property Management?
          </span>
        </h2>

        {/* Subtitle */}
        <p
          className="text-[15px] sm:text-lg text-white/40 mb-10 sm:mb-12 max-w-xl mx-auto leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.7s ${SPRING} 0.2s`,
          }}
        >
          Join hundreds of property managers who trust UnitoPMS to run their operations smoothly.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-2 sm:px-0"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.7s ${SPRING} 0.3s`,
          }}
        >
          <button className="group relative overflow-hidden bg-white text-gray-900 min-h-[52px] px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-[15px] sm:text-base font-bold shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_8px_40px_rgba(45,212,191,0.25)] active:scale-[0.97] sm:hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              Start 14-Day Free Trial
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button className="group bg-white/[0.06] backdrop-blur-md border border-white/[0.1] text-white min-h-[52px] px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-[15px] sm:text-base font-semibold hover:bg-white/[0.1] hover:border-white/20 active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
            Schedule a Demo
          </button>
        </div>

        {/* Trust signals */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-white/35"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 0.8s ${SPRING} 0.5s`,
          }}
        >
          {[
            { icon: "M5 13l4 4L19 7", text: "No credit card required" },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "Setup in 5 minutes" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "GDPR compliant" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glow animation */}
      <style jsx>{`
        @keyframes ctaGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.15; }
        }
      `}</style>

      {/* Edge fades */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.5), transparent)" }} />
    </section>
  );
}
