"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldAlert, Fingerprint, Award, Layers } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

const initialMetrics: Metric[] = [
  { id: "industries", label: "Registered Industries", value: 124, suffix: "+" },
  { id: "experts", label: "Vetted Subject Experts", value: 480, suffix: "+" },
  { id: "projects", label: "Active Project Contracts", value: 312, suffix: "" },
  { id: "collaborations", label: "Research Partnerships", value: 185, suffix: "+" },
  { id: "internships", label: "Student Internships Deployments", value: 650, suffix: "+" },
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
    description: "SLA trackers manage submissions, feasibility reviews, and expert matches, sending automatic notifications on milestone approaching.",
    icon: ShieldAlert,
  },
  {
    title: "Immutable Auditing Logs",
    description: "Every account validation, problem statement modification, and milestone approval writes to an unalterable, transaction-safe audit trail.",
    icon: Layers,
  },
];

// Reusable Counter Component
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quadratic
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
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [loading, setLoading] = useState(false);

  // Ready for API integration:
  useEffect(() => {
    // Simulated backend API fetch from NestJS
    // fetch('/api/metrics')
    //   .then(res => res.json())
    //   .then(data => setMetrics(data))
    //   .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= WHY CHOOSE ANVESHAKHUB ================= */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Enterprise Trust
            </h2>
            <p className="mt-3 text-3xl font-extrabold text-secondary sm:text-4xl tracking-tight">
              Why Global Enterprises Choose AnveshakHub
            </p>
            <p className="mt-4 text-base text-slate-600">
              Built from the ground up for strict confidentiality, regulatory compliance, and high-impact milestone execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {whyChooseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex gap-4 p-6 bg-slate-50 border border-slate-200/60 rounded-xl"
                >
                  <div className="shrink-0 h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-secondary">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= SUCCESS METRICS SECTION ================= */}
        <div className="bg-secondary rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Subtle background nodes decoration */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-6 text-center">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-blue-400">
                  <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                </span>
                <span className="mt-3 text-xs sm:text-sm font-medium text-slate-300 max-w-[140px]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
