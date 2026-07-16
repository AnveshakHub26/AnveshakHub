"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Users, Landmark, Wallet, Plus, ChevronRight, X, Loader2, Send,
  TrendingUp, Activity, BadgeAlert, AlertTriangle, Calendar, Phone,
  Mail, FileText, CheckCircle2, ClipboardCheck, Sparkles, AlertCircle
} from "lucide-react";

interface Lead {
  id: string;
  orgName: string;
  domain: string;
  stage: string; // LEAD, QUALIFIED, MEETING_SCHEDULED, PROPOSAL_SHARED, NEGOTIATION, APPROVED, PROJECT_INITIATED
  estRevenue: number;
  healthScore: number;
  assignedTo: string;
}

interface CrmTask {
  id: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  dueDate: string;
  leadName: string;
}

const pipelineStages = [
  { key: "LEAD", label: "Lead Pipeline" },
  { key: "QUALIFIED", label: "Qualified Lead" },
  { key: "MEETING_SCHEDULED", label: "Meeting Scheduled" },
  { key: "PROPOSAL_SHARED", label: "Proposal Shared" },
  { key: "NEGOTIATION", label: "Negotiation Stage" },
  { key: "APPROVED", label: "Approved Partner" },
  { key: "PROJECT_INITIATED", label: "Project Initiated" }
];

