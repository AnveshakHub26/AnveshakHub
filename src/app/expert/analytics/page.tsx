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
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Enterprise Expert Analytics & Insights</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Comprehensive metrics on project R&D execution, mentorship impact, research citations, and consultancy earnings</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button className="h-8 px-3 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Download className="h-3.5 w-3.5" /> Export Analytics PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] text-[#FF5A36] flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#211F1D]">{data.kpis.projectCompletionRate}%</div>
            <div className="text-[10px] text-[#A8A196] font-bold">Project Completion Rate</div>
          </div>
        </div>

        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-purple-600" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#211F1D]">★ {data.kpis.mentorshipScore}</div>
            <div className="text-[10px] text-[#A8A196] font-bold">Mentorship Impact Rating</div>
          </div>
        </div>

        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] text-[#2F6B4F] flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#211F1D]">{data.kpis.citationsCount}</div>
            <div className="text-[10px] text-[#A8A196] font-bold">Total Citations (H-Index: {data.kpis.hIndex})</div>
          </div>
        </div>

        <div className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0 font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-[#211F1D]">{formatCurrency(data.kpis.totalConsultancyEarnings)}</div>
            <div className="text-[10px] text-[#A8A196] font-bold">Consultancy Revenue</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Monthly Consultancy Payout Trend</h3>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {data.monthlyEarnings.map((m, i) => {
              const max = 100000;
              const heightPct = Math.round((m.earnings / max) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[8px] font-extrabold text-[#57534E]">₹{(m.earnings / 1000).toFixed(0)}k</span>
                  <div className="w-full bg-[#EFE9DF] rounded-t-lg overflow-hidden h-32 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ delay: i * 0.05 }}
                      className="w-full bg-[#FF5A36] rounded-t-lg"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#78716A] uppercase">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Active R&D Milestone Velocity</h3>
          <div className="space-y-4 pt-2">
            {data.projectPerformance.map((p, i) => (
              <div key={i} className="space-y-1.5 border border-[#E2DCD2] rounded-xl p-3.5 bg-[#FBF7F0]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#211F1D]">{p.name}</span>
                  <span className="font-extrabold text-[#FF5A36]">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#D8D2C7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
