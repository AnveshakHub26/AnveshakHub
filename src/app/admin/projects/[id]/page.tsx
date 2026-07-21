"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Briefcase, Calendar, TrendingUp, Wallet, CheckCircle2,
  XCircle, Clock, AlertTriangle, MessageSquare, User, Building2,
  Mail, Phone, Globe, MapPin, Hash, Plus, Download, Eye, ArrowUpRight,
  Send, Loader2, Play, HardHat, ShieldCheck, Check, X, Video,
  Layers, CheckSquare, Square, FileText, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface ProjectProfile {
  id: string;
  name: string;
  description: string;
  lifecycle: string;
  budget: number;
  startDate: string;
  endDate: string;
  problemStatement: string | null;
  scopeDefinition: string | null;
  industry: {
    id: string;
    orgName: string;
    email: string;
  };
  experts: Array<{ id: string; name: string; email: string; designation: string }>;
  students: Array<{ id: string; name: string; degree: string; branch: string; cgpa: number }>;
  progress: number;
  milestones: Array<{ id: string; title: string; description: string | null; status: string; completionPct: number; dueDate: string }>;
  sprints: Array<{ id: string; name: string; startDate: string; endDate: string; status: string }>;
  tasks: Array<{ id: string; sprintId: string | null; title: string; description: string | null; status: string; priority: string; dueDate: string; estimatedHours: number; loggedHours: number; assigneeName: string }>;
  documents: Array<{ id: string; name: string; docType: string; fileUrl: string; fileSize: number; version: number; status: string; uploadedBy: string; createdAt: string }>;
  risks: Array<{ id: string; title: string; description: string | null; impact: string; probability: string; mitigation: string | null; status: string }>;
  issues: Array<{ id: string; title: string; description: string | null; severity: string; priority: string; status: string; assigneeName: string | null }>;
  changeRequests: Array<{ id: string; title: string; description: string; justification: string | null; impact: string | null; status: string; requestedBy: string; createdAt: string }>;
  comments: Array<{ id: string; authorName: string; content: string; isInternal: boolean; createdAt: string }>;
  timeline: Array<{ id: string; event: string; description: string | null; performedBy: string | null; createdAt: string }>;
}

// ─── Constants ─────────────────────────────────────────────────────

const TABS = [
  { key: "overview",   label: "Overview Workspace",   icon: Briefcase },
  { key: "kanban",     label: "Sprints & Kanban",     icon: Layers },
  { key: "timeline",   label: "Gantt Timeline",       icon: Calendar },
  { key: "team",       label: "Team Allocation",      icon: User },
  { key: "risks",      label: "Risks & Issues",       icon: AlertTriangle },
  { key: "documents",  label: "Contract Repository",  icon: FileText },
  { key: "comms",      label: "Discussions & Logs",   icon: MessageSquare }
];

const LIFECYCLE_ORDER = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "PLANNING",
  "IN_PROGRESS", "TESTING", "CLIENT_REVIEW", "COMPLETED", "ARCHIVED"
];

const LIFECYCLE_LABELS: Record<string, string> = {
  DRAFT: "Draft", SUBMITTED: "Submitted", UNDER_REVIEW: "Under Review", APPROVED: "Approved",
  PLANNING: "Planning", IN_PROGRESS: "In Progress", TESTING: "Testing",
  CLIENT_REVIEW: "Client Review", COMPLETED: "Completed", ARCHIVED: "Archived"
};

const KANBAN_COLUMNS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE"];

