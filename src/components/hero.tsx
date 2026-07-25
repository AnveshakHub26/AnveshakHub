"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar, ShieldCheck, Cpu, Building2, GraduationCap, UserCheck } from "lucide-react";

interface HeroProps {
  onScheduleConsultation: () => void;
}

export default function Hero({ onScheduleConsultation }: HeroProps) {
  const handleScrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0B0D10] text-[#FAF8F5] pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-[#1C1F23] font-sans">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C1F23_1px,transparent_1px),linear-gradient(to_bottom,#1C1F23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Deep Indigo Hero Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4338CA]/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Left-aligned Oversized Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Badges: Deep Indigo & Single Amber-Coral Accent */}
            <div className="inline-flex items-center gap-2.5 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4338CA]/15 px-3.5 py-1 text-xs font-semibold text-[#818CF8] border border-[#4338CA]/30">
                <ShieldCheck className="h-3.5 w-3.5 text-[#818CF8]" />
                Vetted R&D Ecosystem
              </span>
              {/* Single Accent Moment: Warm Amber-Coral */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A45]/15 px-3.5 py-1 text-xs font-semibold text-[#FF7A45] border border-[#FF7A45]/30">
                <Cpu className="h-3.5 w-3.5 text-[#FF7A45]" />
                Enterprise Edition
              </span>
            </div>

            {/* Oversized Left-Aligned Headline */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[#FAF8F5] sm:text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.1] text-left">
              Direct R&D Access Between{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#FF7A45]">
                Industry & Academia
              </span>
            </h1>

            {/* Subheading: Direct, Specific Human Copy */}
            <p className="mt-6 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl text-left">
              AnveshakHub connects corporate innovation teams with accredited university domain experts and student researchers under standardized IP & NDA governance.
            </p>

            {/* Action Buttons: Spring Easing & Active Scale-95 */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start">
              <button
                onClick={handleScrollToHowItWorks}
                className="btn-primary px-7 py-3.5 text-sm font-bold shadow-lg shadow-[#4338CA]/20 cursor-pointer"
              >
                Explore Ecosystem
                <ArrowDown className="h-4.5 w-4.5 animate-bounce" />
              </button>
              <button
                onClick={onScheduleConsultation}
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-[#D1D5DB] hover:text-white border border-[#3A3F45] hover:border-[#4338CA] bg-[#1C1F23] rounded-lg hover:bg-[#1C1F23]/80 transition-all duration-200 gap-2 cursor-pointer active:scale-95"
              >
                <Calendar className="h-4.5 w-4.5 text-[#818CF8]" />
                Schedule Consultation
              </button>
            </div>
            
            {/* Supporting metrics */}
            <div className="mt-12 pt-8 border-t border-[#1C1F23] grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#FAF8F5]">100%</p>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">IP & NDA Governed</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#FAF8F5]">24h</p>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">Match Review SLA</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#10B981]">Verified</p>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider mt-1">Supabase DB</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Role Cards with Spring Lift & Pure Neutral Borders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Industry Card */}
            <div className="card-interactive p-5 bg-[#1C1F23] rounded-xl border border-[#3A3F45] flex items-center gap-4">
              <div className="p-3 bg-[#4338CA]/15 text-[#818CF8] rounded-lg shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#FAF8F5]">Industry Partners</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Sponsor industry problem statements & recruit research talent.</p>
              </div>
            </div>

            {/* Expert Card */}
            <div className="card-interactive p-5 bg-[#1C1F23] rounded-xl border border-[#3A3F45] flex items-center gap-4">
              <div className="p-3 bg-[#FF7A45]/15 text-[#FF7A45] rounded-lg shrink-0">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#FAF8F5]">Domain Experts</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Consult on funded R&D proposals with academic autonomy.</p>
              </div>
            </div>

            {/* Student Card */}
            <div className="card-interactive p-5 bg-[#1C1F23] rounded-xl border border-[#3A3F45] flex items-center gap-4">
              <div className="p-3 bg-[#10B981]/15 text-[#10B981] rounded-lg shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#FAF8F5]">Student Researchers</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Apply for paid industry R&D internships and milestones.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
