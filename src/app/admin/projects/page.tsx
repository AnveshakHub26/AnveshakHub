"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Briefcase, Search, Filter, RefreshCw, Download, Plus, Eye,
  ArrowUpRight, Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  description: string;
  lifecycle: string;
  budget: number;
  startDate: string;
  endDate: string;
  industry: {
    orgName: string;
  };
  experts: Array<{ name: string }>;
  students: Array<{ name: string }>;
  progress: number;
  tasksCount: number;
  tasksCompleted: number;
  risksCount: number;
}

interface Stats {
  total: number;
  inProgress: number;
  planning: number;
  underReview: number;
  totalBudget: number;
  avgProgress: number;
  lifecycleList: string[];
}

// ─── Constants ─────────────────────────────────────────────────────

const LIFECYCLE_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  DRAFT:         { label: "Draft",         color: "text-slate-600",   bg: "bg-slate-100",  dot: "bg-slate-400" },
  SUBMITTED:     { label: "Submitted",     color: "text-blue-600",    bg: "bg-blue-50",    dot: "bg-blue-500" },
  UNDER_REVIEW:  { label: "Under Review",  color: "text-amber-600",   bg: "bg-amber-50",   dot: "bg-amber-500" },
  APPROVED:      { label: "Approved",      color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  PLANNING:      { label: "Planning",      color: "text-purple-650",  bg: "bg-purple-50",  dot: "bg-purple-500" },
  IN_PROGRESS:   { label: "In Progress",   color: "text-blue-700",    bg: "bg-blue-50/70", dot: "bg-blue-600" },
  TESTING:       { label: "Testing",       color: "text-teal-700",    bg: "bg-teal-50",    dot: "bg-teal-500" },
  CLIENT_REVIEW: { label: "Client Review", color: "text-pink-700",    bg: "bg-pink-50",    dot: "bg-pink-500" },
  COMPLETED:     { label: "Completed",     color: "text-green-700",   bg: "bg-green-50",   dot: "bg-green-500" },
  ARCHIVED:      { label: "Archived",      color: "text-slate-500",   bg: "bg-slate-100",  dot: "bg-slate-400" }
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function ProjectsDirectoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination & Sort state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("budget");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Project Creation Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectBudget, setNewProjectBudget] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectExpert, setNewProjectExpert] = useState("");
  const [newProjectProblem, setNewProjectProblem] = useState("");
  const [newProjectScope, setNewProjectScope] = useState("");
  const [wizardLoading, setWizardLoading] = useState(false);

  const LIMIT = 12;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        lifecycle: lifecycleFilter === "ALL" ? "" : lifecycleFilter,
        page: String(page),
        limit: String(LIMIT),
        sortBy,
        sortDir,
      });
      const res = await fetch(`/api/admin/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, lifecycleFilter, page, sortBy, sortDir]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setPage(1);
  }, [search, lifecycleFilter]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const handleCreateProject = async () => {
    setWizardLoading(true);
    try {
      await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc,
          budget: parseFloat(newProjectBudget || "0"),
          industry: { orgName: newProjectClient },
          experts: [{ name: newProjectExpert }],
          students: [],
          problemStatement: newProjectProblem,
          scopeDefinition: newProjectScope,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString()
        })
      });
      setWizardOpen(false);
      setWizardStep(1);
      // reset states
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectBudget("");
      setNewProjectClient("");
      setNewProjectExpert("");
      setNewProjectProblem("");
      setNewProjectScope("");
      await fetchProjects();
    } catch (e) {
      console.error(e);
    } finally {
      setWizardLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Projects Control Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Define research scopes, assign subject experts, link student interns, and track lifecycle budgets</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchProjects} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export Ledger
            </button>
            <button onClick={() => setWizardOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Launch Project Wizard
            </button>
          </div>
        </div>

        {/* ── KPI Widgets ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Project Contracts", value: stats.total, icon: Briefcase, bg: "bg-blue-50", color: "text-primary" },
              { label: "Budget Committed", value: formatCurrency(stats.totalBudget), icon: Wallet, bg: "bg-green-50", color: "text-green-600" },
              { label: "Avg Milestone Completion", value: `${stats.avgProgress}%`, icon: TrendingUp, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Pipeline Under Review", value: stats.underReview, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
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
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, client companies, descriptions…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
          {lifecycleFilter !== "ALL" && (
            <span className="ml-0.5 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">1</span>
          )}
        </button>

        <span className="text-xs text-slate-500 ml-auto">{total} active project{total !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Advanced Filters ── */}
      <AnimatePresence>
        {showFilters && stats && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Lifecycle Stage</label>
                <select value={lifecycleFilter} onChange={(e) => setLifecycleFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Stages</option>
                  {Object.entries(LIFECYCLE_STYLES).map(([key, style]) => <option key={key} value={key}>{style.label}</option>)}
                </select>
              </div>
              {lifecycleFilter !== "ALL" && (
                <button onClick={() => setLifecycleFilter("ALL")} className="text-xs text-primary hover:underline font-semibold">Reset Filters</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Projects Listing ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Briefcase className="h-10 w-10 mb-2" />
            <p className="text-sm font-semibold">No project contracts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((p) => {
              const style = LIFECYCLE_STYLES[p.lifecycle] || LIFECYCLE_STYLES.DRAFT;
              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{p.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${style.bg} ${style.color}`}>
                      <span className={`w-1 h-1 rounded-full ${style.dot}`} /> {style.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-800 leading-snug h-8 line-clamp-2">{p.name}</h3>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {p.industry.orgName}
                    </p>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Budget Allocation</span>
                    <span className="font-bold text-slate-800">{formatCurrency(p.budget)}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-450 font-bold uppercase">
                      <span>Milestones Completed</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-2 border-t border-slate-50">
                    <span className="font-medium">{p.tasksCompleted} / {p.tasksCount} tasks done</span>
                    {p.risksCount > 0 && (
                      <span className="flex items-center gap-0.5 text-red-500 font-bold">
                        <AlertTriangle className="h-3 w-3" /> {p.risksCount} risks
                      </span>
                    )}
                  </div>

                  <Link href={`/admin/projects/${p.id}`} className="mt-1">
                    <button className="w-full h-8 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" /> Workspace
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Wizard Creation Modal ── */}
      <AnimatePresence>
        {wizardOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setWizardOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Launch Project Wizard (Step {wizardStep}/3)</h3>
                <button onClick={() => setWizardOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Project Contract Name *</label>
                    <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g. Solid-State Battery R&D Hub" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Brief Description *</label>
                    <textarea value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} rows={3} placeholder="Provide details on project deliverables…" className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Budget Allocation (INR) *</label>
                    <input type="number" value={newProjectBudget} onChange={(e) => setNewProjectBudget(e.target.value)} placeholder="e.g. 3500000" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Client Organization (Industry) *</label>
                    <input value={newProjectClient} onChange={(e) => setNewProjectClient(e.target.value)} placeholder="e.g. Solaris Power Pvt Ltd" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Subject Expert Lead *</label>
                    <input value={newProjectExpert} onChange={(e) => setNewProjectExpert(e.target.value)} placeholder="e.g. Dr. Arunima Krishnan" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Problem Statement Summary *</label>
                    <textarea value={newProjectProblem} onChange={(e) => setNewProjectProblem(e.target.value)} rows={2} placeholder="Detail the core issue to solve…" className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Scope Definition Boundary *</label>
                    <textarea value={newProjectScope} onChange={(e) => setNewProjectScope(e.target.value)} rows={2} placeholder="Outline core deliverables or boundaries…" className="w-full p-2.5 border border-slate-200 rounded-lg text-xs" />
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end border-t border-slate-100 pt-3 mt-4">
                {wizardStep > 1 && (
                  <button onClick={() => setWizardStep(wizardStep - 1)} className="h-8 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50">Back</button>
                )}
                {wizardStep < 3 ? (
                  <button onClick={() => setWizardStep(wizardStep + 1)} className="h-8 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold">Continue</button>
                ) : (
                  <button onClick={handleCreateProject} disabled={wizardLoading} className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                    {wizardLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Launch Project
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
