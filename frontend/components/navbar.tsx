"use client";

/**
 * Navbar Component
 * Main navigation bar for the public website.
 *
 * Ported from Leptos/Rust — preserves all visual behavior:
 * - Scroll-aware: shrinks on scroll, hides on scroll-down, shows on scroll-up
 * - Glassmorphism container with rounded corners and dynamic shadow
 * - Animated hamburger → X toggle for mobile
 * - Language selector dropdown with click-outside-to-close
 * - Auth-aware: shows Dashboard if logged in, Sign In / Get Started if not
 * - Gradient CTA buttons with hover shine effects
 * - NavItem underline + gradient background hover animations
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { LANGUAGE_OPTIONS } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// NavItem — individual navigation link with hover effects
// ---------------------------------------------------------------------------
function NavItem({
  href,
  label,
  delay = 0,
  onClick,
}: {
  href: string;
  label: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="relative px-4 xl:px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="relative z-10">{label}</span>
      {/* Underline animation */}
      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full group-hover:w-1/2 transition-all duration-300 ease-out" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);

  // --- auth ---
  const { user, isAuthenticated } = useAuthStore();
  const isLoggedIn = isAuthenticated && !!user;

  const dashboardHref = (() => {
    if (!user) return "/login";
    if (user.is_platform_admin) return "/admin/dashboard";
    if (user.active_organization) return "/host/dashboard";
    return "/login";
  })();

  // --- scroll listener: shrink + smart hide/show ---
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 20);

      // Hide on scroll-down past 100px, show on scroll-up or at top
      if (currentY > lastScrollY.current && currentY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- click outside to close language dropdown ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- close mobile menu on route-style nav ---
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // --- lock body scroll when mobile menu is open ---
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ================================================================= */}
      {/* Main Navigation */}
      {/* ================================================================= */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform padding-safe-top",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
        style={{ paddingLeft: "var(--safe-left)", paddingRight: "var(--safe-right)" }}
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div
            className={cn(
              "flex items-center justify-between gap-2 min-w-0 transition-all duration-500 ease-out bg-white/80 backdrop-blur-md rounded-2xl border",
              scrolled
                ? "px-3 sm:px-6 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] border-gray-200/60"
                : "px-3 sm:px-6 py-3 sm:py-4 shadow-[0_12px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] border-gray-100/50"
            )}
          >
            {/* ---- Logo ---- */}
            <Link href="/" className="flex items-center group flex-shrink-0 min-w-0">
              <img
                src="/assets/logo.png"
                alt="UnitoPMS"
                className={cn(
                  "w-auto max-h-10 transition-all duration-300 group-hover:scale-[1.02]",
                  scrolled ? "h-7 sm:h-8" : "h-8 sm:h-9 lg:h-10"
                )}
              />
            </Link>

            {/* ---- Desktop Nav Items ---- */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem href="#platform" label={t.nav_platform} delay={0} />
              <NavItem href="#ai-features" label={t.nav_ai_features} delay={50} />
              <NavItem href="#solutions" label={t.nav_solutions} delay={100} />
              <NavItem href="#pricing" label={t.nav_pricing} delay={150} />
            </div>

            {/* ---- Right Actions Group ---- */}
            <div className="flex items-center gap-2 lg:gap-6">
              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  aria-label="Select Language"
                  aria-expanded={langOpen}
                  className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50/80 transition-all duration-300 lg:min-h-0 lg:min-w-0"
                >
                  <span className="lg:inline">{language}</span>
                  <svg
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      langOpen && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className={cn(
                    "absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200",
                    langOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible"
                  )}
                >
                  {LANGUAGE_OPTIONS.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200",
                        language === code
                          ? "bg-violet-50 text-violet-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                {isLoggedIn ? (
                  <Link href={dashboardHref} className="cta-button group">
                    <span className="relative z-10 flex items-center gap-2">
                      {t.nav_dashboard}
                      <ArrowIcon />
                    </span>
                    <CTAShine />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 lg:px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50/80 transition-all duration-300"
                    >
                      {t.nav_sign_in}
                    </Link>
                    <Link href="/register" className="cta-button group">
                      <span className="relative z-10 flex items-center gap-2">
                        {t.nav_get_started}
                        <ArrowIcon />
                      </span>
                      <CTAShine />
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Hamburger - 44px min touch target */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle Mobile Menu"
                aria-expanded={mobileOpen}
                className="lg:hidden touch-target min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl hover:bg-gray-100/80 active:bg-gray-200/80 transition-all duration-200"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={cn(
                      "w-full h-0.5 bg-gray-800 rounded-full transform transition-all duration-300 ease-out origin-center",
                      mobileOpen && "rotate-45 translate-y-[7px]"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-0.5 bg-gray-800 rounded-full transition-all duration-200",
                      mobileOpen && "opacity-0 scale-x-0"
                    )}
                  />
                  <span
                    className={cn(
                      "w-full h-0.5 bg-gray-800 rounded-full transform transition-all duration-300 ease-out origin-center",
                      mobileOpen && "-rotate-45 -translate-y-[7px]"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* Mobile Menu Overlay */}
      {/* ================================================================= */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeMobile}
        />

        {/* Menu Panel - below navbar, scrollable on short viewports */}
        <div
          className={cn(
            "absolute left-3 right-3 xs:left-4 xs:right-4 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden transform transition-all duration-300 ease-out",
            "max-h-[calc(100dvh-var(--navbar-height)-2rem)] overflow-y-auto overscroll-contain",
            mobileOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-[0.98]"
          )}
          style={{ top: "calc(var(--navbar-height) + 0.5rem)" }}
        >
          <div className="p-3 xs:p-4">
            {/* Nav Links - 44px min touch target */}
            <div className="space-y-0.5">
              {[
                ["#platform", t.nav_platform],
                ["#ai-features", t.nav_ai_features],
                ["#solutions", t.nav_solutions],
                ["#pricing", t.nav_pricing],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="flex items-center min-h-[44px] px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 touch-manipulation"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="my-3 border-t border-gray-100" />

            {/* CTA - 44px min touch target */}
            <div className="space-y-2">
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  onClick={closeMobile}
                  className="flex items-center justify-center min-h-[44px] w-full bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-500 text-white px-4 py-3.5 rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(109,40,217,0.35)] active:scale-[0.98] transition-all duration-200 touch-manipulation"
                >
                  {t.nav_dashboard}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center min-h-[44px] px-4 py-3.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 touch-manipulation"
                  >
                    {t.nav_sign_in}
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="flex items-center justify-center min-h-[44px] w-full bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-500 text-white px-4 py-3.5 rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(109,40,217,0.35)] active:scale-[0.98] transition-all duration-200 touch-manipulation"
                  >
                    {t.nav_get_started}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

/** Arrow icon used inside CTA buttons */
function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
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
  );
}

/** Gradient shine overlays for CTA buttons */
function CTAShine() {
  return (
    <>
      {/* Hover gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Top highlight line */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {/* Bottom shadow line */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </>
  );
}
