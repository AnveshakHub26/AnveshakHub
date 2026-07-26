"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, ArrowLeft, RefreshCw, Plus, CheckSquare, Square, Eye,
  Loader2, Calendar, TrendingUp, Wallet, AlertTriangle, AlertCircle,
  FileText, MessageSquare, Clock, ShieldAlert, Sparkles, Send, X
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assigneeName: string;
}

interface Milestone {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  completionPct: number;
}

interface Document {
  id: string;
  name: string;
  docType: string;
  version: number;
  uploadedBy: string;
  createdAt: string;
}

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: string;
  probability: string;
  mitigation: string;
  status: string;
}

interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  impact: string;
  status: string;
  requestedBy: string;
  createdAt: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface ProjectProfile {
  id: string;
  name: string;
  description: string;
  lifecycle: string;
  budget: number;
  budgetUsed: number;
  remainingBudget: number;
  startDate: string;
  endDate: string;
  progress: number;
  problemStatement: string;
  scopeDefinition: string;
  students: Array<{ name: string; degree: string }>;
  milestones: Milestone[];
  tasks: Task[];
  documents: Document[];
  risks: Risk[];
  changeRequests: ChangeRequest[];
  comments: Comment[];
}

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Interactions
  const [crTitle, setCrTitle] = useState("");
  const [crDesc, setCrDesc] = useState("");
  const [crImpact, setCrImpact] = useState("");
  const [crModalOpen, setCrModalOpen] = useState(false);
  const [crSaving, setCrSaving] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industry/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    if (!project) return;
    try {
      await fetch(`/api/industry/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_TASK", taskId, taskStatus: newStatus })
      });
      // Local state toggle
      const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
      const completed = updatedTasks.filter(t => t.status === "DONE").length;
      const progress = Math.round((completed / updatedTasks.length) * 100);
      setProject({ ...project, tasks: updatedTasks, progress });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !project) return;
    setCommentSaving(true);
    try {
      const res = await fetch(`/api/industry/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_COMMENT", commentContent: commentText, authorName: "Rajesh Sharma" })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setProject({ ...project, comments: [...project.comments, data.comment] });
        setCommentText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommentSaving(false);
    }
  };

  const handleCreateChangeRequest = async () => {
    if (!crTitle || !crDesc || !project) return;
    setCrSaving(true);
    try {
      const res = await fetch(`/api/industry/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_CHANGE_REQUEST", crTitle, crDescription: crDesc, crImpact })
      });
      const data = await res.json();
      if (data.success && data.changeRequest) {
        setProject({ ...project, changeRequests: [...project.changeRequests, data.changeRequest] });
        setCrModalOpen(false);
        setCrTitle(""); setCrDesc(""); setCrImpact("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCrSaving(false);
    }
  };

  const handleMitigateRisk = async (riskId: string) => {
    if (!project) return;
    try {
      await fetch(`/api/industry/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MITIGATE_RISK", riskId, riskStatus: "MITIGATED" })
      });
      const updatedRisks = project.risks.map(r => r.id === riskId ? { ...r, status: "MITIGATED" } : r);
      setProject({ ...project, risks: updatedRisks });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/industry/projects" className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D] hover:bg-[#FBF7F0] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[#A8A196] uppercase tracking-wide">Solar Grid AI Pilot</span>
              <span className="text-[#C4BCB0]">·</span>
              <span className="text-[9px] font-semibold text-[#A8A196]">Budget: ₹{(project.budget / 100000).toFixed(0)}L</span>
            </div>
            <h1 className="text-sm font-bold text-[#211F1D] mt-0.5">{project.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setCrModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            Request Scope Change
          </button>
          <button onClick={fetchDetail} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2DCD2] -mb-2.5">
        {[
          { key: "overview", label: "Overview & Milestones", icon: Briefcase },
          { key: "tasks", label: `Tasks Board`, icon: CheckSquare },
          { key: "financials", label: "Financials & Scope Changes", icon: Wallet },
          { key: "risks", label: `Risks & Issues (${project.risks.length})`, icon: ShieldAlert },
          { key: "docs", label: "Documents Vault", icon: FileText },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-[#78716A] hover:text-[#211F1D]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Workspace Panel */}
      <div className="bg-white border border-[#E2DCD2] rounded-2xl p-6 min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wide">Project Description</h3>
                  <p className="text-[#211F1D] leading-relaxed font-semibold mt-1">{project.description}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wide">Scope Definition</h3>
                  <p className="text-[#57534E] leading-relaxed font-medium bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3.5 whitespace-pre-line">
                    {project.scopeDefinition}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wide">Project Milestone Tracker</h3>
                  <div className="space-y-2">
                    {project.milestones.map(m => (
                      <div key={m.id} className="border border-[#E2DCD2] rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#211F1D]">{m.title}</p>
                          <p className="text-[8px] text-[#A8A196] font-semibold mt-0.5">Due: {new Date(m.dueDate).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-extrabold text-[#78716A]">{m.completionPct}%</span>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            m.status === "COMPLETED" ? "bg-[#E8F2EC] text-green-700 border-green-200" : "bg-[#FFF0ED] text-[#FF5A36] border-[#FFCFC4]"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Linked Problem Statement</h3>
                <p className="text-[10px] text-[#57534E] leading-relaxed font-semibold bg-white border border-[#E2DCD2] rounded-xl p-3">
                  {project.problemStatement}
                </p>
                <div className="border-t border-[#E2DCD2]/60 pt-4 space-y-3">
                  <h4 className="text-[9px] font-bold text-[#A8A196] uppercase tracking-wide">Project Team</h4>
                  <div className="space-y-2">
                    {project.students.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-[#FFE9E3] text-[#FF5A36] font-bold flex items-center justify-center text-[9px]">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#211F1D]">{s.name}</p>
                          <span className="text-[8px] text-[#A8A196] block font-semibold">{s.degree} Intern</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TASKS BOARD */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["TODO", "IN_PROGRESS", "DONE"].map(col => {
                  const columnTasks = project.tasks.filter(t => t.status === col);
                  return (
                    <div key={col} className="card-flat rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-2">
                        <span className="font-bold text-[#211F1D] text-[10px] uppercase tracking-wide">{col.replace("_", " ")}</span>
                        <span className="text-[9px] bg-[#D8D2C7] text-[#57534E] rounded-full px-2 font-bold">{columnTasks.length}</span>
                      </div>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {columnTasks.map(t => (
                          <div key={t.id} className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 hover:shadow-sm transition-all">
                            <div>
                              <p className="font-bold text-[#211F1D] leading-snug">{t.title}</p>
                              <p className="text-[9px] text-[#78716A] line-clamp-2 mt-1 font-medium">{t.description}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-50 pt-2.5 text-[8px] text-[#A8A196] font-semibold">
                              <span>Assignee: {t.assigneeName}</span>
                              <div className="flex gap-1.5">
                                {col !== "DONE" && (
                                  <button
                                    onClick={() => handleUpdateTaskStatus(t.id, col === "TODO" ? "IN_PROGRESS" : "DONE")}
                                    className="text-[9px] font-bold text-primary hover:underline"
                                  >
                                    Move →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Discussions & Live comments */}
              <div className="border-t border-[#E2DCD2] pt-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] flex items-center gap-1.5 uppercase tracking-wide">
                  <MessageSquare className="h-4 w-4 text-[#A8A196]" /> Collaboration thread
                </h3>
                <div className="space-y-2.5 max-h-[200px] overflow-y-auto">
                  {project.comments.map(c => (
                    <div key={c.id} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#211F1D] text-[10px] block">{c.authorName}</span>
                        <p className="text-[#57534E] leading-relaxed font-semibold mt-1">{c.content}</p>
                      </div>
                      <span className="text-[8px] text-[#A8A196] font-bold">{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Enter query or feedback for the team..."
                    className="flex-1 h-9 px-3 border border-[#E2DCD2] rounded-lg text-xs"
                  />
                  <button onClick={handleAddComment} disabled={commentSaving || !commentText} className="h-9 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1">
                    {commentSaving && <Loader2 className="h-3 w-3 animate-spin" />} Post
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* FINANCIALS */}
          {activeTab === "financials" && (
            <motion.div key="financials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 text-xs">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Budget", value: project.budget, color: "text-[#211F1D]" },
                  { label: "Budget Disbursed / Used", value: project.budgetUsed, color: "text-green-600" },
                  { label: "Remaining Balance", value: project.remainingBudget, color: "text-primary" }
                ].map(f => (
                  <div key={f.label} className="p-4 bg-[#FBF7F0] rounded-xl border border-[#E2DCD2]">
                    <span className="text-[9px] text-[#A8A196] font-bold block uppercase">{f.label}</span>
                    <span className={`text-base font-extrabold block mt-1 ${f.color}`}>₹{f.value.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Change Requests Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-2">
                  <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Scope / Budget Change Requests</h3>
                  <button onClick={() => setCrModalOpen(true)} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-hover flex items-center gap-1">
                    <Plus className="h-3 w-3" /> New Request
                  </button>
                </div>
                <div className="border border-[#E2DCD2] rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#FBF7F0] border-b border-[#E2DCD2] text-left">
                        {["Title", "Description", "Financial Impact", "Status", "Date"].map(h => (
                          <th key={h} className="py-2 px-3 text-[9px] font-bold text-[#A8A196] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DCD2] font-medium">
                      {project.changeRequests.map(cr => (
                        <tr key={cr.id} className="hover:bg-[#FBF7F0]">
                          <td className="py-2.5 px-3 font-bold text-[#211F1D]">{cr.title}</td>
                          <td className="py-2.5 px-3 text-[#78716A]">{cr.description}</td>
                          <td className="py-2.5 px-3 text-[#211F1D]">{cr.impact}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                              cr.status === "PENDING" ? "bg-[#FEF3C7] text-[#B45309] border-amber-200" : "bg-[#E8F2EC] text-green-700 border-green-200"
                            }`}>
                              {cr.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#A8A196] text-[9px]">{new Date(cr.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* RISKS */}
          {activeTab === "risks" && (
            <motion.div key="risks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Risk & Issue Registers</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.risks.map(r => (
                  <div key={r.id} className="border border-[#E2DCD2] rounded-2xl p-4.5 space-y-3 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-[#211F1D]">{r.title}</h4>
                        <p className="text-[10px] text-[#78716A] mt-1 leading-relaxed font-medium">{r.description}</p>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                        r.status === "ACTIVE" ? "bg-[#FEE2E2] text-red-750 border-[#FECACA]" : "bg-[#E8F2EC] text-green-750 border-green-250"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="border-t border-[#E2DCD2] pt-3 flex items-center justify-between text-[10px]">
                      <div className="flex gap-3 text-[#A8A196] font-semibold">
                        <span>Impact: <strong className="text-[#57534E]">{r.impact}</strong></span>
                        <span>Probability: <strong className="text-[#57534E]">{r.probability}</strong></span>
                      </div>
                      {r.status === "ACTIVE" && (
                        <button onClick={() => handleMitigateRisk(r.id)} className="text-[10px] font-bold text-primary hover:underline">
                          Mitigate Risk
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "docs" && (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Repository Documents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.documents.map(d => (
                  <div key={d.id} className="border border-[#E2DCD2] rounded-xl p-3 flex items-center justify-between hover:border-[#E2DCD2] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#FFF0ED] text-primary rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-[1.125rem] w-[1.125rem]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#211F1D]">{d.name}</p>
                        <p className="text-[9px] text-[#A8A196] font-semibold mt-0.5">Version {d.version}.0 · Uploaded by {d.uploadedBy}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline shrink-0">Download</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Scope Change Request Modal */}
      <AnimatePresence>
        {crModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCrModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Request Scope / Budget Change</h3>
                <button onClick={() => setCrModalOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-[#78716A] uppercase block mb-1">Request Title *</label>
                  <input
                    value={crTitle}
                    onChange={e => setCrTitle(e.target.value)}
                    placeholder="e.g. Increase Solar Grid Capacity to 45kW"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#78716A] uppercase block mb-1">Financial Impact / Adjustments *</label>
                  <input
                    value={crImpact}
                    onChange={e => setCrImpact(e.target.value)}
                    placeholder="e.g. Budget increase by ₹2.5L / Extends timeline 15 days"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#78716A] uppercase block mb-1">Justification *</label>
                  <textarea
                    value={crDesc}
                    onChange={e => setCrDesc(e.target.value)}
                    rows={4}
                    placeholder="Why is this scope change request necessary..."
                    className="w-full p-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-primary text-xs resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-3.5 mt-4">
                <button
                  onClick={handleCreateChangeRequest}
                  disabled={crSaving || !crTitle || !crDesc}
                  className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover text-xs flex items-center gap-1"
                >
                  {crSaving && <Loader2 className="h-3 w-3 animate-spin" />} Submit Request
                </button>
                <button onClick={() => setCrModalOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#FBF7F0]">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
