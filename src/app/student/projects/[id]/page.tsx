"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Layers, CheckCircle2, Clock, Users,
  Upload, FileText, Loader2, X, Check, Star
} from "lucide-react";
import Link from "next/link";

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface Deliverable {
  id: string;
  title: string;
  status: string;
  submittedAt: string;
}

interface StudentProjectDetail {
  id: string;
  name: string;
  industryPartner: string;
  leadExpert: string;
  role: string;
  progress: number;
  status: string;
  scopeDefinition: string;
  milestones: Array<{ id: string; title: string; dueDate: string; status: string }>;
  tasks: TaskItem[];
  deliverables: Deliverable[];
  mentorNotes: Array<{ author: string; note: string; date: string }>;
}

export default function StudentProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<StudentProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");

  // Deliverable Submit Modal
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [delTitle, setDelTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/student/projects/${id}`);
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

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!project) return;
    const nextStatus = currentStatus === "DONE" ? "IN_PROGRESS" : "DONE";
    try {
      await fetch(`/api/student/projects/${project.id}`, {
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

  const handleSubmitDeliverable = async () => {
    if (!delTitle.trim() || !project) return;
    setSubmitting(true);
    try {
      await fetch(`/api/student/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_DELIVERABLE",
          delTitle
        })
      });
      setDelModalOpen(false);
      setDelTitle("");
      await fetchProject();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
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
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/projects" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{project.role}</span>
              <h1 className="text-base font-bold text-slate-900">{project.name}</h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{project.industryPartner} · Lead Expert: {project.leadExpert}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchProject} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setDelModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Submit Deliverable Report
          </button>
        </div>
      </div>

      {/* Progress & Scope */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Overall Project Progress</span>
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
          { key: "tasks", label: `Your Assigned Tasks (${project.tasks.length})`, icon: CheckCircle2 },
          { key: "milestones", label: `Milestones (${project.milestones.length})`, icon: Layers },
          { key: "deliverables", label: `Deliverables (${project.deliverables.length})`, icon: FileText },
          { key: "mentor", label: "Mentor Reviews & Guidance", icon: Star }
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
        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">WBS Work Tasks Checklist</h3>
            <div className="space-y-2">
              {project.tasks.map(t => (
                <div key={t.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(t.id, t.status)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        t.status === "DONE" ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                      }`}
                    >
                      {t.status === "DONE" && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <p className={`font-bold ${t.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">Due: {t.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === "milestones" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Project Milestones</h3>
            <div className="space-y-3">
              {project.milestones.map(m => (
                <div key={m.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">{m.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Target: {new Date(m.dueDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                    m.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERABLES TAB */}
        {activeTab === "deliverables" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Submitted Deliverables</h3>
              <button onClick={() => setDelModalOpen(true)} className="h-7 px-3 bg-primary text-white rounded-lg font-bold text-[10px] hover:bg-primary-hover flex items-center gap-1">
                <Upload className="h-3 w-3" /> Upload Report
              </button>
            </div>

            <div className="space-y-3">
              {project.deliverables.map(del => (
                <div key={del.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">{del.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Submitted: {new Date(del.submittedAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">{del.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MENTOR REVIEWS TAB */}
        {activeTab === "mentor" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Lead Expert Mentor Reviews</h3>
            <div className="space-y-3">
              {project.mentorNotes.map((note, i) => (
                <div key={i} className="border border-purple-100 rounded-xl p-4 bg-purple-50/40 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-purple-900">
                    <span>{note.author}</span>
                    <span className="text-purple-700 font-semibold">{new Date(note.date).toLocaleDateString("en-IN")}</span>
                  </div>
                  <p className="text-slate-700 font-medium italic leading-relaxed">"{note.note}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Deliverable Modal */}
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
                  <input value={delTitle} onChange={e => setDelTitle(e.target.value)} placeholder="e.g. Node 3 Sensor Calibration Log.pdf"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setDelModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitDeliverable} disabled={submitting || !delTitle.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
