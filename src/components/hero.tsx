"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar, ShieldCheck, Cpu } from "lucide-react";

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
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left"
          >
            {/* Tagline */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary border border-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Enterprise Vetted & Secure
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-100">
                <Cpu className="h-3.5 w-3.5" />
                v1.0 Release
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-secondary sm:text-5xl md:text-6xl leading-[1.1]">
              Connecting Industries,{" "}
              <span className="text-primary block lg:inline">Experts & Innovation</span>{" "}
              Through One Platform
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AnveshakHub is the premier Enterprise Collaboration Platform bridging the gap between industry-defined challenges, world-class expert advisors, and talented student researchers under structured legal and operational governance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleScrollToHowItWorks}
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm hover:scale-[1.03] hover:shadow-md transition-all duration-200 gap-2 cursor-pointer"
              >
                Explore Platform
                <ArrowDown className="h-4.5 w-4.5 animate-bounce" />
              </button>
              <button
                onClick={onScheduleConsultation}
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-secondary hover:text-primary border border-slate-300 hover:border-primary bg-white rounded-lg hover:bg-blue-50/30 transition-all duration-200 gap-2 cursor-pointer"
              >
                <Calendar className="h-4.5 w-4.5 text-slate-500" />
                Schedule Consultation
              </button>
            </div>
            
            {/* Supporting statistics placeholder */}
            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-secondary">100%</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">NDA Governed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">24h</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Review SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">Secure</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">IP Protection</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: SVG Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center items-center relative"
          >
            {/* Interactive SVG Diagram */}
            <div className="w-full max-w-[540px] aspect-square relative select-none">
              
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border border-slate-100 animate-[spin_120s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-dashed border-slate-200/60 animate-[spin_80s_linear_infinite_reverse]" />

              <svg
                viewBox="0 0 500 500"
                className="w-full h-full drop-shadow-xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#1E293B" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.2" />
                  </linearGradient>
                  
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* Connecting Background Paths */}
                {/* Industry to Center */}
                <path d="M 110 140 L 250 250" stroke="url(#gradient-line)" strokeWidth="2.5" strokeDasharray="6 6" />
                {/* Expert to Center */}
                <path d="M 390 140 L 250 250" stroke="url(#gradient-line)" strokeWidth="2.5" strokeDasharray="6 6" />
                {/* Student to Center */}
                <path d="M 110 360 L 250 250" stroke="url(#gradient-line)" strokeWidth="2.5" strokeDasharray="6 6" />
                {/* Innovation to Center */}
                <path d="M 390 360 L 250 250" stroke="url(#gradient-line)" strokeWidth="2.5" strokeDasharray="6 6" />

                {/* Pulsing signal dots traversing the paths */}
                <circle r="4" fill="#2563EB">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 110 140 L 250 250" />
                </circle>
                <circle r="4" fill="#2E6F73">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 390 140 L 250 250" />
                </circle>
                <circle r="4" fill="#22C55E">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M 110 360 L 250 250" />
                </circle>
                <circle r="4" fill="#F59E0B">
                  <animateMotion dur="4.5s" repeatCount="indefinite" path="M 390 360 L 250 250" />
                </circle>

                {/* Node 1: Industry (Top Left) */}
                <g filter="url(#shadow)">
                  <circle cx="110" cy="140" r="42" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                  <circle cx="110" cy="140" r="32" fill="#F8FAFC" />
                  {/* Industry Building Icon */}
                  <path d="M 98 148 L 98 132 L 108 132 L 108 138 L 114 138 L 114 132 L 122 132 L 122 148 Z" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="94" y1="148" x2="126" y2="148" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="103" cy="140" r="1" fill="#1E293B" />
                  <circle cx="117" cy="143" r="1" fill="#1E293B" />
                </g>
                <text x="110" y="197" textAnchor="middle" className="text-xs font-bold fill-slate-700 tracking-wider">INDUSTRIES</text>

                {/* Node 2: Experts (Top Right) */}
                <g filter="url(#shadow)">
                  <circle cx="390" cy="140" r="42" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                  <circle cx="390" cy="140" r="32" fill="#F8FAFC" />
                  {/* Expert Cap Icon */}
                  <path d="M 374 136 L 390 126 L 406 136 L 390 146 Z" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 380 140 L 380 148 C 380 151, 400 151, 400 148 L 400 140" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 402 138 L 402 150" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                  <circle cx="402" cy="151" r="1.5" fill="#2563EB" />
                </g>
                <text x="390" y="197" textAnchor="middle" className="text-xs font-bold fill-slate-700 tracking-wider">EXPERTS</text>

                {/* Node 3: Students / Interns (Bottom Left) */}
                <g filter="url(#shadow)">
                  <circle cx="110" cy="360" r="42" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                  <circle cx="110" cy="360" r="32" fill="#F8FAFC" />
                  {/* Student/User Icon */}
                  <path d="M 110 354 A 6 6 0 1 0 110 342 A 6 6 0 1 0 110 354 Z" fill="none" stroke="#2E6F73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 98 370 C 98 362, 103 360, 110 360 C 117 360, 122 362, 122 370" fill="none" stroke="#2E6F73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
                <text x="110" y="417" textAnchor="middle" className="text-xs font-bold fill-slate-700 tracking-wider">STUDENTS</text>

                {/* Node 4: Innovation / Solutions (Bottom Right) */}
                <g filter="url(#shadow)">
                  <circle cx="390" cy="360" r="42" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                  <circle cx="390" cy="360" r="32" fill="#F8FAFC" />
                  {/* Lightbulb Icon */}
                  <path d="M 390 342 A 9 9 0 0 1 399 351 C 399 356, 395 359, 393 363 L 393 367 L 387 367 L 387 363 C 385 359, 381 356, 381 351 A 9 9 0 0 1 390 342 Z" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="387" y1="371" x2="393" y2="371" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                </g>
                <text x="390" y="417" textAnchor="middle" className="text-xs font-bold fill-slate-700 tracking-wider">INNOVATION</text>

                {/* Central Platform Hub Node */}
                <g filter="url(#shadow)">
                  <circle cx="250" cy="250" r="54" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
                  <circle cx="250" cy="250" r="45" fill="#1E293B" />
                  {/* Logo/Hexagon/Network center icon */}
                  <polygon points="250,234 264,242 264,258 250,266 236,258 236,242" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="250" cy="250" r="4" fill="#2563EB" />
                </g>
                <text x="250" y="322" textAnchor="middle" className="text-xs font-bold fill-slate-900 tracking-wider">ANVESHAK HUB</text>
              </svg>

              {/* Floating Dashboard Widget 1 (Top Center) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold text-slate-800 tracking-wide uppercase">
                  100% Vetted Solutions
                </span>
              </motion.div>

              {/* Floating Dashboard Widget 2 (Bottom Left) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 left-2 bg-white border border-slate-100 shadow-md p-2.5 rounded-lg flex items-center gap-3 max-w-[170px]"
              >
                <div className="p-1.5 bg-blue-50 rounded text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Security</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">NDA Encrypted</p>
                </div>
              </motion.div>

              {/* Floating Dashboard Widget 3 (Bottom Right) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 right-0 bg-white border border-slate-100 shadow-md p-2.5 rounded-lg flex items-center gap-3 max-w-[160px]"
              >
                <div className="p-1.5 bg-emerald-50 rounded text-emerald-600">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider leading-none">Status</p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">SLA Auto-match</p>
                </div>
              </motion.div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
