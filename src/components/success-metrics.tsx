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

const defaultMetrics: Metric[] = [
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

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1800;

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
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch("/api/landing/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.industries) {
          setMetrics([
            { id: "industries", label: "Registered Industries", value: data.industries, suffix: "+" },
            { id: "experts", label: "Vetted Subject Experts", value: data.experts, suffix: "+" },
            { id: "projects", label: "Active Project Contracts", value: data.projects, suffix: "" },
            { id: "collaborations", label: "Research Partnerships", value: data.problemStatements, suffix: "+" },
            { id: "internships", label: "Student Internships Deployments", value: data.students, suffix: "+" },
          ]);
          setIsLive(true);
        }
      })
      .catch((err) => console.error("Error fetching live stats:", err));
  }, []);

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Why Choose Section */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              Enterprise Governance
            </span>
            <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Built for Security & High-Impact R&D
            </h2>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              Designed by enterprise architects to streamline complex research agreements while safeguarding IP integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Realtime Live Metrics Counter */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                Live Supabase PostgreSQL Telemetry
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Platform Impact Metrics</h3>
            </div>
            {isLive && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live PostgreSQL Stream
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
            {metrics.map((metric) => (
              <div key={metric.id} className="pt-4 md:pt-0 px-2">
                <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 tracking-tight">
                  <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                </p>
                <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-300">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
