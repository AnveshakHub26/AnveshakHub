"use client";

import { motion } from "framer-motion";

const organizations = [
  {
    name: "IISc Bangalore",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 160 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.2em] fill-[#FF5A36]">IISc Bangalore</text>
      </svg>
    ),
  },
  {
    name: "SIEMENS R&D",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 140 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-black text-base tracking-[0.1em] italic fill-[#211F1D]">SIEMENS</text>
      </svg>
    ),
  },
  {
    name: "DRDO R&D",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.25em] fill-[#B45309]">DRDO R&D</text>
      </svg>
    ),
  },
  {
    name: "Microsoft Research",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 190 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h9.5v9.5H0zM11 0h9.5v9.5H11zM0 11h9.5v9.5H0zM11 11h9.5v9.5H11z" className="fill-[#FF5A36]" />
        <text x="26" y="15" className="font-bold text-xs tracking-[0.05em] fill-[#211F1D]">Microsoft Research</text>
      </svg>
    ),
  },
  {
    name: "ISRO Space",
    logo: (
      <svg className="h-6 fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="18" className="font-extrabold text-sm tracking-[0.3em] fill-[#2F6B4F]">ISRO</text>
      </svg>
    ),
  },
  {
    name: "IIT Madras",
    logo: (
      <svg className="h-5 fill-current" viewBox="0 0 140 20" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="16" className="font-bold text-sm tracking-wide fill-[#211F1D]">IIT Madras</text>
      </svg>
    ),
  },
];

export default function TrustedOrgs() {
  return (
    <section className="py-10 bg-[#EFE9DF] border-b border-[#E2DCD2] relative z-10 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-[#78716A] mb-8">
          Trusted by Academic Research Institutes & Enterprise Sponsors
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-center p-3 rounded-xl hover:bg-[#FBF7F0] hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              {org.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
