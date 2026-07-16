"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  FileCode,
  FileCheck,
  UserCheck,
  TrendingUp,
  CheckCircle,
  Activity,
  User,
  GitMerge,
  Search,
  BookOpen
} from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Industry Registers",
    description: "Organizations onboard with verification documents, creating their profile and contact structure.",
    icon: UserPlus,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    step: 2,
    title: "Problem Statement Submitted",
    description: "Detailed problem descriptions, outcomes, timelines, and required expertise are uploaded.",
    icon: FileCode,
    color: "text-slate-700 bg-slate-100 border-slate-200",
  },
  {
    step: 3,
    title: "AnveshakHub Review",
    description: "Admin reviews statements for feasibility and scope before opening them to the network.",
    icon: FileCheck,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    step: 4,
    title: "Expert Assignment",
    description: "Vetted academic or industry experts are matched and assigned to lead the project.",
    icon: UserCheck,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    step: 5,
    title: "Project Execution",
    description: "Expert hires student interns, designs milestones, and directs execution on the platform.",
    icon: TrendingUp,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    step: 6,
    title: "Solution Delivered",
    description: "Industry reviews milestones, accepts final deliverables, and receives IP/reports.",
    icon: CheckCircle,
    color: "text-primary bg-blue-50 border-blue-100",
  },
];

const stepperNodes = [
  { label: "Register", icon: User },
  { label: "Verify", icon: Search },
  { label: "Match", icon: GitMerge },
  { label: "Build", icon: Activity },
  { label: "Deliver", icon: BookOpen },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/60 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Ecosystem Lifecycle
          </h2>
          <p className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl tracking-tight">
            How AnveshakHub Operates
          </p>
          <p className="mt-4 text-base text-slate-600">
            A comprehensive, governance-gated process ensuring full confidentiality, verification, and execution compliance at every stage.
          </p>
        </div>

        {/* Stepper Stepper Graphic (Register -> Verify -> Match -> Build -> Deliver) */}
        <div className="mt-16 mb-20 max-w-4xl mx-auto">
          <div className="relative">
            {/* Background connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block" />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-0">
              {stepperNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                    <div className="h-12 w-12 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-500 shadow-sm transition-all duration-300 hover:border-primary hover:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col sm:items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Step 0{index + 1}</span>
                      <span className="text-sm font-semibold text-secondary mt-1">{node.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Six Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
              >
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-lg border ${item.color} transition-colors`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-100 group-hover:text-blue-50 transition-colors select-none">
                    0{item.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-grow">
                  {item.description}
                </p>
                
                {/* Subtle visual dot connector for card relations */}
                <div className="mt-6 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-primary/60 transition-colors" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-primary/30 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
