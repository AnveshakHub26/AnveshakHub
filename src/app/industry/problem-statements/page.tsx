"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Filter, RefreshCw, Plus, Eye, Loader2,
  Calendar, Award, Shield, ChevronRight, X, Sparkles, CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  version: number;
  linkedProjectsCount: number;
  createdAt: string;
}

const STATUS_BADGES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-150",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-150",
  APPROVED: "bg-green-50 text-green-700 border-green-150",
  REJECTED: "bg-red-50 text-red-700 border-red-150"
};

const PRIORITY_BADGES: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-600 border-blue-100",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200 animate-pulse"
};

export default function ProblemStatementsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitImmediately, setSubmitImmediately] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter
      });
      const res = await fetch(`/api/industry/problem-statements?${params}`);
      const data = await res.json();
      setProblems(data.problems || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await fetch("/api/industry/problem-statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, priority, submitImmediately })
      });
      setWizardOpen(false);
      setWizardStep(1);
      setTitle("");
      setDescription("");
      setCategory("AI/ML");
      setPriority("MEDIUM");
      setSubmitImmediately(false);
      await fetchProblems();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Problem Statement Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">Draft, submit, track compliance, and view deep AI feasibility analytics for research challenges</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProblems} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setWizardOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Submit Problem Statement
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problem statements..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
          {["ALL", "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                statusFilter === st
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Problem Statements Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Refine your filters or create a new statement to begin matching with subject experts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400">{p.category}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded border font-bold ${STATUS_BADGES[p.status] || STATUS_BADGES.DRAFT}`}>
                    {p.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold ${PRIORITY_BADGES[p.priority]}`}>
                    {p.priority}
                  </span>
                  {p.linkedProjectsCount > 0 && (
                    <span className="text-[8px] bg-slate-50 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-bold">
                      {p.linkedProjectsCount} Active Project
                    </span>
                  )}
                </div>
                <Link
                  href={`/industry/problem-statements/${p.id}`}
                  className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
                >
                  Workspace <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation Wizard Modal */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setWizardOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-primary" /> Create Problem Statement
                  </h3>
                  <p className="text-[9px] text-slate-400 mt-0.5">Step {wizardStep} of 2</p>
                </div>
                <button onClick={() => setWizardOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              {wizardStep === 1 ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Problem Title *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. AI-Powered Smart Grid synchronization bounds"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Category Domain</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                      >
                        <option value="AI/ML">AI / Machine Learning</option>
                        <option value="Clean Energy & Grid Technology">Clean Energy & Grid Tech</option>
                        <option value="Hardware & IoT">Hardware & IoT Mesh</option>
                        <option value="Biotech">Biotech & Pharmaceuticals</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Priority</label>
                      <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Detailed Description *</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Explain the background context, technical specifications, and key deliverables of the problem..."
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-700 uppercase">Verification Pre-Check</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      By submitting directly, AnveshakHub verification center will evaluate compliance, assign a risk score, and index this problem statement for marketplace expert recommendations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 border border-slate-100 rounded-xl p-3 bg-white">
                    <input
                      type="checkbox"
                      id="submitCheck"
                      checked={submitImmediately}
                      onChange={e => setSubmitImmediately(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    <label htmlFor="submitCheck" className="text-[10px] text-slate-600 font-semibold cursor-pointer">
                      Submit immediately for vetting (Skip draft stage)
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-100 pt-4 mt-4">
                {wizardStep === 2 ? (
                  <button
                    onClick={() => setWizardStep(1)}
                    className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setWizardOpen(false)}
                    className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  {wizardStep === 1 ? (
                    <button
                      onClick={() => setWizardStep(2)}
                      disabled={!title || !description}
                      className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover disabled:opacity-40"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={handleCreate}
                      disabled={saving}
                      className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5"
                    >
                      {saving && <Loader2 className="h-3 w-3 animate-spin" />} Finish & Save
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
