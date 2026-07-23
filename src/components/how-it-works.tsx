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
    <section id="how-it-works" className="py-24 bg-slate-950 text-white border-b border-slate-800 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
            End-to-End Workflow Architecture
          </span>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl tracking-tight">
            How AnveshakHub Governance Works
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            A 6-step structured pipeline designed to protect IP, enforce SLAs, and accelerate applied R&D.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl hover:border-blue-500/40 hover:shadow-blue-500/10 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 px-3 py-1 bg-slate-950 rounded-full border border-slate-800">
                    STAGE 0{item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
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
