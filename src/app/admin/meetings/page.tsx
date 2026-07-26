"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Calendar, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Clock, CheckCircle2, AlertTriangle, Video, X, Users,
  Globe, Info, FileText, ChevronLeft, ChevronRight, Award, Trash
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Meeting {
  id: string;
  title: string;
  agenda: string;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string | null;
  project: {
    name: string;
  } | null;
  participants: string[];
}

interface Stats {
  total: number;
  upcoming: number;
  completed: number;
  thisWeek: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const PLATFORM_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  GOOGLE_MEET:     { label: "Google Meet",      color: "text-[#FF5A36]", bg: "bg-[#FFF0ED] border-blue-100" },
  ZOOM:            { label: "Zoom",             color: "text-[#C2410C]", bg: "bg-[#FFF4ED] border-orange-100" },
  MICROSOFT_TEAMS: { label: "MS Teams",         color: "text-[#FF5A36]/700", bg: "bg-[#FF5A36]/50 border-indigo-100" },
  PHYSICAL:        { label: "Physical Venue",   color: "text-[#211F1D]", bg: "bg-[#EFE9DF] border-[#E2DCD2]" }
};

const CALENDAR_DAYS = Array.from({ length: 35 }, (_, i) => {
  const dayNum = (i % 31) + 1;
  return {
    dayNum,
    isCurrentMonth: i >= 4 && i < 35, // mock offset
    meetingsCount: dayNum === 25 ? 1 : dayNum === 26 ? 1 : dayNum === 27 ? 1 : 0
  };
});

// ─── Main Page ─────────────────────────────────────────────────────

