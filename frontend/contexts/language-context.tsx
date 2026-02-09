"use client";

import React, { createContext, useContext, ReactNode } from "react";

const translations = {
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
  stats_subtitle: "Trusted by Professionals",
  stats_title: "Built for Scale",
  stats_description: "Join thousands of property managers who trust UnitoPMS to power their business.",
  stats_time_label: "Efficiency Boost",
  stats_time_sub: "Average time saved per booking",
  stats_checkin_label: "Revenue Growth",
  stats_checkin_sub: "Average increase in first year",
  stats_uptime_label: "Uptime",
  stats_uptime_sub: "Enterprise-grade reliability",
  stats_support_label: "Support",
  stats_support_sub: "Dedicated customer success team",

  // Comparison
  comparison_badge: "Why Switch?",
  comparison_title: "Modern vs Legacy",
  comparison_description: "See how UnitoPMS compares to traditional spreadsheet-based management.",

  // Testimonials
  testimonials_subtitle: "Success Stories",
  testimonials_title: "Loved by Hosts",
  testimonials_description: "Don't just take our word for it. Hear from property managers who have transformed their business.",
};

type Translations = typeof translations;

const LanguageContext = createContext<Translations>(translations);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={translations}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslations() {
  return useContext(LanguageContext);
}
