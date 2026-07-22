"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, RefreshCw, Award, Star, CheckCircle2, Clock,
  ChevronRight, Loader2, BookOpen, FileCheck, UserCheck
} from "lucide-react";
import Link from "next/link";

interface StudentMentee {
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
  completedTasksCount: number;
  totalTasksCount: number;
  status: string;
  recommendationIssued: boolean;
}

export default function StudentMentorshipPage() {
  const [mentees, setMentees] = useState<StudentMentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("ALL");

  const fetchMentees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, project: projectFilter });
      const res = await fetch(`/api/expert/students?${params}`);
      const data = await res.json();
      setMentees(data.mentees || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, projectFilter]);

  useEffect(() => {
    fetchMentees();
  }, [fetchMentees]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Mentorship & Talent Development</h1>
          <p className="text-xs text-slate-500 mt-0.5">Guide student interns, conduct skill assessments, track attendance, and issue recommendations</p>
        </div>
        <button onClick={fetchMentees} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search mentees by name, USN or project..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "Solar Micro-Grid", "Autonomous Rover"].map(p => (
            <button
              key={p}
              onClick={() => setProjectFilter(p)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                projectFilter === p ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Mentees Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : mentees.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Student Mentees Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Assign interns to your R&D projects to begin guidance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentees.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{m.usn}</span>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors mt-1">{m.name}</h3>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{m.attendanceRate}% Attendance</span>
                </div>

                <p className="text-[10px] text-slate-500 font-semibold">{m.institution} · {m.degree} (Sem {m.semester})</p>
                <p className="text-[9px] text-purple-700 font-extrabold bg-purple-50 px-2 py-1 rounded-lg">Role: {m.assignedRole}</p>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center text-xs">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Skill Score</span>
                    <span className="font-extrabold text-slate-800">★ {m.overallScore}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Tasks Done</span>
                    <span className="font-extrabold text-slate-800">{m.completedTasksCount} / {m.totalTasksCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[8px] font-bold text-slate-400">CGPA: {m.cgpa}</span>
                <Link
                  href={`/expert/students/${m.id}`}
                  className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-hover flex items-center gap-1 transition-colors"
                >
                  Mentee Studio <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
