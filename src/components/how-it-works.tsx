"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  FileCode,
  FileCheck,
  UserCheck,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Industry Onboarding",
    description: "Organizations register with verification metadata, establishing secure organization boundaries.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Problem Statement Submission",
    description: "Detailed R&D goals, technical outcomes, budgets, and skill requirements are published.",
    icon: FileCode,
  },
  {
    step: 3,
    title: "SLA Feasibility Review",
    description: "AnveshakHub Admins review problem scope, verify IP protocols, and approve statement queueing.",
    icon: FileCheck,
  },
  {
    step: 4,
    title: "Expert PhD Matching",
    description: "Vetted academic or industry experts accept project leadership under mutual digital NDAs.",
    icon: UserCheck,
  },
  {
    step: 5,
    title: "Student Intern Execution",
    description: "Lead experts recruit student interns, structure milestones, and manage research delivery.",
    icon: TrendingUp,
  },
  {
    step: 6,
    title: "Cryptographic Delivery",
    description: "Milestones are accepted, deliverables stored in NDA vaults, and final IP transferred.",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FBF7F0] text-[#57534E] border-b border-[#E2DCD2] relative font-sans">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF5A36]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
            END-TO-END WORKFLOW ARCHITECTURE
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight font-heading">
            How AnveshakHub Governance Works
          </h2>
          <p className="mt-4 text-base text-[#57534E] leading-relaxed font-medium">
            A 6-step structured pipeline designed to protect IP, enforce SLAs, and accelerate applied R&D.
          </p>
        </div>

        {/* 6 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-8 shadow-sm hover:border-[#FF5A36]/60 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 relative group text-left cursor-default"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF5A36] px-3 py-1 bg-[#FFF0ED] rounded-full border border-[#FFCFC4]">
                    STAGE 0{item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#211F1D] mb-2 group-hover:text-[#FF5A36] transition-colors font-heading text-left">
                  {item.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed text-left font-medium">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