const RISK_IMPACT_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-slate-100 text-slate-700 border-slate-200"
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function ProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProjectProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Interaction loading states
  const [actionLoading, setActionLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  // New task inputs
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`);
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const advanceLifecycle = async () => {
    if (!profile) return;
    const idx = LIFECYCLE_ORDER.indexOf(profile.lifecycle);
    if (idx === -1 || idx === LIFECYCLE_ORDER.length - 1) return;
    
    setActionLoading(true);
    try {
      const nextStage = LIFECYCLE_ORDER[idx + 1];
      await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_LIFECYCLE", lifecycle: nextStage }),
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_TASK",
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          dueDate: newTaskDueDate || new Date().toISOString(),
          assigneeName: newTaskAssignee || "Unassigned"
        })
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskAssignee("");
      setNewTaskDueDate("");
      setTaskFormOpen(false);
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_COMMENT",
          commentContent: newComment,
          commentAuthor: "Priya Nair"
        })
      });
      setNewComment("");
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const lifecycleIdx = LIFECYCLE_ORDER.indexOf(profile.lifecycle);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/projects">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 mt-0.5">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
            <Briefcase className="h-5.5 w-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 truncate">{profile.name}</h1>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-primary rounded-full font-bold">
                {LIFECYCLE_LABELS[profile.lifecycle]}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Host Client: {profile.industry.orgName}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {lifecycleIdx < LIFECYCLE_ORDER.length - 1 && (
              <button onClick={advanceLifecycle} disabled={actionLoading} className="h-8 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Advance Project Stage
              </button>
            )}
          </div>
        </div>

        {/* ── Progress Stepper ── */}
        <div className="mt-4 flex items-center overflow-x-auto gap-0 pb-1">
          {LIFECYCLE_ORDER.map((stage, i) => {
            const isCompleted = i < lifecycleIdx;
            const isActive = i === lifecycleIdx;
            return (
              <React.Fragment key={stage}>
                <div className={`flex flex-col items-center min-w-[70px] ${isActive ? "opacity-100 animate-pulse" : isCompleted ? "opacity-80" : "opacity-35"}`}>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 text-[8px] font-extrabold transition-all ${isCompleted ? "bg-green-500 border-green-500 text-white" : isActive ? "bg-primary border-primary text-white" : "bg-white border-slate-300 text-slate-400"}`}>
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[8px] mt-0.5 font-bold text-center leading-tight max-w-[64px] ${isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-slate-400"}`}>
                    {LIFECYCLE_LABELS[stage]}
                  </span>
                </div>
                {i < LIFECYCLE_ORDER.length - 1 && (
                  <div className={`flex-1 h-0.5 min-w-[10px] mx-0.5 ${i < lifecycleIdx ? "bg-green-400" : "bg-slate-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-0 mt-3 border-t border-slate-100 pt-0 -mb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                <Icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">

          {/* ──── OVERVIEW TAB ──── */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Problem Statement</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{profile.problemStatement || "No problem statement defined."}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Scope Boundary & Deliverables</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">{profile.scopeDefinition || "No scope boundary defined."}</p>
                </div>

                {/* Milestone breakdown */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Key Project Milestones</h3>
                  <div className="space-y-3">
                    {profile.milestones.map((ms) => (
                      <div key={ms.id} className="border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{ms.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Due: {new Date(ms.dueDate).toLocaleDateString("en-IN")}</p>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${ms.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-primary"}`}>{ms.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${ms.completionPct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-650">{ms.completionPct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Cost & Timeline Overview */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Budget Utilization</h3>
                  <div className="text-xl font-extrabold text-slate-850">₹{profile.budget.toLocaleString("en-IN")}</div>
                  <p className="text-[10px] text-slate-450 mt-0.5">Committed contract budget</p>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Fund Consumption</span>
                      <span>₹{Math.floor(profile.budget * 0.45).toLocaleString("en-IN")} (45%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "45%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Project Dates</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-450 font-medium">Start Date</span>
                      <span className="font-bold text-slate-800">{new Date(profile.startDate).toLocaleDateString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-450 font-medium">Estimated End</span>
                      <span className="font-bold text-slate-800">{new Date(profile.endDate).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── SPRINT & KANBAN TAB ──── */}
          {activeTab === "kanban" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-650">Current Sprint:</span>
                  <span className="text-xs px-2.5 py-0.5 bg-blue-50 border border-blue-150 rounded-full font-bold text-primary">Sprint 2: Mesh Protocol Test</span>
                </div>
                <button onClick={() => setTaskFormOpen(!taskFormOpen)} className="h-8 px-3 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all">
                  + Add Task
                </button>
              </div>

              {/* Add Task Form Drawer */}
              <AnimatePresence>
                {taskFormOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white border border-slate-200 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      <div className="col-span-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Task Title</label>
                        <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="e.g. Set frequency bounds" className="w-full h-8 px-2.5 border border-slate-200 text-xs rounded bg-white" />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Priority</label>
                        <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} className="w-full h-8 px-2 border border-slate-200 text-xs rounded bg-white">
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Assignee</label>
                        <input value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} placeholder="e.g. Arpit Goel" className="w-full h-8 px-2.5 border border-slate-200 text-xs rounded bg-white" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={handleCreateTask} disabled={actionLoading} className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-bold">Save Task</button>
                      <button onClick={() => setTaskFormOpen(false)} className="h-8 px-2.5 border border-slate-200 text-slate-650 rounded-lg text-xs">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Kanban columns */}
              <div className="grid grid-cols-5 gap-3 h-[420px] overflow-x-auto">
                {KANBAN_COLUMNS.map((col) => {
                  const colTasks = profile.tasks.filter(t => t.status === col);
                  return (
                    <div key={col} className="bg-slate-100 rounded-2xl p-3.5 flex flex-col gap-3 min-w-[200px] h-full">
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{col}</span>
                        <span className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold">{colTasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-2">
                        {colTasks.map((t) => (
                          <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2 hover:border-primary/45 transition-colors cursor-pointer">
                            <span className="text-xs font-bold text-slate-800 leading-snug">{t.title}</span>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-50">
                              <span>{t.assigneeName}</span>
                              <span className={`px-1.5 py-0.2 rounded font-bold ${t.priority === "HIGH" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}>{t.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ──── TIMELINE TAB ──── */}
          {activeTab === "timeline" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Milestone & Task Sprints Gantt</h3>
              
              <div className="space-y-4">
                {profile.milestones.map((ms, idx) => (
                  <div key={ms.id} className="flex items-center gap-3">
                    <div className="w-48 text-xs font-bold text-slate-800 truncate">{ms.title}</div>
                    <div className="flex-1 h-6 bg-slate-50 border border-slate-100 rounded-lg relative overflow-hidden">
                      <div
                        className="h-full bg-primary/20 border-r border-primary/50 flex items-center px-2 text-[9px] font-bold text-primary"
                        style={{ width: `${(idx * 20) + 40}%` }}
                      >
                        {ms.completionPct}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── TEAM TAB ──── */}
          {activeTab === "team" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Guides */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Subject Expert Guides</h3>
                <div className="space-y-3">
                  {profile.experts.map((exp) => (
                    <div key={exp.id} className="border border-slate-100 rounded-xl p-3 flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                          {exp.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{exp.name}</h4>
                          <p className="text-[9px] text-slate-400 font-semibold">{exp.designation}</p>
                          <p className="text-[9px] text-slate-400 font-medium">{exp.email}</p>
                        </div>
                      </div>
                      <button className="h-7 px-2 border border-slate-200 rounded text-[9px] hover:bg-slate-50 font-bold text-slate-500">Replace</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Interns */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Student Intern Researchers</h3>
                <div className="space-y-3">
                  {profile.students.map((student) => (
                    <div key={student.id} className="border border-slate-100 rounded-xl p-3 flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                          {student.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{student.name}</h4>
                          <p className="text-[9px] text-slate-400 font-semibold">{student.degree} in {student.branch} · GPA {student.cgpa}</p>
                        </div>
                      </div>
                      <button className="h-7 px-2 border border-slate-200 rounded text-[9px] hover:bg-slate-50 font-bold text-slate-500">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── RISKS & ISSUES TAB ──── */}
          {activeTab === "risks" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Register */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> Risk Register</h3>
                <div className="divide-y divide-slate-100">
                  {profile.risks.map((risk) => (
                    <div key={risk.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-slate-800">{risk.title}</h4>
                        <span className={`text-[8px] px-1.5 py-0.2 border rounded font-bold ${RISK_IMPACT_COLORS[risk.impact] || RISK_IMPACT_COLORS.LOW}`}>{risk.impact} Impact</span>
                      </div>
                      {risk.description && <p className="text-[10px] text-slate-500 mt-1">"{risk.description}"</p>}
                      {risk.mitigation && <p className="text-[10px] text-slate-500 mt-0.5"><span className="font-semibold text-slate-700">Mitigation:</span> {risk.mitigation}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Issue Tracker */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><HardHat className="h-4 w-4 text-primary" /> Issue Tracker</h3>
                <div className="divide-y divide-slate-100">
                  {profile.issues.map((issue) => (
                    <div key={issue.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{issue.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">{issue.description}</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Assigned to: {issue.assigneeName || "Unassigned"}</p>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.2 bg-red-50 text-red-650 font-bold border border-red-100 rounded">{issue.severity} Severity</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── DOCUMENTS TAB ──── */}
          {activeTab === "documents" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Contract & Proposal Repository</h3>
              
              <div className="divide-y divide-slate-100">
                {profile.documents.map((doc) => (
                  <div key={doc.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800">{doc.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-650 font-bold">v{doc.version}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-green-50 text-green-700 font-bold">{doc.status}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5">Uploaded by {doc.uploadedBy} on {new Date(doc.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>

                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                      <button className="h-7 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-[10px] font-bold flex items-center gap-1">
                        <Eye className="h-3 w-3" /> View Document
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── COMMS & LOGS TAB ──── */}
          {activeTab === "comms" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Discussion Thread */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Discussion Thread</h3>
                
                <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[260px] border border-slate-100 rounded-xl p-3 space-y-3 bg-slate-50/20">
                  {profile.comments.map((comment) => (
                    <div key={comment.id} className="text-xs bg-white border border-slate-150 rounded-xl p-3">
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>{comment.authorName}</span>
                        <span className="text-[9px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or log a project note…"
                    className="flex-1 h-9 px-3 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  />
                  <button onClick={handlePostComment} disabled={actionLoading} className="h-9 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1 transition-colors">
                    <Send className="h-3.5 w-3.5" /> Post
                  </button>
                </div>
              </div>

              {/* Activity Log Audit */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Project Audit timeline</h3>
                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {profile.timeline.map((act) => (
                    <div key={act.id} className="flex gap-3.5 relative">
                      <div className="h-4.5 w-4.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] z-10">✓</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-snug">{act.event}</div>
                        {act.description && <div className="text-[10px] text-slate-400">{act.description}</div>}
                        <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{act.performedBy} · {new Date(act.createdAt).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
