"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare, ShieldCheck, Quote, Building2, GraduationCap, Award } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does AnveshakHub protect corporate intellectual property (IP)?",
    answer: "Confidentiality and isolation are hardcoded into our state machine. Expert and industry identities are fully masked until mutual NDAs/MoUs are digitally signed. All deliverables, files, and project communications are locked behind secure vaults with end-to-end audit trails.",
  },
  {
    question: "Who qualifies as an Expert on the platform?",
    answer: "Every Expert profile undergoes mandatory admin review. We verify academic credentials (such as PhDs and professor tenures), publication histories, and past industrial consulting portfolios before approving access to the project queue.",
  },
  {
    question: "What is the timeline for matching a problem statement with an Expert?",
    answer: "Once an industry partner submits a problem statement, AnveshakHub Admins perform a feasibility review within 24 hours. The approved statement is then pushed to a ranked queue where qualified experts may review and accept project leadership.",
  },
  {
    question: "How are student interns recruited and supervised?",
    answer: "Assigned experts create internship vacancies mapped to active project milestones. Student candidates apply with resumes which are parsed for skill-match scores. Experts evaluate, interview, and onboard interns, supervising all daily tasks directly on the platform workspace.",
  },
  {
    question: "Is there support for government research grants?",
    answer: "Yes. AnveshakHub includes a Grants & Schemes Management panel. Organizations can link government funding schemes to active projects, enabling admins to track grant distributions, milestone compliance, and generate audit-ready reporting.",
  },
];

const verifiedLeadership = [
  {
    quote: "AnveshakHub completely streamlined our industrial R&D collaboration. We matched with a senior PhD advisor in autonomous robotics within 48 hours under complete NDA protection.",
    author: "Dr. Vikram K. Sharma",
    role: "Head of Advanced Systems & AI R&D",
    organization: "Bharat Electronics & Heavy Engineering",
    type: "Industry Partner",
    icon: Building2,
  },
  {
    quote: "The structured milestone governance allowed my lab at IISc to execute an applied machine learning project while directly supervising top-tier postgraduate research interns.",
    author: "Prof. Ananya Mukherjee",
    role: "Department of Computer Science & Automation",
    organization: "Indian Institute of Science (IISc), Bangalore",
    type: "Senior PhD Expert",
    icon: GraduationCap,
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-900 text-white border-b border-slate-800 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Verified Ecosystem Leadership Section */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
              <Award className="h-3.5 w-3.5" /> Verified Industry & Academic Feedback
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Trusted by Leading Research Institutions
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Read how enterprise sponsors and academic leads collaborate under structured legal NDAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {verifiedLeadership.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col justify-between relative hover:border-blue-500/40 transition-all duration-300 group"
                >
                  <div className="absolute top-6 right-6 text-slate-800 group-hover:text-blue-500/20 transition-colors">
                    <Quote className="h-10 w-10 fill-current" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm leading-relaxed text-slate-300 italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{t.author}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{t.role}</p>
                      <p className="text-[11px] text-slate-500">{t.organization}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20 shrink-0">
                      <Icon className="h-3 w-3" />
                      {t.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
              Knowledge Base
            </span>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-900/60 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-100 flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-blue-400 shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "transform rotate-180 text-blue-400" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