export default function CrmDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [stats, setStats] = useState<any>({});
  const [reports, setReports] = useState<any>({});

  // Add Lead Modal State
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ orgName: "", domain: "", estRevenue: "", assignedTo: "" });
  const [formLoading, setFormLoading] = useState(false);

  // Drag & Drop visual feedback
  const [draggedOverStage, setDraggedOverStage] = useState<string | null>(null);

  const fetchCrmData = async () => {
    try {
      const res = await fetch("/api/admin/crm");
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
        setTasks(data.tasks);
        setStats(data.stats);
        setReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, []);

  // HTML5 Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault();
    setDraggedOverStage(stageKey);
  };

  const handleDrop = async (e: React.DragEvent, stageKey: string) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const id = e.dataTransfer.getData("text/plain");

    // Optimistically update frontend state
    setLeads(prev => prev.map(l => l.id === id ? {
      ...l,
      stage: stageKey,
      healthScore: stageKey === "PROJECT_INITIATED" ? 99 : stageKey === "NEGOTIATION" ? Math.max(30, l.healthScore - 8) : l.healthScore
    } : l));

    try {
      const res = await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_LEAD_STAGE", leadId: id, newStage: stageKey })
      });
      if (!res.ok) {
        // Revert on error
        fetchCrmData();
      } else {
        // Reload summary metrics
        const resStats = await fetch("/api/admin/crm");
        const dataStats = await resStats.json();
        if (resStats.ok) {
          setStats(dataStats.stats);
        }
      }
    } catch (err) {
      console.error(err);
      fetchCrmData();
    }
  };

  // Update Task status handler
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Optimistic toggle
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));

    try {
      await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_TASK_STATUS", taskId, newStatus: nextStatus })
      });
    } catch (e) {
      console.error(e);
      fetchCrmData();
    }
  };

  // Submit Lead Form handler
  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.orgName || !newLeadForm.domain) return;
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_LEAD",
          orgName: newLeadForm.orgName,
          domain: newLeadForm.domain,
          estRevenue: Number(newLeadForm.estRevenue),
          assignedTo: newLeadForm.assignedTo
        })
      });
      if (res.ok) {
        setAddLeadOpen(false);
        setNewLeadForm({ orgName: "", domain: "", estRevenue: "", assignedTo: "" });
        fetchCrmData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 flex-grow">
        <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex-grow relative z-10 flex flex-col">
      {/* ── Top Info Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-secondary tracking-tight">Enterprise CRM Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage partner relationships, schedule proposals, and initiate pilot projects.</p>
        </div>
        <button
          onClick={() => setAddLeadOpen(true)}
          className="h-9 px-4 inline-flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Enterprise Lead
        </button>
      </div>

      {/* ── CRM Stats Summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Pipelines", value: stats.totalLeads, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Total Pipeline Value", value: stats.pipelineValue, icon: Wallet, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Average Health Score", value: stats.avgHealth, icon: TrendingUp, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Conversion Rate", value: stats.conversionRate, icon: ClipboardCheck, color: "text-cyan-600 bg-cyan-50 border-cyan-100" }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              <h3 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">{value}</h3>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Drag & Drop Kanban Pipeline ── */}
      <div className="flex-grow overflow-x-auto min-h-[380px] pb-4 flex gap-4 select-none">
        {pipelineStages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.key);
          const isOver = draggedOverStage === stage.key;

          return (
            <div
              key={stage.key}
              onDragOver={e => handleDragOver(e, stage.key)}
              onDragLeave={() => setDraggedOverStage(null)}
              onDrop={e => handleDrop(e, stage.key)}
              className={[
                "w-72 bg-slate-100 border rounded-2xl p-4 shrink-0 flex flex-col justify-between transition-all min-h-[360px]",
                isOver ? "border-primary bg-blue-50/50 scale-[1.01] ring-2 ring-primary/10" : "border-slate-200"
              ].join(" ")}
            >
              {/* Header info */}
              <div className="mb-3 flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{stage.label}</span>
                <span className="text-[10px] font-bold bg-white text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
                {stageLeads.length > 0 ? (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      draggable={true}
                      onDragStart={e => handleDragStart(e, lead.id)}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-primary transition-all space-y-2.5 relative group"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">{lead.orgName}</h4>
                          <span className={[
                            "text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0",
                            lead.healthScore > 85 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            lead.healthScore > 60 ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-red-50 text-red-700 border-red-100"
                          ].join(" ")}>
                            {lead.healthScore}% Health
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">{lead.domain}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] border-t border-slate-100 pt-2.5">
                        <span className="text-slate-500 font-medium">Est: <span className="font-extrabold text-slate-700">₹{(lead.estRevenue / 100000).toFixed(1)}L</span></span>
                        <span className="text-slate-400 font-bold truncate max-w-[80px]">{lead.assignedTo}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center py-10">
                    <p className="text-[10px] text-slate-400 font-medium text-center">Drag leads here...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CRM Tasks, Schedule, and Reports ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CRM Tasks Checklist */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardCheck className="h-4.5 w-4.5 text-primary" />
                Pipeline Follow-Up Tasks
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {tasks.filter(t => t.status === "PENDING").length} Remaining
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={[
                    "p-3.5 border rounded-xl flex items-start justify-between gap-3 transition-opacity",
                    task.status === "COMPLETED" ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200"
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={[
                        "h-4 w-4 mt-0.5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                        task.status === "COMPLETED" ? "bg-primary border-primary text-white" : "border-slate-350 bg-white"
                      ].join(" ")}
                      aria-label={task.status === "COMPLETED" ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.status === "COMPLETED" && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    <div className="min-w-0">
                      <p className={["text-xs font-bold leading-tight", task.status === "COMPLETED" ? "line-through text-slate-500" : "text-slate-800"].join(" ")}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Lead: {task.leadName} · Due by {task.dueDate}</p>
                    </div>
                  </div>

                  <span className={[
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0",
                    task.priority === "HIGH" ? "bg-red-50 text-red-700 border-red-200" :
                    task.priority === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-slate-100 text-slate-500 border-slate-200"
                  ].join(" ")}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRM Reports Charts */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-secondary uppercase tracking-wider">
              Lead Funnel Conversions
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Updated hourly</span>
          </div>

          <div className="my-3">
            <svg viewBox="0 0 500 130" className="w-full h-auto overflow-visible">
              <line x1="30" y1="10" x2="480" y2="10" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="50" x2="480" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="90" x2="480" y2="90" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Conversion bars */}
              {[
                { label: "Jan", leads: 90, conv: 55, x: 50 },
                { label: "Feb", leads: 110, conv: 70, x: 130 },
                { label: "Mar", leads: 130, conv: 95, x: 210 },
                { label: "Apr", leads: 140, conv: 115, x: 290 },
                { label: "May", leads: 180, conv: 145, x: 370 },
                { label: "Jun", leads: 220, conv: 170, x: 450 }
              ].map(bar => {
                const maxVal = 240;
                const leadsH = (bar.leads / maxVal) * 80;
                const convH = (bar.conv / maxVal) * 80;

                return (
                  <g key={bar.label}>
                    {/* Leads bar */}
                    <rect x={bar.x} y={90 - leadsH} width="22" height={leadsH} rx="3" fill="#cbd5e1" opacity="0.5" />
                    {/* Converted bar */}
                    <rect x={bar.x + 4} y={90 - convH} width="14" height={convH} rx="2" fill="#2563EB" />
                    <text x={bar.x + 11} y="106" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">{bar.label}</text>
                    <text x={bar.x + 11} y={90 - leadsH - 5} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="black">{bar.leads}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-4 text-[9px] font-black text-slate-450 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300 block" /> Leads Created</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary block" /> Converted Projects</div>
          </div>
        </div>
      </div>

      {/* ── Add Lead Dialog Modal ── */}
      <Dialog.Root open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none px-4"
            aria-describedby="add-lead-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Users className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <Dialog.Title className="text-sm font-extrabold text-secondary">Add Enterprise Lead</Dialog.Title>
                    <p id="add-lead-desc" className="text-[10px] text-slate-400 mt-0.5">Register a new prospective organization target</p>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organization Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={newLeadForm.orgName}
                    onChange={e => setNewLeadForm(f => ({ ...f, orgName: e.target.value }))}
                    placeholder="Enter legal entity name"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Industry Domain <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={newLeadForm.domain}
                    onChange={e => setNewLeadForm(f => ({ ...f, domain: e.target.value }))}
                    placeholder="e.g. Aerospace, Quantum, AgriTech"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Est. Annual Value (INR)</label>
                    <input
                      type="number"
                      value={newLeadForm.estRevenue}
                      onChange={e => setNewLeadForm(f => ({ ...f, estRevenue: e.target.value }))}
                      placeholder="e.g. 1500000"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Owner</label>
                    <input
                      value={newLeadForm.assignedTo}
                      onChange={e => setNewLeadForm(f => ({ ...f, assignedTo: e.target.value }))}
                      placeholder="e.g. Aditya Mehta"
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                  <Dialog.Close asChild>
                    <button type="button" className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="h-9 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {formLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm & Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
