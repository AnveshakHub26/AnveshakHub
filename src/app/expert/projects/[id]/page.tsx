"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Layers, CheckCircle2, Clock, Users,
  Upload, FileText, AlertCircle, Plus, Loader2, X, Send,
  ChevronRight, Check
} from "lucide-react";
import Link from "next/link";

interface Deliverable {
  id: string;
  title: string;
  fileUrl: string;
  status: string;
  submittedBy: string;
  submittedAt: string;
}

interface TaskItem {
  id: string;
  title: string;
  status: string;
  assignee: string;
  priority: string;
}

interface ProjectDetail {
  id: string;
  name: string;
  industryPartner: string;
  status: string;
  role: string;
  budget: number;
  startDate: string;
  endDate: string;
  progress: number;
  scopeDefinition: string;
  milestones: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
    amount: number;
  }>;
  tasks: TaskItem[];
  deliverables: Deliverable[];
  studentMentees: Array<{
    id: string;
    name: string;
    role: string;
    progress: number;
    tasksAssigned: number;
  }>;
  risks: Array<{
    id: string;
    title: string;
    impact: string;
    probability: string;
    status: string;
    mitigation: string;
  }>;
}

export default function ExpertProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("milestones");

  // Deliverable Submit Modal State
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [delTitle, setDelTitle] = useState("");
  const [delUrl, setDelUrl] = useState("");
  const [delDesc, setDelDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/expert/projects/${id}`);
      const data = await res.json();
      setProject(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSubmitDeliverable = async () => {
    if (!delTitle.trim() || !project) return;
    setSubmitting(true);
    try {
      await fetch(`/api/expert/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_DELIVERABLE",
          delTitle,
          delUrl,
          delDesc
        })
      });
      setDelModalOpen(false);
      setDelTitle(""); setDelUrl(""); setDelDesc("");
      await fetchProject();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!project) return;
    const nextStatus = currentStatus === "DONE" ? "IN_PROGRESS" : "DONE";
    try {
      await fetch(`/api/expert/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_TASK",
          taskId,
          taskStatus: nextStatus
        })
      });
      await fetchProject();
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
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
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/projects" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{project.role}</span>
              <h1 className="text-base font-bold text-slate-900">{project.name}</h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{project.industryPartner} · {formatCurrency(project.budget)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchProject} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setDelModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Submit Deliverable
          </button>
        </div>
      </div>

      {/* Progress & Scope Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Overall Project Completion</span>
          <span className="text-sm font-extrabold text-primary">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">{project.scopeDefinition}</p>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "milestones", label: `Milestones (${project.milestones.length})`, icon: Layers },
          { key: "tasks", label: `WBS Tasks (${project.tasks.length})`, icon: CheckCircle2 },
          { key: "deliverables", label: `Deliverables Studio (${project.deliverables.length})`, icon: FileText },
          { key: "students", label: `Student Interns (${project.studentMentees.length})`, icon: Users },
          { key: "risks", label: `Risks & Issues (${project.risks.length})`, icon: AlertCircle }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Workspace Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
        {/* MILESTONES TAB */}
        {activeTab === "milestones" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Project Milestone Lifecycle</h3>
            <div className="space-y-3">
              {project.milestones.map(m => (
                <div key={m.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{m.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Due: {new Date(m.dueDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-700">{formatCurrency(m.amount)}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                      m.status === "COMPLETED" ? "bg-green-50 text-green-700" : m.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                    }`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WBS TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Work Breakdown Structure (WBS) Tasks</h3>
            <div className="space-y-2">
              {project.tasks.map(task => (
                <div key={task.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id, task.status)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        task.status === "DONE" ? "bg-green-500 text-white border-green-500" : "border-slate-300 hover:border-primary bg-white"
                      }`}
                    >
                      {task.status === "DONE" && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <p className={`font-bold ${task.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>{task.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">Assigned to: {task.assignee}</p>
                    </div>
                  </div>

                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">{task.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERABLES TAB */}
        {activeTab === "deliverables" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Submitted Deliverables & Test Reports</h3>
              <button onClick={() => setDelModalOpen(true)} className="h-7 px-3 bg-primary text-white rounded-lg font-bold text-[10px] hover:bg-primary-hover flex items-center gap-1">
                <Upload className="h-3 w-3" /> Upload Deliverable
              </button>
            </div>

            <div className="space-y-3">
              {project.deliverables.map(del => (
                <div key={del.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{del.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">Submitted by {del.submittedBy} on {new Date(del.submittedAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">{del.status}</span>
                    <a href={del.fileUrl} target="_blank" rel="noopener noreferrer" className="h-7 px-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-[9px] hover:bg-slate-100 flex items-center gap-1">
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDENT MENTEES TAB */}
        {activeTab === "students" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Assigned Student Interns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.studentMentees.map(m => (
                <div key={m.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{m.name}</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">{m.role}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                    <span>{m.tasksAssigned} Tasks Assigned</span>
                    <span>{m.progress}% Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISKS TAB */}
        {activeTab === "risks" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Project Risk Register</h3>
            <div className="space-y-3">
              {project.risks.map(r => (
                <div key={r.id} className="border border-amber-100 rounded-xl p-4 bg-amber-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{r.title}</p>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Impact: {r.impact}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">Mitigation: {r.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deliverable Upload Modal */}
      <AnimatePresence>
        {delModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDelModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-primary" /> Submit Deliverable Report
                </h3>
                <button onClick={() => setDelModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Deliverable Title *</label>
                  <input value={delTitle} onChange={e => setDelTitle(e.target.value)} placeholder="e.g. Sprint 2 Test Results Report"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Document URL</label>
                  <input value={delUrl} onChange={e => setDelUrl(e.target.value)} placeholder="https://storage.anvesha.in/deliverables/..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Summary / Reviewer Notes</label>
                  <textarea value={delDesc} onChange={e => setDelDesc(e.target.value)} rows={3} placeholder="Highlights of technical findings..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setDelModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitDeliverable} disabled={submitting || !delTitle.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit Deliverable
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
