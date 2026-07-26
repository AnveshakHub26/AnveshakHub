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
          <h1 className="text-xl font-bold text-[#211F1D]">Executive Analytics & KPI Studio</h1>
          <p className="text-xs text-[#78716A] mt-0.5">High-level organizational performance, conversion metrics, expert ROI & burn rate analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {["FY2026", "Q2_2026", "LAST_12_MONTHS"].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`h-8 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                timeframe === t ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2] hover:bg-[#EFE9DF]"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
          <button onClick={fetchAnalytics} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="h-8 px-3 bg-[#1C1917] text-white rounded-lg text-xs font-bold hover:bg-[#0F0E0C] flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export PDF Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : !data ? null : (
        <>
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A8A196]">
                <span className="text-[10px] font-bold uppercase tracking-wide">Problem Statement Conversion</span>
                <TrendingUp className="h-4 w-4 text-[#2F6B4F]" />
              </div>
              <div className="text-xl font-extrabold text-[#2F6B4F]">{data.executiveKpi.problemStatementConversionRate}%</div>
              <p className="text-[10px] text-[#A8A196] font-semibold">5 of 6 translated to active R&D</p>
            </div>

            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A8A196]">
                <span className="text-[10px] font-bold uppercase tracking-wide">Total Budget Deployed</span>
                <Wallet className="h-4 w-4 text-[#FF5A36]" />
              </div>
              <div className="text-xl font-extrabold text-[#211F1D]">{formatCurrency(data.executiveKpi.totalBudgetSpent)}</div>
              <p className="text-[10px] text-purple-600 font-bold">{formatCurrency(data.executiveKpi.totalGrantsDisbursed)} from Grants</p>
            </div>

            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A8A196]">
                <span className="text-[10px] font-bold uppercase tracking-wide">Expert Consultation ROI</span>
                <Users className="h-4 w-4 text-[#FF5A36]" />
              </div>
              <div className="text-xl font-extrabold text-[#FF5A36]">{data.executiveKpi.expertConsultationsCount} Sessions</div>
              <p className="text-[10px] text-[#A8A196] font-semibold">★ {data.executiveKpi.avgProjectSuccessScore}/5 Avg Success Rating</p>
            </div>

            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-[#A8A196]">
                <span className="text-[10px] font-bold uppercase tracking-wide">Student Placements</span>
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-xl font-extrabold text-[#B45309]">{data.executiveKpi.placedInternsCount} Interns</div>
              <p className="text-[10px] text-[#A8A196] font-semibold">Across IIT Madras & IISc labs</p>
            </div>
          </div>

          {/* Domain Breakdown & Milestone Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Technology Domain Distribution</h3>
                  <p className="text-[10px] text-[#A8A196] mt-0.5">Focus areas across active and completed R&D projects</p>
                </div>
                <PieChart className="h-4 w-4 text-[#FF5A36]" />
              </div>

              <div className="space-y-3 pt-2">
                {data.domainBreakdown.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#211F1D]">
                      <span>{item.domain} ({item.projectsCount} projects)</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Project Milestone Breakdown</h3>
              <div className="space-y-3">
                {data.milestoneProgress.map((m, i) => (
                  <div key={i} className="flex items-center justify-between border border-[#E2DCD2] rounded-xl p-3 bg-[#FBF7F0]">
                    <span className="text-xs font-bold text-[#211F1D]">{m.status.replace("_", " ")}</span>
                    <span className="text-sm font-extrabold text-[#FF5A36]">{m.count}</span>
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
