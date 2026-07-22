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
  DRAFT:         { label: "Draft",         color: "text-slate-600",   bg: "bg-slate-100",  dot: "bg-slate-400" },
  SUBMITTED:     { label: "Submitted",     color: "text-blue-600",    bg: "bg-blue-50",    dot: "bg-blue-500" },
  UNDER_REVIEW:  { label: "Under Review",  color: "text-amber-600",   bg: "bg-amber-50",   dot: "bg-amber-500" },
  APPROVED:      { label: "Approved",      color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  PLANNING:      { label: "Planning",      color: "text-purple-700",  bg: "bg-purple-50",  dot: "bg-purple-500" },
  IN_PROGRESS:   { label: "In Progress",   color: "text-primary-text", bg: "bg-primary-light", dot: "bg-primary" },
  TESTING:       { label: "Testing",       color: "text-teal-700",    bg: "bg-teal-50",    dot: "bg-teal-500" },
  COMPLETED:     { label: "Completed",     color: "text-green-700",   bg: "bg-green-50",   dot: "bg-green-500" },
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
          <h1 className="text-xl font-bold text-slate-900">Projects Control Console</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track milestone sprints, assign subject experts, request budget changes, and check risk logs</p>
        </div>
        <button onClick={fetchProjects} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* KPI Widgets */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Active Project Contracts", value: stats.total, icon: Briefcase, bg: "bg-blue-50", color: "text-blue-600" },
            { label: "Allocated Budget", value: formatCurrency(stats.totalBudget), icon: Wallet, bg: "bg-green-50", color: "text-green-600" },
            { label: "Average Completion Progress", value: `${stats.avgProgress}%`, icon: TrendingUp, bg: "bg-purple-50", color: "text-purple-600" },
            { label: "Identified Active Risks", value: stats.activeRisks, icon: AlertTriangle, bg: "bg-orange-50", color: "text-orange-600" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className={`h-4.5 w-4.5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-800 leading-tight">{item.value}</div>
                  <div className="text-[9px] text-slate-500 font-semibold leading-tight mt-0.5">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Stage:</span>
          {["ALL", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW"].map(lifecycle => (
            <button
              key={lifecycle}
              onClick={() => setLifecycleFilter(lifecycle)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                lifecycleFilter === lifecycle
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Active Projects</p>
          <p className="text-[10px] text-slate-400 mt-1">Submit a problem statement or coordinate with advisors to launch a new research project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => {
            const style = LIFECYCLE_STYLES[p.lifecycle] || LIFECYCLE_STYLES.IN_PROGRESS;
            return (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded border shrink-0 flex items-center gap-1 ${style.bg} ${style.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} /> {style.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                    <span>Task Progress</span>
                    <span>{p.progress}% completed ({p.tasksCompleted}/{p.tasksCount} Tasks)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                {/* Meta details footer */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px]">
                  <div className="flex gap-4 font-semibold text-slate-500">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 block uppercase font-bold">Allocated Budget</span>
                      <span className="text-slate-800">{formatCurrency(p.budget)}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-slate-400 block uppercase font-bold">Subject Advisor</span>
                      <span className="text-slate-800 truncate max-w-[120px] block">{p.experts[0]?.name || "—"}</span>
                    </div>
                  </div>
                  <Link
                    href={`/industry/projects/${p.id}`}
                    className="h-7 px-3 bg-slate-50 border border-slate-200 hover:border-primary hover:bg-primary-light text-slate-650 hover:text-primary rounded-lg font-bold flex items-center gap-0.5 transition-all text-[10px]"
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
