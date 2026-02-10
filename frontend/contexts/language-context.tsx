"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Language } from "@/lib/i18n";

const translations = {
  en: {
    // Navbar
    nav_platform: "Platform",
    nav_ai_features: "AI Features",
    nav_solutions: "Solutions",
    nav_pricing: "Pricing",
    nav_dashboard: "Dashboard",
    nav_sign_in: "Sign In",
    nav_get_started: "Get Started",

    // Hero
    hero_badge: "New v2.0 Released",
    hero_title_1: "Property Management",
    hero_title_2: "Reimagined for Growth",
    hero_subtitle: "The all-in-one platform for modern property managers. Automate operations, boost revenue, and delight guests with our AI-powered PMS.",
    hero_cta_primary: "Get Started",
    hero_cta_secondary: "Watch Demo",
    hero_feature_1: "No credit card required",
    hero_feature_2: "14-day free trial",
    hero_feature_3: "Cancel anytime",

    // Stats
    stats_subtitle: "Why Professionals Choose Us",
    stats_title: "Great People Use UnitoPMS",
    stats_description: "Forward-thinking hoteliers and property managers trust UnitoPMS to transform their operations.",
    stats_time_label: "Less Time on Admin",
    stats_time_sub: "Average time saved on daily operations",
    stats_checkin_label: "Faster Check-ins",
    stats_checkin_sub: "Streamlined guest processing",
    stats_uptime_label: "Uptime Guarantee",
    stats_uptime_sub: "Enterprise-grade reliability",
    stats_support_label: "Human Support",
    stats_support_sub: "Real experts, not just bots",

    // Comparison
    comparison_badge: "The Old Way is Broken",
    comparison_title: "Stop Managing Properties the Hard Way",
    comparison_description: "Spreadsheets, manual processes, and scattered tools are costing you time and revenue. There's a better way.",

    // Testimonials
    testimonials_subtitle: "Trusted by Leaders",
    testimonials_title: "What Hoteliers Say",
    testimonials_description: "Join thousands of property managers who have transformed their business with UnitoPMS.",
  },
  // Placeholder for other languages - falling back to English for now
  es: {},
  fr: {},
  de: {},
};

// Fill missing translations with English
(Object.keys(translations) as Language[]).forEach((lang) => {
  if (lang !== "en") {
    translations[lang] = { ...translations.en, ...translations[lang] };
  }
});

type TranslationKeys = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Persist language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("unitopms-lang") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("unitopms-lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language] as TranslationKeys,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Deprecated hook for backward compatibility if needed, but updated to use new context
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}
