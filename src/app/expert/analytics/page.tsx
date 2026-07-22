"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, RefreshCw, BarChart2, Star, BookOpen, Clock,
  DollarSign, Download, Loader2, CheckCircle2, Award
} from "lucide-react";

interface AnalyticsData {
  kpis: {
    projectCompletionRate: number;
    mentorshipScore: number;
    citationsCount: number;
    hIndex: number;
    totalConsultancyEarnings: number;
    totalConsultationHours: number;
  };
  monthlyEarnings: Array<{ month: string; earnings: number }>;
  projectPerformance: Array<{ name: string; progress: number; status: string }>;
  mentorshipBreakdown: Array<{ student: string; score: number; tasksCompleted: number }>;
}

export default function ExpertAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/analytics");
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
          <h1 className="text-xl font-bold text-slate-900">Enterprise Expert Analytics & Insights</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive metrics on project R&D execution, mentorship impact, research citations, and consultancy earnings</p>
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
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.projectCompletionRate}%</div>
            <div className="text-[9px] text-slate-400 font-bold">Project Completion Rate</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-purple-600" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">★ {data.kpis.mentorshipScore}</div>
            <div className="text-[9px] text-slate-400 font-bold">Mentorship Impact Rating</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.citationsCount}</div>
            <div className="text-[9px] text-slate-400 font-bold">Total Citations (H-Index: {data.kpis.hIndex})</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.totalConsultancyEarnings)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Consultancy Revenue</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Monthly Consultancy Payout Trend</h3>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {data.monthlyEarnings.map((m, i) => {
              const max = 100000;
              const heightPct = Math.round((m.earnings / max) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[8px] font-extrabold text-slate-600">₹{(m.earnings / 1000).toFixed(0)}k</span>
                  <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-32 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
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

        {/* Project Performance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Active R&D Milestone Velocity</h3>
          <div className="space-y-4 pt-2">
            {data.projectPerformance.map((p, i) => (
              <div key={i} className="space-y-1.5 border border-slate-100 rounded-xl p-3.5 bg-slate-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-extrabold text-primary">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
