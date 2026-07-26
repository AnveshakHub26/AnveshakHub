"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Star, Award, CheckCircle2, ExternalLink, RefreshCw,
  Loader2, User, Clock, Check, Target, Sparkles, GraduationCap,
  MessageSquare, ChevronRight, Zap
} from "lucide-react";

interface SkillScore {
  skill: string;
  score: number;
  target: number;
}

interface LearningGoal {
  id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface LearningResource {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
}

interface StudentLearningData {
  overallProgressPct: number;
  skillScores: SkillScore[];
  learningGoals: LearningGoal[];
  learningResources: LearningResource[];
  leadMentor: {
    name: string;
    designation: string;
    institution: string;
    totalSessionsCompleted: number;
    latestNote: string;
  };
}

const RESOURCE_COLORS: Record<string, { color: string; bg: string }> = {
  PAPER:       { color: "#4338CA", bg: "#EEF2FF" },
  VIDEO:       { color: "#FF5A36", bg: "#FFF0ED" },
  COURSE:      { color: "#2F6B4F", bg: "#E8F2EC" },
  TOOL:        { color: "#92400E", bg: "#FEF3C7" },
  COMPETITION: { color: "#57534E", bg: "#F5F0E8" },
};

export default function StudentLearningPage() {
  const [data, setData]       = useState<StudentLearningData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLearning = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/student/learning");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLearning(); }, [fetchLearning]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        <p className="text-xs text-[#78716A] font-semibold">Loading your learning plan…</p>
      </div>
    );
  }

  if (!data) return null;

  const completedGoals = data.learningGoals.filter(g => g.status === "COMPLETED").length;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#2F6B4F]/10 text-[#2F6B4F] uppercase tracking-widest">
            Learning Lab
          </span>
          <h1 className="text-2xl font-extrabold text-[#211F1D] mt-1">
            Skill Development & Mentorship
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            R&D competency benchmarks, personalized goals, and curated resources.
          </p>
        </div>
        <button
          onClick={fetchLearning}
          className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Overall Progress Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#211F1D] rounded-2xl p-6 overflow-hidden relative"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-[#FF5A36]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-20 h-24 w-24 bg-[#4338CA]/20 blur-2xl rounded-full" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#FF5A36]/15 flex items-center justify-center border border-[#FF5A36]/30">
              <Sparkles className="h-7 w-7 text-[#FF5A36]" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg">Competency Progress</p>
              <p className="text-[#A8A196] text-xs mt-0.5">
                {completedGoals}/{data.learningGoals.length} goals complete · {data.leadMentor.totalSessionsCompleted} mentorship sessions logged
              </p>
            </div>
          </div>

          <div className="flex items-end gap-6">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-[#FF5A36]">{data.overallProgressPct}<span className="text-2xl text-[#78716A]">%</span></p>
              <p className="text-[10px] text-[#78716A] uppercase tracking-widest mt-1">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-2 bg-[#3a3733] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.overallProgressPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Mentor Card */}
      <div className="bg-[#EFE9DF] rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-5">
        <div className="h-14 w-14 rounded-2xl bg-[#2F6B4F]/10 flex items-center justify-center flex-shrink-0 border border-[#2F6B4F]/20">
          <GraduationCap className="h-7 w-7 text-[#2F6B4F]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-extrabold text-[#211F1D]">{data.leadMentor.name}</p>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] uppercase">Lead Mentor</span>
          </div>
          <p className="text-xs text-[#78716A] font-semibold mt-0.5">
            {data.leadMentor.designation} · {data.leadMentor.institution}
          </p>
          {data.leadMentor.latestNote && (
            <div className="mt-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3">
              <p className="text-[10px] font-bold text-[#78716A] uppercase tracking-wide mb-1 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Latest Mentor Note
              </p>
              <p className="text-xs text-[#57534E] leading-relaxed italic">"{data.leadMentor.latestNote}"</p>
            </div>
          )}
        </div>
        <div className="text-center flex-shrink-0">
          <p className="text-2xl font-extrabold text-[#2F6B4F]">{data.leadMentor.totalSessionsCompleted}</p>
          <p className="text-[10px] text-[#78716A] font-semibold uppercase">Sessions</p>
        </div>
      </div>

      {/* Grid: Skills + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Skill Competency Benchmarks */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <Target className="h-4 w-4 text-[#FF5A36]" /> Technical Competency Benchmarks
          </h3>
          <div className="space-y-5">
            {data.skillScores.map((s, idx) => {
              const pct = Math.round((s.score / s.target) * 100);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.07 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#211F1D]">{s.skill}</span>
                    <span className="text-xs font-extrabold text-[#FF5A36]">{s.score}/{s.target}</span>
                  </div>
                  <div className="h-2 bg-[#D8D2C7] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FF5A36] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + idx * 0.07, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FF5A36]" /> Personalized Learning Goals
            </h3>
            <span className="text-xs font-bold text-[#2F6B4F]">{completedGoals}/{data.learningGoals.length}</span>
          </div>
          <div className="space-y-3">
            {data.learningGoals.map((goal, idx) => {
              const done = goal.status === "COMPLETED";
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.07 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    done
                      ? "bg-[#E8F2EC]/60 border-[#2F6B4F]/20"
                      : "bg-[#FBF7F0] border-[#E2DCD2]"
                  }`}
                >
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                    done ? "bg-[#2F6B4F] border-[#2F6B4F]" : "border-[#D8D2C7] bg-white"
                  }`}>
                    {done && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold leading-snug ${done ? "line-through text-[#A8A196]" : "text-[#211F1D]"}`}>
                      {goal.title}
                    </p>
                    <p className="text-[10px] text-[#78716A] font-semibold mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {goal.dueDate}
                    </p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    done ? "bg-[#E8F2EC] text-[#2F6B4F]" : "bg-[#FEF3C7] text-[#92400E]"
                  }`}>
                    {done ? "Done" : "Active"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resource Library */}
      <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#FF5A36]" /> Curated R&D Learning Library
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.learningResources.map((res, idx) => {
            const meta = RESOURCE_COLORS[res.category] || { color: "#57534E", bg: "#F5F0E8" };
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.06 }}
                className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-4 flex flex-col gap-3 hover:border-[#FF5A36]/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <Zap className="h-4 w-4" style={{ color: meta.color }} />
                  </div>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase" style={{ background: meta.bg, color: meta.color }}>
                    {res.category}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-[#211F1D] leading-snug group-hover:text-[#FF5A36] transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-xs text-[#78716A] mt-1.5 leading-relaxed line-clamp-2">{res.description}</p>
                </div>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 bg-[#211F1D] text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#FF5A36] transition-colors"
                >
                  Access Resource <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
