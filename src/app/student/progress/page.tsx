"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Award, Star, BookOpen, Clock, Download, RefreshCw,
  Loader2, CheckCircle2, ShieldCheck, Trophy, Flame, Target,
  ArrowUpRight, Calendar, ChevronRight
} from "lucide-react";

interface ProgressData {
  academicSummary: {
    cgpa: number;
    completedSemesters: number;
    creditsEarned: number;
    classRank: number;
  };
  growthMetrics: {
    milestonesCompleted: number;
    internshipsCompleted: number;
    mentorshipScore: number;
    attendanceRate: number;
  };
  skillVelocity: Array<{
    skill: string;
    level: string;
    progress: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    category: string;
    issuer: string;
    year: number;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    category: string;
  }>;
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "#A8A196",
  Intermediate: "#FF5A36",
  Advanced:     "#4338CA",
  Expert:       "#2F6B4F",
};

export default function StudentProgressPage() {
  const [data, setData]     = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/student/progress");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        <p className="text-xs text-[#78716A] font-semibold">Loading your growth report…</p>
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { label: "CGPA",            value: `${data.academicSummary.cgpa}`,          sub: `Rank #${data.academicSummary.classRank}`,                    icon: TrendingUp,    color: "#FF5A36", bg: "#FFF0ED" },
    { label: "Credits Earned",  value: `${data.academicSummary.creditsEarned}`,  sub: `${data.academicSummary.completedSemesters} Sems done`,       icon: BookOpen,      color: "#4338CA", bg: "#EEF2FF" },
    { label: "Milestones",      value: `${data.growthMetrics.milestonesCompleted}`, sub: `${data.growthMetrics.internshipsCompleted} internships`, icon: CheckCircle2,  color: "#2F6B4F", bg: "#E8F2EC" },
    { label: "Mentor Rating",   value: `★ ${data.growthMetrics.mentorshipScore}`, sub: "Out of 10",                                                 icon: Star,          color: "#92400E", bg: "#FEF3C7" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#4338CA]/10 text-[#4338CA] uppercase tracking-widest">
            Growth Console
          </span>
          <h1 className="text-2xl font-extrabold text-[#211F1D] mt-1">
            Academic & Professional Progress
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            CGPA trends, milestone velocity, mentor scores — all in one view.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProgress} className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="h-9 px-4 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#FF5A36]/30">
            <Download className="h-3.5 w-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                <k.icon className="h-5 w-5" style={{ color: k.color }} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#A8A196]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#211F1D]">{k.value}</p>
              <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{k.label}</p>
              <p className="text-[10px] text-[#A8A196] mt-0.5">{k.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendance Banner */}
      <div className="bg-[#211F1D] rounded-2xl p-5 flex items-center justify-between overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-[#FF5A36]/20 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#FF5A36]/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-[#FF5A36]" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">Attendance Rate</p>
            <p className="text-[#A8A196] text-xs">Based on all scheduled sessions this term</p>
          </div>
        </div>
        <div className="text-right z-10">
          <p className="text-4xl font-extrabold text-[#FF5A36]">{data.growthMetrics.attendanceRate}%</p>
          <p className="text-[10px] text-[#78716A] uppercase tracking-wide font-semibold">Session attendance</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Skill Velocity */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
              <Target className="h-4 w-4 text-[#FF5A36]" /> Skill Mastery Velocity
            </h3>
            <span className="text-[10px] font-bold text-[#78716A]">{data.skillVelocity.length} tracked skills</span>
          </div>
          <div className="space-y-5">
            {data.skillVelocity.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.07 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#211F1D]">{s.skill}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase"
                      style={{ background: (LEVEL_COLORS[s.level] || "#A8A196") + "18", color: LEVEL_COLORS[s.level] || "#A8A196" }}
                    >
                      {s.level}
                    </span>
                    <span className="text-xs font-extrabold text-[#FF5A36]">{s.progress}%</span>
                  </div>
                </div>
                <div className="h-2 bg-[#D8D2C7] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: LEVEL_COLORS[s.level] || "#FF5A36" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.07, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#FF5A36]" /> Honors, Awards & Fellowships
          </h3>
          <div className="space-y-3">
            {data.achievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-8 w-8 text-[#D8D2C7] mx-auto mb-2" />
                <p className="text-xs text-[#78716A] font-semibold">No achievements recorded yet</p>
              </div>
            ) : data.achievements.map((ach, idx) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.07 }}
                className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between hover:border-[#FF5A36]/40 transition-colors"
              >
                <div>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4338CA] uppercase">
                    {ach.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#211F1D] mt-1">{ach.title}</h4>
                  <p className="text-[10px] text-[#78716A] font-semibold">{ach.issuer}</p>
                </div>
                <span className="text-sm font-extrabold text-[#FF5A36]">{ach.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FF5A36]" /> Activity Timeline
          </h3>
          <div className="relative pl-5 space-y-0">
            {/* Vertical line */}
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-[#D8D2C7]" />
            {data.timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="relative pb-4"
              >
                <div className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-[#FF5A36] border-2 border-[#EFE9DF]" />
                <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 ml-2">
                  <p className="text-xs font-bold text-[#211F1D]">{item.event}</p>
                  <p className="text-[10px] text-[#78716A] font-semibold mt-0.5">
                    {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#A8A196]">{item.category}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
