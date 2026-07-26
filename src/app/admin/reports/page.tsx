"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap, CalendarDays
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface SavedReport {
  id: string;
  title: string;
  description: string;
  module: string;
  schedule: string;
  createdBy: string;
  createdAt: string;
}

interface Stats {
  totalSaved: number;
  scheduledCount: number;
  generatedToday: number;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function ReportsManagementCenter() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("saved"); // saved, builder, schedules

  // Builder form inputs
  const [buildModule, setBuildModule] = useState("PROJECT");
  const [buildFormat, setBuildFormat] = useState("PDF");
  const [buildTitle, setBuildTitle] = useState("");
  const [buildDesc, setBuildDesc] = useState("");
  const [buildSchedule, setBuildSchedule] = useState("ADHOC");
  const [building, setBuilding] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        module: moduleFilter === "ALL" ? "" : moduleFilter
      });
      const res = await fetch(`/api/admin/reports?${params}`);
      const data = await res.json();
      setReports(data.reports || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, moduleFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleBuildReport = async () => {
    if (!buildTitle || !buildDesc) return;
    setBuilding(true);
    try {
      await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: buildTitle,
          description: buildDesc,
          module: buildModule,
          schedule: buildSchedule,
          createdBy: "System Admin"
        })
      });
      setBuildTitle("");
      setBuildDesc("");
      setActiveTab("saved");
      await fetchReports();
    } catch (e) {
      console.error(e);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Reports & Analytics Center</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Generate platform-wide executive reports, schedule email dispatches, and export audit trails</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchReports} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-slate-655 rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setActiveTab("builder")} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] transition-colors">
              <Plus className="h-3.5 w-3.5" /> Report Builder
            </button>
          </div>
        </div>

        {/* ── Report Telemetry stats ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Saved Report Formats", value: stats.totalSaved, icon: FileText, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
              { label: "Active Schedules", value: stats.scheduledCount, icon: CalendarDays, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
              { label: "Generated Today", value: stats.generatedToday, icon: ShieldCheck, bg: "bg-[#FF5A36]/50", color: "text-[#FF5A36]/600" },
              { label: "Data Quality Rate", value: "99.8%", icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-650" }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-[1.125rem] w-[1.125rem] ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#211F1D]">{stat.value}</div>
                    <div className="text-[10px] text-[#78716A] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-[#E2DCD2] pt-0 -mb-5">
          {[
            { key: "saved", label: "Saved Reports", count: reports.length },
            { key: "builder", label: "Custom Builder", count: null },
            { key: "schedules", label: "Email Schedules", count: null }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-[#FF5A36] text-[#FF5A36]" : "border-transparent text-[#78716A] hover:text-[#211F1D]"}`}>
              {tab.label} {tab.count !== null && <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE9DF] text-[#78716A] rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "saved" && (
        <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports titles, authors, description…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
            />
          </div>
        </div>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── SAVED REPORTS TAB ──── */}
            {activeTab === "saved" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((rep) => (
                  <motion.div
                    key={rep.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="card-flat rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wider">{rep.id}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#FFF0ED] text-[#FF5A36] border border-blue-100 rounded font-bold">{rep.module}</span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-805 leading-snug">{rep.title}</h3>
                      <p className="text-[10px] text-[#78716A] mt-1">Schedule: {rep.schedule}</p>
                    </div>

                    <p className="text-[10px] text-[#78716A] line-clamp-2 h-7 font-medium leading-relaxed">"{rep.description}"</p>

                    <div className="flex justify-between items-center text-[10px] text-[#78716A] pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] text-[#A8A196] uppercase block font-semibold leading-none">Created By</span>
                        <span className="font-bold text-[#211F1D]">{rep.createdBy}</span>
                      </div>
                      
                      <button className="h-8 px-3.5 bg-[#0F0E0C] hover:bg-black text-white rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1">
                        Download PDF <Download className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── REPORT BUILDER TAB ──── */}
            {activeTab === "builder" && (
              <div className="max-w-2xl bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Custom Report Query Builder</h3>
                  <p className="text-[10px] text-[#78716A] mt-0.5">Define target parameters and download generated document</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Target Module *</label>
                    <select value={buildModule} onChange={(e) => setBuildModule(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      <option value="PROJECT">Projects LifeCycle Control</option>
                      <option value="FINANCE">Financial Governance</option>
                      <option value="CRM">CRM & Industry Partners</option>
                      <option value="HR">HR internal directory</option>
                      <option value="GRANTS">Grants & Funding</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Format *</label>
                    <select value={buildFormat} onChange={(e) => setBuildFormat(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      <option value="PDF">Adobe PDF (.pdf)</option>
                      <option value="EXCEL">Microsoft Excel (.xlsx)</option>
                      <option value="CSV">Comma Separated Values (.csv)</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Report Title *</label>
                  <input value={buildTitle} onChange={(e) => setBuildTitle(e.target.value)} placeholder="e.g. CSR Grants Milestone Report" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div className="text-xs">
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Description *</label>
                  <textarea value={buildDesc} onChange={(e) => setBuildDesc(e.target.value)} rows={3} placeholder="Report scope and parameters definitions…" className="w-full p-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div className="text-xs">
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Schedule Automations *</label>
                  <select value={buildSchedule} onChange={(e) => setBuildSchedule(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                    <option value="ADHOC">Run Once (No Schedule)</option>
                    <option value="DAILY">Daily email dispatch</option>
                    <option value="WEEKLY">Weekly email summary</option>
                    <option value="MONTHLY">Monthly report board</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-[#E2DCD2]">
                  <button onClick={handleBuildReport} disabled={building} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg font-bold hover:bg-[#E04826] flex items-center gap-1">
                    {building ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save & Run Report
                  </button>
                </div>
              </div>
            )}

            {/* ──── SCHEDULES TAB ──── */}
            {activeTab === "schedules" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Scheduled Email Recurrence</h3>
                <p className="text-xs text-[#78716A] leading-relaxed font-medium">Verify registered coordinator and executive emails configured to receive weekly P&L summaries and project SLA timelines.</p>
                <button className="h-8 px-4 bg-[#0F0E0C] text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Audit Dispatches</button>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
