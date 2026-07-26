"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar, ShieldCheck, Cpu, ArrowRight, Sparkles, Building2, GraduationCap, UserCheck, Lock } from "lucide-react";
import Link from "next/link";

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
    <section className="relative overflow-hidden bg-[#FBF7F0] text-[#57534E] pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-[#E2DCD2] font-sans">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2DCD2_1px,transparent_1px),linear-gradient(to_bottom,#E2DCD2_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Dynamic Glowing Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF5A36]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Pill Badges */}
            <div className="inline-flex items-center gap-3 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE9DF] px-4 py-1.5 text-xs font-semibold text-[#211F1D] border border-[#E2DCD2] shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF5A36]" />
                <span>1,200+ Verified R&D Projects</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0ED] px-4 py-1.5 text-xs font-semibold text-[#FF5A36] border border-[#FFCFC4]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF5A36]" />
                <span>Enterprise Platform</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[#211F1D] sm:text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.1] text-left">
              Direct R&D Match Between{" "}
              <span className="text-[#FF5A36]">
                Industry & Academia
              </span>
            </h1>

            {/* Subtitle Copy */}
            <p className="mt-6 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl text-left font-medium">
              1,200+ active R&D internships and corporate research projects this month. No spam, no fake listings — direct applications to verified enterprise sponsors under strict digital NDA governance.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-start">
              <button
                onClick={handleScrollToHowItWorks}
                className="btn-primary text-sm font-bold shadow-lg shadow-[#FF5A36]/20 cursor-pointer min-h-[44px] hover:scale-105 active:scale-95 transition-all"
              >
                <span>Explore Ecosystem</span>
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </button>
              <button
                onClick={onScheduleConsultation}
                className="btn-secondary text-sm font-bold text-[#211F1D] min-h-[44px] hover:scale-105 active:scale-95 transition-all"
              >
                <Calendar className="h-4 w-4 text-[#FF5A36]" />
                <span>Schedule Consultation</span>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="mt-12 pt-8 border-t border-[#E2DCD2] grid grid-cols-3 gap-6 text-left">
              <div className="group cursor-default">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors">1,200+</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Active Projects</p>
              </div>
              <div className="group cursor-default">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors">5-7 Days</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Avg Response</p>
              </div>
              <div className="group cursor-default">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#2F6B4F] group-hover:text-[#2F6B4F] transition-colors">100%</p>
                <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider mt-1">Verified Partners</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Interactive Card Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="card-elevated rounded-3xl p-6 space-y-5 text-left border-[#E2DCD2] hover:border-[#FF5A36]/40 transition-all hover:shadow-xl">
              
              {/* Header card info */}
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36]">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#211F1D]">Autonomous Drone Navigation</h3>
                    <p className="text-xs text-[#78716A]">Siemens Corporate R&D Division</p>
                  </div>
                </div>
                <span className="badge-forest text-[10px] font-extrabold uppercase">
                  SLA Approved
                </span>
              </div>

              {/* Match Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FBF7F0] border border-[#E2DCD2] hover:border-[#FF5A36]/30 transition-all">
                  <span className="text-[10px] text-[#78716A] uppercase font-semibold">Allocated Budget</span>
                  <p className="text-sm font-extrabold text-[#211F1D] mt-0.5">₹25,00,000</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FBF7F0] border border-[#E2DCD2] hover:border-[#FF5A36]/30 transition-all">
                  <span className="text-[10px] text-[#78716A] uppercase font-semibold">Matched Expert</span>
                  <p className="text-sm font-extrabold text-[#211F1D] mt-0.5">Dr. S. Ramanathan (IISc)</p>
                </div>
              </div>

              {/* Governance Status */}
              <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#211F1D] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#FF5A36]" /> Mutual NDA Hashed
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#FF5A36]">SHA-256 Verified</span>
                </div>
                <div className="w-full bg-[#EFE9DF] rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF5A36] to-[#2F6B4F] h-full rounded-full w-[85%]" />
                </div>
              </div>

              {/* Quick Role Selectors */}
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-[#78716A] uppercase tracking-wider mb-2.5">Explore By Role:</p>
                <div className="grid grid-cols-3 gap-2">
                  <Link href="/auth/register/industry" className="p-2.5 rounded-xl bg-[#FBF7F0] hover:bg-[#FFF0ED] border border-[#E2DCD2] hover:border-[#FF5A36]/40 text-center transition-all group">
                    <Building2 className="h-4 w-4 mx-auto text-[#FF5A36] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-[#211F1D] block">Industry</span>
                  </Link>
                  <Link href="/auth/register/expert" className="p-2.5 rounded-xl bg-[#FBF7F0] hover:bg-[#E8F2EC] border border-[#E2DCD2] hover:border-[#2F6B4F]/40 text-center transition-all group">
                    <GraduationCap className="h-4 w-4 mx-auto text-[#2F6B4F] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-[#211F1D] block">Expert</span>
                  </Link>
                  <Link href="/auth/register/student" className="p-2.5 rounded-xl bg-[#FBF7F0] hover:bg-[#FFF8E6] border border-[#E2DCD2] hover:border-[#B45309]/40 text-center transition-all group">
                    <UserCheck className="h-4 w-4 mx-auto text-[#B45309] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-[#211F1D] block">Student</span>
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
