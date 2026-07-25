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
    <section id="features" className="py-24 bg-[#0B0D10] text-[#FAF8F5] border-b border-[#1C1F23] relative scroll-mt-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Left-aligned Header */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF7A45]">
            Core Platform Architecture
          </span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-[#FAF8F5] sm:text-4xl tracking-tight text-left">
            Built for Modern R&D & Technical Teams
          </h2>
          <p className="mt-4 text-base text-[#6B7280] leading-relaxed text-left">
            Everything corporate sponsors and academic institutions need to manage high-stakes research collaborations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                className="card-interactive bg-[#1C1F23] border border-[#3A3F45] rounded-xl p-6 shadow-md hover:border-[#4338CA] group text-left"
              >
                <div className="h-12 w-12 rounded-lg bg-[#4338CA]/15 border border-[#4338CA]/30 flex items-center justify-center text-[#818CF8] mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#FAF8F5] mb-2 group-hover:text-[#818CF8] transition-colors text-left">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed text-left">
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
