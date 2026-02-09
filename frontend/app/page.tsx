"use client";

import { Navbar } from "@/components/navbar";
import {
  HeroSection,
  StatsSection,
  TestimonialsSection,
  ComparisonSection,
  FeaturesSection,
  CtaSection,
  Footer,
} from "@/components/landing";
import { LanguageProvider } from "@/contexts/language-context";

export default function LandingPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white overflow-x-hidden min-w-0 pb-safe">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <TestimonialsSection />
        <ComparisonSection />
        <FeaturesSection />
        <CtaSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
