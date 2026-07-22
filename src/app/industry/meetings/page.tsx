"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Search, RefreshCw, Plus, Video, ChevronRight,
  Loader2, Clock, CheckCircle2, Users, X, Repeat, ExternalLink,
  MapPin, Monitor, Phone, AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Meeting {
  id: string;
  title: string;
  agenda: string;
  participants: string[];
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string | null;
  status: string;
  isRecurring: boolean;
  recurrenceRule: string | null;
  projectId: string | null;
}

interface Stats {
  total: number;
  scheduled: number;
  completed: number;
  upcomingToday: number;
}

const PLATFORM_ICONS: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  GOOGLE_MEET:      { icon: <Video className="h-3.5 w-3.5" />, label: "Google Meet",    color: "text-green-600 bg-green-50 border-green-200" },
  MICROSOFT_TEAMS:  { icon: <Monitor className="h-3.5 w-3.5" />, label: "MS Teams",    color: "text-blue-700 bg-blue-50 border-blue-200" },
  ZOOM:             { icon: <Video className="h-3.5 w-3.5" />, label: "Zoom",           color: "text-blue-600 bg-blue-50 border-blue-100" },
  PHYSICAL:         { icon: <MapPin className="h-3.5 w-3.5" />, label: "In-Person",     color: "text-purple-600 bg-purple-50 border-purple-200" },
  PHONE:            { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone Call",     color: "text-slate-600 bg-slate-50 border-slate-200" }
};

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  SCHEDULED:   { label: "Scheduled",   bg: "bg-blue-50",  text: "text-blue-700" },
  IN_PROGRESS: { label: "Live Now",    bg: "bg-green-50", text: "text-green-700" },
  COMPLETED:   { label: "Completed",   bg: "bg-slate-100",text: "text-slate-600" },
  CANCELLED:   { label: "Cancelled",   bg: "bg-red-50",   text: "text-red-700" }
};

export default function MeetingsDashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Schedule form state
  const [newTitle, setNewTitle] = useState("");
  const [newAgenda, setNewAgenda] = useState("");
  const [newPlatform, setNewPlatform] = useState("GOOGLE_MEET");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newParticipants, setNewParticipants] = useState("");
  const [newVideoLink, setNewVideoLink] = useState("");
  const [newRecurring, setNewRecurring] = useState(false);
  const [newProjectId, setNewProjectId] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, status: statusFilter });
      const res = await fetch(`/api/industry/meetings?${params}`);
      const data = await res.json();
      setMeetings(data.meetings || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleSchedule = async () => {
    if (!newTitle || !newStart || !newEnd) return;
    setSaving(true);
    try {
      await fetch("/api/industry/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          agenda: newAgenda,
          platform: newPlatform,
          startTime: newStart,
          endTime: newEnd,
          participants: newParticipants.split(",").map(p => p.trim()).filter(Boolean),
          videoLink: newVideoLink || null,
          isRecurring: newRecurring,
          projectId: newProjectId || null
        })
      });
      setScheduleOpen(false);
      setNewTitle(""); setNewAgenda(""); setNewPlatform("GOOGLE_MEET");
      setNewStart(""); setNewEnd(""); setNewParticipants(""); setNewVideoLink(""); setNewRecurring(false); setNewProjectId("");
      await fetchMeetings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Meetings & Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Schedule sessions, manage MoM notes, assign action items and track project calls</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMeetings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setScheduleOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Schedule Meeting
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Meetings", value: stats.total, icon: Calendar, color: "text-primary bg-blue-50" },
            { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
            { label: "Happening Today", value: stats.upcomingToday, icon: AlertCircle, color: "text-purple-600 bg-purple-50" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-800">{item.value}</div>
                  <div className="text-[9px] text-slate-500 font-semibold">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search meetings by title or agenda..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
          {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                statusFilter === s ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
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
          <p className="text-xs font-bold text-slate-800">No Meetings Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Schedule a new meeting to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m, idx) => {
            const platform = PLATFORM_ICONS[m.platform] || PLATFORM_ICONS.GOOGLE_MEET;
            const status = STATUS_STYLES[m.status] || STATUS_STYLES.SCHEDULED;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all group"
              >
                {/* Date/Time Column */}
                <div className="w-20 shrink-0 text-center border-r border-slate-100 pr-4">
                  <div className="text-[10px] font-extrabold text-primary">{formatDate(m.startTime)}</div>
                  <div className="text-[9px] text-slate-500 font-semibold">{formatTime(m.startTime)}</div>
                  <div className="text-[9px] text-slate-400 font-semibold">– {formatTime(m.endTime)}</div>
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{m.title}</h3>
                    {m.isRecurring && <Repeat className="h-3 w-3 text-slate-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{m.agenda}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${platform.color}`}>
                      {platform.icon} {platform.label}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                    <span className="text-[8px] text-slate-400 font-semibold">
                      <Users className="h-3 w-3 inline mr-0.5" />{m.participants.length} participants
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {m.videoLink && m.status === "SCHEDULED" && (
                    <a href={m.videoLink} target="_blank" rel="noopener noreferrer"
                       className="h-8 px-3 bg-green-500 text-white rounded-lg text-[10px] font-bold hover:bg-green-600 flex items-center gap-1">
                      <Video className="h-3 w-3" /> Join
                    </a>
                  )}
                  <Link
                    href={`/industry/meetings/${m.id}`}
                    className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    Workspace <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {scheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setScheduleOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Schedule New Meeting
                </h3>
                <button onClick={() => setScheduleOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Meeting Title *</label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Sprint 3 Planning – Solar Grid"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agenda</label>
                  <textarea value={newAgenda} onChange={e => setNewAgenda(e.target.value)} rows={2} placeholder="Key discussion topics..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Start Date & Time *</label>
                    <input type="datetime-local" value={newStart} onChange={e => setNewStart(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">End Date & Time *</label>
                    <input type="datetime-local" value={newEnd} onChange={e => setNewEnd(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Platform</label>
                    <select value={newPlatform} onChange={e => setNewPlatform(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                      <option value="GOOGLE_MEET">Google Meet</option>
                      <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
                      <option value="ZOOM">Zoom</option>
                      <option value="PHYSICAL">In-Person</option>
                      <option value="PHONE">Phone Call</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Link Project (Optional)</label>
                    <select value={newProjectId} onChange={e => setNewProjectId(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                      <option value="">No project</option>
                      <option value="prj-001">Solar Micro-Grid for IIT Madras</option>
                      <option value="prj-004">Autonomous Rover Control Module</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Video / Meet Link</label>
                  <input value={newVideoLink} onChange={e => setNewVideoLink(e.target.value)} placeholder="https://meet.google.com/..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Participants (comma separated)</label>
                  <input value={newParticipants} onChange={e => setNewParticipants(e.target.value)} placeholder="Dr. Arunima, Rajesh Sharma, Arpit Goel..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="flex items-center gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50">
                  <input type="checkbox" id="recurring" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)}
                    className="h-4 w-4 accent-primary" />
                  <label htmlFor="recurring" className="text-[10px] font-semibold text-slate-600 cursor-pointer flex items-center gap-1.5">
                    <Repeat className="h-3 w-3" /> Set as Recurring Meeting
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setScheduleOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSchedule} disabled={saving || !newTitle || !newStart || !newEnd}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Schedule Meeting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
