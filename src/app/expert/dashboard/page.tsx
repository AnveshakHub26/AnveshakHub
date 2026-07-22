"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, Calendar, Award, Star, RefreshCw, Video,
  Clock, CheckCircle2, ChevronRight, Loader2, BookOpen, ShieldCheck,
  TrendingUp, Activity, ExternalLink, UserCheck
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
  recentActivities: Array<{
    id: string;
    event: string;
    target: string;
    date: string;
  }>;
}

const AVAILABILITY_BADGES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  AVAILABLE:           { label: "Available for Consulting", bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  PARTIALLY_AVAILABLE: { label: "Limited Availability",     bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  UNAVAILABLE:         { label: "Currently Unavailable",   bg: "bg-slate-100", text: "text-slate-600",  dot: "bg-slate-400" }
};

export default function ExpertDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/dashboard");
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

  const handleStatusChange = async (status: string) => {
    try {
      await fetch("/api/expert/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilityStatus: status })
      });
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const avail = AVAILABILITY_BADGES[data.expert.availabilityStatus] || AVAILABILITY_BADGES.AVAILABLE;

  return (
    <div className="p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center text-xl shrink-0 shadow-lg">
            {data.expert.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{data.expert.name}</h1>
              {data.expert.verificationStatus === "VERIFIED" && (
                <span className="text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Expert
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium">{data.expert.designation} · {data.expert.institution}</p>
            <p className="text-[10px] text-slate-400 font-semibold">{data.expert.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${avail.dot}`} />
            <select
              value={data.expert.availabilityStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="AVAILABLE" className="bg-slate-800 text-white">Available for Consulting</option>
              <option value="PARTIALLY_AVAILABLE" className="bg-slate-800 text-white">Limited Availability</option>
              <option value="UNAVAILABLE" className="bg-slate-800 text-white">Unavailable</option>
            </select>
          </div>
          <Link href="/expert/profile" className="h-9 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5 transition-colors">
            Profile Studio <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.activeEngagementsCount} Active</div>
            <div className="text-[9px] text-slate-400 font-bold">{data.kpis.completedEngagementsCount} Completed Projects</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.studentsMentoredCount} Interns</div>
            <div className="text-[9px] text-slate-400 font-bold">Student Guidance</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{data.kpis.totalConsultationHours} Hours</div>
            <div className="text-[9px] text-slate-400 font-bold">Consulting Conducted</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Star className="h-5 w-5 fill-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">★ {data.expert.rating}</div>
            <div className="text-[9px] text-slate-400 font-bold">H-Index: {data.kpis.hIndex} ({data.kpis.citationsCount} Citations)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Engagements & Mentorship */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Engagements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Active Industry R&D Projects</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Projects where you are assigned as Technical Advisor or Consultant</p>
              </div>
              <button onClick={fetchDashboard} className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3">
              {data.activeProjects.map(p => (
                <div key={p.id} className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{p.role}</span>
                        <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Partner: {p.industryPartner}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-700">{p.progress}% Progress</span>
                  </div>

                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                    <span>Milestone: {p.sprintMilestone}</span>
                    <span>Next Deliverable: {p.nextDeliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Mentorship Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Student Mentees Under Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.studentMentees.map(m => (
                <div key={m.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{m.name}</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-700">{m.attendance}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-semibold line-clamp-1">{m.project}</p>
                  <div className="text-[8px] text-slate-400 font-semibold">{m.institution} · {m.progress}% milestone</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Sessions & Activity */}
        <div className="space-y-6">
          {/* Upcoming Calls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Upcoming Sessions
            </h3>
            <div className="space-y-3">
              {data.upcomingCalls.map(call => (
                <div key={call.id} className="border border-slate-100 rounded-xl p-3.5 space-y-2 bg-slate-50">
                  <p className="font-bold text-xs text-slate-800">{call.title}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">{call.orgName}</p>
                  <div className="text-[9px] text-primary font-bold">
                    {new Date(call.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – {new Date(call.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <a
                    href={call.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 w-full bg-green-500 hover:bg-green-600 text-white rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Video className="h-3 w-3" /> Join Call
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Recent Activity Log</h3>
            <div className="space-y-2.5">
              {data.recentActivities.map(act => (
                <div key={act.id} className="border-l-2 border-primary pl-3 py-1 space-y-0.5">
                  <p className="font-bold text-slate-800">{act.event}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{act.target} · {new Date(act.date).toLocaleDateString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
