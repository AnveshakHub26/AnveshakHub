"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Building2, Mail, Phone, Globe, MapPin, ExternalLink,
  Users, Briefcase, FileText, MessageSquare, BarChart2, Settings,
  CheckCircle2, Clock, Zap, Award, Download, Eye, Plus,
  Calendar, UserPlus, ArrowUpRight, Send, Loader2, Tag,
  Edit3, Hash, TrendingUp, Star, AlertCircle, Video, Layers,
  Shield, FileCheck, ChevronDown, ChevronUp, Check, X
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface IndustryProfile {
  id: string;
  orgName: string;
  orgType: string;
  email: string;
  phone: string;
  website: string;
  industryDomain: string;
  businessCategory: string;
  description: string;
  state: string;
  city: string;
  pin: string;
  addressLine: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  foundedYear: number;
  employeeCount: string;
  annualTurnover: string;
  verificationStatus: string;
  approvedAt: string;
  lifecycle: string;
  engagementScore: number;
  collaborationScore: number;
  avgResponseTime: number;
  totalProjects: number;
  activeProjects: number;
  expertsAssigned: number;
  studentsAssigned: number;
  totalRevenue: number;
  tags: string[];
  contacts: Contact[];
  projects: Project[];
  vaultDocuments: VaultDoc[];
  communications: Communication[];
  timeline: TimelineItem[];
  analytics: Analytics;
}

interface Contact {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  department: string | null;
  linkedIn: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  experts: string[];
  students: number;
  budget: string;
  timeline: string;
  progress: number;
}

interface VaultDoc {
  id: string;
  name: string;
  docType: string;
  fileUrl: string;
  fileSize: number | null;
  version: number;
  uploadedBy: string;
  createdAt: string;
  expiresAt: string | null;
  description: string | null;
}

interface Communication {
  id: string;
  type: string;
  title: string;
  date: string;
  description: string;
  author: string;
}

interface TimelineItem {
  id: string;
  event: string;
  category: string;
  performedBy: string | null;
  createdAt: string;
}

interface Analytics {
  engagementTrend: number[];
  months: string[];
  projectCompletion: number[];
  meetingCount: number[];
  responseTimeAvg: number[];
}

// ─── Constants ─────────────────────────────────────────────────────

const TABS = [
  { key: "overview",    label: "Overview",      icon: Building2 },
  { key: "contacts",   label: "Contacts",      icon: Users },
  { key: "projects",   label: "Projects",      icon: Briefcase },
  { key: "vault",      label: "Document Vault",icon: FileText },
  { key: "comms",      label: "Communications",icon: MessageSquare },
  { key: "analytics",  label: "Analytics",     icon: BarChart2 },
];

const LIFECYCLE_ORDER = [
  "REGISTERED", "VERIFIED", "MEETING_COMPLETED",
  "OPPORTUNITY_CREATED", "EXPERTS_ASSIGNED",
  "PROJECT_STARTED", "PROJECT_COMPLETED", "LONG_TERM_PARTNER",
];

const LIFECYCLE_LABELS: Record<string, string> = {
  REGISTERED: "Registered", VERIFIED: "Verified", MEETING_COMPLETED: "Meeting Done",
  OPPORTUNITY_CREATED: "Opportunity", EXPERTS_ASSIGNED: "Experts Assigned",
  PROJECT_STARTED: "Project Active", PROJECT_COMPLETED: "Completed", LONG_TERM_PARTNER: "Long-term Partner",
};

const COMM_TYPE_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  EMAIL:    { icon: Mail,      color: "text-blue-600",   bg: "bg-blue-50" },
  MEETING:  { icon: Video,     color: "text-teal-600",   bg: "bg-teal-50" },
  CALL:     { icon: Phone,     color: "text-green-600",  bg: "bg-green-50" },
  CRM_NOTE: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
};

const VAULT_TYPE_COLORS: Record<string, string> = {
  NDA: "bg-red-50 text-red-700", MOU: "bg-blue-50 text-blue-700",
  CONTRACT: "bg-indigo-50 text-indigo-700", INVOICE: "bg-amber-50 text-amber-700",
  REPORT: "bg-green-50 text-green-700", IP_AGREEMENT: "bg-purple-50 text-purple-700",
  PROJECT_DOC: "bg-teal-50 text-teal-700", OTHER: "bg-slate-100 text-slate-600",
};

