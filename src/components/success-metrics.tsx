"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert, Fingerprint, Award, Layers, TrendingUp } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

const defaultMetrics: Metric[] = [
  { id: "industries", label: "Registered Industries", value: 48, suffix: "+" },
  { id: "experts", label: "Vetted Subject Experts", value: 124, suffix: "+" },
  { id: "projects", label: "Active R&D Contracts", value: 180, suffix: "+" },
  { id: "collaborations", label: "Research Partnerships", value: 92, suffix: "%" },
  { id: "internships", label: "Student Internships", value: 1200, suffix: "+" },
];

const whyChooseItems = [
  {
    title: "Cryptographic IP Protection",
    description: "Strict isolation protocols prevent industries and experts from identifying each other until mutual NDAs are digitally signed and hashed.",
    icon: Fingerprint,
  },
  {
    title: "Vetted Expertise Gate",
    description: "Every academic researcher and technical expert is strictly verified by AnveshakHub Admin through credential audits before team assignment.",
    icon: Award,
  },
  {
    title: "Ironclad SLA Enforcement",
    description: "SLA trackers manage submissions, feasibility reviews, and expert matches, sending automatic notifications on milestone deadlines.",
    icon: ShieldAlert,
  },
  {
    title: "Immutable Auditing Logs",
    description: "Every account validation, problem statement modification, and milestone approval writes to an unalterable, transaction-safe audit trail.",
    icon: Layers,
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1400;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutProgress = progress * (2 - progress);
      setCount(Math.floor(easeOutProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function SuccessMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);

  useEffect(() => {
    fetch("/api/landing/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.industries || data.experts)) {
          setMetrics([
            { id: "industries", label: "Registered Industries", value: data.industries || 48, suffix: "+" },
            { id: "experts", label: "Vetted Subject Experts", value: data.experts || 124, suffix: "+" },
            { id: "projects", label: "Active R&D Contracts", value: data.projects || 180, suffix: "+" },
            { id: "collaborations", label: "Research Partnerships", value: data.problemStatements || 92, suffix: "+" },
            { id: "internships", label: "Student Internships", value: data.students || 1200, suffix: "+" },
          ]);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <section className="py-24 bg-[#EFE9DF] text-[#57534E] border-b border-[#E2DCD2] relative font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Metrics Bar */}
        <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-3xl p-8 shadow-md mb-24">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36] flex items-center justify-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> Live Platform Metrics
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2DCD2]">
            {metrics.map((item) => (
              <div key={item.id} className="pt-4 md:pt-0 px-2 group cursor-default">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors">
                  <AnimatedCounter target={item.value} suffix={item.suffix} />
                </p>
                <p className="text-xs font-semibold text-[#57534E] mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A36]">
            ENTERPRISE SECURITY & COMPLIANCE
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-[#211F1D] sm:text-4xl tracking-tight font-heading">
            Why Leading R&D Organizations Choose AnveshakHub
          </h2>
          <p className="mt-4 text-base text-[#57534E] leading-relaxed font-medium">
            Built from the ground up for zero IP leaks, cryptographic verification, and strict SLA compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {whyChooseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-8 shadow-sm hover:border-[#FF5A36]/60 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-5 text-left group cursor-default"
              >
                <div className="h-12 w-12 rounded-xl bg-[#FFF0ED] border border-[#FFCFC4] flex items-center justify-center text-[#FF5A36] shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#211F1D] mb-2 group-hover:text-[#FF5A36] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
