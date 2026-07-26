"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Layers, CheckCircle2, Clock, Users,
  Upload, FileText, Loader2, X, Check, Star, Send, ShieldCheck, AlertCircle
} from "lucide-react";
import Link from "next/link";
import MilestoneTimeline from "@/components/ui/milestone-timeline";
import HumanEmptyState from "@/components/ui/human-empty-state";

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
  milestones: Array<{ id: string; title: string; dueDate: string; status: string; description?: string }>;
  tasks: TaskItem[];
  deliverables: Deliverable[];
  mentorNotes: Array<{ author: string; note: string; date: string }>;
}

export default function StudentProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<StudentProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("milestones");

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

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (!project) return;
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const { id } = await params;
      await fetch(`/api/student/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_TASK", taskId, status: newStatus }),
      });
      setProject({
        ...project,
        tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delTitle.trim() || !project) return;
    setSubmitting(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/student/projects/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUBMIT_DELIVERABLE", title: delTitle }),
      });
      if (res.ok) {
        setDelModalOpen(false);
        setDelTitle("");
        fetchProject();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-sm font-semibold text-[#57534E]">Loading project workspace…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] p-8">
        <HumanEmptyState
          title="Project Workspace Not Found"
          description="You might not have active permissions to view this project environment."
          actionLabel="Back to My Projects"
          actionHref="/student/projects"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20 text-left">
      
      {/* Workspace Header */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/student/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78716A] hover:text-[#211F1D] mb-3 link-inline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Projects
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">{project.industryPartner}</span>
                <span className="badge-forest text-[10px] font-bold">
                  <ShieldCheck className="h-3 w-3" /> {project.status}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#211F1D] mt-0.5">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#57534E] font-semibold mt-1">
                Role: {project.role} • Lead Supervisor: {project.leadExpert}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setDelModalOpen(true)}
                className="btn-primary text-xs min-h-[40px] px-4 shadow-md inline-flex items-center gap-1.5"
              >
                <Upload className="h-4 w-4" /> Submit Milestone PDF
              </button>
              <button onClick={fetchProject} className="btn-secondary text-xs min-h-[40px]">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-[#E2DCD2]">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#211F1D]">Overall Milestone Progress</span>
              <span className="text-[#FF5A36] font-mono">{project.progress}% Complete</span>
            </div>
            <div className="w-full bg-[#FBF7F0] rounded-full h-2.5 overflow-hidden border border-[#E2DCD2]">
              <div
                className="bg-[#FF5A36] h-full rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2DCD2] pb-3 overflow-x-auto">
          {[
            { key: "milestones", label: `Sprint Milestones (${project.milestones.length})`, icon: Layers },
            { key: "tasks", label: `Assigned Tasks (${project.tasks.length})`, icon: CheckCircle2 },
            { key: "deliverables", label: `Vault Deliverables (${project.deliverables.length})`, icon: FileText },
            { key: "notes", label: `Supervisor Feedback (${project.mentorNotes.length})`, icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#FF5A36] text-white shadow-sm"
                    : "bg-[#EFE9DF] text-[#57534E] hover:bg-[#E6DFD4] border border-[#E2DCD2]"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "milestones" && (
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h3 className="font-heading text-base font-bold text-[#211F1D]">
              Project Milestone Timeline & SLA Audit
            </h3>
            <MilestoneTimeline
              milestones={project.milestones.map((m, idx) => ({
                id: m.id,
                title: m.title,
                dueDate: m.dueDate,
                status: (m.status as any) || "UPCOMING",
                description: m.description || `Milestone Phase 0${idx + 1} deliverable verification block.`,
                approvedBy: m.status === "COMPLETED" ? project.leadExpert : undefined,
              }))}
            />
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h3 className="font-heading text-base font-bold text-[#211F1D]">
              Sprint Task Checklists
            </h3>
            <div className="space-y-3">
              {project.tasks.map((task) => {
                const isDone = task.status === "COMPLETED";
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isDone
                        ? "bg-[#E8F2EC] border-[#BBD9C8]"
                        : "bg-[#EFE9DF] border-[#E2DCD2] hover:border-[#FF5A36]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                          isDone
                            ? "bg-[#2F6B4F] border-[#2F6B4F] text-white"
                            : "border-[#A8A196] bg-[#FBF7F0]"
                        }`}
                      >
                        {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            isDone ? "line-through text-[#2F6B4F]" : "text-[#211F1D]"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[#78716A] font-semibold mt-0.5">
                          Priority: {task.priority} • Due: {task.dueDate}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isDone ? "bg-[#2F6B4F] text-white" : "bg-[#FFF0ED] text-[#FF5A36]"
                      }`}
                    >
                      {isDone ? "Completed" : "Action Required"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "deliverables" && (
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
              <h3 className="font-heading text-base font-bold text-[#211F1D]">
                Submitted Vault Deliverables
              </h3>
              <button
                onClick={() => setDelModalOpen(true)}
                className="btn-primary text-xs py-1.5 px-3 min-h-[36px]"
              >
                <Upload className="h-3.5 w-3.5" /> Upload File
              </button>
            </div>

            <div className="space-y-3">
              {project.deliverables.map((del) => (
                <div key={del.id} className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4] flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#211F1D]">{del.title}</h4>
                      <p className="text-[11px] text-[#78716A] font-semibold mt-0.5">
                        Submitted: {del.submittedAt}
                      </p>
                    </div>
                  </div>
                  <span className="badge-forest text-[10px] font-bold">
                    {del.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h3 className="font-heading text-base font-bold text-[#211F1D]">
              PhD Supervisor Review Feedback
            </h3>
            <div className="space-y-3">
              {project.mentorNotes.map((n, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-[#211F1D]">{n.author}</span>
                    <span className="text-[11px] text-[#78716A] font-semibold">{n.date}</span>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed italic font-medium">
                    "{n.note}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Deliverable Upload Modal */}
      <AnimatePresence>
        {delModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-flat p-6 rounded-3xl bg-[#FBF7F0] max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h3 className="font-heading text-base font-bold text-[#211F1D] flex items-center gap-2">
                  <Upload className="h-5 w-5 text-[#FF5A36]" /> Submit Milestone Deliverable
                </h3>
                <button onClick={() => setDelModalOpen(false)}>
                  <X className="h-5 w-5 text-[#78716A] hover:text-[#211F1D]" />
                </button>
              </div>

              <form onSubmit={handleSubmitDeliverable} className="space-y-4">
                <div>
                  <label className="form-label">Deliverable Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={delTitle}
                    onChange={(e) => setDelTitle(e.target.value)}
                    placeholder="e.g. Sprint 3 Telemetry Data & Simulation Script PDF"
                    className="input-field text-xs"
                  />
                </div>

                <div className="p-4 rounded-2xl border-2 border-dashed border-[#E2DCD2] bg-[#EFE9DF] text-center space-y-1">
                  <Upload className="h-6 w-6 text-[#FF5A36] mx-auto" />
                  <p className="text-xs font-bold text-[#211F1D]">Drag & drop PDF / ZIP document here</p>
                  <p className="text-[10px] text-[#78716A]">Supports PDF, ZIP, DOCX up to 50MB</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setDelModalOpen(false)} className="btn-secondary text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting || !delTitle.trim()} className="btn-primary text-xs px-4">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload to Vault"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
