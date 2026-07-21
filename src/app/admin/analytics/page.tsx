"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface ChartData {
  name: string;
  revenue: number;
  projects: number;
}

interface Stats {
  grantSuccessRate: string;
  verificationSlaCompliance: string;
  marketplaceFillRate: string;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [distribution, setDistribution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [timeRange, setTimeRange] = useState("30_DAYS");
  const [activeTab, setActiveTab] = useState("overview"); // overview, segments, comparative

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ timeRange });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const data = await res.json();
      setChartData(data.comparisonData || []);
      setStats(data.successMetrics || null);
      setDistribution(data.distribution || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Enterprise Analytics & Intelligence</h1>
            <p className="text-xs text-slate-500 mt-0.5">Ecosystem success ratios, comparatives, platform growth pipelines, and revenue trajectories</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="h-8 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none">
              <option value="7_DAYS">Last 7 Days</option>
              <option value="30_DAYS">Last 30 Days</option>
              <option value="90_DAYS">Last 90 Days</option>
              <option value="180_DAYS">Last 180 Days</option>
            </select>
            <button onClick={fetchAnalytics} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-655 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* ── Key Performance Indicators ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Grant Success Rate", value: stats.grantSuccessRate, icon: Award, bg: "bg-blue-50", color: "text-primary" },
              { label: "SLA compliance Rate", value: stats.verificationSlaCompliance, icon: ShieldCheck, bg: "bg-green-50", color: "text-green-600" },
              { label: "Marketplace Match Rate", value: stats.marketplaceFillRate, icon: UsersRound, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Data Telemetry Health", value: "Optimal", icon: CheckCircle2, bg: "bg-teal-50", color: "text-teal-650" }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-800">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-slate-100 pt-0 -mb-5">
          {[
            { key: "overview", label: "Executive Overview" },
            { key: "segments", label: "Module Distribution" },
            { key: "comparative", label: "Comparative Trends" }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── OVERVIEW TAB ──── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Comparative Line Chart Simulation */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ecosystem Growth Trajectory</h3>
                      <p className="text-[10px] text-slate-450 mt-0.5">Platform revenues vs Ongoing research projects</p>
                    </div>
                  </div>

                  <div className="h-64 flex items-end gap-3 justify-between pt-6 px-4">
                    {chartData.map((d) => {
                      const revHeight = `${Math.min(Math.round((d.revenue / 4500000) * 100), 100)}%`;
                      const projHeight = `${Math.min(Math.round((d.projects / 90) * 100), 100)}%`;
                      return (
                        <div key={d.name} className="flex-1 flex flex-col items-center h-full justify-end gap-2 group relative">
                          <div className="w-full flex items-end justify-center gap-1 h-[80%]">
                            {/* Revenue Bar */}
                            <div className="w-4 bg-primary rounded-t-sm transition-all" style={{ height: revHeight }} />
                            {/* Projects Bar */}
                            <div className="w-4 bg-indigo-400 rounded-t-sm transition-all" style={{ height: projHeight }} />
                          </div>
                          
                          {/* Hover Tooltip details */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-4 bg-slate-900 text-white rounded p-1.5 text-[8px] font-bold z-10 transition-opacity whitespace-nowrap">
                            Rev: {formatCurrency(d.revenue)} | Proj: {d.projects}
                          </div>

                          <span className="text-[9px] font-bold text-slate-500 uppercase">{d.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right distribution pane */}
                {distribution && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ecosystem Composition</h3>
                    <div className="space-y-4 text-xs font-semibold">
                      {[
                        { label: "Active Industry Partners", count: distribution.industries, total: 2000, color: "bg-blue-500" },
                        { label: "Verified Subject Experts", count: distribution.experts, total: 500, color: "bg-indigo-500" },
                        { label: "Enrolled Students", count: distribution.students, total: 2000, color: "bg-teal-500" }
                      ].map((item) => {
                        const pct = Math.round((item.count / item.total) * 100);
                        return (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-slate-700">
                              <span>{item.label}</span>
                              <span>{item.count}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ──── DISTRIBUTION TAB ──── */}
            {activeTab === "segments" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-primary" /> Segment Breakdown Details</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Auto-assess active verification compliance and committee decision distributions across all registered MSME, DST schemes, and student cohorts.</p>
              </div>
            )}

            {/* ──── COMPARATIVE TAB ──── */}
            {activeTab === "comparative" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><Info className="h-4.5 w-4.5 text-primary" /> Multi-Year Growth Comparatives</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Compare platform growth parameters between FY-25 and FY-26 cohorts to evaluate outreach conversions.</p>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
