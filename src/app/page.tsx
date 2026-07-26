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
    <div className="flex flex-col min-h-screen font-sans antialiased text-[#211F1D]" style={{ backgroundColor: "#FBF7F0" }}>
      {/* Top sticky navigation */}
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onScheduleConsultation={handleScheduleConsultation} />

        {/* Trusted Organizations strip */}
        <TrustedOrgs />

        {/* How AnveshakHub Governance Works */}
        <HowItWorks />

        {/* Stakeholder Ecosystem Topology */}
        <Ecosystem />

        {/* Platform Core Features */}
        <Features />

        {/* Metrics & Enterprise Security */}
        <SuccessMetrics />

        {/* Verified Feedback & FAQ */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
}
