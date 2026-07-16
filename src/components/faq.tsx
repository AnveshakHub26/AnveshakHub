"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare, ShieldCheck, Quote } from "lucide-react";

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

const testimonials = [
  {
    quote: "AnveshakHub transformed our research pipeline. We matched with a leading PhD advisor in quantum computing within days, all under secure legal protocols.",
    author: "Dr. Elena Rostova",
    role: "VP of Quantum Research, Aether Technologies",
    institution: "Industry Sponsor",
  },
  {
    quote: "The structured milestone tracking allowed my laboratory to deliver a working machine learning model ahead of schedule while supervising five top-tier graduate interns.",
    author: "Prof. Rajesh Kumar",
    role: "Department of Robotics, Indian Institute of Science",
    institution: "Expert Lead",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= TESTIMONIALS SECTION (PLACEHOLDER) ================= */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Validation
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl tracking-tight">
              Ecosystem Feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative"
              >
                <div className="absolute top-6 right-6 text-slate-100">
                  <Quote className="h-10 w-10 fill-current" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm italic leading-relaxed text-slate-600">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-secondary">{t.author}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{t.role}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-primary border border-blue-100">
                    {t.institution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FAQ SECTION ================= */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              FAQ
            </h2>
            <p className="mt-3 text-2xl font-extrabold text-secondary sm:text-3xl tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-secondary hover:text-primary transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
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
