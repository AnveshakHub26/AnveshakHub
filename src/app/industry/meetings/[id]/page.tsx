"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Video, CheckSquare, Square, FileText,
  Loader2, Users, Plus, Clock, Upload, Save, X, CheckCircle2, Link2
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Participant {
  name: string;
  role: string;
  status: string;
}

interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  isCompleted: boolean;
  priority: string;
}

interface Document {
  id: string;
  name: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

interface TimelineEvent {
  id: string;
  event: string;
  performedBy: string;
  createdAt: string;
}

interface MeetingDetail {
  id: string;
  title: string;
  agenda: string;
  momNotes: string | null;
  participants: Participant[];
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string | null;
  recordingUrl: string | null;
  status: string;
  isRecurring: boolean;
  recurrenceRule: string | null;
  projectId: string | null;
  projectName: string | null;
  actionItems: ActionItem[];
  documents: Document[];
  timeline: TimelineEvent[];
}

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-[#FEE2E2] text-[#C0392B] border-[#FECACA]",
  HIGH:     "bg-[#FFF4ED] text-[#C2410C] border-orange-200",
  MEDIUM:   "bg-[#FEF3C7] text-[#B45309] border-amber-200",
  LOW:      "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2]"
};

const PARTICIPANT_STATUS: Record<string, { dot: string; label: string }> = {
  ACCEPTED: { dot: "bg-[#E8F2EC]0", label: "Accepted" },
  PENDING:  { dot: "bg-[#FEF3C7]0", label: "Pending" },
  DECLINED: { dot: "bg-[#FEE2E2]0",   label: "Declined" }
};

export default function MeetingWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [momDraft, setMomDraft] = useState("");
  const [momSaving, setMomSaving] = useState(false);

  const [newAiTitle, setNewAiTitle] = useState("");
  const [newAiAssignee, setNewAiAssignee] = useState("");
  const [newAiDue, setNewAiDue] = useState("");
  const [newAiPriority, setNewAiPriority] = useState("MEDIUM");
  const [aiSaving, setAiSaving] = useState(false);

  const [newDocName, setNewDocName] = useState("");
  const [docUploading, setDocUploading] = useState(false);

