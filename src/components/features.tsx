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
    title: "Analytics",
    description: "Comprehensive reporting suites rendering real-time metrics on matching speeds, research output, and grant spend.",
    icon: BarChart3,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Core Capabilities
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl tracking-tight">
              Enterprise Collaboration Platform Features
            </p>
          </div>
          <p className="mt-4 md:mt-0 text-sm font-semibold text-slate-500 max-w-sm">
            Everything your organization needs to bridge corporate funding and academic brilliance on a single secure dashboard.
          </p>
        </div>

        {/* Grid Layout: 2 Rows, 4 Cards on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50/80 border border-blue-100 flex items-center justify-center text-primary mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                
                <h3 className="text-base font-bold text-secondary">
                  {feature.title}
                </h3>
                
                <p className="mt-3 text-xs leading-relaxed text-slate-500 flex-grow">
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
