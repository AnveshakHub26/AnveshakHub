"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Calendar, FileText, Landmark, Loader2,
  RefreshCw, TrendingUp, Wallet, CheckCircle2, ArrowRight,
  ShoppingBag, Clock, Bell, Zap, Activity, AlertCircle
} from "lucide-react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────
interface DashboardData {
  kpis: {
    activeProjects: number;
    pendingMeetings: number;
    openProblemStatements: number;
    grantApplications: number;
    platformCreditBalance: number;
  };
  projects: { id: string; name: string; progress: number; status: string; milestone: string }[];
  meetings: { id: string; title: string; time: string; platform: string; link: string }[];
  activities: { id: string; type: string; description: string; timestamp: string }[];
  financial: { allocatedBudget: number; disbursedAmount: number; remainingBalance: number; currency: string };
  quickActions: { label: string; href: string; icon: string }[];
}

// ─── Helpers ────────────────────────────────────────────────────────
function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

const QUICK_ICONS: Record<string, React.ElementType> = {
  FileText, Calendar, Landmark, ShoppingBag
};

const STATUS_STYLES: Record<string, string> = {
  ON_TRACK:     "bg-green-50 text-green-700 border-green-200",
  IN_PROGRESS:  "bg-blue-50 text-blue-700 border-blue-200",
  NEAR_COMPLETE:"bg-teal-50 text-teal-700 border-teal-200",
  DELAYED:      "bg-red-50 text-red-600 border-red-200",
};

const PLATFORM_COLORS: Record<string, string> = {
  GOOGLE_MEET:     "bg-red-50 text-red-600",
  MICROSOFT_TEAMS: "bg-blue-50 text-blue-600",
  ZOOM:            "bg-indigo-50 text-indigo-600",
  PHYSICAL:        "bg-slate-100 text-slate-600",
};

// ─── Main Page ─────────────────────────────────────────────────────
export default function IndustryDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industry/dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!data) return null;
  const { kpis, projects, meetings, activities, financial, quickActions } = data;

  return (
    <div className="p-8 space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Solaris Power Pvt Ltd · Real-time collaboration and project intelligence</p>
        </div>
        <button onClick={fetchDashboard} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Sync
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Active Projects", value: kpis.activeProjects, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Meetings", value: kpis.pendingMeetings, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Problem Statements", value: kpis.openProblemStatements, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Grant Applications", value: kpis.grantApplications, icon: Landmark, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Platform Credits", value: formatINR(kpis.platformCreditBalance), icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-800 leading-tight">{stat.value}</div>
                <div className="text-[9px] text-slate-500 font-semibold leading-tight truncate">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COLUMN (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Project Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-blue-500" /> Active Project Progress
              </h3>
              <Link href="/industry/projects" className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{proj.name}</span>
                      <span className="ml-2 text-[9px] text-slate-400 font-semibold">{proj.milestone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-700">{proj.progress}%</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold ${STATUS_STYLES[proj.status] || STATUS_STYLES.IN_PROGRESS}`}>
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Wallet className="h-4 w-4 text-emerald-500" /> Financial & Grant Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Allocated Budget", value: financial.allocatedBudget, color: "text-slate-700" },
                { label: "Disbursed Amount", value: financial.disbursedAmount, color: "text-green-600" },
                { label: "Remaining Balance", value: financial.remainingBalance, color: "text-blue-600" },
              ].map((f) => (
                <div key={f.label} className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className={`text-sm font-extrabold ${f.color}`}>{formatINR(f.value)}</div>
                  <div className="text-[9px] text-slate-500 font-semibold mt-0.5">{f.label}</div>
                </div>
              ))}
            </div>
            {/* Utilization bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                <span>Fund Utilization</span>
                <span>{Math.round((financial.disbursedAmount / financial.allocatedBudget) * 100)}% used</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  style={{ width: `${Math.round((financial.disbursedAmount / financial.allocatedBudget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = QUICK_ICONS[action.icon] || FileText;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                  >
                    <div className="h-8 w-8 bg-slate-100 group-hover:bg-emerald-100 rounded-lg flex items-center justify-center transition-colors shrink-0">
                      <Icon className="h-4 w-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (1/3) ── */}
        <div className="space-y-5">

          {/* Today's Meetings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-500" /> Today's Meetings
              </h3>
              <Link href="/industry/meetings" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {meetings.map((mtg) => (
                <div key={mtg.id} className="border border-slate-100 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-800 leading-snug">{mtg.title}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${PLATFORM_COLORS[mtg.platform] || PLATFORM_COLORS.PHYSICAL}`}>
                      {mtg.platform.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {mtg.time}
                    </span>
                    <a href={mtg.link} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-emerald-600 hover:underline">
                      Join Call →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-indigo-500" /> Recent Activity
            </h3>

            <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full bg-white border-2 border-emerald-400 shadow-sm" />
                  <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">{act.description}</p>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">
                    {new Date(act.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
