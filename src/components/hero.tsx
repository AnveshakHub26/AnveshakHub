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
    <section className="relative overflow-hidden bg-[#FBF7F0] text-[#57534E] pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-[#E2DCD2] font-sans">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2DCD2_1px,transparent_1px),linear-gradient(to_bottom,#E2DCD2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Ember Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5A36]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Left-aligned Oversized Headline & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Specific Copy Badges (Rule #5) */}
            <div className="inline-flex items-center gap-2.5 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE9DF] px-3.5 py-1 text-xs font-semibold text-[#211F1D] border border-[#E2DCD2]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF5A36]" />
                1,200+ Verified R&D Projects Posted
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0ED] px-3.5 py-1 text-xs font-semibold text-[#FF5A36] border border-[#FF5A36]/30">
                <Cpu className="h-3.5 w-3.5 text-[#FF5A36]" />
                Enterprise Edition
              </span>
            </div>

            {/* Oversized Left-Aligned Headline */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[#211F1D] sm:text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.1] text-left">
              Direct R&D Match Between{" "}
              <span className="text-[#FF5A36]">
                Industry & Academia
              </span>
            </h1>

            {/* Subheading: Specific Data Copy (Rule #5) */}
            <p className="mt-6 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl text-left">
              1,200+ active R&D internships and funded projects this month. No spam, no fake listings — direct applications to verified corporate leads.
            </p>

            {/* Action Buttons: Spring Easing & Active Scale-95 */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-start">
              <button
                onClick={handleScrollToHowItWorks}
                className="btn-primary text-sm font-bold shadow-lg shadow-[#FF5A36]/20 cursor-pointer min-h-[44px]"
              >
                Explore Ecosystem
                <ArrowDown className="h-4.5 w-4.5 animate-bounce" />
              </button>
              <button
                onClick={onScheduleConsultation}
                className="btn-secondary text-sm font-bold text-[#211F1D] min-h-[44px]"
              >
                <Calendar className="h-4.5 w-4.5 text-[#FF5A36]" />
                Schedule Consultation
              </button>
            </div>
            
            {/* Specific Metrics (Rule #5) */}
            <div className="mt-10 pt-8 border-t border-[#E2DCD2] grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#211F1D]">1,200+</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Projects Active</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#211F1D]">5-7 Days</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Average Response</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-extrabold text-[#2F6B4F]">100%</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Verified Partners</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Role Cards with Secondary Cream Surface (#EFE9DF) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Industry Card */}
            <div className="card-warm p-5 bg-[#EFE9DF] rounded-xl border border-[#E2DCD2] flex items-center gap-4">
              <div className="p-3 bg-[#FFF0ED] text-[#FF5A36] rounded-lg shrink-0 border border-[#FF5A36]/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#211F1D]">Industry Partners</h3>
                <p className="text-xs text-[#57534E] mt-0.5">Sponsor research problem statements & hire top academic scholars.</p>
              </div>
            </div>

            {/* Expert Card */}
            <div className="card-warm p-5 bg-[#EFE9DF] rounded-xl border border-[#E2DCD2] flex items-center gap-4">
              <div className="p-3 bg-[#FFF0ED] text-[#FF5A36] rounded-lg shrink-0 border border-[#FF5A36]/20">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#211F1D]">Domain Experts</h3>
                <p className="text-xs text-[#57534E] mt-0.5">Consult on funded corporate R&D projects with academic autonomy.</p>
              </div>
            </div>

            {/* Student Card */}
            <div className="card-warm p-5 bg-[#EFE9DF] rounded-xl border border-[#E2DCD2] flex items-center gap-4">
              <div className="p-3 bg-[#E8F2EC] text-[#2F6B4F] rounded-lg shrink-0 border border-[#2F6B4F]/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#211F1D]">Student Researchers</h3>
                <p className="text-xs text-[#57534E] mt-0.5">Apply for paid industry internships and research milestones.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
