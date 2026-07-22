"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Video, Calendar, CheckCircle2,
  Check, Loader2, Save, Users, FileText
} from "lucide-react";
import Link from "next/link";

interface ActionItem {
  id: string;
  text: string;
  done: boolean;
}

interface Participant {
  name: string;
  role: string;
}

interface StudentMeetingDetail {
  id: string;
  title: string;
  orgName: string;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string;
  status: string;
  agenda: string;
  momNotes: string;
  actionItems: ActionItem[];
  participants: Participant[];
}

export default function StudentMeetingWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [meeting, setMeeting] = useState<StudentMeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mom");
  const [momNotes, setMomNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchMeeting = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/student/meetings/${id}`);
      const data = await res.json();
      setMeeting(data);
      setMomNotes(data.momNotes || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  const handleToggleAction = async (actId: string, currentDone: boolean) => {
    if (!meeting) return;
    try {
      await fetch(`/api/student/meetings/${meeting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_ACTION",
          actId,
          done: !currentDone
        })
      });
      await fetchMeeting();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMom = async () => {
    if (!meeting) return;
    setSaving(true);
    try {
      await fetch(`/api/student/meetings/${meeting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ momNotes })
      });
      await fetchMeeting();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
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

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/meetings" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">{meeting.platform}</span>
              <h1 className="text-base font-bold text-slate-900">{meeting.title}</h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{meeting.orgName} · {new Date(meeting.startTime).toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchMeeting} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={meeting.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Video className="h-3.5 w-3.5" /> Join Call
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "mom", label: "Minutes of Meeting (MoM)", icon: FileText },
          { key: "actions", label: `Action Items (${meeting.actionItems.length})`, icon: CheckCircle2 },
          { key: "participants", label: `Participants (${meeting.participants.length})`, icon: Users }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[320px]">
        {/* MOM TAB */}
        {activeTab === "mom" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Session Notes & Decision Log</h3>
              <button onClick={handleSaveMom} disabled={saving}
                className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Notes
              </button>
            </div>

            <textarea
              value={momNotes}
              onChange={e => setMomNotes(e.target.value)}
              rows={6}
              placeholder="Enter meeting notes, technical recommendations & decisions agreed upon during the call..."
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed"
            />
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeTab === "actions" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Follow-Up Action Items Checklist</h3>
            <div className="space-y-2">
              {meeting.actionItems.map(act => (
                <div key={act.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleAction(act.id, act.done)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        act.done ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                      }`}
                    >
                      {act.done && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <span className={`font-bold ${act.done ? "line-through text-slate-400" : "text-slate-800"}`}>{act.text}</span>
                  </div>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                    act.done ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}>{act.done ? "DONE" : "PENDING"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARTICIPANTS TAB */}
        {activeTab === "participants" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Confirmed Attendee Roster</h3>
            <div className="space-y-2">
              {meeting.participants.map((p, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
