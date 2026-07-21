"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, GraduationCap, Award, FileText, CheckCircle2,
  XCircle, Clock, AlertTriangle, MessageSquare, Calendar, User,
  Building2, Mail, Phone, Globe, MapPin, Hash, Plus, Download,
  Eye, ArrowUpRight, Send, Loader2, Play, HardHat, ShieldCheck,
  Check, X, Video
} from "lucide-react";


// ─── Types ─────────────────────────────────────────────────────────

interface StudentProfile {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  usn: string | null;
  institution: string;
  degree: string;
  branch: string;
  semester: number;
  cgpa: number;
  bio: string | null;
  skills: string[];
  resumeUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
  expert: {
    id: string;
    name: string;
    designation: string;
    email: string;
  } | null;
  industry: {
    id: string;
    orgName: string;
    email: string;
  } | null;
  project: {
    id: string;
    name: string;
    status: string;
  } | null;
  documents: Array<{ id: string; name: string; docType: string; fileUrl: string; status: string; createdAt: string }>;
  applications: Array<{ id: string; industryName: string; status: string; coverLetter: string | null; createdAt: string }>;
  attendance: Array<{ id: string; date: string; status: string; notes: string | null }>;
  milestones: Array<{ id: string; title: string; description: string | null; status: string; rating: number | null; dueDate: string; createdAt: string }>;
  timeline: Array<{ id: string; event: string; category: string; performedBy: string | null; createdAt: string }>;
  attendanceRate: number;
  milestonesCompleted: number;
  milestonesCount: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const TABS = [
  { key: "overview",   label: "Overview",       icon: User },
  { key: "documents",  label: "Resume & Docs",  icon: FileText },
  { key: "internship", label: "Applications",   icon: Building2 },
  { key: "milestones", label: "Milestones",     icon: Award },
  { key: "attendance", label: "Attendance",     icon: Calendar },
  { key: "timeline",   label: "Activity Trail", icon: ShieldCheck },
];

const APPLICATION_STAGES = ["PENDING", "SHORTLISTED", "OFFERED", "PLACED", "REJECTED"];

// ─── Main Page ─────────────────────────────────────────────────────

export default function StudentProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Action Loading states
  const [actionLoading, setActionLoading] = useState(false);
  const [milestoneLoading, setMilestoneLoading] = useState<string | null>(null);
  const [attLoading, setAttLoading] = useState(false);

  // New attendance slot input
  const [newAttDate, setNewAttDate] = useState("");
  const [newAttStatus, setNewAttStatus] = useState("PRESENT");
  const [newAttNotes, setNewAttNotes] = useState("");
  const [showAttForm, setShowAttForm] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", status: newStatus }),
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMilestoneUpdate = async (msId: string, status: string, rating?: number) => {
    setMilestoneLoading(msId);
    try {
      await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_MILESTONE", milestoneId: msId, milestoneStatus: status, rating }),
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setMilestoneLoading(null);
    }
  };

