"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Award, Star, BookOpen, Clock, Download, RefreshCw,
  Loader2, CheckCircle2, ShieldCheck
} from "lucide-react";

interface ProgressData {
  academicSummary: {
    cgpa: number;
    completedSemesters: number;
    creditsEarned: number;
    classRank: number;
  };
  growthMetrics: {
    milestonesCompleted: number;
    internshipsCompleted: number;
    mentorshipScore: number;
    attendanceRate: number;
  };
  skillVelocity: Array<{
    skill: string;
    level: string;
    progress: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    category: string;
    issuer: string;
    year: number;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    category: string;
  }>;
}

export default function StudentProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/progress");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

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
          <h1 className="text-xl font-bold text-slate-900">Academic & Professional Growth Console</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive analytics on CGPA trends, milestone completion velocity, hackathons & expert mentorship scores</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProgress} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button className="h-8 px-3 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Download className="h-3.5 w-3.5" /> Export Progress Report PDF
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.academicSummary.cgpa} CGPA</div>
            <div className="text-[9px] text-slate-400 font-bold">Rank #{data.academicSummary.classRank} ({data.academicSummary.creditsEarned} Credits)</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.growthMetrics.milestonesCompleted} Milestones</div>
            <div className="text-[9px] text-slate-400 font-bold">{data.growthMetrics.internshipsCompleted} R&D Internship</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">★ {data.growthMetrics.mentorshipScore}</div>
            <div className="text-[9px] text-slate-400 font-bold">Lead Mentor Rating</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.achievements.length} Honors</div>
            <div className="text-[9px] text-slate-400 font-bold">Awards & Fellowships</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Velocity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Velocity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Technical Skill Mastery Velocity</h3>
          <div className="space-y-4 pt-1">
            {data.skillVelocity.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 font-bold">{s.skill}</span>
                  <span className="text-primary font-extrabold">{s.level} ({s.progress}%)</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Achievements, Awards & Fellowships</h3>
          <div className="space-y-3 pt-1">
            {data.achievements.map(ach => (
              <div key={ach.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">{ach.category}</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{ach.title}</h4>
                  <p className="text-[9px] text-slate-400 font-semibold">{ach.issuer}</p>
                </div>
                <span className="text-[9px] font-extrabold text-primary">{ach.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
