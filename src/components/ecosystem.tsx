"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Activity, Award, User, Target, ShieldCheck, CheckCircle2 } from "lucide-react";

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
    <section id="ecosystem" className="py-24 bg-[#EFE9DF] text-[#57534E] border-b border-[#E2DCD2] relative overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
            MULTI-STAKEHOLDER TOPOLOGY
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight font-heading">
            The AnveshakHub Ecosystem
          </h2>
          <p className="mt-4 text-base text-[#57534E] leading-relaxed font-medium">
            Click on any node in the topology below to inspect role responsibilities and governance boundaries.
          </p>
        </div>

        {/* Interactive Node Selector Buttons */}
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
                    ? "bg-[#FFF0ED] border-[#FF5A36] text-[#211F1D] shadow-md scale-105"
                    : "bg-[#FBF7F0] border-[#E2DCD2] text-[#78716A] hover:border-[#FF5A36]/40 hover:text-[#211F1D] hover:scale-102"
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 transition-transform ${
                  isSelected ? "bg-[#FF5A36] text-white scale-110" : "bg-[#EFE9DF] text-[#57534E]"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold font-heading">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Inspector Card */}
        <div className="max-w-4xl mx-auto bg-[#FBF7F0] border border-[#E2DCD2] rounded-3xl p-8 shadow-xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DCD2] pb-6">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                    Role & Position
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#211F1D] mt-1 font-heading">
                    {activeNode.role}
                  </h3>
                </div>
                <div className="badge-forest shrink-0 self-start sm:self-auto py-1 px-3">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Governed Node</span>
                </div>
              </div>

              <p className="text-sm text-[#57534E] leading-relaxed font-medium">
                {activeNode.description}
              </p>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716A] mb-3">
                  Core Responsibilities & Capabilities:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeNode.actions.map((act) => (
                    <div key={act} className="p-3.5 rounded-xl bg-[#EFE9DF] border border-[#E2DCD2] flex items-start gap-2 text-xs font-semibold text-[#211F1D]">
                      <CheckCircle2 className="h-4 w-4 text-[#FF5A36] shrink-0 mt-0.5" />
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
