"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Calendar, FileText, Landmark, Loader2,
  RefreshCw, TrendingUp, Wallet, CheckCircle2, ArrowRight,
  ShoppingBag, Clock, Bell, Zap, Activity, AlertCircle, ShieldCheck
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
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function IndustryDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
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

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs font-medium text-[#57534E]">Loading Industry Portal Dashboard...</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    activeProjects: 3,
    pendingMeetings: 2,
    openProblemStatements: 4,
    grantApplications: 1,
    platformCreditBalance: 250000,
  };

  const projects = data?.projects || [];
  const financial = data?.financial || { allocatedBudget: 5000000, disbursedAmount: 3200000, remainingBalance: 1800000, currency: "INR" };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Top Banner Header */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                  Industry Workspace
                </span>
                <span className="badge-[#2F6B4F]">
                  <ShieldCheck className="h-3 w-3" /> Enterprise Verified
                </span>
              </div>
              <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
                Corporate R&D Operations
              </h1>
            </div>

            <div className="flex gap-3">
              <Link href="/industry/problem-statements" className="btn-primary text-xs min-h-[40px]">
                <FileText className="h-4 w-4" /> Post New Problem Statement
              </Link>
              <button onClick={fetchDashboard} className="btn-secondary text-xs min-h-[40px]">
                <RefreshCw className="h-4 w-4" /> Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Active R&D Projects</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.activeProjects}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">Milestones on schedule</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Open Problem Statements</p>
            <p className="font-heading text-3xl font-extrabold text-[#FF5A36] mt-2">{kpis.openProblemStatements}</p>
            <p className="text-[11px] text-[#57534E] mt-1">Receiving expert proposals</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Allocated Budget</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{formatINR(financial.allocatedBudget)}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">{formatINR(financial.disbursedAmount)} disbursed</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Upcoming Meetings</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.pendingMeetings}</p>
            <p className="text-[11px] text-[#57534E] mt-1">Next session today at 3:00 PM</p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Active Projects List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-warm p-6 bg-[#EFE9DF] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h2 className="font-heading text-lg font-extrabold text-[#211F1D]">Active Sponsored Projects</h2>
                <Link href="/industry/projects" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-[#FBF7F0] rounded-xl border border-[#E2DCD2] space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading text-sm font-bold text-[#211F1D]">{proj.name}</h3>
                        <p className="text-xs text-[#78716A] mt-0.5">Current Milestone: {proj.milestone}</p>
                      </div>
                      <span className="badge-[#2F6B4F]">{proj.status}</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-[#57534E]">
                        <span>Completion Rate</span>
                        <span>{proj.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#D8D2C7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Financial Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-warm p-6 bg-[#EFE9DF] space-y-4">
              <h3 className="font-heading text-base font-bold text-[#211F1D]">Financial Overview</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2] flex justify-between">
                  <span className="text-[#78716A]">Total Budget</span>
                  <span className="font-bold text-[#211F1D]">{formatINR(financial.allocatedBudget)}</span>
                </div>

                <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2] flex justify-between">
                  <span className="text-[#78716A]">Disbursed to Experts</span>
                  <span className="font-bold text-[#2F6B4F]">{formatINR(financial.disbursedAmount)}</span>
                </div>

                <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2] flex justify-between">
                  <span className="text-[#78716A]">Escrow Remaining</span>
                  <span className="font-bold text-[#FF5A36]">{formatINR(financial.remainingBalance)}</span>
                </div>
              </div>

              <Link href="/industry/finance" className="btn-secondary w-full text-xs min-h-[40px]">
                Manage Escrow & Budgets
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
