"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, ShieldCheck, ShieldAlert, FileText, CheckCircle2,
  XCircle, Clock, AlertTriangle, MessageSquare, Calendar, User,
  Building2, Mail, Phone, Globe, MapPin, Hash, Download, Eye,
  RefreshCcw, ChevronDown, ChevronUp, ArrowUpRight, Loader2,
  Flag, Scale, UserCheck, AlertCircle, Check, X, Send,
  ClipboardList, Video, MoreHorizontal, Maximize2, Shield
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface VerificationDetail {
  id: string;
  type: string;
  stage: string;
  priority: string;
  riskScore: number;
  fraudFlag: boolean;
  duplicateFlag: boolean;
  complianceStatus: boolean;
  assignedOfficer: { id: string; name: string; email: string } | null;
  submittedAt: string;
  reviewedAt: string | null;
  organization: Record<string, string | number | boolean | null>;
  documents: DocItem[];
  reviewNotes: ReviewNote[];
  actions: ActionItem[];
  meetings: MeetingItem[];
  crmNotes: CrmNote[];
  previousApplications: object[];
}

interface DocItem {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  status: string;
  reviewerComment: string | null;
  reviewedAt: string | null;
}

interface ReviewNote {
  id: string;
  author: string;
  content: string;
  recommendation: string | null;
  isInternal: boolean;
  createdAt: string;
}

interface ActionItem {
  id: string;
  admin: string;
  action: string;
  fromStage: string | null;
  toStage: string | null;
  notes: string | null;
  createdAt: string;
  ipAddress: string;
}

interface MeetingItem {
  id: string;
  title: string;
  platform: string;
  startTime: string;
  endTime: string;
  participants: string[];
  videoLink: string | null;
  agenda: string | null;
  outcomes: string | null;
  status: string;
}

interface CrmNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// ─── Constants ─────────────────────────────────────────────────────

const WORKFLOW_STAGES = [
  { key: "SUBMITTED",             label: "Submitted",           icon: ClipboardList },
  { key: "INITIAL_REVIEW",        label: "Initial Review",      icon: Eye },
  { key: "DOCUMENT_VERIFICATION", label: "Document Check",      icon: FileText },
  { key: "BUSINESS_VALIDATION",   label: "Business Validation", icon: Building2 },
  { key: "MEETING_SCHEDULED",     label: "Meeting",             icon: Calendar },
  { key: "COMPLIANCE_REVIEW",     label: "Compliance",          icon: Scale },
  { key: "APPROVAL_COMMITTEE",    label: "Committee",           icon: UserCheck },
  { key: "APPROVED",              label: "Approved",            icon: CheckCircle2 },
];

const DOC_STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:           { color: "text-slate-600",  bg: "bg-slate-100",  label: "Pending" },
  APPROVED:          { color: "text-green-700",  bg: "bg-green-100",  label: "Approved" },
  REJECTED:          { color: "text-red-700",    bg: "bg-red-100",    label: "Rejected" },
  REUPLOAD_REQUESTED:{ color: "text-amber-700",  bg: "bg-amber-100",  label: "Re-upload" },
};

const RECOMMENDATIONS = ["APPROVE", "REJECT", "HOLD", "ESCALATE", "REQUEST_MORE_INFO"];
const MEETING_PLATFORMS = ["GOOGLE_MEET", "MICROSOFT_TEAMS", "ZOOM", "PHYSICAL"];

// ─── Sub-components ────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-2 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-[10px] text-slate-500 w-32 flex-shrink-0 font-medium">{label}</span>
      <span className="text-[11px] text-slate-800 font-medium break-all">{String(value)}</span>
    </div>
  );
}

