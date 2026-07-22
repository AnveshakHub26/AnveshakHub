"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, RefreshCw, BarChart2, Star, BookOpen, Clock,
  DollarSign, Download, Loader2, CheckCircle2, Award
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

export default function StudentAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enterprise Student Analytics & Performance</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive analytics on CGPA progress, milestone velocity, skill competency growth & stipend earnings</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button className="h-8 px-3 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Download className="h-3.5 w-3.5" /> Export Analytics PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.cgpa} CGPA</div>
            <div className="text-[9px] text-slate-400 font-bold">Academic Grade Summary</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.milestonesCompleted} Milestones</div>
            <div className="text-[9px] text-slate-400 font-bold">{data.kpis.tasksCompleted} Tasks Completed</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">★ {data.kpis.mentorshipScore}</div>
            <div className="text-[9px] text-slate-400 font-bold">Lead Mentor Rating</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.stipendEarned)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Total Stipend Earned</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Monthly Competency Score Trend</h3>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {data.monthlyProgress.map((m, i) => {
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[8px] font-extrabold text-slate-600">{m.score}%</span>
                  <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${m.score}%` }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full bg-primary rounded-t-lg"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Mastery Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Technical Skill Proficiency</h3>
          <div className="space-y-4 pt-2">
            {data.skillMastery.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{s.skill}</span>
                  <span className="text-primary font-extrabold">{s.score}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
