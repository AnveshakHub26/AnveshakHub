"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Search, RefreshCw, Layers, CheckCircle2, Clock,
  Loader2, ChevronRight, User, ShieldCheck, ArrowRight, Bell
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
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                Deliverable Status Tracker
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
                My Projects & Applications
              </h1>
            </div>
            
            <button onClick={fetchProjects} className="btn-secondary text-xs min-h-[40px]">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Status
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Application Status Specific Banner (Rule #5) */}
        <div className="card-warm p-5 bg-[#E8F2EC] border-[#2F6B4F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#2F6B4F] animate-ping shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-[#211F1D]">
                Submitted Tuesday. Companies usually respond within 5-7 days — we'll notify you the moment they do.
              </h3>
              <p className="text-xs text-[#57534E] mt-0.5">
                Your application to EV Dynamics (Battery Management R&D) is currently under review by Dr. S. Ramanathan.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2F6B4F] bg-white px-3 py-1.5 rounded-lg border border-[#2F6B4F]/20 shrink-0">
            In Review
          </span>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin mx-auto" />
            <p className="text-xs text-[#78716A] mt-2">Loading active projects...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="card-warm p-6 bg-[#EFE9DF] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DCD2] pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">{proj.role}</span>
                    <h2 className="font-heading text-lg font-extrabold text-[#211F1D] mt-0.5">{proj.name}</h2>
                    <p className="text-xs text-[#78716A] mt-1">
                      Sponsor: <strong>{proj.industryPartner}</strong> • Lead Advisor: <strong>{proj.leadExpert}</strong>
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[#2F6B4F] bg-[#E8F2EC] px-3 py-1 rounded-md border border-[#2F6B4F]/20 self-start sm:self-auto">
                    {proj.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#211F1D]">
                  <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2]">
                    <span className="text-[#78716A]">Milestone Progress</span>
                    <p className="font-bold text-[#211F1D] text-sm mt-0.5">{proj.completedMilestonesCount}/{proj.milestonesCount} Milestones Done</p>
                  </div>

                  <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2]">
                    <span className="text-[#78716A]">Task Deliverables</span>
                    <p className="font-bold text-[#211F1D] text-sm mt-0.5">{proj.completedTasksCount}/{proj.assignedTasksCount} WBS Tasks Completed</p>
                  </div>

                  <div className="p-3 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2]">
                    <span className="text-[#78716A]">Timeline Duration</span>
                    <p className="font-bold text-[#211F1D] text-sm mt-0.5">{proj.startDate} to {proj.endDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
