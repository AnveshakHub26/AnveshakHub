"use client";

import { motion } from "framer-motion";

const organizations = [
  {
    name: "MIT Research",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.2em]">MIT</text>
        <rect x="55" y="4" width="3" height="15" />
        <rect x="62" y="4" width="12" height="3" />
        <rect x="66" y="7" width="4" height="12" />
        <rect x="80" y="4" width="15" height="3" />
        <rect x="86" y="7" width="3" height="12" />
      </svg>
    ),
  },
  {
    name: "Siemens",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-black text-base tracking-[0.1em] italic">SIEMENS</text>
      </svg>
    ),
  },
  {
    name: "Pfizer",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-bold text-sm tracking-[0.15em] italic">Pfizer</text>
      </svg>
    ),
  },
  {
    name: "Microsoft Research",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 180 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h9.5v9.5H0zM11 0h9.5v9.5H11zM0 11h9.5v9.5H0zM11 11h9.5v9.5H11z" className="text-slate-400" />
        <text x="26" y="15" className="font-bold text-xs tracking-[0.05em]">Microsoft Research</text>
      </svg>
    ),
  },
  {
    name: "NASA",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.3em] text-red-600">NASA</text>
      </svg>
    ),
  },
  {
    name: "Stanford University",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 180 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-serif font-bold text-sm tracking-wide">Stanford University</text>
      </svg>
    ),
  },
];

export default function TrustedOrgs() {
  return (
    <div className="bg-slate-50 border-y border-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          Empowering Innovation Across Trusted Global Institutions & Enterprises
        </p>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-x-16 lg:gap-x-20">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
              aria-label={org.name}
            >
              {org.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
