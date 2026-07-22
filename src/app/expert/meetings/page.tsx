"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Video, Search, RefreshCw, Plus, Clock, CheckCircle2,
  Users, FileText, Loader2, X, ChevronRight, Repeat
} from "lucide-react";
import Link from "next/link";

interface ExpertMeeting {
  id: string;
  title: string;
  orgName: string;
  projectId: string | null;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string;
  status: string;
  agenda: string;
  participantsCount: number;
  isRecurring: boolean;
  hasMom: boolean;
}

export default function ExpertMeetingsPage() {
  const [meetings, setMeetings] = useState<ExpertMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [orgName, setOrgName] = useState("");
  const [platform, setPlatform] = useState("GOOGLE_MEET");
  const [agenda, setAgenda] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, status: statusFilter });
      const res = await fetch(`/api/expert/meetings?${params}`);
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleScheduleCall = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/expert/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, orgName, platform, agenda })
      });
      setScheduleOpen(false);
      setTitle(""); setOrgName(""); setAgenda("");
      await fetchMeetings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Expert Meetings & Collaboration Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Schedule research syncs, conduct video calls, draft Minutes of Meeting (MoM) & track follow-up action items</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMeetings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setScheduleOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Schedule Call
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings by title or partner organization..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "SCHEDULED", "COMPLETED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                statusFilter === s ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Meetings Scheduled</p>
          <p className="text-[10px] text-slate-400 mt-1">Schedule a session with your project team or student mentees.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-extrabold shrink-0">
                  <Video className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{m.title}</h3>
                    {m.isRecurring && <Repeat className="h-3 w-3 text-slate-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold truncate">{m.orgName} · {m.agenda}</p>
                  <div className="flex items-center gap-3 text-[9px] text-slate-400 font-medium">
                    <span className="text-primary font-bold">
                      {new Date(m.startTime).toLocaleDateString("en-IN")} ({new Date(m.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })})
                    </span>
                    <span>·</span>
                    <span>{m.participantsCount} Participants</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/expert/meetings/${m.id}`}
                  className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <FileText className="h-3 w-3" /> Workspace
                </Link>

                <a
                  href={m.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Video className="h-3 w-3" /> Join Call
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {scheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setScheduleOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-primary" /> Schedule Video Call Session
                </h3>
                <button onClick={() => setScheduleOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Session Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint 3 Technical Architecture Sync"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Partner Organization</label>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Solaris Power / IIT Madras"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Video Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="GOOGLE_MEET">Google Meet</option>
                      <option value="MICROSOFT_TEAMS">MS Teams</option>
                      <option value="ZOOM">Zoom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agenda & Notes</label>
                  <textarea value={agenda} onChange={e => setAgenda(e.target.value)} rows={3} placeholder="Discussion topics, deliverables review..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setScheduleOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleScheduleCall} disabled={saving || !title.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Schedule Call
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
