"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ArrowLeft, RefreshCw, Upload, FileSignature, CheckCircle2,
  Clock, MessageSquare, AlertCircle, Sparkles, Shield, User, Loader2
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Attachment {
  id: string;
  name: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

interface TimelineEvent {
  id: string;
  event: string;
  description: string;
  performedBy: string;
  createdAt: string;
}

interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: {
    feasibilityScore: number;
    difficulty: string;
    recommendedDomains: string[];
    estimatedDevelopmentDays: number;
    academicReadiness: string;
    complianceRisk: string;
    keyTechnicalObstacles: string[];
  };
  documents: Attachment[];
  comments: Comment[];
  timeline: TimelineEvent[];
}

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Interaction inputs
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industry/problem-statements/${id}`);
      const data = await res.json();
      setProblem(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/industry/problem-statements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_COMMENT", commentContent: newComment, authorName: "Rajesh Sharma" })
      });
      const data = await res.json();
      if (data.success && problem && data.comment) {
        setProblem({
          ...problem,
          comments: [...problem.comments, data.comment]
        });
        setNewComment("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommenting(false);
    }
  };

  const handleAttachDocument = async () => {
    if (!newDocName.trim()) return;
    setUploading(true);
    try {
      const res = await fetch(`/api/industry/problem-statements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ATTACH_DOCUMENT", docName: newDocName, docSize: 2048000, authorName: "Rajesh Sharma" })
      });
      const data = await res.json();
      if (data.success && problem && data.document) {
        setProblem({
          ...problem,
          documents: [...problem.documents, data.document]
        });
        setNewDocName("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDraft = async () => {
    try {
      const res = await fetch(`/api/industry/problem-statements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", status: "SUBMITTED" })
      });
      const data = await res.json();
      if (data.success && problem) {
        setProblem({
          ...problem,
          status: "SUBMITTED"
        });
      }
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

  if (!problem) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/industry/problem-statements" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{problem.category}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[9px] font-semibold text-slate-400">Version {problem.version}.0</span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 mt-0.5">{problem.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {problem.status === "DRAFT" && (
            <button onClick={handleSubmitDraft} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
              Submit Draft for Review
            </button>
          )}
          <button onClick={fetchDetail} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-around text-center">
        {[
          { label: "Drafted", key: "DRAFT", desc: "Save basic outline" },
          { label: "Submitted", key: "SUBMITTED", desc: "Compliance pre-check" },
          { label: "Under Review", key: "UNDER_REVIEW", desc: "Expert assessment" },
          { label: "Approved", key: "APPROVED", desc: "Ready for projects" },
        ].map((step, idx) => {
          const isActive = problem.status === step.key;
          const isPassed = ["APPROVED", "UNDER_REVIEW", "SUBMITTED", "DRAFT"].indexOf(problem.status) >= ["APPROVED", "UNDER_REVIEW", "SUBMITTED", "DRAFT"].indexOf(step.key);
          return (
            <div key={step.key} className="flex-1 relative flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                isActive
                  ? "bg-primary border-primary text-white"
                  : isPassed
                  ? "bg-primary-light border-primary text-primary"
                  : "bg-white border-slate-200 text-slate-400"
              }`}>
                {isPassed && !isActive ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
              </div>
              <p className="text-[10px] font-bold text-slate-800 mt-2">{step.label}</p>
              <p className="text-[8px] text-slate-400 font-semibold">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "overview", label: "Overview & AI Insights", icon: Sparkles },
          { key: "documents", label: `Supporting Files (${problem.documents.length})`, icon: FileText },
          { key: "comments", label: `Discussion (${problem.comments.length})`, icon: MessageSquare },
          { key: "timeline", label: "Audit Timeline", icon: Clock },
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

      {/* Main Workspace content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* OVERVIEW & AI */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Problem Scope & Objective</h3>
                  <p className="text-slate-750 font-medium leading-relaxed mt-1">{problem.description}</p>
                </div>
              </div>

              {/* AI Diagnostic Side Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" /> AI Match vector analysis
                </h3>
                {problem.aiAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-600">Feasibility Match Score</span>
                      <span className="text-sm font-extrabold text-primary">{problem.aiAnalysis.feasibilityScore}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${problem.aiAnalysis.feasibilityScore}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase">Difficulty</span>
                        <span className="text-[10px] font-bold text-slate-700">{problem.aiAnalysis.difficulty}</span>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase">Est. Development</span>
                        <span className="text-[10px] font-bold text-slate-700">{problem.aiAnalysis.estimatedDevelopmentDays} Days</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Recommended Keywords</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {problem.aiAnalysis.recommendedDomains.map((d, i) => (
                          <span key={i} className="text-[8px] px-2 py-0.5 rounded bg-primary-light text-primary-text border border-primary-border font-bold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Key Technical Obstacles</span>
                      <ul className="list-disc pl-4 space-y-1 text-[9px] text-slate-500 font-semibold leading-relaxed">
                        {problem.aiAnalysis.keyTechnicalObstacles.map((obstacle, i) => (
                          <li key={i}>{obstacle}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    AI diagnostic analysis will run automatically once the problem statement is submitted for review and approval.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "documents" && (
            <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Supporting Attachments</h3>
                <div className="flex gap-2">
                  <input
                    value={newDocName}
                    onChange={e => setNewDocName(e.target.value)}
                    placeholder="Document Name (e.g. scope.pdf)"
                    className="h-8 px-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <button onClick={handleAttachDocument} disabled={uploading || !newDocName} className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Attach File
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problem.documents.map(d => (
                  <div key={d.id} className="border border-slate-100 rounded-xl p-3 flex items-center justify-between hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{d.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{(d.fileSize ? d.fileSize / 1024 : 0).toFixed(0)} KB · By {d.uploadedBy}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline">Download</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* COMMENTS */}
          {activeTab === "comments" && (
            <motion.div key="comments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {problem.comments.map(c => (
                  <div key={c.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" /> {c.authorName}
                      </span>
                      <span className="text-[8px] text-slate-400 font-semibold">{new Date(c.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-slate-650 leading-relaxed font-semibold">{c.content}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-3">
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Ask a question or add details to the statement..."
                  className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs"
                />
                <button onClick={handleAddComment} disabled={commenting || !newComment} className="h-9 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover">
                  Post Comment
                </button>
              </div>
            </motion.div>
          )}

          {/* TIMELINE */}
          {activeTab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative border-l border-slate-100 pl-4 ml-2 space-y-4 text-xs">
              {problem.timeline.map(event => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full bg-white border-2 border-primary shadow-sm" />
                  <p className="font-bold text-slate-800">{event.event}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{event.description}</p>
                  <span className="text-[8px] text-slate-400 font-semibold mt-0.5 block">{new Date(event.createdAt).toLocaleString("en-IN")} · Performed by {event.performedBy}</span>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
