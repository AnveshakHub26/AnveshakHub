"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Activity, Award, User, Target, ArrowRight, ShieldCheck, HeartHandshake, Code } from "lucide-react";

const nodes = [
  {
    id: "industry",
    label: "Industry",
    icon: Building,
    role: "Problem Originator & Sponsor",
    description: "Sponsors research by providing capital and defining real-world problem statements. Monitored through full NDA compliance.",
    color: "bg-blue-600 border-blue-200 text-white",
    hoverColor: "border-blue-600 ring-blue-100",
    actions: ["Submit Problem Statements", "Fund Research Milestones", "Review & Accept Deliverables"],
  },
  {
    id: "hub",
    label: "AnveshakHub",
    icon: Activity,
    role: "Central Orchestration & Governance",
    description: "The core platform facilitating matching, secure data isolation, milestone tracking, and automated legal contracts.",
    color: "bg-slate-900 border-slate-700 text-white",
    hoverColor: "border-slate-900 ring-slate-200",
    actions: ["Perform Feasibility Audits", "Match Vetted Experts", "Enforce Strict NDA Gates"],
  },
  {
    id: "experts",
    label: "Experts",
    icon: Award,
    role: "Project Leader & Supervisor",
    description: "Professors or consultants who review problem statements, architect research paths, and oversee student interns.",
    color: "bg-indigo-600 border-indigo-200 text-white",
    hoverColor: "border-indigo-600 ring-indigo-100",
    actions: ["Structure Projects & Milestones", "Hire & Direct Student Teams", "Verify Core Intellectual Property"],
  },
  {
    id: "students",
    label: "Students",
    icon: User,
    role: "Hands-on Researchers / Interns",
    description: "Perform the ground-level development, testing, and literature reviews under direct supervision of the assigned Expert.",
    color: "bg-teal-600 border-teal-200 text-white",
    hoverColor: "border-teal-600 ring-teal-100",
    actions: ["Apply to Opportunities", "Execute Daily Task Assignments", "Submit Milestone Deliverables"],
  },
  {
    id: "innovation",
    label: "Innovation",
    icon: Target,
    role: "Final Output / Value Created",
    description: "The crystallization of the collaboration. Results in production code, scientific papers, patents, and hired talent.",
    color: "bg-amber-500 border-amber-200 text-white",
    hoverColor: "border-amber-500 ring-amber-100",
    actions: ["Production-Ready Systems", "Academic Publications & Patents", "Direct Enterprise Placements"],
  },
];

