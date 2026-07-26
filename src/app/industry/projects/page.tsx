"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, Filter, RefreshCw, Eye, ChevronRight,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2, AlertTriangle, Activity
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  description: string;
  lifecycle: string;
  budget: number;
  startDate: string;
  endDate: string;
  progress: number;
  tasksCount: number;
  tasksCompleted: number;
  risksCount: number;
  budgetUsed: number;
  experts: Array<{ name: string }>;
}

interface Stats {
  total: number;
  totalBudget: number;
  avgProgress: number;
  activeRisks: number;
  completedTasks: number;
}

const LIFECYCLE_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  DRAFT:         { label: "Draft",         color: "text-[#57534E]",   bg: "bg-[#EFE9DF]",  dot: "bg-[#A8A196]" },
  SUBMITTED:     { label: "Submitted",     color: "text-[#FF5A36]",    bg: "bg-[#FFF0ED]",    dot: "bg-[#FFF0ED]0" },
  UNDER_REVIEW:  { label: "Under Review",  color: "text-amber-600",   bg: "bg-[#FEF3C7]",   dot: "bg-[#FEF3C7]0" },
  APPROVED:      { label: "Approved",      color: "text-[#2F6B4F]", bg: "bg-[#E8F2EC]", dot: "bg-[#E8F2EC]0" },
  PLANNING:      { label: "Planning",      color: "text-purple-700",  bg: "bg-purple-50",  dot: "bg-purple-500" },
  IN_PROGRESS:   { label: "In Progress",   color: "text-[#FF5A36]-text", bg: "bg-[#FFF0ED]", dot: "bg-[#FF5A36]" },
  TESTING:       { label: "Testing",       color: "text-teal-700",    bg: "bg-teal-50",    dot: "bg-teal-500" },
  COMPLETED:     { label: "Completed",     color: "text-[#2F6B4F]",   bg: "bg-[#E8F2EC]",   dot: "bg-[#E8F2EC]0" },
};

export default function IndustryProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("ALL");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        lifecycle: lifecycleFilter === "ALL" ? "" : lifecycleFilter
      });
      const res = await fetch(`/api/industry/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, lifecycleFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Projects Control Console</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Track milestone sprints, assign subject experts, request budget changes, and check risk logs</p>
        </div>
        <button onClick={fetchProjects} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* KPI Widgets */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Active Project Contracts", value: stats.total, icon: Briefcase, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
            { label: "Allocated Budget", value: formatCurrency(stats.totalBudget), icon: Wallet, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
            { label: "Average Completion Progress", value: `${stats.avgProgress}%`, icon: TrendingUp, bg: "bg-purple-50", color: "text-purple-600" },
            { label: "Identified Active Risks", value: stats.activeRisks, icon: AlertTriangle, bg: "bg-[#FFF4ED]", color: "text-orange-600" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-flat rounded-2xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className={`h-[1.125rem] w-[1.125rem] ${item.color}`} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-[#211F1D] leading-tight">{item.value}</div>
                  <div className="text-[10px] text-[#78716A] font-semibold leading-tight mt-0.5">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#A8A196] uppercase">Stage:</span>
          {["ALL", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW"].map(lifecycle => (
            <button
              key={lifecycle}
              onClick={() => setLifecycleFilter(lifecycle)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                lifecycleFilter === lifecycle
                  ? "bg-[#FF5A36] text-white border-[#FF5A36]"
                  : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2] hover:bg-[#E6DFD4]"
              }`}
            >
              {lifecycle.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <Briefcase className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Active Projects</p>
          <p className="text-[10px] text-[#A8A196] mt-1">Submit a problem statement or coordinate with advisors to launch a new research project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => {
            const style = LIFECYCLE_STYLES[p.lifecycle] || LIFECYCLE_STYLES.IN_PROGRESS;
            return (
              <div key={p.id} className="card-flat rounded-2xl p-5 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-[#78716A] leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border shrink-0 flex items-center gap-1 ${style.bg} ${style.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {style.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-semibold text-[#78716A]">
                    <span>Task Progress</span>
                    <span>{p.progress}% completed ({p.tasksCompleted}/{p.tasksCount} Tasks)</span>
                  </div>
                  <div className="h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                {/* Meta details footer */}
                <div className="border-t border-[#E2DCD2] pt-3 flex items-center justify-between text-[10px]">
                  <div className="flex gap-4 font-semibold text-[#78716A]">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-[#A8A196] block uppercase font-bold">Allocated Budget</span>
                      <span className="text-[#211F1D]">{formatCurrency(p.budget)}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-[#A8A196] block uppercase font-bold">Subject Advisor</span>
                      <span className="text-[#211F1D] truncate max-w-[120px] block">{p.experts[0]?.name || "—"}</span>
                    </div>
                  </div>
                  <Link
                    href={`/industry/projects/${p.id}`}
                    className="h-7 px-3 bg-[#FBF7F0] border border-[#E2DCD2] hover:border-[#FF5A36] hover:bg-[#FFF0ED] text-[#57534E] hover:text-[#FF5A36] rounded-lg font-bold flex items-center gap-0.5 transition-all text-[10px]"
                  >
                    Control Panel <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