export default function MeetingsDirectoryPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"list" | "calendar">("calendar");

  // Scheduling Modal State
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAgenda, setNewAgenda] = useState("");
  const [newPlatform, setNewPlatform] = useState("GOOGLE_MEET");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newParticipants, setNewParticipants] = useState("");
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        platform: platformFilter === "ALL" ? "" : platformFilter,
        page: String(page),
        limit: String(LIMIT)
      });
      const res = await fetch(`/api/admin/meetings?${params}`);
      const data = await res.json();
      setMeetings(data.meetings || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, platformFilter, page]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleScheduleMeeting = async () => {
    if (!newTitle || !newStartTime) return;
    setSchedulerLoading(true);
    try {
      await fetch("/api/admin/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          agenda: newAgenda,
          platform: newPlatform,
          startTime: newStartTime,
          endTime: newEndTime || new Date(new Date(newStartTime).getTime() + 3600000).toISOString(),
          project: newProjectName ? { name: newProjectName } : null,
          participants: newParticipants.split(",").map(p => p.trim()).filter(Boolean),
          videoLink: newPlatform === "PHYSICAL" ? null : "https://meet.google.com/mock-link-join"
        })
      });
      setSchedulerOpen(false);
      setNewTitle("");
      setNewAgenda("");
      setNewStartTime("");
      setNewEndTime("");
      setNewProjectName("");
      setNewParticipants("");
      await fetchMeetings();
    } catch (e) {
      console.error(e);
    } finally {
      setSchedulerLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Meeting Manager</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Coordinate technical syncs between guide advisors, client industries, and student intern teams</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchMeetings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setSchedulerOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] transition-colors">
              <Plus className="h-3.5 w-3.5" /> Schedule Sync Meeting
            </button>
          </div>
        </div>

        {/* ── KPI Widgets ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Sessions Logged", value: stats.total, icon: Calendar, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
              { label: "Upcoming Meetings", value: stats.upcoming, icon: Clock, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
              { label: "Completed Sessions", value: stats.completed, icon: CheckCircle2, bg: "bg-[#FF5A36]/50", color: "text-[#FF5A36]/600" },
              { label: "Meetings This Week", value: stats.thisWeek, icon: Users, bg: "bg-purple-50", color: "text-purple-650" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-[1.125rem] w-[1.125rem] ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#211F1D]">{stat.value}</div>
                    <div className="text-[10px] text-[#78716A] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meeting titles, agendas, projects…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-[#FF5A36] bg-[#FFF0ED] text-[#FF5A36]" : "border-[#E2DCD2] text-[#57534E] hover:bg-[#EFE9DF]"}`}
        >
          <Filter className="h-3.5 w-3.5" /> Platform Filter
        </button>

        <div className="flex items-center gap-0.5 border border-[#E2DCD2] rounded-lg p-0.5 bg-[#FBF7F0] ml-auto">
          <button onClick={() => setCalendarViewMode("calendar")} className={`h-7 px-3.5 text-[10px] font-bold rounded-md transition-all ${calendarViewMode === "calendar" ? "bg-[#FBF7F0] text-[#211F1D] shadow-[var(--shadow-sm)]" : "text-[#78716A] hover:text-[#211F1D]"}`}>Calendar Grid</button>
          <button onClick={() => setCalendarViewMode("list")} className={`h-7 px-3.5 text-[10px] font-bold rounded-md transition-all ${calendarViewMode === "list" ? "bg-[#FBF7F0] text-[#211F1D] shadow-[var(--shadow-sm)]" : "text-[#78716A] hover:text-[#211F1D]"}`}>List Directory</button>
        </div>
      </div>

      {/* ── Platform Filters ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#FBF7F0] border-b border-[#E2DCD2]">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">Platform</label>
                <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="h-7 text-xs border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36]">
                  <option value="ALL">All Platforms</option>
                  {Object.entries(PLATFORM_STYLES).map(([key, style]) => <option key={key} value={key}>{style.label}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
          </div>
        ) : calendarViewMode === "calendar" ? (
          /* ──── Calendar Grid View ──── */
          <div className="card-flat rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E2DCD2]">
              <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><Calendar className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> July 2026</h3>
              <div className="flex items-center gap-1.5">
                <button className="h-7 w-7 border border-[#E2DCD2] text-[#57534E] rounded-lg hover:bg-[#FBF7F0] flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
                <button className="h-7 w-7 border border-[#E2DCD2] text-[#57534E] rounded-lg hover:bg-[#FBF7F0] flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-[#78716A] text-center border-b border-slate-50 pb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5 h-[340px]">
              {CALENDAR_DAYS.map((day, i) => (
                <div key={i} className={`border border-[#E2DCD2] rounded-xl p-2.5 flex flex-col justify-between transition-colors hover:border-[#FFD8D0] ${day.isCurrentMonth ? "bg-[#FBF7F0]" : "bg-[#FBF7F0] opacity-40"}`}>
                  <span className={`text-[10px] font-bold ${day.isCurrentMonth ? "text-[#211F1D]" : "text-[#A8A196]"}`}>{day.dayNum}</span>
                  {day.meetingsCount > 0 && (
                    <div className="text-[8px] bg-[#FF5A36]/10 border border-[#FFD8D0] text-[#FF5A36] font-extrabold px-1 py-0.5 rounded leading-none text-center">
                      {day.meetingsCount} Session{day.meetingsCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ──── Directory List View ──── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((m) => {
              const platform = PLATFORM_STYLES[m.platform] || PLATFORM_STYLES.GOOGLE_MEET;
              return (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  className="card-flat rounded-2xl p-5 flex flex-col gap-3.5 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wider">{m.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${platform.bg} ${platform.color}`}>
                      <Video className="h-3 w-3" /> {platform.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-850 h-8 line-clamp-2 leading-snug">{m.title}</h3>
                    {m.project && (
                      <p className="text-[10px] text-[#A8A196] font-semibold mt-1">Project: {m.project.name}</p>
                    )}
                  </div>

                  <p className="text-[10px] text-[#78716A] line-clamp-2 h-7 font-medium leading-relaxed">"{m.agenda}"</p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px] text-[#78716A] font-bold">
                    <span>{new Date(m.startTime).toLocaleString("en-IN")}</span>
                    <span>{m.participants.length} Invitees</span>
                  </div>

                  <Link href={`/admin/meetings/${m.id}`}>
                    <button className="w-full h-8 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-[10px] font-bold transition-colors flex items-center justify-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> Open Minutes Workspace
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Scheduling Dialog ── */}
      <AnimatePresence>
        {schedulerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSchedulerOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850">Schedule B2B Technical Sync</h3>
                <button onClick={() => setSchedulerOpen(false)} className="text-[#78716A] hover:text-[#57534E]"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Meeting Title *</label>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Avionics Serial Topology Sweeps" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Agenda & Goals</label>
                  <textarea value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} rows={3} placeholder="Review Node 3 frame drops, finalize calibration parameters…" className="w-full p-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Platform *</label>
                    <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      <option value="GOOGLE_MEET">Google Meet</option>
                      <option value="ZOOM">Zoom</option>
                      <option value="MICROSOFT_TEAMS">MS Teams</option>
                      <option value="PHYSICAL">Physical Venue</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Project Binding (Optional)</label>
                    <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g. Solar Micro-Grid for IITM" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Start Time *</label>
                    <input type="datetime-local" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">End Time</label>
                    <input type="datetime-local" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Participant Emails (comma separated)</label>
                  <input value={newParticipants} onChange={(e) => setNewParticipants(e.target.value)} placeholder="e.g. dr.arunima@aiml.in, arpit.goel@iit.in" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-3.5 mt-4">
                <button onClick={handleScheduleMeeting} disabled={schedulerLoading} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg font-bold flex items-center gap-1 hover:bg-[#E04826]">
                  {schedulerLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Schedule Session
                </button>
                <button onClick={() => setSchedulerOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg font-semibold hover:bg-[#EFE9DF]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
