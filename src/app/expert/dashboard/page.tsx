"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, Calendar, Award, Star, RefreshCw, Video,
  Clock, CheckCircle2, ChevronRight, Loader2, BookOpen, ShieldCheck,
  TrendingUp, Activity, ExternalLink, UserCheck, GraduationCap,
  FlaskConical, ArrowUpRight, BadgeCheck, Quote
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
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/expert/dashboard");
      const json = await res.json();
      if (json.status === "success") setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs font-semibold text-[#57534E]">Loading Research Workbench…</p>
        </div>
      </div>
    );
  }

  const expert = data?.expert || {
    name: "Verified Expert Researcher",
    designation: "Subject Matter Expert",
    institution: "Partner University",
    department: "R&D Department",
    availabilityStatus: "AVAILABLE",
    rating: 5.0,
    reviewsCount: 0,
    verificationStatus: "VERIFIED",
  };

  const kpis = data?.kpis || {
    activeEngagementsCount: 0,
    completedEngagementsCount: 0,
    studentsMentoredCount: 0,
    totalConsultationHours: 0,
    hIndex: 0,
    citationsCount: 0,
    totalPublications: 0,
  };

  const projects     = data?.activeProjects || [];
  const mentees      = data?.studentMentees || [];
  const upcomingCalls = data?.upcomingCalls || [];

  const kpiCards = [
    { label: "Active Consultations",   value: kpis.activeEngagementsCount,   sub: "2 milestone reviews due",    icon: Briefcase,     color: "#FF5A36", bg: "#FFF0ED" },
    { label: "Students Mentored",      value: kpis.studentsMentoredCount,    sub: "Active lab supervision",     icon: GraduationCap, color: "#4338CA", bg: "#EEF2FF" },
    { label: "Consultation Hours",     value: `${kpis.totalConsultationHours}h`, sub: "This academic year",    icon: Clock,         color: "#2F6B4F", bg: "#E8F2EC" },
    { label: "h-Index",                value: kpis.hIndex,                   sub: `${kpis.citationsCount} citations`, icon: FlaskConical, color: "#92400E", bg: "#FEF3C7" },
  ];

  return (
    <div className="bg-[#FBF7F0] min-h-screen">

      {/* Top Banner */}
      <div className="bg-[#211F1D] px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] uppercase tracking-widest">
                  Expert Portal
                </span>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] flex items-center gap-1">
                  <BadgeCheck className="h-2.5 w-2.5" /> {expert.verificationStatus}
                </span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  expert.availabilityStatus === "AVAILABLE"
                    ? "bg-[#E8F2EC] text-[#2F6B4F]"
                    : "bg-[#FEF3C7] text-[#92400E]"
                }`}>
                  ● {expert.availabilityStatus}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome back, {expert.name}
              </h1>
              <p className="text-[#78716A] text-sm mt-1">
                {expert.designation} · {expert.institution} · {expert.department}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#FF5A36] fill-[#FF5A36]" />
                  <span className="text-white font-extrabold text-sm">{expert.rating}</span>
                  <span className="text-[#78716A] text-xs">({expert.reviewsCount} reviews)</span>
                </div>
                <span className="text-[#3a3733]">·</span>
                <span className="text-[#78716A] text-xs">{kpis.totalPublications} publications</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/expert/opportunities"
                className="h-10 px-5 bg-[#FF5A36] text-white rounded-xl text-sm font-bold hover:bg-[#E04826] flex items-center gap-2 transition-colors shadow-md shadow-[#FF5A36]/30"
              >
                <Briefcase className="h-4 w-4" /> Browse Proposals
              </Link>
              <button
                onClick={fetchDashboard}
                className="h-10 px-4 bg-[#3a3733] text-[#A8A196] hover:text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                  <k.icon className="h-5 w-5" style={{ color: k.color }} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#A8A196]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#211F1D]">{k.value}</p>
                <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{k.label}</p>
                <p className="text-[10px] text-[#A8A196] mt-0.5">{k.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Active Projects */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#211F1D]">Active Industry Consultations</h2>
                <Link href="/expert/projects" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                  All Projects <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-10 text-center">
                  <Briefcase className="h-8 w-8 text-[#D8D2C7] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#211F1D]">No active consultations</p>
                  <p className="text-xs text-[#78716A] mt-1">Browse funded proposals to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.06 }}
                      className="bg-[#FBF7F0] rounded-xl border border-[#E2DCD2] p-4 space-y-3 hover:border-[#FF5A36]/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-extrabold text-[#FF5A36] uppercase tracking-widest">{proj.role}</span>
                          <h3 className="text-sm font-extrabold text-[#211F1D] mt-0.5">{proj.name}</h3>
                          <p className="text-xs text-[#78716A] font-semibold">Sponsor: {proj.industryPartner}</p>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] flex-shrink-0">
                          {proj.status}
                        </span>
                      </div>
                      {proj.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-[#57534E]">
                            <span>{proj.sprintMilestone}</span>
                            <span className="text-[#FF5A36] font-extrabold">{proj.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#D8D2C7] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#FF5A36] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${proj.progress}%` }}
                              transition={{ duration: 0.8, delay: 0.4 + idx * 0.06, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-[#78716A] pt-1 border-t border-[#E2DCD2]">
                        <span>Next: <strong className="text-[#211F1D]">{proj.nextDeliverable}</strong></span>
                        <span>Due: <strong className="text-[#FF5A36]">{proj.dueDate}</strong></span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Student Mentees */}
            {mentees.length > 0 && (
              <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#211F1D] flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#4338CA]" /> Student Mentees
                  </h2>
                  <Link href="/expert/students" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                    View All <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentees.slice(0, 4).map((mentee, idx) => (
                    <motion.div
                      key={mentee.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.06 }}
                      className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 space-y-2 hover:border-[#4338CA]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4338CA] font-extrabold text-sm flex-shrink-0">
                          {mentee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-[#211F1D] truncate">{mentee.name}</p>
                          <p className="text-[10px] text-[#78716A] truncate">{mentee.institution}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#57534E] font-semibold truncate">{mentee.project}</p>
                      <div className="h-1.5 bg-[#D8D2C7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#4338CA] rounded-full" style={{ width: `${mentee.progress}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Upcoming Calls + Quick Links */}
          <div className="lg:col-span-4 space-y-6">

            {/* Upcoming Calls */}
            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
                <Video className="h-4 w-4 text-[#FF5A36]" /> Upcoming Sessions
              </h3>
              {upcomingCalls.length === 0 ? (
                <p className="text-xs text-[#78716A] text-center py-4">No sessions scheduled</p>
              ) : (
                <div className="space-y-2">
                  {upcomingCalls.slice(0, 3).map((call, idx) => (
                    <div key={call.id} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 space-y-2">
                      <div>
                        <p className="text-xs font-bold text-[#211F1D]">{call.title}</p>
                        <p className="text-[10px] text-[#78716A] font-semibold">{call.orgName}</p>
                        <p className="text-[10px] text-[#A8A196] flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {new Date(call.startTime).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <a href={call.videoLink} target="_blank" rel="noopener noreferrer"
                        className="h-7 w-full bg-[#2F6B4F] text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#245840] transition-colors">
                        <Video className="h-3 w-3" /> Join {call.platform}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-extrabold text-[#57534E] uppercase tracking-widest">Expert Tools</h3>
              {[
                { label: "Funded Proposals",    href: "/expert/opportunities", icon: Briefcase,     color: "#FF5A36", bg: "#FFF0ED" },
                { label: "Mentee Progress",      href: "/expert/students",      icon: GraduationCap, color: "#4338CA", bg: "#EEF2FF" },
                { label: "Documents & Reports",  href: "/expert/documents",     icon: BookOpen,      color: "#2F6B4F", bg: "#E8F2EC" },
                { label: "Consultation Finance", href: "/expert/finance",       icon: Award,         color: "#92400E", bg: "#FEF3C7" },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-3 p-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl hover:border-[#FF5A36]/40 transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
                    <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
                  </div>
                  <span className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors flex-1">{a.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#A8A196] group-hover:text-[#FF5A36] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
