"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, RefreshCw, Download, Award, Users,
  Briefcase, Wallet, CheckCircle2, PieChart, Star, Loader2,
  Calendar, Layers, ArrowUpRight
} from "lucide-react";

interface AnalyticsData {
  orgName: string;
  executiveKpi: {
    problemStatementConversionRate: number;
    activeProjectsCount: number;
    completedProjectsCount: number;
    totalBudgetSpent: number;
    totalGrantsDisbursed: number;
    expertConsultationsCount: number;
    placedInternsCount: number;
    avgProjectSuccessScore: number;
  };
  domainBreakdown: Array<{
    domain: string;
    percentage: number;
    projectsCount: number;
  }>;
  milestoneProgress: Array<{
    status: string;
    count: number;
  }>;
  expertEngagementTrend: Array<{
    month: string;
    sessions: number;
    rating: number;
  }>;
}

export default function ExecutiveAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("FY2026");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industry/analytics");
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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Executive Analytics & KPI Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-level organizational performance, conversion metrics, expert ROI & burn rate analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {["FY2026", "Q2_2026", "LAST_12_MONTHS"].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`h-8 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                timeframe === t ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
          <button onClick={fetchAnalytics} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="h-8 px-3 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export PDF Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !data ? null : (
        <>
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wide">Problem Statement Conversion</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-emerald-700">{data.executiveKpi.problemStatementConversionRate}%</div>
              <p className="text-[9px] text-slate-400 font-semibold">5 of 6 translated to active R&D</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wide">Total Budget Deployed</span>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{formatCurrency(data.executiveKpi.totalBudgetSpent)}</div>
              <p className="text-[9px] text-purple-600 font-bold">{formatCurrency(data.executiveKpi.totalGrantsDisbursed)} from Grants</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wide">Expert Consultation ROI</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-xl font-extrabold text-blue-700">{data.executiveKpi.expertConsultationsCount} Sessions</div>
              <p className="text-[9px] text-slate-400 font-semibold">★ {data.executiveKpi.avgProjectSuccessScore}/5 Avg Success Rating</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wide">Student Placements</span>
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-xl font-extrabold text-amber-700">{data.executiveKpi.placedInternsCount} Interns</div>
              <p className="text-[9px] text-slate-400 font-semibold">Across IIT Madras & IISc labs</p>
            </div>
          </div>

          {/* Domain Breakdown & Milestone Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Technology Domain Distribution</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Focus areas across active and completed R&D projects</p>
                </div>
                <PieChart className="h-4 w-4 text-primary" />
              </div>

              <div className="space-y-3 pt-2">
                {data.domainBreakdown.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{item.domain} ({item.projectsCount} projects)</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Project Milestone Breakdown</h3>
              <div className="space-y-3">
                {data.milestoneProgress.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border border-slate-100 rounded-xl p-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-700">{m.status.replace("_", " ")}</span>
                    <span className="text-sm font-extrabold text-primary">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
