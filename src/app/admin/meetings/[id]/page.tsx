"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Calendar, Video, Loader2, Play, HardHat, ShieldCheck,
  CheckCircle2, XCircle, Clock, AlertTriangle, Plus, Check, X,
  FileText, MessageSquare, Award, Star
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface MeetingProfile {
  id: string;
  title: string;
  agenda: string;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string | null;
  recordingUrl: string | null;
  outcomes: string | null;
  notes: string | null;
  project: {
    id: string;
    name: string;
  } | null;
  participants: string[];
  actionItemsList: Array<{ id: string; title: string; assigneeId: string | null; status: string; dueDate: string | null }>;
  feedbacks: Array<{ id: string; rating: number; comment: string | null }>;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function MeetingWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<MeetingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Minutes editing & action item inputs
  const [actionLoading, setActionLoading] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionAssignee, setNewActionAssignee] = useState("");
  const [newActionDueDate, setNewActionDueDate] = useState("");

  const [meetingOutcomes, setMeetingOutcomes] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  // Feedback input
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/meetings/${id}`);
      const data = await res.json();
      setProfile(data);
      setMeetingOutcomes(data.outcomes || "");
      setMeetingNotes(data.notes || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveOutcomes = async () => {
    setActionLoading(true);
    try {
      await fetch(`/api/admin/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_MINUTES",
          outcomes: meetingOutcomes,
          notes: meetingNotes
        })
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateActionItem = async () => {
    if (!newActionTitle) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/meetings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_ACTION_ITEM",
          title: newActionTitle,
          assigneeId: newActionAssignee || "Unassigned",
          dueDate: newActionDueDate || new Date().toISOString()
        })
      });
      setNewActionTitle("");
      setNewActionAssignee("");
      setNewActionDueDate("");
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePostFeedback = async () => {
    if (!newComment) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "POST_FEEDBACK",
          rating: newRating,
          comment: newComment
        })
      });
      setNewComment("");
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
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
          <Link href="/admin/meetings">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 mt-0.5">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
            <Video className="h-5.5 w-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 truncate">{profile.title}</h1>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-primary border border-blue-150 rounded-full font-bold">
                {profile.platform}
              </span>
            </div>
            {profile.project && (
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Linked Project: {profile.project.name}</p>
            )}
          </div>

          {profile.videoLink && (
            <a href={profile.videoLink} target="_blank" rel="noreferrer" className="flex-shrink-0">
              <button className="h-8 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" /> Join Video Call
              </button>
            </a>
          )}
        </div>
      </div>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Meeting Minutes and Discussion Points */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Meeting Agenda</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{profile.agenda}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><FileText className="h-4.5 w-4.5 text-primary" /> Meeting Minutes & Outcomes</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Key Outcomes & Resolutions</label>
                <textarea
                  value={meetingOutcomes}
                  onChange={(e) => setMeetingOutcomes(e.target.value)}
                  rows={4}
                  placeholder="Summarize decided points, parameter thresholds, and agreements…"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/20 text-xs"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Internal Follow-up Notes</label>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes for platform moderators and compliance compliance syncs…"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50/20 text-xs"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button onClick={handleSaveOutcomes} disabled={actionLoading} className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs flex items-center gap-1">
                  {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save Outcomes
                </button>
              </div>
            </div>
          </div>

          {/* Action Items Tracker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><HardHat className="h-4.5 w-4.5 text-primary" /> Decisions & Action Items</h3>
            
            <div className="divide-y divide-slate-100">
              {profile.actionItemsList.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full flex items-center justify-center border text-[8px] font-bold ${item.status === "COMPLETED" ? "bg-green-500 border-green-500 text-white" : "border-slate-350 text-slate-400"}`}>
                      {item.status === "COMPLETED" ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className={`text-xs font-semibold ${item.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>{item.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-3">
                    <span>{item.assigneeId}</span>
                    {item.dueDate && <span>Due: {new Date(item.dueDate).toLocaleDateString("en-IN")}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Inline Action Item Creator */}
            <div className="pt-3 border-t border-slate-50 flex gap-2">
              <input value={newActionTitle} onChange={(e) => setNewActionTitle(e.target.value)} placeholder="Assign new follow-up task…" className="flex-1 h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
              <input value={newActionAssignee} onChange={(e) => setNewActionAssignee(e.target.value)} placeholder="Assignee name" className="w-32 h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
              <button onClick={handleCreateActionItem} disabled={actionLoading} className="h-8 px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700">+</button>
            </div>
          </div>
        </div>

        {/* Right Side: Participant List & Feedback Tracker */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Participant Registry</h3>
            <div className="space-y-2">
              {profile.participants.map((email) => (
                <div key={email} className="flex items-center gap-2 border border-slate-50 rounded-xl p-2.5 text-xs">
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px] uppercase">
                    {email[0]}
                  </div>
                  <span className="font-semibold text-slate-650 truncate">{email}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback & Ratings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1"><Award className="h-4.5 w-4.5 text-primary" /> Session Feedback & Rating</h3>
            
            <div className="divide-y divide-slate-100">
              {profile.feedbacks.map((fb) => (
                <div key={fb.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex gap-0.5 text-amber-400 mb-1">
                    {Array.from({ length: fb.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">"{fb.comment}"</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Rate Call</span>
                <select value={newRating} onChange={(e) => setNewRating(parseInt(e.target.value))} className="h-7 border border-slate-200 rounded px-1.5 bg-white text-xs">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Log session rating notes…" className="flex-1 h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                <button onClick={handlePostFeedback} disabled={actionLoading} className="h-8 px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700">Submit</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
