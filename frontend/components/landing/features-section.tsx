"use client";

import { useEffect, useRef, useState } from "react";

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ── Animated counter hook ── */
function useCountUp(end: number, prefix = "", suffix = "", duration = 1800, enabled = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, enabled]);
  return `${prefix}${val}${suffix}`;
}

/* ── Feature card ── */
function PremiumFeatureCard({
  iconPath,
  gradientFrom,
  stat,
  statLabel,
  title,
  items,
  visible,
  delay,
}: {
  iconPath: string;
  gradientFrom: string;
  stat: string;
  statLabel: string;
  title: string;
  items: [string, string][];
  visible: boolean;
  delay: number;
}) {
  const hoverBorder =
    gradientFrom.includes("blue") ? "hover:border-blue-400/40" :
    gradientFrom.includes("teal") ? "hover:border-teal-400/40" :
    gradientFrom.includes("green") ? "hover:border-emerald-400/40" :
    "hover:border-purple-400/40";

  const glowColor =
    gradientFrom.includes("blue") ? "rgba(96,165,250,0.08)" :
    gradientFrom.includes("teal") ? "rgba(45,212,191,0.08)" :
    gradientFrom.includes("green") ? "rgba(52,211,153,0.08)" :
    "rgba(167,139,250,0.08)";

  return (
    <div
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.7s ${SPRING} ${delay}s`,
        perspective: "800px",
      }}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-white border border-gray-100/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${hoverBorder} hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full group-hover:translate-y-[-2px]`}>
        {/* Hover glow */}
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: glowColor }}
        />

        <div className="relative flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientFrom} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold bg-gradient-to-r ${gradientFrom} bg-clip-text text-transparent`}>{stat}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{statLabel}</div>
          </div>
        </div>

        <h4 className="relative font-bold text-lg text-gray-900 mb-4">{title}</h4>

        <ul className="relative space-y-3">
          {items.map(([text, badge]) => (
            <li key={text} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2.5 text-gray-600 group-hover:text-gray-800 transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientFrom} flex-shrink-0`} />
                {text}
              </div>
              {badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${gradientFrom} text-white shadow-sm`}>
                  {badge}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-300 origin-left scale-x-0 group-hover:scale-x-100`}
          style={{ transition: "opacity 0.3s, transform 0.5s" }}
        />
      </div>
    </div>
  );
}

const ALSO_INCLUDED = [
  { label: "Website Included", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
  { label: "Channel Manager", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { label: "Multi-property", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { label: "Unified Inbox", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Custom Reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "API Access", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Mobile App", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { label: "5-min Setup", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const occupancy = useCountUp(78, "", "%", 2000, visible);
  const revenue = useCountUp(2400, "€", "", 2000, visible);

  return (
    <section ref={ref} id="ai-features" className="py-20 sm:py-28 lg:py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `all 0.7s ${SPRING}`,
          }}
        >
          <span className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-semibold text-teal-600 tracking-[0.15em] uppercase mb-4 sm:mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Complete Platform
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.035em] text-gray-900 mb-4 sm:mb-6 leading-[1.1]">
            Everything in One Place
          </h2>
          <p className="text-[15px] sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Powerful tools designed for modern hospitality. See your operations at a glance.
          </p>
        </div>

        {/* ── Product Previews ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-14 sm:mb-20">
          {/* Calendar Preview */}
          <div
            className="group rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.8s ${SPRING} 0.1s`,
            }}
          >
            <div className="bg-gradient-to-r from-[#1a365d] to-[#0f766e] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg">🏠</span>
                </div>
                <div className="text-white">
                  <div className="font-semibold text-sm sm:text-base">Apartment Calendar</div>
                  <div className="text-xs text-white/60">December 2024</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
              </div>
            </div>
            <div className="p-3 sm:p-5">
              <div className="flex mb-3">
                <div className="w-16 sm:w-24 flex-shrink-0" />
                <div className="flex-1 grid grid-cols-7 gap-0.5 text-center">
                  {["Fri","Sat","Sun","Mon","Tue","Wed","Thu"].map((d, i) => {
                    const day = 20 + i;
                    const isToday = day === 23;
                    return (
                      <div key={d} className={`text-[10px] sm:text-xs font-medium py-1 ${isToday ? "text-teal-600" : "text-gray-400"}`}>
                        <div>{d}</div>
                        <div className={isToday ? "bg-teal-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-0.5 text-[11px] font-bold shadow-md" : "mt-0.5"}>
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                {([
                  ["Apt 1A", "John S.", 0, 3, "from-green-500 to-green-600", "green"],
                  ["Apt 1B", "Emma W.", 2, 4, "from-teal-500 to-teal-600", "teal"],
                  ["Apt 2A", "Marco R.", 1, 2, "from-red-500 to-red-600", "red"],
                  ["Apt 2B", "Lisa M.", 0, 5, "from-gray-400 to-gray-500", "gray"],
                  ["Studio 3", "Sophie K.", 3, 3, "from-teal-500 to-teal-600", "teal"],
                ] as const).map(([unit, guest, start, duration, gradient], idx) => {
                  const widthPct = ((duration - 0.1) / 7) * 100;
                  const leftPct = ((start + 0.55) / 7) * 100;
                  return (
                    <div
                      key={unit}
                      className="flex items-center"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateX(0)" : "translateX(-20px)",
                        transition: `all 0.5s ${SPRING} ${0.3 + idx * 0.08}s`,
                      }}
                    >
                      <div className="w-16 sm:w-24 flex-shrink-0 text-[10px] sm:text-xs font-medium text-gray-700 truncate pr-2">{unit}</div>
                      <div className="flex-1 grid grid-cols-7 gap-0.5 h-9 relative">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="bg-gray-50 rounded-sm border border-gray-100/80" />
                        ))}
                        {duration > 0 && (
                          <div
                            className={`absolute top-1 bottom-1 rounded-full flex items-center pl-2.5 pr-2 text-xs font-medium text-white shadow-md bg-gradient-to-r ${gradient}`}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          >
                            <span className="truncate">{guest}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {([["bg-green-500","Checked-in"],["bg-teal-500","Confirmed"],["bg-gray-400","Checked-out"],["bg-red-500","No-show"]] as const).map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full ${c} shadow-sm`} />
                    <span className="text-gray-500">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div
            className="group rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.8s ${SPRING} 0.2s`,
            }}
          >
            <div className="bg-[#1a365d] px-4 sm:px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-[#0f766e] shadow-inner" />
                <span className="text-white font-semibold text-sm">Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-white/60 text-xs">Live</span>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Today", "4", "Check-ins", "bg-teal-50 border-teal-100", "text-teal-600", "text-teal-700"],
                  ["Pending", "2", "Payments", "bg-amber-50 border-amber-100", "text-amber-600", "text-amber-700"],
                  ["Revenue", `€${visible ? "2.4k" : "0"}`, "This week", "bg-emerald-50 border-emerald-100", "text-emerald-600", "text-emerald-700"],
                ].map(([label, val, sub, bg, labelColor, valColor]) => (
                  <div key={label} className={`${bg} border rounded-xl p-3`}>
                    <div className={`text-[11px] ${labelColor} font-medium`}>{label}</div>
                    <div className={`text-xl font-bold ${valColor} tabular-nums`}>{val}</div>
                    <div className="text-[10px] text-gray-400">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Today&apos;s Tasks</div>
                <div className="space-y-2">
                  {[
                    ["Check-in: John Smith","14:00","bg-blue-500","Apt 2B"],
                    ["Check-out: Maria Garcia","11:00","bg-emerald-500","Apt 1A"],
                    ["Cleaning: Unit 3C","12:30","bg-amber-500",""],
                  ].map(([task, time, dot, unit]) => (
                    <div key={task} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors border border-gray-100/50">
                      <div className={`w-2 h-2 rounded-full ${dot} shadow-sm flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{task}</div>
                        {unit && <div className="text-[10px] text-gray-400">{unit}</div>}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occupancy bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500 font-medium">Occupancy</span>
                  <span className="text-xs font-bold text-gray-900 tabular-nums">{occupancy}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-[2000ms] ease-out"
                    style={{ width: visible ? "78%" : "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-14 sm:mb-20">
          <PremiumFeatureCard
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            gradientFrom="from-blue-500 via-blue-600 to-indigo-600"
            stat="98%" statLabel="SATISFACTION" title="Guest Experience"
            items={[["Online guest registration",""],["Digital check-in/check-out","Fast"],["Automated communications","AI"],["Review management","Smart"]]}
            visible={visible} delay={0.3}
          />
          <PremiumFeatureCard
            iconPath="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
            gradientFrom="from-teal-500 via-teal-600 to-cyan-600"
            stat="24/7" statLabel="MONITORING" title="Operations"
            items={[["Visual booking calendar","Live"],["Housekeeping management",""],["Resource & inventory",""],["Maintenance tracking","Auto"]]}
            visible={visible} delay={0.4}
          />
          <PremiumFeatureCard
            iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            gradientFrom="from-green-500 via-emerald-600 to-teal-600"
            stat="+23%" statLabel="AVG. GROWTH" title="Revenue"
            items={[["AI dynamic pricing","AI"],["Professional invoices",""],["Payment processing","Secure"],["Financial reports","Real-time"]]}
            visible={visible} delay={0.5}
          />
          <PremiumFeatureCard
            iconPath="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            gradientFrom="from-purple-500 via-purple-600 to-pink-600"
            stat="&#8734;" statLabel="TEAM MEMBERS" title="Team & Business"
            items={[["Staff management",""],["Salary & payroll","Auto"],["Role-based access","Secure"],["Shareholder portal","Pro"]]}
            visible={visible} delay={0.6}
          />
        </div>

        {/* ── Also Included ── */}
        <div
          className="border-t border-gray-200/60 pt-10 sm:pt-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.7s ${SPRING} 0.6s`,
          }}
        >
          <p className="text-center text-gray-400 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-6 sm:mb-8">
            Also Included
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              { 
                label: "Website Included", 
                desc: "SEO-optimized booking engine",
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
              },
              { 
                label: "Channel Manager", 
                desc: "Sync Airbnb, Booking.com & more",
                icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              },
              { 
                label: "Multi-property", 
                desc: "Manage 1 to 100+ units easily",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              },
              { 
                label: "Unified Inbox", 
                desc: "All messages in one place",
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              },
              { 
                label: "Custom Reports", 
                desc: "Track revenue & occupancy",
                icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              },
              { 
                label: "API Access", 
                desc: "Connect your favorite tools",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
              },
              { 
                label: "Mobile App", 
                desc: "Manage from anywhere",
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
              },
              { 
                label: "5-min Setup", 
                desc: "Get started instantly",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
