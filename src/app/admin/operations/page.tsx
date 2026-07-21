"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardHat, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award,
  ShieldCheck, AlertTriangle, Info, Zap, ShieldAlert
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: string;
  steps: string[];
  slaHours: number;
  createdAt: string;
}

interface Incident {
  id: string;
  workflowName: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdAt: string;
}

interface Stats {
  activeWorkflows: number;
  activeIncidents: number;
  slaCompliance: string;
  resolvedIncidents: number;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function OperationsWorkspace() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("workflows"); // workflows, incidents, processes

  // Workflow creator panel state
  const [createOpen, setCreateOpen] = useState(false);
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [wfSteps, setWfSteps] = useState("");
  const [wfSla, setWfSla] = useState("24");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search });
      const res = await fetch(`/api/admin/operations?${params}`);
      const data = await res.json();
      setWorkflows(data.workflows || []);
      setIncidents(data.incidents || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const handleCreateWorkflow = async () => {
    if (!wfName || !wfDesc) return;
    setCreateLoading(true);
    try {
      await fetch("/api/admin/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wfName,
          description: wfDesc,
          steps: wfSteps.split(",").map(s => s.trim()).filter(Boolean),
          slaHours: parseInt(wfSla)
        })
      });
      setCreateOpen(false);
      setWfName("");
      setWfDesc("");
      setWfSteps("");
      await fetchOperations();
    } catch (e) {
      console.error(e);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await fetch("/api/admin/operations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE_INCIDENT", incidentId })
      });
      await fetchOperations();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ecosystem Operations Control</h1>
            <p className="text-xs text-slate-500 mt-0.5">Audit workflow SLA compliance, resolve escalated incidents, and configure process automations</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOperations} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-650 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setCreateOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Create SLA Workflow
            </button>
          </div>
        </div>

        {/* ── Operational metrics ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active SLA Pipelines", value: stats.activeWorkflows, icon: HardHat, bg: "bg-blue-50", color: "text-primary" },
              { label: "Escalated Incidents", value: stats.activeIncidents, icon: ShieldAlert, bg: "bg-red-50", color: "text-red-500" },
              { label: "SLA Compliance Rate", value: stats.slaCompliance, icon: CheckCircle2, bg: "bg-green-50", color: "text-green-600" },
              { label: "Incidents Resolved (MTD)", value: stats.resolvedIncidents, icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-650" }
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
            { key: "workflows", label: "SLA Workflows", count: workflows.length },
            { key: "incidents", label: "Incident Board", count: incidents.length },
            { key: "processes", label: "Workflow Configs", count: null }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {tab.label} {tab.count !== null && <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "incidents" && (
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents, workflows, details…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── SLA WORKFLOWS TAB ──── */}
            {activeTab === "workflows" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflows.map((wf) => (
                  <motion.div
                    key={wf.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{wf.id}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-primary border border-blue-100 rounded font-bold">{wf.slaHours} Hours SLA</span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{wf.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">"{wf.description}"</p>
                    </div>

                    <div className="space-y-1.5 pt-2.5 border-t border-slate-50">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Process Milestones:</span>
                      <div className="flex items-center gap-1 flex-wrap text-[9px] text-slate-500 font-bold">
                        {wf.steps.map((st, idx) => (
                          <React.Fragment key={st}>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded">{st}</span>
                            {idx < wf.steps.length - 1 && <span className="text-slate-350">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── INCIDENT REGISTER TAB ──── */}
            {activeTab === "incidents" && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3">Incident Scope</th>
                      <th className="px-6 py-3">Workflow Target</th>
                      <th className="px-6 py-3 text-center">Severity</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {incidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{inc.title}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5 font-semibold">"{inc.description}"</div>
                        </td>
                        <td className="px-6 py-4 text-slate-550">{inc.workflowName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[8px] px-2 py-0.5 rounded font-bold ${inc.severity === "CRITICAL" ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>{inc.severity}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-[9px] bg-red-50 text-red-600 rounded font-bold px-2 py-0.5 border border-red-100">{inc.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleResolveIncident(inc.id)} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold">Mark Resolved</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ──── AUTOMATION QUEUES TAB ──── */}
            {activeTab === "processes" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-primary" /> Process Automation Rules</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Automatically dispatch warning reminders to Outreach Coordinators when student internship agreements fail signatures within 72 hours of project approval.</p>
                <button className="h-8 px-4 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Run Automation Sweep</button>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Create Workflow Modal ── */}
      <AnimatePresence>
        {createOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCreateOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Create Operational SLA Workflow</h3>
                <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Workflow Title *</label>
                  <input value={wfName} onChange={(e) => setWfName(e.target.value)} placeholder="e.g. CSR Innovation Funding Milestone SLA" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Description *</label>
                  <textarea value={wfDesc} onChange={(e) => setWfDesc(e.target.value)} rows={3} placeholder="Outline workflow scope limits and timelines…" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">SLA Hours *</label>
                    <input type="number" value={wfSla} onChange={(e) => setWfSla(e.target.value)} placeholder="e.g. 24" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Workflow Steps (comma separated) *</label>
                    <input value={wfSteps} onChange={(e) => setWfSteps(e.target.value)} placeholder="Step 1, Step 2, Step 3" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleCreateWorkflow} disabled={createLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {createLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Publish Workflow
                </button>
                <button onClick={() => setCreateOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
