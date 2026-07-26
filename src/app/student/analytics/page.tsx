"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, RefreshCw, BarChart2, Star, BookOpen, Clock,
  DollarSign, Download, Loader2, CheckCircle2, Award, ArrowUpRight,
  Zap, Activity
} from "lucide-react";

interface AnalyticsData {
  kpis: {
    cgpa: number;
    milestonesCompleted: number;
    tasksCompleted: number;
    mentorshipScore: number;
    attendanceRate: number;
    stipendEarned: number;
  };
  monthlyProgress: Array<{ month: string; score: number }>;
  projectMilestones: Array<{ name: string; progress: number; status: string }>;
  skillMastery: Array<{ skill: string; score: number }>;
}

const MILESTONE_COLORS: Record<string, { bg: string; text: string }> = {
  COMPLETED:   { bg: "#E8F2EC", text: "#2F6B4F" },
  IN_PROGRESS: { bg: "#FFF0ED", text: "#FF5A36" },
  PENDING:     { bg: "#FEF3C7", text: "#92400E" },
};

export default function StudentAnalyticsPage() {
  const [data, setData]     = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/student/analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        <p className="text-xs text-[#78716A] font-semibold">Crunching your performance data…</p>
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { label: "Academic CGPA",    value: `${data.kpis.cgpa}`,                icon: TrendingUp,   color: "#FF5A36", bg: "#FFF0ED" },
    { label: "Milestones Done",  value: `${data.kpis.milestonesCompleted}`, icon: CheckCircle2, color: "#4338CA", bg: "#EEF2FF" },
    { label: "Mentor Score",     value: `★ ${data.kpis.mentorshipScore}`,   icon: Star,         color: "#92400E", bg: "#FEF3C7" },
    { label: "Stipend Earned",   value: formatCurrency(data.kpis.stipendEarned), icon: DollarSign, color: "#2F6B4F", bg: "#E8F2EC" },
  ];

  const maxScore = Math.max(...(data.monthlyProgress || []).map(m => m.score), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] uppercase tracking-widest">
            Performance Analytics
          </span>
          <h1 className="text-2xl font-extrabold text-[#211F1D] mt-1">
            Enterprise Student Analytics
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            Comprehensive view of your CGPA, milestone velocity, skill growth, and stipend earnings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="h-9 px-4 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#FF5A36]/30">
            <Download className="h-3.5 w-3.5" /> Export PDF
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
              <p className="text-xl font-extrabold text-[#211F1D]">{k.value}</p>
              <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{k.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
            <Activity className="h-4 w-4 text-[#4338CA]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#211F1D]">{data.kpis.tasksCompleted}</p>
            <p className="text-[10px] text-[#78716A] font-semibold uppercase">Tasks Completed</p>
          </div>
        </div>
        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
            <Zap className="h-4 w-4 text-[#92400E]" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-[#211F1D]">{data.kpis.attendanceRate}%</p>
            <p className="text-[10px] text-[#78716A] font-semibold uppercase">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly Progress Chart */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-[#FF5A36]" /> Monthly Competency Score
          </h3>
          <div className="flex items-end justify-between gap-2 h-44">
            {(data.monthlyProgress || []).map((m, i) => {
              const barH = Math.round((m.score / maxScore) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-extrabold text-[#57534E] opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.score}%
                  </span>
                  <div className="w-full bg-[#D8D2C7] rounded-t-lg overflow-hidden flex-1 flex items-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-[#FF5A36] to-[#FF8C6B] rounded-t-lg"
                      style={{ height: `${barH}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${barH}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#78716A] uppercase">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Mastery */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#FF5A36]" /> Technical Skill Proficiency
          </h3>
          <div className="space-y-4">
            {(data.skillMastery || []).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#211F1D]">{s.skill}</span>
                  <span className="text-xs font-extrabold text-[#FF5A36]">{s.score}%</span>
                </div>
                <div className="h-2 bg-[#D8D2C7] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF5A36] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.score}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Milestones */}
      {data.projectMilestones && data.projectMilestones.length > 0 && (
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#FF5A36]" /> Project Milestone Completion
          </h3>
          <div className="space-y-4">
            {data.projectMilestones.map((m, i) => {
              const meta = MILESTONE_COLORS[m.status] || MILESTONE_COLORS["PENDING"];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#211F1D]">{m.name}</span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.text }}>
                      {m.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="h-2 bg-[#D8D2C7] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: meta.text }}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-[#A8A196] font-semibold text-right">{m.progress}% complete</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
