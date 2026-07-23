"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar, ShieldCheck, Cpu, Sparkles, Building2, GraduationCap, UserCheck } from "lucide-react";

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
    <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-slate-800 font-sans">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

      {/* Radial glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            {/* Tagline Badges */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Enterprise Vetted & Secure
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                <Cpu className="h-3.5 w-3.5" />
                v1.0 Production Release
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
              Connecting Industries,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 block lg:inline">
                Experts & Innovation
              </span>{" "}
              Through One Platform
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AnveshakHub is the premier Enterprise Collaboration Platform bridging corporate funding, world-class academic experts, and student researchers under cryptographic NDA governance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleScrollToHowItWorks}
                className="inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-200 gap-2 cursor-pointer"
              >
                Explore Ecosystem
                <ArrowDown className="h-4.5 w-4.5 animate-bounce" />
              </button>
              <button
                onClick={onScheduleConsultation}
                className="inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-slate-200 hover:text-white border border-slate-800 hover:border-blue-500/50 bg-slate-900/90 rounded-xl hover:bg-slate-800 transition-all duration-200 gap-2 cursor-pointer shadow-md"
              >
                <Calendar className="h-4.5 w-4.5 text-blue-400" />
                Schedule Consultation
              </button>
            </div>
            
            {/* Supporting statistics */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">NDA Governed</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">24h</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Review SLA</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-400">Cryptographic</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">IP Vault</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Platform Architecture Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    ANVESHAKHUB ECOSYSTEM HUB
                  </span>
                </div>
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Corporate Industry</h4>
                      <p className="text-[11px] text-slate-400">Problem Statements & Grants</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Active</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">PhD & Academic Experts</h4>
                      <p className="text-[11px] text-slate-400">Milestone Solution Architecture</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">Vetted</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Student Researchers</h4>
                      <p className="text-[11px] text-slate-400">Internship Project Execution</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">Verified</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Real-Time Supabase Sync</span>
                <span className="text-emerald-400 font-semibold">100% Encryption</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
