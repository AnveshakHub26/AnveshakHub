"use client";

import { motion } from "framer-motion";

const organizations = [
  {
    name: "IIT Bangalore",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 140 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.2em] fill-blue-400">IISc Bangalore</text>
      </svg>
    ),
  },
  {
    name: "Siemens R&D",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-black text-base tracking-[0.1em] italic fill-sky-300">SIEMENS</text>
      </svg>
    ),
  },
  {
    name: "DRDO",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.25em] fill-amber-400">DRDO R&D</text>
      </svg>
    ),
  },
  {
    name: "Microsoft Research",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 180 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h9.5v9.5H0zM11 0h9.5v9.5H11zM0 11h9.5v9.5H0zM11 11h9.5v9.5H11z" className="fill-blue-400" />
        <text x="26" y="15" className="font-bold text-xs tracking-[0.05em] fill-slate-300">Microsoft Research</text>
      </svg>
    ),
  },
  {
    name: "ISRO Space",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.3em] fill-emerald-400">ISRO</text>
      </svg>
    ),
  },
  {
    name: "IIT Madras",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 180 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-bold text-sm tracking-wide fill-indigo-300">IIT Madras</text>
      </svg>
    ),
  },
];

export default function TrustedOrgs() {
  return (
    <section className="py-10 bg-slate-900 border-b border-slate-800 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by Academic Research Institutes & Enterprise Sponsors
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80 hover:opacity-100 transition-opacity">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              {org.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
