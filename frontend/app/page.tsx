"use client";

import { Navbar } from "@/components/navbar";
import {
  HeroSection,
  StatsSection,
  TestimonialsSection,
  ComparisonSection,
  FeaturesSection,
  PricingSection,
  MobileStickyCta,
  CtaSection,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden min-w-0 pb-safe">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <TestimonialsSection />
      <ComparisonSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
      <MobileStickyCta />
    </div>
  );
}
