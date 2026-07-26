"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, RefreshCw, Layers, CheckCircle2, Clock,
  Loader2, ChevronRight, Users, FileText
} from "lucide-react";
import Link from "next/link";

interface ExpertProject {
  id: string;
  name: string;
  industryPartner: string;
  status: string;
  role: string;
  budget: number;
  startDate: string;
  endDate: string;
  progress: number;
  milestonesCount: number;
  completedMilestonesCount: number;
  tasksCount: number;
  completedTasksCount: number;
  studentMenteesCount: number;
  deliverablesCount: number;
}

export default function ExpertProjectsPage() {
  const [projects, setProjects] = useState<ExpertProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, status: statusFilter });
      const res = await fetch(`/api/expert/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Expert Assigned R&D Projects</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Manage research execution, WBS task assignments, student intern guidance & deliverable sign-offs</p>
        </div>
        <button onClick={fetchProjects} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects by name or industry partner..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                statusFilter === s ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2]"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#EFE9DF] rounded-2xl p-12 text-center">
          <Briefcase className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Assigned Projects Found</p>
          <p className="text-[10px] text-[#A8A196] mt-1">Engage with industry opportunities to start R&D projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#FFF0ED] text-[#FF5A36]">{p.role}</span>
                  <h3 className="text-sm font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors mt-1">{p.name}</h3>
                  <p className="text-xs text-[#78716A] font-semibold">{p.industryPartner}</p>
                </div>
                <span className="text-xs font-extrabold text-[#211F1D]">{p.progress}%</span>
              </div>

              <div className="h-1.5 bg-[#EFE9DF] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${p.progress}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 text-center text-xs">
                <div>
                  <span className="text-[8px] text-[#A8A196] font-bold uppercase block">Milestones</span>
                  <span className="font-extrabold text-[#211F1D]">{p.completedMilestonesCount} / {p.milestonesCount}</span>
                </div>
                <div>
                  <span className="text-[8px] text-[#A8A196] font-bold uppercase block">Tasks</span>
                  <span className="font-extrabold text-[#211F1D]">{p.completedTasksCount} / {p.tasksCount}</span>
                </div>
                <div>
                  <span className="text-[8px] text-[#A8A196] font-bold uppercase block">Mentees</span>
                  <span className="font-extrabold text-[#211F1D]">{p.studentMenteesCount} Interns</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[10px] text-[#A8A196] font-semibold">{formatCurrency(p.budget)} Budget</span>
                <Link
                  href={`/expert/projects/${p.id}`}
                  className="h-8 px-3 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1 transition-colors"
                >
                  Manage Project <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
