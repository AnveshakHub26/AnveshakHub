"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, RefreshCw, Layers, CheckCircle2, Clock,
  Loader2, ChevronRight, User
} from "lucide-react";
import Link from "next/link";

interface StudentProject {
  id: string;
  name: string;
  industryPartner: string;
  leadExpert: string;
  role: string;
  progress: number;
  status: string;
  milestonesCount: number;
  completedMilestonesCount: number;
  assignedTasksCount: number;
  completedTasksCount: number;
  startDate: string;
  endDate: string;
}

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assigned Student R&D Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track milestone progress, complete assigned WBS work tasks & submit hardware/software deliverables</p>
        </div>
        <button onClick={fetchProjects} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Projects Assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{p.role}</span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors mt-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{p.industryPartner} · Lead: {p.leadExpert}</p>
                </div>
                <span className="text-xs font-extrabold text-slate-800">{p.progress}%</span>
              </div>

              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center text-xs">
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Milestones</span>
                  <span className="font-extrabold text-slate-800">{p.completedMilestonesCount} / {p.milestonesCount}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Your Tasks</span>
                  <span className="font-extrabold text-slate-800">{p.completedTasksCount} / {p.assignedTasksCount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  href={`/student/projects/${p.id}`}
                  className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1 transition-colors"
                >
                  Workspace <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
