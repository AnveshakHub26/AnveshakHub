"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award,
  ShieldCheck, AlertTriangle, Info, Zap, Send, Mail, Radio
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Broadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  channel: string;
  scheduledAt: string | null;
  sentAt: string | null;
  status: string;
  recipientsCount: number;
  readCount: number;
  createdBy: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  channel: string;
  subject: string | null;
  body: string;
}

interface Stats {
  totalDispatched: number;
  deliverySuccessRate: string;
  readRate: string;
  activeScheduled: number;
  templatesCount: number;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function NotificationsHubConsole() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("broadcasts"); // broadcasts, templates, scheduled

  // Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL_USERS");
  const [channel, setChannel] = useState("ALL");
  const [scheduledAt, setScheduledAt] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        channel: channelFilter === "ALL" ? "" : channelFilter
      });
      const res = await fetch(`/api/admin/notifications?${params}`);
      const data = await res.json();
      setBroadcasts(data.broadcasts || []);
      setTemplates(data.templates || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, channelFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleCreateBroadcast = async () => {
    if (!title || !message) return;
    setCreateLoading(true);
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          targetAudience,
          channel,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          createdBy: "Platform Communications Officer"
        })
      });
      setCreateOpen(false);
      setTitle("");
      setMessage("");
      setScheduledAt("");
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Notifications & Communication Center</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Broadcast platform announcements, manage automated email dispatches, and audit delivery telemetry</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchNotifications} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-slate-655 rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setCreateOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] transition-colors">
              <Plus className="h-3.5 w-3.5" /> Broadcast Announcement
            </button>
          </div>
        </div>

        {/* ── Telemetry Stats ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Dispatched", value: stats.totalDispatched.toLocaleString("en-IN"), icon: Send, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
              { label: "Delivery Success Rate", value: stats.deliverySuccessRate, icon: CheckCircle2, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
              { label: "Audience Read Rate", value: stats.readRate, icon: Eye, bg: "bg-[#FF5A36]/50", color: "text-[#FF5A36]/600" },
              { label: "Active Scheduled Reminders", value: stats.activeScheduled, icon: Clock, bg: "bg-[#FEF3C7]", color: "text-amber-600" }
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

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-[#E2DCD2] pt-0 -mb-5">
          {[
            { key: "broadcasts", label: "Broadcast History", count: broadcasts.length },
            { key: "templates", label: "Message Templates", count: templates.length },
            { key: "scheduled", label: "Scheduled Queue", count: stats?.activeScheduled || 0 }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-[#FF5A36] text-[#FF5A36]" : "border-transparent text-[#78716A] hover:text-[#211F1D]"}`}>
              {tab.label} {tab.count !== null && <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE9DF] text-[#78716A] rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "broadcasts" && (
        <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements, audiences, content…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-[#78716A] uppercase tracking-wide text-[10px]">Channel</label>
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="h-8 border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none">
              <option value="ALL">All Channels</option>
              <option value="IN_APP">In-App Only</option>
              <option value="EMAIL">Email</option>
              <option value="PUSH">Mobile Push</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── BROADCASTS TAB ──── */}
            {activeTab === "broadcasts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {broadcasts.map((b) => (
                  <motion.div
                    key={b.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="card-flat rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wider">{b.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${b.status === "SENT" ? "bg-[#E8F2EC] text-[#2F6B4F] border-green-150" : "bg-[#FEF3C7] text-[#B45309] border-amber-150"}`}>
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#211F1D] leading-snug">{b.title}</h3>
                      <p className="text-[10px] text-[#78716A] font-semibold mt-0.5">Audience: {b.targetAudience} · Channel: {b.channel}</p>
                    </div>

                    <p className="text-[10px] text-[#57534E] line-clamp-2 leading-relaxed">"{b.message}"</p>

                    <div className="flex justify-between items-center text-[10px] text-[#78716A] pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] text-[#A8A196] uppercase block font-semibold leading-none">Recipients</span>
                        <span className="font-bold text-[#211F1D]">{b.recipientsCount} ({Math.round((b.readCount / (b.recipientsCount || 1)) * 100)}% Read)</span>
                      </div>
                      
                      <span className="text-[10px] text-[#A8A196] font-semibold">
                        {b.sentAt ? new Date(b.sentAt).toLocaleString("en-IN") : "Scheduled"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── TEMPLATES TAB ──── */}
            {activeTab === "templates" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><Mail className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> System Notification Templates</h3>
                <div className="space-y-3">
                  {templates.map((t) => (
                    <div key={t.id} className="border border-[#E2DCD2] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#211F1D]">{t.name}</span>
                        <span className="text-[10px] bg-[#FFF0ED] text-[#FF5A36] border border-blue-150 rounded px-2 py-0.5 font-bold">{t.channel}</span>
                      </div>
                      <p className="text-[10px] text-[#78716A] font-mono bg-[#FBF7F0] p-2 rounded">"{t.body}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── SCHEDULED QUEUE TAB ──── */}
            {activeTab === "scheduled" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><Clock className="h-[1.125rem] w-[1.125rem] text-amber-500" /> Active Scheduled Queue</h3>
                <p className="text-xs text-[#78716A] font-medium">Messages in the scheduled queue will automatically dispatch via RabbitMQ notification events when triggered.</p>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Create Broadcast Modal ── */}
      <AnimatePresence>
        {createOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCreateOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Broadcast System Notification</h3>
                <button onClick={() => setCreateOpen(false)} className="text-[#A8A196] hover:text-[#57534E]"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Announcement Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q3 Grant Application Portal Open" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Message Content *</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Write announcement text…" className="w-full p-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Target Audience *</label>
                    <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      <option value="ALL_USERS">All Platform Users</option>
                      <option value="INDUSTRIES">Industry Partners Only</option>
                      <option value="EXPERTS">Subject Experts Only</option>
                      <option value="STUDENTS">Students Portal Only</option>
                      <option value="ADMINS">Internal Staff Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Channel *</label>
                    <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      <option value="ALL">All Channels (In-App + Email)</option>
                      <option value="IN_APP">In-App Banner Only</option>
                      <option value="EMAIL">Email Dispatch Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Schedule Dispatched Time (Optional)</label>
                  <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-3.5 mt-4">
                <button onClick={handleCreateBroadcast} disabled={createLoading} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg font-bold flex items-center gap-1 hover:bg-[#E04826]">
                  {createLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Dispatch Broadcast
                </button>
                <button onClick={() => setCreateOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg font-semibold hover:bg-[#EFE9DF]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