function DocStatusBadge({ status }: { status: string }) {
  const s = DOC_STATUS_STYLES[status] || DOC_STATUS_STYLES.PENDING;
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.color}`}>{s.label}</span>;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function VerificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // UI state
  const [newNote, setNewNote] = useState("");
  const [recommendation, setRecommendation] = useState("APPROVE");
  const [noteLoading, setNoteLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComments, setRejectComments] = useState("");
  const [rejectDeadline, setRejectDeadline] = useState("");
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingPlatform, setMeetingPlatform] = useState("GOOGLE_MEET");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");

  // Doc action state
  const [docComments, setDocComments] = useState<Record<string, string>>({});
  const [docLoading, setDocLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/verification-center/${id}`)
      .then((r) => r.json())
      .then((d) => { setDetail(d); setLoading(false); });
  }, [id]);

  const doAction = async (action: string, extra?: object) => {
    setActionLoading(true);
    await fetch(`/api/admin/verification-center/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const res = await fetch(`/api/admin/verification-center/${id}`);
    setDetail(await res.json());
    setActionLoading(false);
    setShowRejectForm(false);
  };

  const doDocAction = async (docId: string, action: string) => {
    setDocLoading(docId);
    await fetch(`/api/admin/verification-center/${id}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId, action, reviewerComment: docComments[docId] || null }),
    });
    setDocLoading(null);
    const res = await fetch(`/api/admin/verification-center/${id}`);
    setDetail(await res.json());
  };

  const submitNote = async () => {
    if (!newNote.trim()) return;
    setNoteLoading(true);
    await fetch(`/api/admin/verification-center/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ADD_NOTE", notes: newNote, recommendation }),
    });
    setNewNote("");
    setNoteLoading(false);
    const res = await fetch(`/api/admin/verification-center/${id}`);
    setDetail(await res.json());
  };

  if (loading || !detail) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const org = detail.organization;
  const currentStageIdx = WORKFLOW_STAGES.findIndex(s => s.key === detail.stage);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/admin/verification-center">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{String(org.orgName)}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{detail.type}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${detail.priority === "HIGH" || detail.priority === "URGENT" || detail.priority === "CRITICAL" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>{detail.priority}</span>
              {detail.fraudFlag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold flex items-center gap-1"><Flag className="h-3 w-3" />FRAUD FLAG</span>}
              {detail.duplicateFlag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">DUPLICATE</span>}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">ID: {detail.id} · Submitted {formatDateTime(detail.submittedAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            {detail.stage !== "APPROVED" && detail.stage !== "REJECTED" && (
              <>
                <button onClick={() => doAction("HOLD", { toStage: "ON_HOLD" })} disabled={actionLoading} className="h-8 px-3 border border-amber-300 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-50 transition-colors flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Hold
                </button>
                <button onClick={() => doAction("ESCALATE")} disabled={actionLoading} className="h-8 px-3 border border-orange-300 text-orange-700 rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Escalate
                </button>
                <button onClick={() => setShowRejectForm(!showRejectForm)} className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
                <button onClick={() => doAction("APPROVE", { toStage: "APPROVED" })} disabled={actionLoading} className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Workflow Stepper ── */}
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {WORKFLOW_STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isCompleted = i < currentStageIdx;
            const isActive = i === currentStageIdx;
            const isRejected = detail.stage === "REJECTED";
            return (
              <React.Fragment key={stage.key}>
                <div className={`flex flex-col items-center min-w-[80px] ${isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40"}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? "bg-green-500 border-green-500" : isActive ? (isRejected ? "bg-red-500 border-red-500" : "bg-primary border-primary") : "bg-white border-slate-300"}`}>
                    {isCompleted ? <Check className="h-3.5 w-3.5 text-white" /> : <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />}
                  </div>
                  <span className={`text-[9px] mt-1 font-semibold text-center leading-tight max-w-[70px] ${isActive ? (isRejected ? "text-red-600" : "text-primary") : isCompleted ? "text-green-600" : "text-slate-400"}`}>
                    {stage.label}
                  </span>
                </div>
                {i < WORKFLOW_STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 min-w-[16px] transition-colors ${i < currentStageIdx ? "bg-green-400" : "bg-slate-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Rejection Form ── */}
      <AnimatePresence>
        {showRejectForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-red-50 border-b border-red-200">
            <div className="px-8 py-4">
              <h4 className="text-sm font-bold text-red-800 mb-3">Rejection Details</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-red-700 uppercase mb-1 block">Rejection Reason *</label>
                  <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g., Incomplete documentation" className="w-full h-8 px-3 text-xs border border-red-300 rounded-lg focus:outline-none focus:border-red-500 bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-red-700 uppercase mb-1 block">Required Corrections</label>
                  <input value={rejectComments} onChange={(e) => setRejectComments(e.target.value)} placeholder="What needs to be fixed" className="w-full h-8 px-3 text-xs border border-red-300 rounded-lg focus:outline-none focus:border-red-500 bg-white" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-red-700 uppercase mb-1 block">Resubmission Deadline</label>
                  <input type="date" value={rejectDeadline} onChange={(e) => setRejectDeadline(e.target.value)} className="w-full h-8 px-3 text-xs border border-red-300 rounded-lg focus:outline-none focus:border-red-500 bg-white" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => doAction("REJECT", { toStage: "REJECTED", rejectionReason: rejectReason, rejectionComments: rejectComments, resubmissionDeadline: rejectDeadline })} disabled={!rejectReason || actionLoading} className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1">
                  {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Confirm Rejection
                </button>
                <button onClick={() => setShowRejectForm(false)} className="h-8 px-3 border border-red-300 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Main Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">

          {/* Organization Info */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800">Organization Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-0">
              <div>
                <InfoRow label="Organization Name" value={org.orgName} />
                <InfoRow label="Organization Type" value={org.orgType} />
                <InfoRow label="Industry Domain" value={org.industryDomain} />
                <InfoRow label="Business Category" value={org.businessCategory} />
                <InfoRow label="Founded Year" value={org.foundedYear} />
                <InfoRow label="Employee Count" value={org.employeeCount} />
                <InfoRow label="Annual Turnover" value={org.annualTurnover} />
              </div>
              <div>
                <InfoRow label="Email" value={org.email} />
                <InfoRow label="Phone" value={org.phone} />
                <InfoRow label="Website" value={org.website} />
                <InfoRow label="GST Number" value={org.gstNumber} />
                <InfoRow label="PAN Number" value={org.panNumber} />
                <InfoRow label="CIN Number" value={org.cinNumber} />
                <InfoRow label="Address" value={org.addressLine ? `${org.addressLine}, ${org.city}, ${org.state} – ${org.pin}` : null} />
              </div>
            </div>
            {org.description && (
              <div className="px-5 pb-4">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">About</p>
                <p className="text-xs text-slate-600 leading-relaxed">{String(org.description)}</p>
              </div>
            )}
          </div>

          {/* Document Verification */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-800">Document Verification</h3>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">{detail.documents.length} docs</span>
              </div>
              <span className="text-[10px] text-slate-500">{detail.documents.filter(d => d.status === "APPROVED").length}/{detail.documents.length} approved</span>
            </div>
            <div className="divide-y divide-slate-50">
              {detail.documents.map((doc) => (
                <div key={doc.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-800">{doc.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">{doc.category}</span>
                        <DocStatusBadge status={doc.status} />
                        {doc.fileSize && <span className="text-[10px] text-slate-400">{formatFileSize(doc.fileSize)}</span>}
                      </div>
                      {doc.reviewerComment && (
                        <p className="text-[10px] text-slate-500 mt-1 italic">"{doc.reviewerComment}"</p>
                      )}
                      {doc.reviewedAt && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Reviewed: {formatDateTime(doc.reviewedAt)}</p>
                      )}

                      {/* Reviewer Comment Input */}
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          value={docComments[doc.id] || ""}
                          onChange={(e) => setDocComments({ ...docComments, [doc.id]: e.target.value })}
                          placeholder="Add reviewer comment…"
                          className="flex-1 h-7 px-2.5 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:border-primary bg-white max-w-sm"
                        />
                        <button onClick={() => doDocAction(doc.id, "APPROVE")} disabled={!!docLoading} className="h-7 px-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1">
                          {docLoading === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Approve
                        </button>
                        <button onClick={() => doDocAction(doc.id, "REJECT")} disabled={!!docLoading} className="h-7 px-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1">
                          <X className="h-3 w-3" /> Reject
                        </button>
                        <button onClick={() => doDocAction(doc.id, "REQUEST_REUPLOAD")} disabled={!!docLoading} className="h-7 px-2.5 border border-amber-400 text-amber-700 hover:bg-amber-50 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1">
                          <RefreshCcw className="h-3 w-3" /> Re-upload
                        </button>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                          <button className="h-7 px-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </a>
                        <a href={doc.fileUrl} download>
                          <button className="h-7 px-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Scheduling */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-800">Verification Meetings</h3>
              </div>
              <button onClick={() => setShowMeetingForm(!showMeetingForm)} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors">
                + Schedule Meeting
              </button>
            </div>

            <AnimatePresence>
              {showMeetingForm && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 uppercase mb-1 block">Platform</label>
                        <select value={meetingPlatform} onChange={(e) => setMeetingPlatform(e.target.value)} className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                          {MEETING_PLATFORMS.map((p) => <option key={p} value={p}>{p.replace("_", " ")}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 uppercase mb-1 block">Date</label>
                        <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 uppercase mb-1 block">Time</label>
                        <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 uppercase mb-1 block">Agenda</label>
                        <input value={meetingAgenda} onChange={(e) => setMeetingAgenda(e.target.value)} placeholder="Meeting agenda…" className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { doAction("SCHEDULE_MEETING", { toStage: "MEETING_SCHEDULED", platform: meetingPlatform, date: meetingDate, time: meetingTime, agenda: meetingAgenda }); setShowMeetingForm(false); }} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors">Schedule & Advance</button>
                      <button onClick={() => setShowMeetingForm(false)} className="h-7 px-3 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-medium hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="divide-y divide-slate-50">
              {detail.meetings.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">No meetings scheduled yet</div>
              )}
              {detail.meetings.map((mtg) => (
                <div key={mtg.id} className="p-4 flex items-start gap-3">
                  <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">{mtg.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">{mtg.platform.replace("_", " ")}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${mtg.status === "UPCOMING" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>{mtg.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDateTime(mtg.startTime)}</p>
                    {mtg.agenda && <p className="text-[10px] text-slate-600 mt-1">Agenda: {mtg.agenda}</p>}
                    {mtg.videoLink && <a href={mtg.videoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold mt-1 hover:underline"><ArrowUpRight className="h-3 w-3" /> Join Meeting</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800">CRM Notes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {detail.crmNotes.map((note) => (
                <div key={note.id} className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-700">{note.author}</span>
                    <span className="text-[10px] text-slate-400">{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Action Panel */}
        <aside className="w-72 border-l border-slate-200 bg-white flex-shrink-0 overflow-auto">
          <div className="p-5 space-y-5">

            {/* Risk Score */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Risk Assessment</p>
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
                      stroke={detail.riskScore <= 25 ? "#22c55e" : detail.riskScore <= 50 ? "#f59e0b" : "#ef4444"}
                      strokeDasharray={`${detail.riskScore} 100`} strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-slate-800">{detail.riskScore}</span>
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-bold ${detail.riskScore <= 25 ? "text-green-600" : detail.riskScore <= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {detail.riskScore <= 25 ? "Low Risk" : detail.riskScore <= 50 ? "Medium Risk" : "High Risk"}
                  </p>
                  <p className="text-[10px] text-slate-500">Score out of 100</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  { label: "Fraud Indicators", value: detail.fraudFlag, bad: true },
                  { label: "Duplicate Detected", value: detail.duplicateFlag, bad: true },
                  { label: "Compliance Cleared", value: detail.complianceStatus, bad: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-[10px] text-slate-600">{item.label}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-semibold ${item.value ? (item.bad ? "text-red-600" : "text-green-600") : (item.bad ? "text-green-600" : "text-red-500")}`}>
                      {item.value ? (item.bad ? <><AlertTriangle className="h-3 w-3" />Yes</> : <><Check className="h-3 w-3" />Yes</>) : (item.bad ? <><CheckCircle2 className="h-3 w-3" />No</> : <><X className="h-3 w-3" />No</>)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Officer */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Assigned Officer</p>
              {detail.assignedOfficer ? (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {detail.assignedOfficer.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{detail.assignedOfficer.name}</p>
                    <p className="text-[10px] text-slate-500">{detail.assignedOfficer.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Unassigned</p>
              )}
            </div>

            {/* Add Review Note */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Reviewer Notes</p>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal review note…"
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex items-center gap-2 mt-2">
                <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="flex-1 h-7 text-[10px] border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  {RECOMMENDATIONS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
                <button onClick={submitNote} disabled={!newNote.trim() || noteLoading} className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1">
                  {noteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Post
                </button>
              </div>
            </div>

            {/* Existing Notes */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              {detail.reviewNotes.map((note) => (
                <div key={note.id} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-700">{note.author}</span>
                    {note.recommendation && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${note.recommendation === "APPROVE" ? "bg-green-100 text-green-700" : note.recommendation === "REJECT" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {note.recommendation.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{note.content}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{formatDateTime(note.createdAt)}</p>
                </div>
              ))}
            </div>

            {/* Audit Trail */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Audit Trail</p>
              <div className="space-y-3">
                {detail.actions.map((act, i) => (
                  <div key={act.id} className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-3 w-3 text-slate-500" />
                      </div>
                      {i < detail.actions.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-[10px] font-semibold text-slate-700">{act.action.replace(/_/g, " ")}</p>
                      <p className="text-[9px] text-slate-500">{act.admin} · {formatDateTime(act.createdAt)}</p>
                      {act.notes && <p className="text-[10px] text-slate-500 mt-0.5 italic">{act.notes}</p>}
                      {act.fromStage && act.toStage && (
                        <p className="text-[9px] text-slate-400 mt-0.5">{act.fromStage} → {act.toStage}</p>
                      )}
                      <p className="text-[9px] text-slate-400">{act.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