  const handleAddAttendance = async () => {
    if (!newAttDate) return;
    setAttLoading(true);
    try {
      await fetch(`/api/admin/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_ATTENDANCE", attDate: newAttDate, attStatus: newAttStatus, attNotes: newAttNotes }),
      });
      setNewAttDate("");
      setNewAttNotes("");
      setShowAttForm(false);
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setAttLoading(false);
    }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/students">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 mt-0.5">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-extrabold text-base">
            {profile.user.name.split(" ").slice(0,2).map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 truncate">{profile.user.name}</h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${profile.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {profile.status}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-primary rounded-full font-bold">
                GPA {profile.cgpa}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{profile.degree} in {profile.branch} · {profile.institution}</p>
          </div>

          <div className="flex items-center gap-2">
            {profile.status === "PENDING" && (
              <>
                <button onClick={() => handleStatusChange("ACTIVE")} disabled={actionLoading} className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                  {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Verify Student
                </button>
                <button onClick={() => handleStatusChange("SUSPENDED")} disabled={actionLoading} className="h-8 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-all">
                  Reject
                </button>
              </>
            )}
            {profile.status === "ACTIVE" && (
              <button onClick={() => handleStatusChange("SUSPENDED")} disabled={actionLoading} className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all">
                Suspend Intern
              </button>
            )}
            {profile.status === "SUSPENDED" && (
              <button onClick={() => handleStatusChange("ACTIVE")} disabled={actionLoading} className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                Activate Intern
              </button>
            )}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-0 mt-4 border-t border-slate-100 pt-0 -mb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                <Icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            
            {/* ──── OVERVIEW TAB ──── */}
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Bio block */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Student Bio</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{profile.bio || "No professional bio provided."}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">USN / Roll No</div>
                        <div className="text-sm font-extrabold text-slate-800 mt-0.5">{profile.usn || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Degree / Semester</div>
                        <div className="text-xs font-bold text-slate-700 mt-1">
                          {profile.degree} (Sem {profile.semester})
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Academic GPA</div>
                        <div className="text-sm font-extrabold text-slate-850 mt-0.5">{profile.cgpa} / 10.0</div>
                      </div>
                    </div>
                  </div>

                  {/* Active attachments */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Project Details</h3>
                    {profile.project ? (
                      <div className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50/30 transition-all">
                        <h4 className="text-xs font-bold text-slate-800">{profile.project.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold">{profile.project.status}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-450 italic">No project allocated.</p>
                    )}
                  </div>

                  {/* Assigned Guide & Industry */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Guide Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Assigned Expert Guide</h3>
                      {profile.expert ? (
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {profile.expert.name.split(" ").slice(-1)[0][0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{profile.expert.name}</h4>
                            <p className="text-[9px] text-slate-400 font-medium">{profile.expert.designation}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{profile.expert.email}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-450 italic">No expert advisor assigned.</p>
                      )}
                    </div>

                    {/* Industry Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Host Industry Partner</h3>
                      {profile.industry ? (
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{profile.industry.orgName}</h4>
                            <p className="text-[9px] text-slate-400 font-medium">{profile.industry.email}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-450 italic">No industry host assigned.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Overview Column */}
                <div className="space-y-4">
                  {/* Skillset list */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Candidate Skillset</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry charts */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Internship Progress</h3>
                    
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Attendance Rate</span>
                        <span className="font-bold text-slate-800">{profile.attendanceRate}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${profile.attendanceRate >= 90 ? "bg-green-500" : "bg-amber-400"}`} style={{ width: `${profile.attendanceRate}%` }} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-bold text-slate-800">{profile.milestonesCompleted} / {profile.milestonesCount}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(profile.milestonesCompleted / (profile.milestonesCount || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── DOCUMENTS TAB ──── */}
            {activeTab === "documents" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Credentials & Resume</h3>
                  <div className="divide-y divide-slate-100">
                    {profile.documents.map((doc) => (
                      <div key={doc.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{doc.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-650 font-bold">{doc.docType}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold">{doc.status}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5">Uploaded {new Date(doc.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                          <button className="h-7 px-3 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] font-bold flex items-center gap-1">
                            <Eye className="h-3 w-3" /> View Document
                          </button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── INTERNSHIP TAB ──── */}
            {activeTab === "internship" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Internship Applications ({profile.applications.length})</h3>
                  
                  <div className="space-y-3">
                    {profile.applications.map((app) => (
                      <div key={app.id} className="border border-slate-150 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-800">{app.industryName}</h4>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${app.status === "PLACED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-primary"}`}>{app.status}</span>
                          </div>
                          {app.coverLetter && <p className="text-[10px] text-slate-500 mt-1">"{app.coverLetter}"</p>}
                          <p className="text-[9px] text-slate-400 mt-0.5">Applied on {new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── MILESTONES TAB ──── */}
            {activeTab === "milestones" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Internship Deliverables & Milestones</h3>
                  
                  <div className="divide-y divide-slate-100">
                    {profile.milestones.map((ms) => (
                      <div key={ms.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{ms.title}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${ms.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-primary"}`}>{ms.status}</span>
                            {ms.rating && <span className="text-[10px] text-amber-600 font-bold">★ {ms.rating} / 5</span>}
                          </div>
                          {ms.description && <p className="text-[10px] text-slate-500 mt-1">"{ms.description}"</p>}
                          <p className="text-[9px] text-slate-400 mt-0.5">Due date: {new Date(ms.dueDate).toLocaleDateString("en-IN")}</p>
                        </div>

                        {ms.status === "PENDING" && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => handleMilestoneUpdate(ms.id, "COMPLETED", 5)} disabled={milestoneLoading === ms.id} className="h-7 px-3 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 flex items-center gap-1 transition-colors">
                              {milestoneLoading === ms.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Mark Completed (Rating: 5)
                            </button>
                            <button onClick={() => handleMilestoneUpdate(ms.id, "MISSED")} disabled={milestoneLoading === ms.id} className="h-7 px-2.5 border border-red-200 text-red-650 rounded-lg text-[10px] font-bold hover:bg-red-50 transition-colors">Missed</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── ATTENDANCE TAB ──── */}
            {activeTab === "attendance" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance List */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Daily Attendance Registry</h3>
                    <button onClick={() => setShowAttForm(!showAttForm)} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors">
                      + Log Attendance
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAttForm && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                        <div className="grid grid-cols-3 gap-2.5 mb-3">
                          <div>
                            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Date</label>
                            <input type="date" value={newAttDate} onChange={(e) => setNewAttDate(e.target.value)} className="w-full h-7 px-2.5 border border-slate-200 text-xs rounded bg-white" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Status</label>
                            <select value={newAttStatus} onChange={(e) => setNewAttStatus(e.target.value)} className="w-full h-7 px-2 border border-slate-200 text-xs rounded bg-white">
                              <option value="PRESENT">Present</option>
                              <option value="ABSENT">Absent</option>
                              <option value="LEAVE">Approved Leave</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Notes</label>
                            <input value={newAttNotes} onChange={(e) => setNewAttNotes(e.target.value)} placeholder="e.g. Done research report" className="w-full h-7 px-2 border border-slate-200 text-xs rounded bg-white" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleAddAttendance} disabled={attLoading} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700">Save Registry</button>
                          <button onClick={() => setShowAttForm(false)} className="h-7 px-2.5 border border-slate-200 text-slate-650 rounded-lg text-[10px]">Cancel</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="divide-y divide-slate-100">
                    {profile.attendance.map((att) => (
                      <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="font-semibold text-slate-700">{att.date}</div>
                        {att.notes && <div className="text-[10px] text-slate-500 italic max-w-[200px] truncate">"{att.notes}"</div>}
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${att.status === "PRESENT" ? "bg-green-50 text-green-700" : att.status === "ABSENT" ? "bg-red-50 text-red-650" : "bg-blue-50 text-primary"}`}>{att.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar summary widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Attendance Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-green-50 border border-green-150 rounded-xl p-3">
                      <div className="text-base font-extrabold text-green-700">{profile.attendanceRate}%</div>
                      <div className="text-[9px] text-slate-500 font-medium">Compliance</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <div className="text-base font-extrabold text-slate-750">{profile.attendance.filter(a => a.status === "PRESENT").length} days</div>
                      <div className="text-[9px] text-slate-500 font-medium">Logged Days</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── TIMELINE TAB ──── */}
            {activeTab === "timeline" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Candidate Internship Timeline Trail</h3>
                
                <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {profile.timeline.map((item) => (
                    <div key={item.id} className="flex gap-4 relative">
                      <div className="h-5.5 w-5.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] z-10">✓</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.event}</div>
                        <div className="text-[10px] text-slate-550 mt-0.5">{item.performedBy} · {new Date(item.createdAt).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
