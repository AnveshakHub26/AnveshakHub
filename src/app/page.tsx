"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import TrustedOrgs from "@/components/trusted-orgs";
import HowItWorks from "@/components/how-it-works";
import Features from "@/components/features";
import Ecosystem from "@/components/ecosystem";
import SuccessMetrics from "@/components/success-metrics";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import ContactModal from "@/components/contact-modal";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleScheduleConsultation = () => {
    setIsContactOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top sticky navigation */}
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onScheduleConsultation={handleScheduleConsultation} />

        {/* Trusted Organizations strip */}
        <TrustedOrgs />

        {/* How AnveshakHub Works stepper cards */}
        <HowItWorks />

        {/* Stakeholder Ecosystem diagram */}
        <Ecosystem />

        {/* Platform Features grid cards */}
        <Features />

        {/* Why Choose & Success Metrics animated counters */}
        <SuccessMetrics />

        {/* FAQ accordion & Testimonials placeholder */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
}
