"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, Calendar, Award, Star, RefreshCw, Video,
  Clock, CheckCircle2, ChevronRight, Loader2, BookOpen, ShieldCheck,
  TrendingUp, Activity, ExternalLink, UserCheck, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  expert: {
    name: string;
    designation: string;
    institution: string;
    department: string;
    availabilityStatus: string;
    rating: number;
    reviewsCount: number;
    verificationStatus: string;
  };
  kpis: {
    activeEngagementsCount: number;
    completedEngagementsCount: number;
    studentsMentoredCount: number;
    totalConsultationHours: number;
    hIndex: number;
    citationsCount: number;
    totalPublications: number;
  };
  activeProjects: Array<{
    id: string;
    name: string;
    industryPartner: string;
    status: string;
    role: string;
    sprintMilestone: string;
    progress: number;
    nextDeliverable: string;
    dueDate: string;
  }>;
  studentMentees: Array<{
    id: string;
    name: string;
    project: string;
    institution: string;
    progress: number;
    attendance: string;
  }>;
  upcomingCalls: Array<{
    id: string;
    title: string;
    orgName: string;
    startTime: string;
    endTime: string;
    platform: string;
    videoLink: string;
    status: string;
  }>;
}

export default function ExpertDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/dashboard");
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
          <p className="text-xs font-medium text-[#57534E]">Loading Expert Advisor Dashboard...</p>
        </div>
      </div>
    );
  }

  const expert = data?.expert || {
    name: "Dr. S. Ramanathan",
    designation: "Professor & Department Head",
    institution: "IISc Bangalore",
    department: "Aerospace Engineering",
    availabilityStatus: "AVAILABLE",
    rating: 4.9,
    reviewsCount: 18,
    verificationStatus: "VERIFIED",
  };

  const kpis = data?.kpis || {
    activeEngagementsCount: 2,
    completedEngagementsCount: 14,
    studentsMentoredCount: 6,
    totalConsultationHours: 120,
    hIndex: 24,
    citationsCount: 1420,
    totalPublications: 38,
  };

  const projects = data?.activeProjects || [];

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Top Banner Header */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-3xl font-extrabold text-[#211F1D]">
                  Welcome back, {expert.name}
                </h1>
                <span className="badge-[#2F6B4F]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {expert.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-[#57534E] mt-1">
                {expert.designation} • {expert.institution} ({expert.department})
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/expert/opportunities" className="btn-primary text-xs min-h-[40px]">
                <Briefcase className="h-4 w-4" /> Browse Funded Proposals
              </Link>
              <button onClick={fetchDashboard} className="btn-secondary text-xs min-h-[40px]">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* 4 Key KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Active Consultations</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.activeEngagementsCount}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">2 milestone reviews due</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Students Mentored</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.studentsMentoredCount}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">Active lab supervision</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Consultation Hours</p>
            <p className="font-heading text-3xl font-extrabold text-[#FF5A36] mt-2">{kpis.totalConsultationHours} hrs</p>
            <p className="text-[11px] text-[#57534E] mt-1">Logged this academic year</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Academic Metrics</p>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">h-index {kpis.hIndex}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">{kpis.citationsCount} Citations</p>
          </div>
        </div>

        {/* Active Consultations List */}
        <div className="card-warm p-6 bg-[#EFE9DF] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
            <h2 className="font-heading text-lg font-extrabold text-[#211F1D]">Active Industry Projects</h2>
            <Link href="/expert/projects" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
              View All Projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-[#FBF7F0] rounded-xl border border-[#E2DCD2] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">{proj.role}</span>
                    <h3 className="font-heading text-base font-bold text-[#211F1D] mt-0.5">{proj.name}</h3>
                    <p className="text-xs text-[#78716A] mt-0.5">Sponsor: {proj.industryPartner}</p>
                  </div>
                  <span className="badge-[#2F6B4F]">{proj.status}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#57534E] pt-2 border-t border-[#E2DCD2]">
                  <span>Next Deliverable: <strong>{proj.nextDeliverable}</strong></span>
                  <span>Due Date: <strong>{proj.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
