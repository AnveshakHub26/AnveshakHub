"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, CheckCircle2, Star, Clock, Video, RefreshCw,
  ChevronRight, Loader2, Award, User, ShieldCheck, Check
} from "lucide-react";
import Link from "next/link";

interface StudentDashboardData {
  student: {
    name: string;
    usn: string;
    institution: string;
    degree: string;
    semester: number;
    cgpa: number;
    verificationStatus: string;
  };
  kpis: {
    activeProjectsCount: number;
    completedTasksCount: number;
    totalTasksCount: number;
    mentorshipScore: number;
    attendanceRate: number;
    learningGoalsCompleted: number;
    totalLearningGoals: number;
  };
  assignedProject: {
    id: string;
    name: string;
    industryPartner: string;
    role: string;
    leadExpert: string;
    progress: number;
    sprintMilestone: string;
  };
  assignedTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
  }>;
  leadMentor: {
    id: string;
    name: string;
    designation: string;
    institution: string;
    lastFeedback: string;
    lastFeedbackDate: string;
  };
  upcomingCalls: Array<{
    id: string;
    title: string;
    orgName: string;
    startTime: string;
    endTime: string;
    videoLink: string;
  }>;
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/dashboard");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center text-xl shrink-0 shadow-lg">
            {data.student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{data.student.name}</h1>
              <span className="text-[8px] font-mono font-extrabold bg-slate-700 text-slate-200 px-2 py-0.5 rounded">{data.student.usn}</span>
              {data.student.verificationStatus === "VERIFIED" && (
                <span className="text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Student
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium">{data.student.institution} · {data.student.degree} (Sem {data.student.semester})</p>
            <p className="text-[10px] text-slate-400 font-semibold">Assigned Project: {data.assignedProject.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchDashboard} className="h-8 w-8 rounded-xl border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <Link href="/student/profile" className="h-9 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5 transition-colors">
            Portfolio Studio <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.activeProjectsCount} Project</div>
            <div className="text-[9px] text-slate-400 font-bold">{data.assignedProject.role}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.completedTasksCount} / {data.kpis.totalTasksCount}</div>
            <div className="text-[9px] text-slate-400 font-bold">Tasks Completed</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">★ {data.kpis.mentorshipScore}</div>
            <div className="text-[9px] text-slate-400 font-bold">Expert Evaluation Score</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.attendanceRate}%</div>
            <div className="text-[9px] text-slate-400 font-bold">Attendance Record</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Project Tasks & Mentor Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Project Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{data.assignedProject.role}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{data.assignedProject.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Partner: {data.assignedProject.industryPartner}</p>
              </div>
              <span className="text-xs font-extrabold text-primary">{data.assignedProject.progress}% Progress</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${data.assignedProject.progress}%` }} />
            </div>
          </div>

          {/* Assigned WBS Tasks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Assigned Work Tasks</h3>
            <div className="space-y-2.5">
              {data.assignedTasks.map(t => (
                <div key={t.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                      t.status === "DONE" ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                    }`}>
                      {t.status === "DONE" && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className={`font-bold text-xs ${t.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">Due Date: {t.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">{t.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mentor & Sessions */}
        <div className="space-y-6">
          {/* Lead Mentor Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Assigned Expert Mentor</h3>
            <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/40 space-y-2">
              <p className="font-bold text-xs text-purple-950">{data.leadMentor.name}</p>
              <p className="text-[9px] text-purple-700 font-semibold">{data.leadMentor.designation}</p>
              <div className="pt-2 border-t border-purple-100/60">
                <p className="text-[9px] text-slate-400 font-bold uppercase">Latest Feedback</p>
                <p className="text-xs text-slate-700 font-medium italic mt-0.5">"{data.leadMentor.lastFeedback}"</p>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-primary" /> Upcoming Review Calls
            </h3>
            <div className="space-y-3">
              {data.upcomingCalls.map(call => (
                <div key={call.id} className="border border-slate-100 rounded-xl p-3.5 space-y-2 bg-slate-50">
                  <p className="font-bold text-xs text-slate-800">{call.title}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">{call.orgName}</p>
                  <a
                    href={call.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Video className="h-3 w-3" /> Join Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
