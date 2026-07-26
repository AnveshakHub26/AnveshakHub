"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, RefreshCw, Layers, CheckCircle2, Clock,
  Loader2, ChevronRight, User, ShieldCheck, ArrowRight, Bell, FileText
} from "lucide-react";
import Link from "next/link";
import HumanEmptyState from "@/components/ui/human-empty-state";

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
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20 text-left">
      
      {/* Header Banner */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                Deliverable & Milestone Velocity Tracker
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
                My Projects & Research Sprints
              </h1>
              <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-medium">
                Active industrial research projects assigned by faculty leads and corporate partners.
              </p>
            </div>
            <button onClick={fetchProjects} className="btn-secondary text-xs shrink-0 self-start md:self-auto">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh List
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin mx-auto" />
            <p className="text-xs text-[#78716A] font-semibold mt-2">Loading active project workspaces…</p>
          </div>
        ) : projects.length === 0 ? (
          <HumanEmptyState
            title="No Active Projects Assigned"
            description="You haven't been onboarded onto a research project team yet. Browse available corporate R&D listings and submit your application."
            actionLabel="Explore Opportunities"
            actionHref="/student/opportunities"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-5 flex flex-col justify-between hover:border-[#FF5A36]/50 transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">
                        {proj.industryPartner}
                      </span>
                      <h2 className="font-heading text-lg font-extrabold text-[#211F1D] mt-0.5">
                        {proj.name}
                      </h2>
                    </div>
                    <span className="badge-forest text-[10px] font-bold shrink-0">
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#57534E] font-semibold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#FF5A36]" />
                    Lead Supervisor: {proj.leadExpert}
                  </p>
                  <p className="text-xs text-[#78716A] font-semibold">
                    Role: {proj.role}
                  </p>

                  {/* Progress bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#211F1D]">Milestones Progress</span>
                      <span className="text-[#FF5A36] font-mono">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-[#EFE9DF] rounded-full h-2 overflow-hidden border border-[#E2DCD2]">
                      <div
                        className="bg-[#FF5A36] h-full rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-[#EFE9DF] border border-[#E2DCD2]">
                      <span className="text-[10px] text-[#78716A] uppercase font-bold">Milestones</span>
                      <p className="text-sm font-extrabold text-[#211F1D] mt-0.5">
                        {proj.completedMilestonesCount}/{proj.milestonesCount} Verified
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#EFE9DF] border border-[#E2DCD2]">
                      <span className="text-[10px] text-[#78716A] uppercase font-bold">Sprint Tasks</span>
                      <p className="text-sm font-extrabold text-[#211F1D] mt-0.5">
                        {proj.completedTasksCount}/{proj.assignedTasksCount} Complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2DCD2] flex items-center justify-between">
                  <span className="text-[11px] text-[#78716A] font-semibold">
                    Duration: {proj.startDate} - {proj.endDate}
                  </span>
                  <Link
                    href={`/student/projects/${proj.id}`}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