  const fetchMeeting = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industry/meetings/${id}`);
      const data = await res.json();
      setMeeting(data);
      setMomDraft(data.momNotes || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  const handleSaveMom = async () => {
    if (!meeting) return;
    setMomSaving(true);
    try {
      await fetch(`/api/industry/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SAVE_MOM", momNotes: momDraft })
      });
      setMeeting({ ...meeting, momNotes: momDraft });
    } catch (e) {
      console.error(e);
    } finally {
      setMomSaving(false);
    }
  };

  const handleToggleActionItem = async (aiId: string, currentStatus: boolean) => {
    if (!meeting) return;
    try {
      await fetch(`/api/industry/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_ACTION_ITEM", actionItemId: aiId, isCompleted: !currentStatus })
      });
      const updated = meeting.actionItems.map(a => a.id === aiId ? { ...a, isCompleted: !currentStatus } : a);
      setMeeting({ ...meeting, actionItems: updated });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddActionItem = async () => {
    if (!newAiTitle.trim() || !meeting) return;
    setAiSaving(true);
    try {
      const res = await fetch(`/api/industry/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_ACTION_ITEM", aiTitle: newAiTitle, aiAssignee: newAiAssignee, aiDueDate: newAiDue, aiPriority: newAiPriority })
      });
      const data = await res.json();
      if (data.success && data.actionItem) {
        setMeeting({ ...meeting, actionItems: [...meeting.actionItems, data.actionItem] });
        setNewAiTitle(""); setNewAiAssignee(""); setNewAiDue(""); setNewAiPriority("MEDIUM");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiSaving(false);
    }
  };

  const handleUploadDoc = async () => {
    if (!newDocName.trim() || !meeting) return;
    setDocUploading(true);
    try {
      const res = await fetch(`/api/industry/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ATTACH_DOC", docName: newDocName, docSize: 1024000 })
      });
      const data = await res.json();
      if (data.success && data.document) {
        setMeeting({ ...meeting, documents: [...meeting.documents, data.document] });
        setNewDocName("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDocUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!meeting) return null;

  const actionItemsList = Array.isArray(meeting.actionItems) ? meeting.actionItems : [];
  const participantsList = Array.isArray(meeting.participants) ? meeting.participants : [];
  const docsList = Array.isArray(meeting.documents) ? meeting.documents : [];

  const completedCount = actionItemsList.filter((a: any) => a.isCompleted).length;
  const totalCount = actionItemsList.length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/industry/meetings" className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D] hover:bg-[#FBF7F0] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                meeting.status === "SCHEDULED" ? "bg-[#FFF0ED] text-[#FF5A36]" :
                meeting.status === "COMPLETED" ? "bg-[#EFE9DF] text-[#57534E]" :
                "bg-[#E8F2EC] text-green-700"
              }`}>{meeting.status}</span>
              {meeting.projectName && (
                <span className="text-[9px] font-semibold text-[#A8A196]">· {meeting.projectName}</span>
              )}
            </div>
            <h1 className="text-sm font-bold text-[#211F1D] mt-0.5">{meeting.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {meeting.videoLink && meeting.status === "SCHEDULED" && (
            <a href={meeting.videoLink} target="_blank" rel="noopener noreferrer"
               className="h-8 px-4 bg-[#E8F2EC]0 hover:bg-green-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5" /> Join Meeting
            </a>
          )}
          {meeting.recordingUrl && (
            <a href={meeting.recordingUrl} target="_blank" rel="noopener noreferrer"
               className="h-8 px-3 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-bold hover:bg-[#FBF7F0] flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" /> Recording
            </a>
          )}
          <button onClick={fetchMeeting} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Info Banner */}
      <div className="bg-white border border-[#E2DCD2] rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[9px] font-bold text-[#A8A196] uppercase block">Date & Time</span>
          <span className="font-bold text-[#211F1D]">{new Date(meeting.startTime).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
          <span className="text-[10px] text-[#A8A196] block font-semibold">
            {new Date(meeting.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} – {new Date(meeting.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-[#A8A196] uppercase block">Platform</span>
          <span className="font-bold text-[#211F1D]">{meeting.platform.replace("_", " ")}</span>
          {meeting.isRecurring && <span className="text-[9px] text-[#A8A196] block font-semibold">{meeting.recurrenceRule}</span>}
        </div>
        <div>
          <span className="text-[9px] font-bold text-[#A8A196] uppercase block">Action Items</span>
          <span className="font-bold text-[#211F1D]">{completedCount}/{totalCount} Completed</span>
          <div className="h-1.5 bg-[#EFE9DF] rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }} />
          </div>
        </div>
        <div>
          <span className="text-[9px] font-bold text-[#A8A196] uppercase block">Participants</span>
          <span className="font-bold text-[#211F1D]">{participantsList.length} Invited</span>
          <span className="text-[9px] text-[#A8A196] block font-semibold">{participantsList.filter((p: any) => p.status === "ACCEPTED").length} Accepted</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2DCD2] -mb-2.5">
        {[
          { key: "overview", label: "Overview & Agenda", icon: Clock },
          { key: "mom", label: "Minutes of Meeting", icon: FileText },
          { key: "actions", label: `Action Items (${totalCount})`, icon: CheckSquare },
          { key: "docs", label: `Documents (${docsList.length})`, icon: Upload },
          { key: "timeline", label: "Event Timeline", icon: Clock }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-[#78716A] hover:text-[#211F1D]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-[#E2DCD2] rounded-2xl p-6 min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wide mb-2">Meeting Agenda</h3>
                  <p className="text-[#211F1D] font-semibold leading-relaxed bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 whitespace-pre-line">
                    {meeting.agenda || "No agenda specified."}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wide">Participants</h3>
                <div className="space-y-2">
                  {meeting.participants.map((p, i) => {
                    const pStatus = PARTICIPANT_STATUS[p.status] || PARTICIPANT_STATUS.PENDING;
                    return (
                      <div key={i} className="flex items-center justify-between border border-[#E2DCD2] rounded-xl p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-primary-light text-primary font-bold flex items-center justify-center text-[9px]">
                            {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-[#211F1D]">{p.name}</p>
                            <p className="text-[8px] text-[#A8A196] font-semibold">{p.role}</p>
                          </div>
                        </div>
                        <span className={`text-[8px] font-bold flex items-center gap-1 ${pStatus.dot === "bg-[#E8F2EC]0" ? "text-green-700" : pStatus.dot === "bg-[#FEF3C7]0" ? "text-[#B45309]" : "text-[#C0392B]"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${pStatus.dot}`} />{pStatus.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* MINUTES OF MEETING */}
          {activeTab === "mom" && (
            <motion.div key="mom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <div>
                  <h3 className="font-bold text-[#211F1D] uppercase tracking-wide text-[10px]">Minutes of Meeting (MoM)</h3>
                  <p className="text-[9px] text-[#A8A196] mt-0.5 font-semibold">Official record of discussion points, decisions and outcomes</p>
                </div>
                <button onClick={handleSaveMom} disabled={momSaving}
                  className="h-8 px-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {momSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save MoM
                </button>
              </div>
              <textarea
                value={momDraft}
                onChange={e => setMomDraft(e.target.value)}
                rows={12}
                placeholder="Document the key discussion points, decisions taken, and outcomes of this meeting..."
                className="w-full p-4 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-primary text-xs resize-none leading-relaxed"
              />
            </motion.div>
          )}

          {/* ACTION ITEMS */}
          {activeTab === "actions" && (
            <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {meeting.actionItems.length === 0 ? (
                  <p className="text-[10px] text-[#A8A196] text-center py-8">No action items yet. Add one below.</p>
                ) : meeting.actionItems.map(ai => (
                  <div key={ai.id} className={`border rounded-xl p-3.5 flex items-center gap-3 transition-all ${ai.isCompleted ? "border-green-100 bg-[#E8F2EC]/50 opacity-70" : "border-[#E2DCD2]"}`}>
                    <button onClick={() => handleToggleActionItem(ai.id, ai.isCompleted)} className="shrink-0">
                      {ai.isCompleted
                        ? <CheckCircle2 className="h-[1.125rem] w-[1.125rem] text-green-500" />
                        : <Square className="h-[1.125rem] w-[1.125rem] text-[#C4BCB0] hover:text-primary" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold ${ai.isCompleted ? "line-through text-[#A8A196]" : "text-[#211F1D]"}`}>{ai.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] text-[#A8A196] font-semibold">Assignee: {ai.assignee}</span>
                        <span className="text-[8px] text-[#A8A196] font-semibold">Due: {new Date(ai.dueDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${PRIORITY_BADGE[ai.priority] || PRIORITY_BADGE.MEDIUM}`}>
                      {ai.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Action Item Form */}
              <div className="border-t border-[#E2DCD2] pt-4 space-y-2">
                <h3 className="text-[10px] font-bold text-[#78716A] uppercase tracking-wide">Add New Action Item</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                  <input value={newAiTitle} onChange={e => setNewAiTitle(e.target.value)} placeholder="Action item title *"
                    className="lg:col-span-2 h-8 px-2.5 border border-[#E2DCD2] rounded-lg text-xs" />
                  <input value={newAiAssignee} onChange={e => setNewAiAssignee(e.target.value)} placeholder="Assignee name"
                    className="h-8 px-2.5 border border-[#E2DCD2] rounded-lg text-xs" />
                  <input type="date" value={newAiDue} onChange={e => setNewAiDue(e.target.value)}
                    className="h-8 px-2 border border-[#E2DCD2] rounded-lg text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <select value={newAiPriority} onChange={e => setNewAiPriority(e.target.value)}
                    className="h-8 px-2 border border-[#E2DCD2] rounded-lg bg-white text-xs">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                  <button onClick={handleAddActionItem} disabled={aiSaving || !newAiTitle}
                    className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1">
                    {aiSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Add Item
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* DOCUMENTS */}
          {activeTab === "docs" && (
            <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h3 className="font-bold text-[#211F1D] uppercase tracking-wide text-[10px]">Meeting Documents & References</h3>
                <div className="flex gap-2">
                  <input value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="Document name (e.g. agenda.pdf)"
                    className="h-8 px-2.5 border border-[#E2DCD2] rounded-lg text-xs" />
                  <button onClick={handleUploadDoc} disabled={docUploading || !newDocName}
                    className="h-8 px-3 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1">
                    {docUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload
                  </button>
                </div>
              </div>
              {meeting.documents.length === 0 ? (
                <p className="text-[10px] text-[#A8A196] text-center py-8">No documents attached yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meeting.documents.map(d => (
                    <div key={d.id} className="border border-[#E2DCD2] rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-[#FFF0ED] text-primary rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#211F1D]">{d.name}</p>
                          <p className="text-[9px] text-[#A8A196] font-semibold">{(d.fileSize / 1024).toFixed(0)} KB · {d.uploadedBy}</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold text-primary hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TIMELINE */}
          {activeTab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative border-l border-[#E2DCD2] pl-4 ml-2 space-y-4 text-xs">
              {meeting.timeline.map(event => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-[21px] top-0.5 h-3 w-3 rounded-full bg-white border-2 border-primary shadow-sm" />
                  <p className="font-bold text-[#211F1D]">{event.event}</p>
                  <span className="text-[8px] text-[#A8A196] font-semibold block mt-0.5">
                    {new Date(event.createdAt).toLocaleString("en-IN")} · {event.performedBy}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
