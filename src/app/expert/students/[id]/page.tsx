"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Star, Award, CheckCircle2, Clock,
  FileCheck, Plus, Loader2, X, Send, BookOpen, User, Check
} from "lucide-react";
import Link from "next/link";

interface MenteeDetail {
  id: string;
  name: string;
  email: string;
  usn: string;
  institution: string;
  degree: string;
  semester: number;
  cgpa: number;
  assignedProject: string;
  assignedRole: string;
  technicalSkillScore: number;
  softSkillScore: number;
  overallScore: number;
  attendanceRate: number;
  skills: string[];
  evaluations: Array<{ id: string; technicalScore: number; softSkillScore: number; overallScore: number; feedback: string; date: string }>;
  learningPlan: Array<{ id: string; title: string; status: string; targetDate: string }>;
  recommendation: { id: string; title: string; content: string; issuedAt: string } | null;
  attendanceLogs: Array<{ date: string; status: string; notes: string }>;
}

export default function MenteeWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [student, setStudent] = useState<MenteeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");

  // Evaluation Modal
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [techScore, setTechScore] = useState("4.8");
  const [softScore, setSoftScore] = useState("4.6");
  const [evalFeedback, setEvalFeedback] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  // Recommendation Modal
  const [recModalOpen, setRecModalOpen] = useState(false);
  const [recTitle, setRecTitle] = useState("");
  const [recContent, setRecContent] = useState("");
  const [recommending, setRecommending] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/expert/students/${id}`);
      const data = await res.json();
      setStudent(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleSubmitEvaluation = async () => {
    if (!student || !evalFeedback.trim()) return;
    setEvaluating(true);
    try {
      await fetch(`/api/expert/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_EVALUATION",
          technicalScore: techScore,
          softSkillScore: softScore,
          feedback: evalFeedback
        })
      });
      setEvalModalOpen(false);
      setEvalFeedback("");
      await fetchDetail();
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const handleIssueRecommendation = async () => {
    if (!student || !recTitle.trim()) return;
    setRecommending(true);
    try {
      await fetch(`/api/expert/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ISSUE_RECOMMENDATION",
          recTitle,
          recContent
        })
      });
      setRecModalOpen(false);
      setRecTitle(""); setRecContent("");
      await fetchDetail();
    } catch (e) {
      console.error(e);
    } finally {
      setRecommending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/students" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{student.usn}</span>
              <h1 className="text-base font-bold text-slate-900">{student.name}</h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{student.institution} · {student.degree} (Sem {student.semester})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchDetail} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setEvalModalOpen(true)} className="h-8 px-3 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500" /> Evaluate Skill
          </button>
          <button onClick={() => setRecModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5" /> Issue Recommendation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "skills", label: "Skill Assessment & Performance", icon: Star },
          { key: "goals", label: `Learning Plan (${student.learningPlan.length})`, icon: BookOpen },
          { key: "attendance", label: `Attendance Log (${student.attendanceRate}%)`, icon: CheckCircle2 },
          { key: "recommendation", label: "Recommendation Letter", icon: FileCheck }
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

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
        {/* SKILL ASSESSMENT TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Technical Score</span>
                <span className="text-base font-extrabold text-slate-800">★ {student.technicalSkillScore} / 5</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Soft Skills Score</span>
                <span className="text-base font-extrabold text-slate-800">★ {student.softSkillScore} / 5</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Overall Rating</span>
                <span className="text-base font-extrabold text-primary">★ {student.overallScore} / 5</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Expert Evaluation History</h3>
              <div className="space-y-3">
                {student.evaluations.map((ev, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                      <span>Rating: ★ {ev.overallScore}</span>
                      <span className="text-slate-400 font-semibold">{new Date(ev.date).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{ev.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEARNING PLAN TAB */}
        {activeTab === "goals" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Learning Goals & Milestones</h3>
            <div className="space-y-2">
              {student.learningPlan.map(g => (
                <div key={g.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                      g.status === "COMPLETED" ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                    }`}>
                      {g.status === "COMPLETED" && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`font-bold ${g.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>{g.title}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">Target: {new Date(g.targetDate).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDATION TAB */}
        {activeTab === "recommendation" && (
          <div className="space-y-4 text-xs">
            {student.recommendation ? (
              <div className="border border-purple-100 rounded-2xl p-6 bg-purple-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-purple-900 text-sm">{student.recommendation.title}</h3>
                  <span className="text-[9px] font-bold text-purple-700">Issued: {new Date(student.recommendation.issuedAt).toLocaleDateString("en-IN")}</span>
                </div>
                <pre className="text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">{student.recommendation.content}</pre>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-800">No Recommendation Letter Issued Yet</p>
                <button onClick={() => setRecModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover inline-flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Issue Letter of Recommendation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Evaluate Modal */}
      <AnimatePresence>
        {evalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEvalModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-400" /> Evaluate Mentee Performance
                </h3>
                <button onClick={() => setEvalModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Technical Skill Score (1-5)</label>
                    <input type="number" step="0.1" value={techScore} onChange={e => setTechScore(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Soft Skills Score (1-5)</label>
                    <input type="number" step="0.1" value={softScore} onChange={e => setSoftScore(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Detailed Feedback Notes *</label>
                  <textarea value={evalFeedback} onChange={e => setEvalFeedback(e.target.value)} rows={4} placeholder="Evaluation notes on code quality, task execution, problem solving..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setEvalModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitEvaluation} disabled={evaluating || !evalFeedback.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {evaluating && <Loader2 className="h-3 w-3 animate-spin" />} Save Evaluation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recommendation Modal */}
      <AnimatePresence>
        {recModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setRecModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-primary" /> Issue Recommendation Letter
                </h3>
                <button onClick={() => setRecModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Recommendation Title *</label>
                  <input value={recTitle} onChange={e => setRecTitle(e.target.value)} placeholder="e.g. Letter of Recommendation for Industry R&D Excellence"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Letter Content *</label>
                  <textarea value={recContent} onChange={e => setRecContent(e.target.value)} rows={6} placeholder="I highly recommend Arpit Goel for his exceptional contributions to hardware ADC sensor calibration..."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setRecModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleIssueRecommendation} disabled={recommending || !recTitle.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {recommending && <Loader2 className="h-3 w-3 animate-spin" />} Issue Letter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
