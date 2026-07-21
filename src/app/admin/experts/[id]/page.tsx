"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Award, Star, Mail, Phone, ExternalLink, Globe,
  ShieldCheck, FileText, CheckCircle2, XCircle, Clock, AlertTriangle,
  MessageSquare, Calendar, User, Building2, MapPin, Hash, Plus,
  Download, Eye, RefreshCw, Send, Loader2, Play, HardHat, Check, X
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface ExpertProfile {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  designation: string;
  institution: string;
  department: string | null;
  yearsOfExp: number;
  bio: string | null;
  rating: number;
  availability: "AVAILABLE" | "BUSY" | "ON_LEAVE";
  avgResponseTime: number;
  linkedinUrl: string | null;
  googleScholar: string | null;
  orcid: string | null;
  skills: string[];
  domains: string[];
  certifications: Array<{ name: string; issuer: string; year: number }>;
  employmentHistory: Array<{ role: string; org: string; period: string }>;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  projects: Array<{ id: string; name: string; status: string; budget: string; timeline: string; progress: number }>;
  students: Array<{ id: string; name: string; degree: string; branch: string; cgpa: number; status: string }>;
  documents: Array<{ id: string; name: string; docType: string; fileUrl: string; status: string; reviewerComment: string | null; createdAt: string }>;
  resourceRequests: Array<{ id: string; title: string; description: string | null; quantity: number; status: string; createdAt: string }>;
  meetings: Array<{ id: string; title: string; platform: string; startTime: string; endTime: string; participants: string[]; videoLink: string | null; agenda: string | null; outcomes: string | null; status: string }>;
  timeline: Array<{ id: string; event: string; category: string; performedBy: string | null; createdAt: string }>;
  analytics: {

    months: string[];
    scoreTrend: number[];
    responseTime: number[];
    meetingHours: number[];
    deliverablesCompleted: number[];
  };
}

// ─── Constants ─────────────────────────────────────────────────────

const TABS = [
  { key: "overview",  label: "Overview",       icon: User },
  { key: "skills",    label: "Skills Matrix",  icon: Award },
  { key: "documents", label: "NDA & NOC Vault",icon: FileText },
  { key: "calendar",  label: "Availability",   icon: Calendar },
  { key: "resources", label: "Resource Req",   icon: HardHat },
  { key: "timeline",  label: "Audit Trail",    icon: ShieldCheck },
];

const AVAILABILITY_LABELS = { AVAILABLE: "Available", BUSY: "Busy", ON_LEAVE: "On Leave" };

function SvgSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const W = 150; const H = 35;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v / max) * H)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-28 h-8">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function ExpertProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Action Loading states
  const [actionLoading, setActionLoading] = useState(false);
  const [docActionId, setDocActionId] = useState<string | null>(null);
  const [reqActionId, setReqActionId] = useState<string | null>(null);

  // Review comment input state
  const [docReviewComment, setDocReviewComment] = useState<Record<string, string>>({});

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/experts/${id}`);
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
      await fetch(`/api/admin/experts/${id}`, {
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

  const handleDocAction = async (docId: string, docStatus: string) => {
    setDocActionId(docId);
    try {
      await fetch(`/api/admin/experts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_DOCUMENT",
          documentId: docId,
          docStatus,
          reviewerComment: docReviewComment[docId] || null
        }),
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setDocActionId(null);
    }
  };

  const handleResourceAction = async (reqId: string, requestStatus: string) => {
    setReqActionId(reqId);
    try {
      await fetch(`/api/admin/experts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_RESOURCE",
          requestId: reqId,
          requestStatus
        }),
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setReqActionId(null);
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
          <Link href="/admin/experts">
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
                {AVAILABILITY_LABELS[profile.availability]}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{profile.designation} · {profile.institution}</p>
          </div>

          <div className="flex items-center gap-2">
            {profile.status === "PENDING" && (
              <>
                <button onClick={() => handleStatusChange("ACTIVE")} disabled={actionLoading} className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                  {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Approve Expert
                </button>
                <button onClick={() => handleStatusChange("SUSPENDED")} disabled={actionLoading} className="h-8 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-all">
                  Reject
                </button>
              </>
            )}
            {profile.status === "ACTIVE" && (
              <button onClick={() => handleStatusChange("SUSPENDED")} disabled={actionLoading} className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all">
                Suspend Profile
              </button>
            )}
            {profile.status === "SUSPENDED" && (
              <button onClick={() => handleStatusChange("ACTIVE")} disabled={actionLoading} className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all">
                Re-Activate
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
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Expert Bio</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{profile.bio || "No professional bio provided."}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Years Exp</div>
                        <div className="text-base font-extrabold text-slate-800 mt-0.5">{profile.yearsOfExp} years</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Google Scholar</div>
                        <div className="text-xs font-bold text-primary mt-1 truncate">
                          {profile.googleScholar ? <a href={`https://${profile.googleScholar}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1"><Globe className="h-3 w-3" /> Link</a> : "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">ORCID Registry</div>
                        <div className="text-xs font-bold text-slate-700 mt-1 truncate">
                          {profile.orcid ? <span className="hover:underline cursor-pointer">{profile.orcid}</span> : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active allocations */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Project Leadership ({profile.projects.length})</h3>
                    <div className="space-y-3">
                      {profile.projects.map((proj) => (
                        <div key={proj.id} className="border border-slate-100 rounded-xl p-3 flex flex-col gap-2 hover:bg-slate-50/30 transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{proj.name}</h4>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{proj.timeline} · Budget: {proj.budget}</div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold">{proj.status}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${proj.progress}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">{proj.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Supervision */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Student Interns ({profile.students.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.students.map((student) => (
                        <div key={student.id} className="border border-slate-150 rounded-xl p-3 flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{student.name}</h4>
                            <div className="text-[9px] text-slate-400 font-medium">{student.degree} in {student.branch} · CGPA {student.cgpa}</div>
                          </div>
                          <span className="text-[8px] px-1 py-0.5 bg-blue-50 text-primary font-bold rounded">{student.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side Overview Column */}
                <div className="space-y-4">
                  {/* Contact Info Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Employment Details</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Primary Affiliation</div>
                        <div className="text-xs font-semibold text-slate-800 mt-0.5">{profile.institution}</div>
                        {profile.department && <div className="text-[10px] text-slate-500 font-medium">{profile.department}</div>}
                      </div>
                      
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Work History</div>
                        <div className="space-y-1.5 mt-1.5">
                          {profile.employmentHistory.map((history, idx) => (
                            <div key={idx} className="text-[10px]">
                              <span className="font-semibold text-slate-700">{history.role}</span> at <span className="text-slate-600">{history.org}</span> ({history.period})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry charts */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Advisor Analytics</h3>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Engagement Trend</div>
                        <div className="text-base font-extrabold text-slate-800 mt-0.5">98%</div>
                      </div>
                      <SvgSparkline data={profile.analytics.scoreTrend} color="#2563eb" />
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Avg Response Time</div>
                        <div className="text-base font-extrabold text-slate-800 mt-0.5">{profile.avgResponseTime} hrs</div>
                      </div>
                      <SvgSparkline data={profile.analytics.responseTime} color="#16a34a" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Meetings / Mo</div>
                        <div className="text-base font-extrabold text-slate-800 mt-0.5">18 hrs</div>
                      </div>
                      <SvgSparkline data={profile.analytics.meetingHours} color="#eab308" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── SKILLS TAB ──── */}
            {activeTab === "skills" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skill Matrix */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Key Domain Expertise</h3>
                  <div className="space-y-4">
                    {profile.domains.map((domain, idx) => (
                      <div key={domain} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                          <span>{domain}</span>
                          <span>{(98 - idx * 5)}% Competency</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(98 - idx * 5)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific tools/skills & Certs */}
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Skills & Toolsets</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-primary">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Certifications</h3>
                    <div className="space-y-3">
                      {profile.certifications.map((cert) => (
                        <div key={cert.name} className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">★</div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{cert.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{cert.issuer} · Issued {cert.year}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── DOCUMENTS TAB ──── */}
            {activeTab === "documents" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Credentials & legal Agreements</h3>
                  <div className="divide-y divide-slate-100">
                    {profile.documents.map((doc) => (
                      <div key={doc.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{doc.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">{doc.docType}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${doc.status === "APPROVED" ? "bg-green-50 text-green-700" : "bg-blue-50 text-primary"}`}>{doc.status}</span>
                          </div>
                          {doc.reviewerComment && <p className="text-[10px] text-slate-500 italic mt-1">"{doc.reviewerComment}"</p>}
                          <p className="text-[9px] text-slate-400 mt-0.5">Uploaded on {new Date(doc.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            value={docReviewComment[doc.id] || ""}
                            onChange={(e) => setDocReviewComment({ ...docReviewComment, [doc.id]: e.target.value })}
                            placeholder="Add audit note…"
                            className="h-7 text-[10px] border border-slate-200 rounded-lg px-2 max-w-[150px] bg-white focus:outline-none"
                          />
                          <button onClick={() => handleDocAction(doc.id, "APPROVED")} disabled={docActionId === doc.id} className="h-7 px-3 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 flex items-center gap-1 transition-colors">
                            {docActionId === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Approve
                          </button>
                          <button onClick={() => handleDocAction(doc.id, "REJECTED")} disabled={docActionId === doc.id} className="h-7 px-2.5 border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-50 transition-colors">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── CALENDAR TAB ──── */}
            {activeTab === "calendar" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Layout */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Advisor Availability Calendar</h3>
                  
                  <div className="grid grid-cols-7 gap-1 border border-slate-100 rounded-xl p-2 text-center text-[10px] font-bold uppercase text-slate-500 bg-slate-50/50 mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div key={day} className="py-1">{day}</div>)}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1.5 h-64">
                    {Array.from({ length: 28 }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const hasMeeting = dayNum === 15 || dayNum === 22 || dayNum === 25;
                      return (
                        <div key={idx} className={`border border-slate-100 rounded-xl p-1.5 flex flex-col justify-between hover:border-primary/45 transition-colors cursor-pointer ${hasMeeting ? "bg-blue-50/30 border-blue-200" : "bg-white"}`}>
                          <span className="text-[10px] font-bold text-slate-500 text-left">{dayNum}</span>
                          {hasMeeting && <span className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mb-1" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Meetings List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Meetings History</h3>
                  <div className="space-y-3">
                    {profile.meetings.map((meeting) => (
                      <div key={meeting.id} className="border border-slate-100 rounded-xl p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800">{meeting.title}</h4>
                          <span className="text-[8px] px-1 py-0.5 bg-blue-100 text-primary font-bold rounded">{meeting.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(meeting.startTime).toLocaleString("en-IN")}</p>
                        {meeting.videoLink && (
                          <a href={meeting.videoLink} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-1 mt-2">
                            <Play className="h-3 w-3" /> Join Meet Session
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── RESOURCES TAB ──── */}
            {activeTab === "resources" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><HardHat className="h-4 w-4 text-primary" /> Resource Requirement Requests</h3>
                  <div className="divide-y divide-slate-100">
                    {profile.resourceRequests.map((req) => (
                      <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-800">{req.title}</span>
                            <span className="text-[10px] text-slate-450 font-bold">Qty: {req.quantity}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${req.status === "APPROVED" ? "bg-green-50 text-green-700" : req.status === "REJECTED" ? "bg-red-50 text-red-650" : "bg-blue-50 text-primary"}`}>{req.status}</span>
                          </div>
                          {req.description && <p className="text-[10px] text-slate-500 mt-1">"{req.description}"</p>}
                          <p className="text-[9px] text-slate-450 mt-0.5">Requested on {new Date(req.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>

                        {req.status === "PENDING" && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => handleResourceAction(req.id, "APPROVED")} disabled={reqActionId === req.id} className="h-7 px-3 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 flex items-center gap-1 transition-colors">
                              {reqActionId === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Approve
                            </button>
                            <button onClick={() => handleResourceAction(req.id, "REJECTED")} disabled={reqActionId === req.id} className="h-7 px-2.5 border border-red-200 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-50 transition-colors">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ──── TIMELINE TAB ──── */}
            {activeTab === "timeline" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Compliance Activity Audit Trail</h3>
                
                <div className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {profile.timeline.map((item) => (
                    <div key={item.id} className="flex gap-4 relative">
                      <div className="h-5.5 w-5.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] z-10">✓</div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.event}</div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.performedBy} · {new Date(item.createdAt).toLocaleString("en-IN")}</div>
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