const ROLE_LABELS: Record<string, string> = {
  PRIMARY: "Primary Contact", SECONDARY: "Secondary", FINANCE: "Finance",
  HR: "Human Resources", TECHNICAL: "Technical", LEGAL: "Legal",
};

// ─── Sub-components ────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function SvgLineChart({ data, months, color, label }: { data: number[]; months: string[]; color: string; label: string }) {
  const max = Math.max(...data, 1);
  const W = 300; const H = 80; const pad = 10;
  const pts = data.map((v, i) => `${pad + (i / (data.length - 1)) * (W - pad * 2)},${H - pad - ((v / max) * (H - pad * 2))}`).join(" ");
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wide">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${pad},${H - pad} ${pts} ${pad + (1) * (W - pad * 2)},${H - pad}`} fill={`url(#g-${label})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={pad + (i / (data.length - 1)) * (W - pad * 2)} cy={H - pad - ((v / max) * (H - pad * 2))} r="3" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {months.map((m) => <span key={m} className="text-[9px] text-slate-400">{m}</span>)}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function IndustryProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);
  const [vaultFilter, setVaultFilter] = useState("");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/industries/${id}`)
      .then((r) => r.json())
      .then((d) => { setProfile(d); setLoading(false); });
  }, [id]);

  const doQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    await new Promise((r) => setTimeout(r, 800));
    setQuickActionLoading(null);
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const lifecycleIdx = LIFECYCLE_ORDER.indexOf(profile.lifecycle);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/industries">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 mt-0.5">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-extrabold text-slate-900">{profile.orgName}</h1>
              <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
              {profile.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">#{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{profile.orgType}</span>
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{profile.industryDomain}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.city}, {profile.state}</span>
              <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                <Globe className="h-3 w-3" />{profile.website}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Engagement", value: `${profile.engagementScore}%`, color: "text-green-600" },
              { label: "Projects", value: profile.totalProjects, color: "text-primary" },
              { label: "Experts", value: profile.expertsAssigned, color: "text-amber-600" },
              { label: "Students", value: profile.studentsAssigned, color: "text-purple-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl px-3 py-2">
                <div className={`text-base font-extrabold ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lifecycle Stepper ── */}
        <div className="mt-4 flex items-center gap-0 overflow-x-auto">
          {LIFECYCLE_ORDER.map((stage, i) => {
            const isCompleted = i < lifecycleIdx;
            const isActive = i === lifecycleIdx;
            return (
              <React.Fragment key={stage}>
                <div className={`flex flex-col items-center min-w-[80px] ${isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-35"}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[8px] font-bold transition-all ${isCompleted ? "bg-green-500 border-green-500 text-white" : isActive ? "bg-primary border-primary text-white" : "bg-white border-slate-300 text-slate-400"}`}>
                    {isCompleted ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={`text-[8px] mt-0.5 font-semibold text-center leading-tight max-w-[72px] ${isActive ? "text-primary" : isCompleted ? "text-green-600" : "text-slate-400"}`}>
                    {LIFECYCLE_LABELS[stage]}
                  </span>
                </div>
                {i < LIFECYCLE_ORDER.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-0.5 min-w-[12px] ${i < lifecycleIdx ? "bg-green-400" : "bg-slate-200"}`} />
                )}
              </React.Fragment>
            );
          })}
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

      {/* ── Main Content + Right Panel ── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">

          {/* ──── OVERVIEW TAB ──── */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Company Info */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Company Overview</h3>
                  <div className="space-y-0">
                    {[
                      ["Organization Type", profile.orgType],
                      ["Industry Domain", profile.industryDomain],
                      ["Business Category", profile.businessCategory],
                      ["Founded Year", profile.foundedYear],
                      ["Employee Count", profile.employeeCount],
                      ["Annual Turnover", profile.annualTurnover],
                      ["GST Number", profile.gstNumber],
                      ["PAN Number", profile.panNumber],
                      ["CIN / LLP Number", profile.cinNumber],
                      ["Registered Address", `${profile.addressLine}, ${profile.city}, ${profile.state} – ${profile.pin}`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2 py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-[10px] text-slate-500 w-36 flex-shrink-0 font-medium">{k}</span>
                        <span className="text-[11px] text-slate-800 font-medium break-all">{v ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                  {profile.description && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">About</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{profile.description}</p>
                    </div>
                  )}
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Engagement Metrics</h3>
                    {[
                      { label: "Engagement Score", value: profile.engagementScore, color: "bg-green-500" },
                      { label: "Collaboration Score", value: profile.collaborationScore, color: "bg-blue-500" },
                    ].map((m) => (
                      <div key={m.label} className="mb-3">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>{m.label}</span><span className="font-bold text-slate-700">{m.value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 0.8, delay: 0.2 }} className={`h-full rounded-full ${m.color}`} />
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className="text-base font-extrabold text-slate-700">{profile.avgResponseTime}h</div>
                        <div className="text-[9px] text-slate-500">Avg Response Time</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className="text-base font-extrabold text-slate-700">{profile.activeProjects}/{profile.totalProjects}</div>
                        <div className="text-[9px] text-slate-500">Active / Total Projects</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline (recent) */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Recent Activity</h3>
                    <div className="space-y-3">
                      {profile.timeline.slice(0, 4).map((item, i) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-[8px] font-bold text-primary">{i + 1}</span>
                            </div>
                            {i < profile.timeline.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                          </div>
                          <div className="pb-2">
                            <p className="text-[11px] font-semibold text-slate-700">{item.event}</p>
                            <p className="text-[10px] text-slate-400">{item.performedBy} · {formatDate(item.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── CONTACTS TAB ──── */}
          {activeTab === "contacts" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {profile.contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-primary">{contact.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">{ROLE_LABELS[contact.role] || contact.role}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{contact.name}</h4>
                  {contact.designation && <p className="text-[10px] text-slate-500 mt-0.5">{contact.designation}</p>}
                  {contact.department && <p className="text-[10px] text-slate-400">{contact.department}</p>}
                  <div className="mt-3 space-y-1.5">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-[11px] text-slate-600 hover:text-primary transition-colors">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />{contact.email}
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-[11px] text-slate-600 hover:text-primary transition-colors">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />{contact.phone}
                      </a>
                    )}
                    {contact.linkedIn && (
                      <a href={`https://${contact.linkedIn}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] text-blue-600 hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />LinkedIn
                      </a>
                    )}
                  </div>
                  <button className="mt-3 w-full h-7 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-medium hover:bg-slate-50 flex items-center justify-center gap-1 transition-colors">
                    <Edit3 className="h-3 w-3" /> Edit Contact
                  </button>
                </div>
              ))}
              {profile.contacts.length < 6 && (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-blue-50/30 transition-all">
                  <Plus className="h-6 w-6 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Add Contact</span>
                </div>
              )}
            </motion.div>
          )}

          {/* ──── PROJECTS TAB ──── */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{proj.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{proj.experts.join(", ")}</span>
                        <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{proj.students} students</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{proj.timeline}</span>
                        <span className="font-semibold text-slate-700">{proj.budget}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${proj.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{proj.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${proj.progress === 100 ? "bg-emerald-500" : proj.progress >= 50 ? "bg-blue-500" : "bg-amber-500"}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{proj.progress}%</span>
                  </div>
                </div>
              ))}
              {profile.projects.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
                  <Briefcase className="h-8 w-8 mx-auto mb-2" /><p className="text-sm">No projects linked yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ──── DOCUMENT VAULT TAB ──── */}
          {activeTab === "vault" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {["", "NDA", "MOU", "CONTRACT", "INVOICE", "REPORT", "IP_AGREEMENT"].map((type) => (
                    <button key={type} onClick={() => setVaultFilter(type)} className={`h-7 px-3 rounded-lg text-[10px] font-semibold transition-colors ${vaultFilter === type ? "bg-primary text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      {type || "All"}
                    </button>
                  ))}
                </div>
                <button className="ml-auto h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Upload Document
                </button>
              </div>
              <div className="space-y-2">
                {profile.vaultDocuments.filter((d) => !vaultFilter || d.docType === vaultFilter).map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-800">{doc.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${VAULT_TYPE_COLORS[doc.docType] || "bg-slate-100 text-slate-600"}`}>{doc.docType.replace("_", " ")}</span>
                          <span className="text-[10px] text-slate-400">v{doc.version}</span>
                          {doc.fileSize && <span className="text-[10px] text-slate-400">{formatFileSize(doc.fileSize)}</span>}
                        </div>
                        {doc.description && <p className="text-[10px] text-slate-500 mt-0.5">{doc.description}</p>}
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-slate-400">
                          <span>Uploaded by {doc.uploadedBy} · {formatDate(doc.createdAt)}</span>
                          {doc.expiresAt && <span className={`font-medium ${new Date(doc.expiresAt) < new Date() ? "text-red-500" : "text-amber-600"}`}>Expires {formatDate(doc.expiresAt)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                          {expandedDoc === doc.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                          <button className="h-7 px-2.5 flex items-center gap-1 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-medium hover:bg-slate-50"><Eye className="h-3 w-3" /> Preview</button>
                        </a>
                        <a href={doc.fileUrl} download>
                          <button className="h-7 px-2.5 flex items-center gap-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700"><Download className="h-3 w-3" /> Download</button>
                        </a>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedDoc === doc.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                            <p className="text-[10px] text-slate-500 pt-3">Version History: This is v{doc.version} — previous versions would be listed here in production (stored in MinIO with version metadata).</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── COMMUNICATIONS TAB ──── */}
          {activeTab === "comms" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {profile.communications.map((comm, i) => {
                const style = COMM_TYPE_STYLES[comm.type] || COMM_TYPE_STYLES.EMAIL;
                const Icon = style.icon;
                return (
                  <div key={comm.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      <Icon className={`h-4 w-4 ${style.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800">{comm.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${style.bg} ${style.color}`}>{comm.type.replace("_", " ")}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{comm.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{comm.author} · {formatDate(comm.date)}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ──── ANALYTICS TAB ──── */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <SvgLineChart data={profile.analytics.engagementTrend} months={profile.analytics.months} color="#2563eb" label="Engagement Score Trend" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <SvgLineChart data={profile.analytics.meetingCount} months={profile.analytics.months} color="#22c55e" label="Meetings Per Month" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <SvgLineChart data={profile.analytics.projectCompletion} months={profile.analytics.months} color="#f59e0b" label="Project Completion %" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <SvgLineChart data={profile.analytics.responseTimeAvg} months={profile.analytics.months} color="#8b5cf6" label="Avg Response Time (hrs)" />
              </div>
              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">Collaboration Score by Month</p>
                <div className="flex items-end gap-2 h-24">
                  {profile.analytics.engagementTrend.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(v / 100) * 80}px` }} transition={{ duration: 0.6, delay: i * 0.08 }} className="w-full bg-primary/80 rounded-t-md" style={{ minHeight: "4px" }} />
                      <span className="text-[9px] text-slate-400">{profile.analytics.months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Right Quick Actions Panel ── */}
        <aside className="w-56 border-l border-slate-200 bg-white flex-shrink-0 overflow-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-2">
            {[
              { key: "meeting", icon: Calendar, label: "Create Meeting", color: "border-blue-200 text-blue-700 hover:bg-blue-50" },
              { key: "expert", icon: UserPlus, label: "Assign Expert", color: "border-amber-200 text-amber-700 hover:bg-amber-50" },
              { key: "opportunity", icon: Zap, label: "Create Opportunity", color: "border-purple-200 text-purple-700 hover:bg-purple-50" },
              { key: "crm", icon: ArrowUpRight, label: "View in CRM", color: "border-slate-200 text-slate-700 hover:bg-slate-50" },
              { key: "report", icon: BarChart2, label: "Generate Report", color: "border-green-200 text-green-700 hover:bg-green-50" },
              { key: "notify", icon: Send, label: "Send Notification", color: "border-indigo-200 text-indigo-700 hover:bg-indigo-50" },
              { key: "download", icon: Download, label: "Download Profile", color: "border-slate-200 text-slate-700 hover:bg-slate-50" },
            ].map(({ key, icon: Icon, label, color }) => (
              <button key={key} onClick={() => doQuickAction(key)} disabled={quickActionLoading === key} className={`w-full h-8 flex items-center gap-2 px-3 border rounded-lg text-[11px] font-semibold transition-colors ${color} disabled:opacity-50`}>
                {quickActionLoading === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 mt-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">Lifecycle Stage</p>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-primary mb-2">{LIFECYCLE_LABELS[profile.lifecycle]}</div>
              <p className="text-[9px] text-slate-500">Stage {lifecycleIdx + 1} of {LIFECYCLE_ORDER.length}</p>
              <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${((lifecycleIdx + 1) / LIFECYCLE_ORDER.length) * 100}%` }} />
              </div>
            </div>
            {lifecycleIdx < LIFECYCLE_ORDER.length - 1 && (
              <button onClick={() => doQuickAction("advance_lifecycle")} className="mt-2 w-full h-7 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                {quickActionLoading === "advance_lifecycle" ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpRight className="h-3 w-3" />} Advance Stage
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
