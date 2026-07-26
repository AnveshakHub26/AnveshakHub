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
          <h1 className="text-xl font-bold text-[#211F1D]">Expert Meetings & Collaboration Calendar</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Schedule research syncs, conduct video calls, draft Minutes of Meeting (MoM) & track follow-up action items</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMeetings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setScheduleOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Plus className="h-3.5 w-3.5" /> Schedule Call
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings by title or partner organization..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["ALL", "SCHEDULED", "COMPLETED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                statusFilter === s ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2]"
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
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <Calendar className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Meetings Scheduled</p>
          <p className="text-[10px] text-[#A8A196] mt-1">Schedule a session with your project team or student mentees.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card-flat rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-[#E8F2EC] text-[#2F6B4F] flex items-center justify-center font-extrabold shrink-0">
                  <Video className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors truncate">{m.title}</h3>
                    {m.isRecurring && <Repeat className="h-3 w-3 text-[#A8A196] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-[#78716A] font-semibold truncate">{m.orgName} · {m.agenda}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#A8A196] font-medium">
                    <span className="text-[#FF5A36] font-bold">
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
                  className="h-8 px-3 border border-[#E2DCD2] hover:border-[#FF5A36] text-[#57534E] hover:text-[#FF5A36] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
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
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-[#FF5A36]" /> Schedule Video Call Session
                </h3>
                <button onClick={() => setScheduleOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Session Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint 3 Technical Architecture Sync"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Partner Organization</label>
                    <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Solaris Power / IIT Madras"
                      className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Video Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs font-bold">
                      <option value="GOOGLE_MEET">Google Meet</option>
                      <option value="MICROSOFT_TEAMS">MS Teams</option>
                      <option value="ZOOM">Zoom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Agenda & Notes</label>
                  <textarea value={agenda} onChange={e => setAgenda(e.target.value)} rows={3} placeholder="Discussion topics, deliverables review..."
                    className="w-full p-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-4">
                <button onClick={() => setScheduleOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">Cancel</button>
                <button onClick={handleScheduleCall} disabled={saving || !title.trim()}
                  className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
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
