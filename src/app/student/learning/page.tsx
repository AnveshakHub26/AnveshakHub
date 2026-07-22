"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Star, Award, CheckCircle2, ExternalLink, RefreshCw,
  Loader2, User, Clock, Check
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

export default function StudentLearningPage() {
  const [data, setData] = useState<StudentLearningData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLearning = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/learning");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLearning();
  }, [fetchLearning]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Learning, Mentorship & Skill Development</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track R&D competency scores, complete personalized learning goals & access specialized technical resources</p>
        </div>
        <button onClick={fetchLearning} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[8px] font-extrabold uppercase bg-purple-500/20 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded">Competency Track</span>
          <h2 className="text-lg font-bold mt-1">Skill Proficiency Target</h2>
          <p className="text-xs text-purple-200 font-medium">Lead Mentor: {data.leadMentor.name} ({data.leadMentor.totalSessionsCompleted} Mentorship Sessions Completed)</p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-extrabold block">{data.overallProgressPct}%</span>
          <span className="text-[9px] text-purple-300 font-semibold uppercase block">Overall Progress</span>
        </div>
      </div>

      {/* Grid: Skill Scores & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Competency Scores */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Award className="h-4 w-4 text-primary" /> Technical Competency Benchmarks
          </h3>

          <div className="space-y-3 pt-1">
            {data.skillScores.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{s.skill}</span>
                  <span className="text-primary font-extrabold">{s.score} / {s.target}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Personalized Learning Goals
          </h3>

          <div className="space-y-2.5 pt-1">
            {data.learningGoals.map(goal => (
              <div key={goal.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                    goal.status === "COMPLETED" ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                  }`}>
                    {goal.status === "COMPLETED" && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className={`font-bold text-xs ${goal.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>{goal.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">Target Date: {goal.dueDate}</p>
                  </div>
                </div>
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                  goal.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}>{goal.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Resources Repository */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary" /> Curated R&D Learning Materials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {data.learningResources.map(res => (
            <div key={res.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-primary-light text-primary uppercase">{res.category}</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1">{res.title}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{res.description}</p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 mt-3 transition-colors"
              >
                Access Documentation <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
