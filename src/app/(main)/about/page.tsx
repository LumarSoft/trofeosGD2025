"use client";

import CtaSection from "./components/CtaSection";
import HeroSection from "./components/HeroSection";
import HistorySection from "./components/HistorySection";
import TestimonialsSection from "./components/TestimonialsSection";
import ValuesSection from "./components/ValuesSection";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen text-gold-light/90">
      <HeroSection />
      <HistorySection />
      <ValuesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
