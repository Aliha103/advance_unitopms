"use client";

import { useTranslations } from "@/contexts/language-context";
import { useEffect, useRef, useState } from "react";

const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ── Star rating ── */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Testimonial card ── */
function TestimonialCard({
  highlight,
  quote,
  author,
  role,
  location,
  propertyType,
  initials,
  accentColor,
  visible,
  delay,
}: {
  highlight: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  propertyType: string;
  initials: string;
  accentColor: string;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s ${SPRING} ${delay}s`,
      }}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100/80 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col">
        {/* Top accent gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        />

        {/* Background decorative quote mark */}
        <div className="absolute -top-4 -right-2 text-[120px] leading-none font-serif text-gray-50 select-none pointer-events-none group-hover:text-gray-100/80 transition-colors duration-500">
          &ldquo;
        </div>

        {/* Result badge + stars */}
        <div className="relative flex items-center justify-between mb-5">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border"
            style={{
              color: accentColor,
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}08`,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {highlight}
          </div>
          <Stars />
        </div>

        {/* Quote */}
        <blockquote className="relative text-gray-700 text-[15px] sm:text-base leading-relaxed mb-6 sm:mb-8 flex-1">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="relative flex items-center gap-4 pt-5 border-t border-gray-100">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 ring-2 ring-offset-2"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
              ringColor: `${accentColor}40`,
            }}
          >
            {initials}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-[15px]">{author}</div>
            <div className="text-sm text-gray-500">{role}</div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location} &bull; {propertyType}
            </div>
          </div>
        </div>

        {/* Bottom glow on hover */}
        <div
          className="absolute -bottom-1 left-0 right-0 h-16 rounded-b-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
          style={{ background: accentColor }}
        />
      </div>
    </div>
  );
}

/* ── Trust signal ticker ── */
const TRUST_ITEMS = [
  { label: "GDPR Compliant", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { label: "256-bit SSL Encryption", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { label: "Cloud-Based Platform", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "No Hidden Fees", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "99.9% Uptime SLA", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "SOC 2 Type II", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

function TrustMarquee() {
  const doubled = [...TRUST_ITEMS, ...TRUST_ITEMS]; // duplicate for seamless loop
  return (
    <div className="relative overflow-hidden py-6">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="flex animate-marquee gap-8 sm:gap-12 w-max">
        {doubled.map((t, i) => (
          <div key={`${t.label}-${i}`} className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-100 px-4 py-2.5 rounded-xl whitespace-nowrap hover:bg-gray-100 transition-colors">
            <svg className="w-4.5 h-4.5 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            <span className="text-sm font-medium text-gray-600">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main section ── */
export function TestimonialsSection() {
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
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Soft ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-teal-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            {t.testimonials_subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.035em] text-gray-900 mb-4 sm:mb-6 leading-[1.1]">
            {t.testimonials_title}
          </h2>
          <p className="text-[15px] sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            {t.testimonials_description}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 mb-14 sm:mb-20">
          <TestimonialCard
            highlight="40% time saved"
            quote="We reduced our booking management time by 40%. The AI-powered insights helped us optimize pricing strategies we never knew existed."
            author="Marco Bianchi"
            role="Owner, Hotel Bella Vista"
            location="Florence, Italy"
            propertyType="12-room Boutique Hotel"
            initials="MB"
            accentColor="#14b8a6"
            visible={visible}
            delay={0.1}
          />
          <TestimonialCard
            highlight="7-minute setup"
            quote="Setup took exactly 7 minutes. Within a week, we had complete visibility over all our properties. The dashboard is incredibly intuitive."
            author="Anna M&uuml;ller"
            role="Property Portfolio Manager"
            location="Vienna, Austria"
            propertyType="8 Vacation Rentals"
            initials="AM"
            accentColor="#3b82f6"
            visible={visible}
            delay={0.2}
          />
          <TestimonialCard
            highlight="18% occupancy increase"
            quote="The AI pricing recommendations helped us increase occupancy during slow months. It's like having a revenue manager on staff 24/7."
            author="Carlos Mendez"
            role="Operations Director"
            location="Lisbon, Portugal"
            propertyType="Aparthotel (24 units)"
            initials="CM"
            accentColor="#8b5cf6"
            visible={visible}
            delay={0.3}
          />
        </div>

        {/* Trust signals marquee */}
        <div
          className="border-t border-gray-100 pt-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: `opacity 0.8s ${SPRING} 0.5s`,
          }}
        >
          <TrustMarquee />
        </div>
      </div>

      {/* Marquee animation keyframes */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
