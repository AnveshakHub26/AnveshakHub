"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Calendar, FileText, Landmark, Loader2,
  RefreshCw, TrendingUp, Wallet, CheckCircle2, ArrowRight,
  Clock, Bell, Zap, Activity, ShieldCheck, Building2,
  DollarSign, Users, ArrowUpRight, ChevronRight
} from "lucide-react";
import Link from "next/link";

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

function formatINR(val: number) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000)   return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function IndustryDashboard() {
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industry/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs font-semibold text-[#57534E]">Loading Corporate Operations Centre…</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    activeProjects: 0,
    pendingMeetings: 0,
    openProblemStatements: 0,
    grantApplications: 0,
    platformCreditBalance: 0,
  };
  const projects  = data?.projects  || [];
  const meetings  = data?.meetings  || [];
  const activities = data?.activities || [];
  const financial = data?.financial || { allocatedBudget: 0, disbursedAmount: 0, remainingBalance: 0, currency: "INR" };

  const kpiCards = [
    { label: "Active R&D Projects",     value: kpis.activeProjects,         sub: "Milestones on schedule",    icon: Briefcase,    color: "#FF5A36", bg: "#FFF0ED" },
    { label: "Open Problem Statements", value: kpis.openProblemStatements,  sub: "Receiving expert proposals", icon: FileText,     color: "#4338CA", bg: "#EEF2FF" },
    { label: "Upcoming Meetings",       value: kpis.pendingMeetings,        sub: "Next session today",         icon: Calendar,     color: "#2F6B4F", bg: "#E8F2EC" },
    { label: "Grant Applications",      value: kpis.grantApplications,      sub: "Under review",               icon: Landmark,     color: "#92400E", bg: "#FEF3C7" },
  ];

  return (
    <div className="bg-[#FBF7F0] min-h-screen">

      {/* Top Banner */}
      <div className="bg-[#211F1D] px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] uppercase tracking-widest">
                  Industry Portal
                </span>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] flex items-center gap-1">
                  <ShieldCheck className="h-2.5 w-2.5" /> Enterprise Verified
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Corporate R&D Operations
              </h1>
              <p className="text-[#78716A] text-sm mt-1">
                Your R&D budget allocation, problem statement pipeline, and project delivery hub.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/industry/problem-statements"
                className="h-10 px-5 bg-[#FF5A36] text-white rounded-xl text-sm font-bold hover:bg-[#E04826] flex items-center gap-2 transition-colors shadow-md shadow-[#FF5A36]/30"
              >
                <FileText className="h-4 w-4" /> Post Problem Statement
              </Link>
              <button
                onClick={fetchDashboard}
                className="h-10 px-4 bg-[#3a3733] text-[#A8A196] hover:text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((k, i) => (
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
                <p className="text-3xl font-extrabold text-[#211F1D]">{k.value}</p>
                <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{k.label}</p>
                <p className="text-[10px] text-[#A8A196] mt-0.5">{k.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Active Projects */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#211F1D]">Active Sponsored Projects</h2>
                <Link
                  href="/industry/projects"
                  className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-10 text-center">
                  <Briefcase className="h-8 w-8 text-[#D8D2C7] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#211F1D]">No active projects yet</p>
                  <p className="text-xs text-[#78716A] mt-1">Post a problem statement to receive expert proposals.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.06 }}
                      className="bg-[#FBF7F0] rounded-xl border border-[#E2DCD2] p-4 space-y-3 hover:border-[#FF5A36]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-[#211F1D]">{proj.name}</h3>
                          <p className="text-xs text-[#78716A] mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-[#2F6B4F]" /> Milestone: {proj.milestone}
                          </p>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] flex-shrink-0">
                          {proj.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-[#57534E]">
                          <span>Completion Rate</span>
                          <span className="text-[#FF5A36] font-extrabold">{proj.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#D8D2C7] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${proj.progress}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + idx * 0.06, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Meetings */}
            {meetings.length > 0 && (
              <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#211F1D]">Upcoming Sessions</h2>
                  <Link href="/industry/meetings" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                    View All <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {meetings.slice(0, 3).map((mtg, idx) => (
                    <div key={mtg.id} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 text-[#4338CA]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#211F1D]">{mtg.title}</p>
                          <p className="text-[10px] text-[#78716A] font-semibold flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {new Date(mtg.time).toLocaleString("en-IN")}
                            <span className="ml-1 px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#A8A196]">{mtg.platform}</span>
                          </p>
                        </div>
                      </div>
                      <a href={mtg.link} target="_blank" rel="noopener noreferrer"
                        className="h-7 px-3 bg-[#2F6B4F] text-white rounded-lg text-[10px] font-bold hover:bg-[#245840] flex items-center gap-1 transition-colors flex-shrink-0">
                        Join
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Financial Panel */}
          <div className="lg:col-span-4 space-y-6">

            {/* Budget Overview */}
            <div className="bg-[#211F1D] rounded-2xl p-6 space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#FF5A36]/15 blur-2xl rounded-full" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-[#FF5A36]/15 flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-[#FF5A36]" />
                  </div>
                  <h3 className="text-sm font-extrabold text-white">Financial Overview</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#3a3733] rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-[#78716A] font-semibold">Total Budget</span>
                    <span className="text-sm font-extrabold text-white">{formatINR(financial.allocatedBudget)}</span>
                  </div>
                  <div className="bg-[#3a3733] rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-[#78716A] font-semibold">Disbursed</span>
                    <span className="text-sm font-extrabold text-[#2F6B4F]">{formatINR(financial.disbursedAmount)}</span>
                  </div>
                  <div className="bg-[#3a3733] rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-[#78716A] font-semibold">In Escrow</span>
                    <span className="text-sm font-extrabold text-[#FF5A36]">{formatINR(financial.remainingBalance)}</span>
                  </div>
                </div>

                {/* Budget bar */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-[10px] text-[#78716A] font-semibold uppercase">Budget Utilization</p>
                  <div className="h-2 bg-[#3a3733] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((financial.disbursedAmount / financial.allocatedBudget) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-right text-[10px] text-[#78716A]">
                    {Math.round((financial.disbursedAmount / financial.allocatedBudget) * 100)}% utilized
                  </p>
                </div>
              </div>

              <Link
                href="/industry/finance"
                className="relative w-full h-9 bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FF5A36]/30 transition-colors"
              >
                Manage Escrow & Budgets <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-extrabold text-[#57534E] uppercase tracking-widest">Quick Actions</h3>
              {[
                { label: "Post Problem Statement", href: "/industry/problem-statements", color: "#FF5A36", bg: "#FFF0ED", icon: FileText },
                { label: "Invite Expert Reviewer",  href: "/industry/projects",           color: "#4338CA", bg: "#EEF2FF", icon: Users },
                { label: "Browse Marketplace",      href: "/industry/marketplace",        color: "#2F6B4F", bg: "#E8F2EC", icon: Building2 },
                { label: "View Analytics",          href: "/industry/analytics",          color: "#92400E", bg: "#FEF3C7", icon: TrendingUp },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-3 p-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl hover:border-[#FF5A36]/40 hover:shadow-sm transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
                    <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
                  </div>
                  <span className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors flex-1">{a.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#A8A196] group-hover:text-[#FF5A36] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        {activities.length > 0 && (
          <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#FF5A36]" />
              <h3 className="text-sm font-extrabold text-[#211F1D]">Recent Activity</h3>
            </div>
            <div className="space-y-2">
              {activities.slice(0, 5).map((act, idx) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.04 }}
                  className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 flex items-start gap-3"
                >
                  <div className="h-6 w-6 rounded-full bg-[#FF5A36]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-3 w-3 text-[#FF5A36]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#211F1D]">{act.description}</p>
                    <p className="text-[10px] text-[#A8A196] mt-0.5">
                      {new Date(act.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
