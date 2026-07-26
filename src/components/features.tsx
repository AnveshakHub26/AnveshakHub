"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Landmark,
  Database,
  CalendarCheck,
  BarChart3
} from "lucide-react";

const features = [
  {
    title: "Industry Workspace",
    description: "Post research problem statements, set project budgets, and review pre-screened expert proposals.",
    icon: Briefcase,
  },
  {
    title: "Domain Experts Directory",
    description: "Verified academic professors, PhD scholars, and technical leads indexed by patents and research field.",
    icon: GraduationCap,
  },
  {
    title: "Paid R&D Internships",
    description: "Connect top student researchers directly with funded corporate R&D milestones under faculty supervision.",
    icon: Sparkles,
  },
  {
    title: "Pipeline Tracking",
    description: "Track R&D proposals from initial inquiry to signed contract with clear milestone status gates.",
    icon: Layers,
  },
  {
    title: "Government Schemes",
    description: "Cross-reference R&D proposals with active national research grants and institutional funding opportunities.",
    icon: Landmark,
  },
  {
    title: "Secure Deliverables Vault",
    description: "Store IP documents, codebases, and progress reports with automatic audit logging.",
    icon: Database,
  },
  {
    title: "Milestone Management",
    description: "Verify SLA milestones, track academic hours, and approve payouts upon verified deliverables.",
    icon: CalendarCheck,
  },
  {
    title: "R&D Analytics Console",
    description: "Monitor proposal match velocity, active expert consultation hours, and grant utilization rates.",
    icon: BarChart3,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#FBF7F0] text-[#57534E] border-b border-[#E2DCD2] relative scroll-mt-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Left-aligned Header */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
            CORE PLATFORM ARCHITECTURE
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight text-left">
            Built for Modern R&D & Technical Teams
          </h2>
          <p className="mt-4 text-base text-[#57534E] leading-relaxed text-left font-medium">
            Everything corporate sponsors and academic institutions need to manage high-stakes research collaborations.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-6 shadow-sm hover:border-[#FF5A36]/60 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group text-left cursor-default"
              >
                <div className="h-12 w-12 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36] mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#211F1D] mb-2 group-hover:text-[#FF5A36] transition-colors text-left">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed text-left font-medium">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
