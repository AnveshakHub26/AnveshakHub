"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Activity, Award, User, Target, ArrowRight, ShieldCheck } from "lucide-react";

const nodes = [
  {
    id: "industry",
    label: "Industry",
    icon: Building,
    role: "Problem Originator & Sponsor",
    description: "Sponsors research by providing capital and defining real-world problem statements. Monitored through full NDA compliance.",
    actions: ["Submit Problem Statements", "Fund Research Milestones", "Review & Accept Deliverables"],
  },
  {
    id: "hub",
    label: "AnveshakHub",
    icon: Activity,
    role: "Central Orchestration & Governance",
    description: "The core platform facilitating matching, secure data isolation, milestone tracking, and automated legal contracts.",
    actions: ["Perform Feasibility Audits", "Match Vetted Experts", "Enforce Strict NDA Gates"],
  },
  {
    id: "experts",
    label: "Experts",
    icon: Award,
    role: "Project Leader & Supervisor",
    description: "Professors or consultants who review problem statements, architect research paths, and oversee student interns.",
    actions: ["Structure Projects & Milestones", "Hire & Direct Student Teams", "Verify Core Intellectual Property"],
  },
  {
    id: "students",
    label: "Students",
    icon: User,
    role: "Hands-on Researchers / Interns",
    description: "Perform the ground-level development, testing, and literature reviews under direct supervision of the assigned Expert.",
    actions: ["Apply to Opportunities", "Execute Daily Task Assignments", "Submit Milestone Deliverables"],
  },
  {
    id: "innovation",
    label: "Innovation",
    icon: Target,
    role: "Final Output / Value Created",
    description: "The crystallization of the collaboration. Results in production code, scientific papers, patents, and hired talent.",
    actions: ["Production-Ready Systems", "Academic Publications & Patents", "Direct Enterprise Placements"],
  },
];

export default function Ecosystem() {
  const [activeId, setActiveId] = useState("hub");
  const activeNode = nodes.find((n) => n.id === activeId) || nodes[1];

  return (
    <section className="py-24 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
            Multi-Stakeholder Topology
          </span>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl tracking-tight">
            The AnveshakHub Ecosystem
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Click on any node in the topology below to inspect role responsibilities and governance boundaries.
          </p>
        </div>

        {/* Interactive Node Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = activeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setActiveId(node.id)}
                className={`p-5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 scale-105"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <activeNode.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{activeNode.label}</h3>
                    <p className="text-xs text-blue-400 font-semibold mt-0.5">{activeNode.role}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> NDA Isolated
                </span>
              </div>

              <p className="mt-6 text-sm text-slate-300 leading-relaxed">
                {activeNode.description}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Key Operational Actions & Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeNode.actions.map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
                      <ArrowRight className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