export default function Ecosystem() {
  const [activeNode, setActiveNode] = useState(nodes[0]);

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200/60 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Ecosystem Integration
          </h2>
          <p className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl tracking-tight">
            The AnveshakHub Stakeholder Chain
          </p>
          <p className="mt-4 text-base text-slate-600">
            A secure, closed-loop network channeling corporate capital and complex problems directly into verified academic minds, yielding rapid innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Ecosystem Diagram */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Legend / Interactive Hint */}
            <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              Hover or Select nodes to inspect collaboration roles
            </p>

            {/* Desktop Node Visualizer */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
              
              {/* Circular loop line */}
              <div className="absolute inset-16 rounded-full border border-dashed border-slate-200 animate-[spin_100s_linear_infinite]" />
              
              {/* Central AnveshakHub Node */}
              <button
                onClick={() => setActiveNode(nodes[1])}
                onMouseEnter={() => setActiveNode(nodes[1])}
                className={`absolute z-20 h-24 w-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-md ${
                  activeNode.id === "hub"
                    ? "border-primary scale-110 shadow-primary/10 ring-8 ring-blue-50"
                    : "border-slate-200 hover:border-slate-800"
                } bg-slate-900 text-white`}
              >
                <Activity className="h-8 w-8 text-blue-400" />
                <span className="text-[10px] font-bold mt-1 tracking-wider">HUB</span>
              </button>

              {/* Node: Industry (Top Left) */}
              <button
                onClick={() => setActiveNode(nodes[0])}
                onMouseEnter={() => setActiveNode(nodes[0])}
                className={`absolute top-8 left-8 z-10 h-20 w-20 rounded-full border-2 flex flex-col items-center justify-center bg-white transition-all duration-300 shadow-sm ${
                  activeNode.id === "industry"
                    ? "border-primary scale-110 ring-4 ring-blue-50 shadow-md"
                    : "border-slate-200 hover:border-blue-600"
                }`}
              >
                <Building className={`h-6 w-6 ${activeNode.id === "industry" ? "text-primary" : "text-slate-500"}`} />
                <span className="text-[10px] font-bold text-slate-800 mt-1">Industry</span>
              </button>

              {/* Node: Experts (Top Right) */}
              <button
                onClick={() => setActiveNode(nodes[2])}
                onMouseEnter={() => setActiveNode(nodes[2])}
                className={`absolute top-8 right-8 z-10 h-20 w-20 rounded-full border-2 flex flex-col items-center justify-center bg-white transition-all duration-300 shadow-sm ${
                  activeNode.id === "experts"
                    ? "border-primary scale-110 ring-4 ring-blue-50 shadow-md"
                    : "border-slate-200 hover:border-indigo-600"
                }`}
              >
                <Award className={`h-6 w-6 ${activeNode.id === "experts" ? "text-primary" : "text-slate-500"}`} />
                <span className="text-[10px] font-bold text-slate-800 mt-1">Experts</span>
              </button>

              {/* Node: Students (Bottom Left) */}
              <button
                onClick={() => setActiveNode(nodes[3])}
                onMouseEnter={() => setActiveNode(nodes[3])}
                className={`absolute bottom-8 left-8 z-10 h-20 w-20 rounded-full border-2 flex flex-col items-center justify-center bg-white transition-all duration-300 shadow-sm ${
                  activeNode.id === "students"
                    ? "border-primary scale-110 ring-4 ring-blue-50 shadow-md"
                    : "border-slate-200 hover:border-teal-600"
                }`}
              >
                <User className={`h-6 w-6 ${activeNode.id === "students" ? "text-primary" : "text-slate-500"}`} />
                <span className="text-[10px] font-bold text-slate-800 mt-1">Students</span>
              </button>

              {/* Node: Innovation (Bottom Right) */}
              <button
                onClick={() => setActiveNode(nodes[4])}
                onMouseEnter={() => setActiveNode(nodes[4])}
                className={`absolute bottom-8 right-8 z-10 h-20 w-20 rounded-full border-2 flex flex-col items-center justify-center bg-white transition-all duration-300 shadow-sm ${
                  activeNode.id === "innovation"
                    ? "border-primary scale-110 ring-4 ring-blue-50 shadow-md"
                    : "border-slate-200 hover:border-amber-500"
                }`}
              >
                <Target className={`h-6 w-6 ${activeNode.id === "innovation" ? "text-primary" : "text-slate-500"}`} />
                <span className="text-[10px] font-bold text-slate-800 mt-1">Innovation</span>
              </button>

              {/* Connectors / Directional indicator arrows inside the circle */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-200 stroke-2 fill-none" viewBox="0 0 400 400">
                <path d="M 120 120 L 160 160" />
                <path d="M 280 120 L 240 160" />
                <path d="M 120 280 L 160 240" />
                <path d="M 280 280 L 240 240" />
              </svg>

            </div>
          </div>

          {/* Right Column: Node Details Inspector Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm h-[400px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow flex flex-col justify-between"
                >
                  <div>
                    {/* Active tag info */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${activeNode.color}`}>
                        <activeNode.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Stakeholder</span>
                        <h3 className="text-xl font-bold text-secondary mt-0.5">{activeNode.label}</h3>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-primary mt-4 tracking-wide uppercase">{activeNode.role}</p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{activeNode.description}</p>
                  </div>

                  {/* Actions / Contributions in the chain */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Key Responsibilities:</p>
                    <ul className="space-y-2">
                      {activeNode.actions.map((act) => (
                        <li key={act} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
