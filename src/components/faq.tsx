"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Quote, Building2, GraduationCap, Award } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#FBF7F0] text-[#57534E] border-b border-[#E2DCD2] relative font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Verified Ecosystem Leadership Section */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4] mb-4">
              <Award className="h-3.5 w-3.5" /> Verified Industry & Academic Feedback
            </span>
            <h2 className="text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight font-heading">
              Trusted by Leading Research Institutions
            </h2>
            <p className="mt-4 text-base text-[#57534E] leading-relaxed font-medium">
              Read how enterprise sponsors and academic leads collaborate under structured legal NDAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {verifiedLeadership.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl p-8 shadow-sm flex flex-col justify-between relative hover:border-[#FF5A36]/60 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group text-left cursor-default"
                >
                  <div className="absolute top-6 right-6 text-[#D8D2C7] group-hover:text-[#FF5A36]/20 transition-colors">
                    <Quote className="h-10 w-10 fill-current" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm leading-relaxed text-[#211F1D] font-semibold italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#E2DCD2] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors font-heading">{t.author}</p>
                      <p className="text-xs font-semibold text-[#57534E] mt-0.5">{t.role}</p>
                      <p className="text-[11px] font-bold text-[#FF5A36] mt-0.5">{t.organization}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36] shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight font-heading">
              Platform & Governance Details
            </h2>
            <p className="mt-4 text-base text-[#57534E] leading-relaxed font-medium">
              Everything you need to know about corporate NDA isolation, feasibility reviews, and stipend management.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#EFE9DF] border border-[#E2DCD2] rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#211F1D] font-heading pr-4">
                      {faq.question}
                    </span>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-[#FBF7F0] border border-[#E2DCD2] text-[#FF5A36] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#FFF0ED]" : ""
                    }`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-[#E2DCD2]/60 mt-1">
                          <p className="text-xs text-[#57534E] leading-relaxed pt-4 font-medium">
                            {faq.answer}
                          </p>
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
