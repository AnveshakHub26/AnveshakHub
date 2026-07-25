"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, CheckCircle2, Star, Clock, Video, RefreshCw,
  ChevronRight, Loader2, Award, User, ShieldCheck, Check, AlertCircle, ArrowRight
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
      if (json.status === "success") {
        setData(json);
      }
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
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-sm font-medium text-[#57534E]">Loading your research dashboard...</p>
        </div>
      </div>
    );
  }

  const student = data?.student || {
    name: "Aditya Kumar",
    usn: "1RV21CS014",
    institution: "RV College of Engineering",
    degree: "B.Tech Computer Science",
    semester: 6,
    cgpa: 9.2,
    verificationStatus: "VERIFIED",
  };

  const kpis = data?.kpis || {
    activeProjectsCount: 1,
    completedTasksCount: 8,
    totalTasksCount: 12,
    mentorshipScore: 9.4,
    attendanceRate: 98,
    learningGoalsCompleted: 4,
    totalLearningGoals: 5,
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#211F1D]">
                  Welcome back, {student.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-[#E8F2EC] text-[#2F6B4F] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#2F6B4F]/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {student.verificationStatus}
                </span>
              </div>
              <p className="text-sm text-[#57534E] mt-1">
                {student.degree} • {student.institution} (Semester {student.semester})
              </p>
            </div>
            
            {/* Specific Copy Alert (Rule #5) */}
            <div className="bg-[#FFF0ED] border border-[#FF5A36]/30 p-3.5 rounded-xl flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#FF5A36] animate-ping shrink-0" />
              <p className="text-xs text-[#211F1D] font-medium">
                <strong className="text-[#FF5A36]">3 recruiters</strong> viewed your profile this week.
              </p>
              <Link href="/student/profile" className="btn-primary text-xs py-1.5 px-3 min-h-[36px] ml-auto shrink-0">
                Finish Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Profile Resume Action Prompt (Rule #5) */}
        <div className="card-warm p-5 bg-[#FFF0ED] border-[#FF5A36]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-[#FF5A36] shrink-0" />
            <div>
              <h3 className="font-heading text-sm font-bold text-[#211F1D]">
                Profiles with a resume get 4x more replies. Yours is missing one.
              </h3>
              <p className="text-xs text-[#57534E] mt-0.5">
                Upload your latest PDF resume to appear in corporate recruitment searches.
              </p>
            </div>
          </div>
          <Link href="/student/profile" className="btn-primary text-xs min-h-[40px]">
            Upload Resume Now
          </Link>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Active Projects</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.activeProjectsCount}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">1 milestone in review</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Task Completion</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">
              {kpis.completedTasksCount}/{kpis.totalTasksCount}
            </p>
            <p className="text-[11px] text-[#57534E] mt-1">66% milestone velocity</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Mentor Rating</p>
            <p className="font-heading text-3xl font-extrabold text-[#FF5A36] mt-2">{kpis.mentorshipScore}/10</p>
            <p className="text-[11px] text-[#57534E] mt-1">From Dr. S. Ramanathan</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Learning Goals</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">
              {kpis.learningGoalsCompleted}/{kpis.totalLearningGoals}
            </p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">80% completed</p>
          </div>
        </div>

        {/* 2-Column Section: Active Project & Specific Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Project Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-warm p-6 bg-[#EFE9DF] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#FF5A36]">Assigned R&D Project</span>
                <span className="text-xs font-semibold text-[#2F6B4F] bg-[#E8F2EC] px-2.5 py-1 rounded-md border border-[#2F6B4F]/20">
                  Sprint 3 Active
                </span>
              </div>

              <h2 className="font-heading text-xl font-extrabold text-[#211F1D]">
                Autonomous Drone Navigation in Low-Bandwidth GPS Environments
              </h2>

              <p className="text-xs text-[#57534E]">
                Sponsored by <strong>AeroTech Industries Bangalore</strong> • Lead Advisor: <strong>Dr. S. Ramanathan</strong>
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-medium text-[#211F1D]">
                  <span>Milestone Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-[#D8D2C7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <Link href="/student/projects" className="btn-primary text-xs min-h-[40px]">
                  View Deliverables
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Opportunities Specific Copy (Rule #5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-warm p-6 bg-[#EFE9DF] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-[#211F1D]">Matched Opportunities</h3>
                <span className="text-xs text-[#FF5A36] font-semibold">12 Available Today</span>
              </div>

              <p className="text-xs text-[#57534E]">
                You haven't applied anywhere yet — pick one of the 12 internships below and it takes about 3 minutes.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2] flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-[#211F1D]">AI Computer Vision Intern</h4>
                    <p className="text-[11px] text-[#78716A]">RoboTech Labs • ₹25,000 / mo</p>
                  </div>
                  <Link href="/student/opportunities" className="btn-primary text-xs py-1.5 px-3 min-h-[36px]">
                    Apply Now
                  </Link>
                </div>

                <div className="p-3.5 bg-[#FBF7F0] rounded-lg border border-[#E2DCD2] flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-[#211F1D]">Battery Management R&D Intern</h4>
                    <p className="text-[11px] text-[#78716A]">EV Dynamics • ₹30,000 / mo</p>
                  </div>
                  <Link href="/student/opportunities" className="btn-primary text-xs py-1.5 px-3 min-h-[36px]">
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
