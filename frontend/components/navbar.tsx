"use client";

/**
 * Navbar — iOS-Inspired Premium Navigation
 *
 * Design Language:
 *  ✦ iOS vibrancy: frosted glass with saturate + backdrop-blur
 *  ✦ Spring-like animations using cubic-bezier mimicking iOS easing
 *  ✦ Pill-style active section indicator with smooth sliding
 *  ✦ SF-style system font stack
 *  ✦ Refined micro-interactions with scale transforms
 *  ✦ Bottom-sheet mobile menu (iOS modal style)
 *  ✦ Haptic-feel button press states
 *  ✦ Active section highlighting via IntersectionObserver
 *  ✦ Scroll progress bar (gradient)
 *  ✦ Language selector with flags, keyboard navigation, z-index:99999
 *  ✦ Auth-aware: Dashboard (role-based) or Sign In / Get Started
 *  ✦ Security: open-redirect guard, escape-closes-all
 *  ✦ Full WCAG 2.1 AA keyboard accessibility
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { LANGUAGE_OPTIONS, type Language } from "@/lib/i18n";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { href: "#platform", label: "Platform", id: "platform" },
  { href: "#ai-features", label: "AI Features", id: "ai-features" },
  { href: "#solutions", label: "Solutions", id: "solutions" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
] as const;

const SAFE_DASHBOARD_PATHS = ["/admin/dashboard", "/host/dashboard"] as const;

// iOS spring easing
const SPRING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const SPRING_BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// ─── NavItem ─────────────────────────────────────────────────────────────────

function NavItem({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <li className="list-none">
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "relative px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] rounded-full transition-all duration-300 inline-flex items-center",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1",
          "active:scale-[0.97]",
          "active:scale-[0.97]",
          isActive
            ? "text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
        )}
        style={{ transitionTimingFunction: SPRING }}
        aria-current={isActive ? "true" : undefined}
      >
        {/* Active pill background */}
        {isActive && (
          <span
            className="absolute inset-0 rounded-full bg-gray-900 shadow-sm"
            style={{
              animation: "pillSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </a>
    </li>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-[15px] h-[15px]", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
    </svg>
  );
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180", className)}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
      style={{ transitionTimingFunction: SPRING_BOUNCE }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Language Selector (z-index: 99999) ──────────────────────────────────────

function LanguageSelector({
  language,
  setLanguage,
  langOpen,
  setLangOpen,
  langRef,
}: {
  language: string;
  setLanguage: (code: Language) => void;
  langOpen: boolean;
  setLangOpen: (open: boolean | ((v: boolean) => boolean)) => void;
  langRef: React.RefObject<HTMLDivElement | null>;
}) {
  const activeOption = LANGUAGE_OPTIONS.find((o) => o.code === language);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (!langOpen) setFocusedIndex(-1);
  }, [langOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!langOpen && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
        e.preventDefault();
        setLangOpen(true);
        setFocusedIndex(0);
        return;
      }
      if (!langOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < LANGUAGE_OPTIONS.length - 1 ? prev + 1 : 0;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : LANGUAGE_OPTIONS.length - 1;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        case "Escape":
          e.preventDefault();
          setLangOpen(false);
          break;
        case "Tab":
          setLangOpen(false);
          break;
      }
    },
    [langOpen, setLangOpen]
  );

  return (
    <div className="relative" ref={langRef} onKeyDown={handleKeyDown} style={{ zIndex: 99999 }}>
      <button
        onClick={() => setLangOpen((v: boolean) => !v)}
        aria-label="Select Language"
        aria-expanded={langOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1",
          "active:scale-[0.96]",
          langOpen
            ? "text-blue-600 bg-blue-50/80"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/60"
        )}
        style={{ transitionTimingFunction: SPRING }}
      >

        <span className="hidden sm:inline text-sm">{activeOption?.flag}</span>
        <span>{language.toUpperCase()}</span>
        <ChevronIcon open={langOpen} />
      </button>

      {/* Dropdown — z-index: 99999 */}
      <div
        role="listbox"
        aria-label="Language options"
        className={cn(
          "absolute right-0 top-full mt-2 w-40 rounded-2xl border overflow-hidden transition-all duration-250",
          "bg-white/95 backdrop-blur-2xl backdrop-saturate-[1.8]",
          "border-gray-200/50 shadow-[0_8px_40px_rgba(0,0,0,0.12),0_0_1px_rgba(0,0,0,0.05)]",
          langOpen
            ? "opacity-100 translate-y-0 visible scale-100"
            : "opacity-0 -translate-y-1 invisible scale-[0.96]"
        )}
        style={{
          zIndex: 99999,
          transitionTimingFunction: SPRING_BOUNCE,
        }}
      >
        <div className="p-1.5">
          {LANGUAGE_OPTIONS.map(({ code, label, flag }, index) => (
            <button
              key={code}
              ref={(el) => { optionRefs.current[index] = el; }}
              role="option"
              aria-selected={language === code}
              onClick={() => {
                setLanguage(code as Language);
                setLangOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/50",
                "active:scale-[0.98]",
                language === code
                  ? "bg-blue-50/80 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50/80"
              )}
              style={{ transitionTimingFunction: SPRING }}
            >
              <span className="text-lg leading-none" aria-hidden="true">{flag}</span>
              <span className="flex-1 text-left">{label}</span>
              {language === code && (
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Auth Buttons ────────────────────────────────────────────────────────────

function AuthButtons({
  isLoggedIn,
  dashboardHref,
  variant,
  onNavigate,
}: {
  isLoggedIn: boolean;
  dashboardHref: string;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const btnBase = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1";

  if (variant === "desktop") {
    return (
      <div className="hidden lg:flex items-center gap-1.5">
        {isLoggedIn ? (
          <Link
            href={dashboardHref}
            onClick={onNavigate}
            className={cn(
              "relative group overflow-hidden bg-gray-900 text-white px-5 py-2 rounded-full text-[13px] font-semibold tracking-[-0.01em]",
              "shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
              "hover:bg-gray-800 active:scale-[0.97] active:bg-gray-950",
              "transition-all duration-200",
              btnBase
            )}
            style={{ transitionTimingFunction: SPRING }}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Dashboard
              <ArrowIcon />
            </span>
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className={cn(
                "px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100/60 active:scale-[0.97]",
                "transition-all duration-200",
                btnBase
              )}
              style={{ transitionTimingFunction: SPRING }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                "relative group overflow-hidden bg-gray-900 text-white px-5 py-2 rounded-full text-[13px] font-semibold tracking-[-0.01em]",
                "shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
                "hover:bg-gray-800 active:scale-[0.97] active:bg-gray-950",
                "transition-all duration-200",
                btnBase
              )}
              style={{ transitionTimingFunction: SPRING }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Get Started
                <ArrowIcon />
              </span>
            </Link>
          </>
        )}
      </div>
    );
  }

  // Mobile variant — full-width iOS-style buttons
  return (
    <div className="space-y-2 px-1">
      {isLoggedIn ? (
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className={cn(
            "flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-[14px] rounded-2xl text-[15px] font-semibold",
            "shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "active:scale-[0.98] active:bg-gray-950 transition-all duration-200",
            btnBase
          )}
          style={{ transitionTimingFunction: SPRING }}
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            href="/login"
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-center py-[14px] text-[15px] font-medium text-gray-700 hover:text-gray-900 rounded-2xl",
              "hover:bg-gray-50 active:scale-[0.98] transition-all duration-200",
              btnBase
            )}
            style={{ transitionTimingFunction: SPRING }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-[14px] rounded-2xl text-[15px] font-semibold",
              "shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]",
              "active:scale-[0.98] active:bg-gray-950 transition-all duration-200",
              btnBase
            )}
            style={{ transitionTimingFunction: SPRING }}
          >
            Get Started
            <ArrowIcon />
          </Link>
        </>
      )}
    </div>
  );
}

// ─── Mobile Bottom Sheet ─────────────────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  activeSection,
  isLoggedIn,
  dashboardHref,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  isLoggedIn: boolean;
  dashboardHref: string;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] lg:hidden transition-all duration-300",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      {/* Backdrop — iOS style blur */}
      <div
        className={cn(
          "absolute inset-0 bg-black/25 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* iOS-style bottom sheet card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-2xl backdrop-saturate-[1.8] rounded-t-[20px] overflow-hidden transform transition-all duration-400",
          "shadow-[0_-8px_40px_rgba(0,0,0,0.1)]",
          "safe-area-bottom",
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        )}
        style={{ transitionTimingFunction: SPRING }}
      >
        {/* iOS drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[5px] bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Nav links */}
          <nav aria-label="Main navigation">
            <ul className="space-y-0.5">
              {NAV_SECTIONS.map(({ href, label, id }, index) => (
                <li
                  key={href}
                  style={{
                    animationDelay: isOpen ? `${index * 40 + 50}ms` : "0ms",
                  }}
                  className={cn(isOpen && "animate-[sheetSlideUp_0.35s_ease-out_forwards]")}
                >
                  <a
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-[14px] text-[17px] font-medium rounded-2xl transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      "active:scale-[0.98] active:bg-gray-100",
                      activeSection === id
                        ? "text-blue-600 bg-blue-50/60"
                        : "text-gray-900"
                    )}
                    style={{ transitionTimingFunction: SPRING }}
                    aria-current={activeSection === id ? "true" : undefined}
                  >
                    {activeSection === id && (
                      <span className="w-[6px] h-[6px] bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Separator — iOS hairline */}
          <div className="my-4 h-px bg-gray-200/80 mx-2" />

          {/* Auth buttons */}
          <AuthButtons
            isLoggedIn={isLoggedIn}
            dashboardHref={dashboardHref}
            variant="mobile"
            onNavigate={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────

function ScrollProgressBar({ progress }: { progress: number }) {
  if (progress <= 0) return null;
  return (
    <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gray-100/40 rounded-full overflow-hidden" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-[width] duration-100 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);

  // --- auth (secure routing) ---
  const { user, isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated && !!user;

  const dashboardHref = useMemo(() => {
    if (!user) return "/login";
    if (user.is_platform_admin) return SAFE_DASHBOARD_PATHS[0];
    if (user.active_organization) return SAFE_DASHBOARD_PATHS[1];
    return "/login";
  }, [user]);

  // --- mount animation ---
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- scroll listener ---
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(currentY > 20);
      setScrollProgress(docHeight > 0 ? (currentY / docHeight) * 100 : 0);

      if (currentY > lastScrollY.current && currentY > 100) {
        setIsVisible(false);
        setLangOpen(false);
      } else {
        setIsVisible(true);
      }
      
      // Clear active section at the very top
      if (currentY < 100) {
        setActiveSection("");
      }

      // Determine active section via scroll position
      let currentActive = "";
      if (currentY >= 100) {
        for (const { id } of NAV_SECTIONS) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Active if top is near viewport/header or within view
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentActive = id;
            }
          }
        }
      }
      setActiveSection(currentActive);

      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- click outside to close lang ---
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // --- global escape ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // --- lock body scroll ---
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ═══ Main Nav ═══ */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[9998] transition-all duration-500 transform",
          isVisible ? "translate-y-0" : "-translate-y-full",
          mounted ? "opacity-100" : "opacity-0"
        )}
        role="navigation"
        aria-label="Main navigation"
        style={{ transitionTimingFunction: SPRING }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-2.5 sm:pt-3">
          <div
            className={cn(
              "relative flex items-center justify-between transition-all duration-500 rounded-[18px] border",
              // iOS vibrancy: strong blur + saturation
              "bg-white/70 backdrop-blur-2xl backdrop-saturate-[1.8]",
              scrolled
                ? "px-4 sm:px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)] border-gray-200/50"
                : "px-4 sm:px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.04)] border-gray-200/40"
            )}
            style={{ transitionTimingFunction: SPRING }}
          >
            {/* ── Logo ── */}
            <Link
              href="/"
              className={cn(
                "flex items-center group flex-shrink-0 min-w-0 rounded-xl",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1",
                "active:scale-[0.97] transition-transform duration-200"
              )}
              aria-label="UnitoPMS Home"
              style={{ transitionTimingFunction: SPRING }}
            >
              <img
                src="/assets/logo.png"
                alt="UnitoPMS"
                className={cn(
                  "w-auto transition-all duration-300",
                  scrolled ? "h-7" : "h-8 sm:h-9"
                )}
                style={{ transitionTimingFunction: SPRING }}
              />
            </Link>

            {/* ── Desktop Nav — pill-style segmented control ── */}
            <ul className="hidden lg:flex items-center gap-0.5 bg-gray-100/60 rounded-full p-1" role="menubar">
              {NAV_SECTIONS.map(({ href, label, id }) => (
                <NavItem
                  key={href}
                  href={href}
                  label={label}
                  isActive={activeSection === id}
                />
              ))}
            </ul>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-3">
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
                langOpen={langOpen}
                setLangOpen={setLangOpen}
                langRef={langRef}
              />

              <AuthButtons
                isLoggedIn={isLoggedIn}
                dashboardHref={dashboardHref}
                variant="desktop"
              />

              {/* Mobile Hamburger — iOS style */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className={cn(
                  "lg:hidden relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-1",
                  "active:scale-[0.92]",
                  mobileOpen
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-100/60 text-gray-600"
                )}
                style={{ transitionTimingFunction: SPRING_BOUNCE }}
              >
                <div className="w-[18px] h-[14px] relative flex flex-col justify-between">
                  <span
                    className={cn(
                      "w-full h-[2px] rounded-full transform transition-all duration-300 origin-center",
                      mobileOpen ? "rotate-45 translate-y-[6px] bg-gray-900" : "bg-gray-600"
                    )}
                    style={{ transitionTimingFunction: SPRING_BOUNCE }}
                  />
                  <span
                    className={cn(
                      "w-full h-[2px] rounded-full transition-all duration-200",
                      mobileOpen ? "opacity-0 scale-x-0 bg-gray-900" : "bg-gray-600"
                    )}
                    style={{ transitionTimingFunction: SPRING }}
                  />
                  <span
                    className={cn(
                      "w-full h-[2px] rounded-full transform transition-all duration-300 origin-center",
                      mobileOpen ? "-rotate-45 -translate-y-[6px] bg-gray-900" : "bg-gray-600"
                    )}
                    style={{ transitionTimingFunction: SPRING_BOUNCE }}
                  />
                </div>
              </button>
            </div>

            {/* ── Progress Bar ── */}
            <ScrollProgressBar progress={scrollProgress} />
          </div>
        </div>
      </nav>

      {/* ═══ Mobile Bottom Sheet ═══ */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobile}
        activeSection={activeSection}
        isLoggedIn={isLoggedIn}
        dashboardHref={dashboardHref}
      />
    </>
  );
}
