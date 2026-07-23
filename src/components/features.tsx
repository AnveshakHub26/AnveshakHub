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
    title: "Industry Collaboration",
    description: "Streamline communication between corporate R&D divisions and elite research laboratories with secure isolation protocols.",
    icon: Briefcase,
  },
  {
    title: "Expert Network",
    description: "Access verified professors, PhD scholars, and technical consultants indexed by granular domains and research history.",
    icon: GraduationCap,
  },
  {
    title: "Internship Ecosystem",
    description: "Deploy and manage selected student interns to execute core deliverables under the supervision of leading experts.",
    icon: Sparkles,
  },
  {
    title: "Enterprise CRM",
    description: "Automated Kanban pipelines mapping corporate engagements from initial lead to matched, active project contract.",
    icon: Layers,
  },
  {
    title: "Government Grants",
    description: "Discover, catalogue, and cross-reference research proposals against national and international scheme directories.",
    icon: Landmark,
  },
  {
    title: "Knowledge Repository",
    description: "Centralized archive for deliverables, patents, codebases, and academic papers with cryptographic auditing.",
    icon: Database,
  },
  {
    title: "Project Tracking",
    description: "Robust milestone boards, SLA verification gates, and time logs tracking academic hours and project health.",
    icon: CalendarCheck,
  },
  {
    title: "Analytics Console",
    description: "Comprehensive reporting suites rendering real-time metrics on matching speeds, research output, and grant spend.",
    icon: BarChart3,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 text-white border-b border-slate-800 relative scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
            Enterprise Module Suite
          </span>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl tracking-tight">
            Engineered for Modern R&D Teams
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Everything your organization needs to manage high-stakes collaboration with academic experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
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
