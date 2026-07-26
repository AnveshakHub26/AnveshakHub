"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, UsersRound, GraduationCap, Briefcase, Calendar, Landmark,
  Wallet, RefreshCw, Radio, ShieldCheck,
  CheckCircle2, XCircle, ChevronRight, AlertTriangle, AlertCircle,
  Wifi, ShieldAlert, FileText, Check, X, Sparkles,
  Loader2, Send, ArrowUpRight, Activity, Zap, TrendingUp, Globe
} from "lucide-react";

interface KPIItem {
  count: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  progress: number;
}

interface VerificationItem {
  id: string;
  orgName: string;
  type: string;
  domain: string;
  submittedAt: string;
  documentStatus: string;
  priority: "HIGH" | "STANDARD";
}

export default function AdminDashboardPage() {
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [kpis, setKpis]                   = useState<Record<string, KPIItem>>({});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [meetings, setMeetings]           = useState<any[]>([]);
  const [services, setServices]           = useState<any[]>([]);
  const [systemStatus, setSystemStatus]   = useState<any>({});
  const [queue, setQueue]                 = useState<VerificationItem[]>([]);

  const [verifyActionLoading, setVerifyActionLoading] = useState(false);
  const [broadcastOpen, setBroadcastOpen]   = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastDone, setBroadcastDone]   = useState(false);

  const loadMetrics = async () => {
    try {
      const res  = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        setKpis(data.kpis);
        setRecentActivities(data.recentActivities);
        setMeetings(data.upcomingMeetings);
        setServices(data.systemHealth);
        setSystemStatus(data.telemetry);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadVerificationQueue = async () => {
    try {
      const res  = await fetch("/api/admin/verification-center");
      const data = await res.json();
      if (res.ok) setQueue(data.queue);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([loadMetrics(), loadVerificationQueue()]).finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMetrics(), loadVerificationQueue()]);
    setRefreshing(false);
  };

  const handleVerifyAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setVerifyActionLoading(true);
    try {
      const res = await fetch(`/api/admin/verification-center/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "APPROVE" ? "VERIFIED" : "REJECTED" }),
      });
      if (res.ok) {
        setQueue(prev => prev.filter(item => item.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyActionLoading(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage, scope: "GLOBAL" }),
      });
      if (res.ok) {
        setBroadcastDone(true);
        setTimeout(() => {
          setBroadcastOpen(false);
          setBroadcastDone(false);
          setBroadcastMessage("");
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs font-semibold text-[#57534E]">Loading Executive Command Centre…</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: "Verified Industries", value: kpis.industries?.count || "48", sub: "+12% this quarter", icon: Building2,   color: "#FF5A36", bg: "#FFF0ED" },
    { label: "Subject Experts",     value: kpis.experts?.count    || "142",sub: "+8% active advisors", icon: UsersRound, color: "#4338CA", bg: "#EEF2FF" },
    { label: "Active Projects",     value: kpis.projects?.count   || "86", sub: "₹4.2 Cr total funding",icon: Briefcase,  color: "#2F6B4F", bg: "#E8F2EC" },
    { label: "Compliance Queue",    value: queue.length,                   sub: "Awaiting review",     icon: ShieldAlert, color: "#DC2626", bg: "#FEE2E2" },
  ];

  return (
    <div className="bg-[#FBF7F0] min-h-screen">

      {/* Command Banner */}
      <div className="bg-[#211F1D] px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] uppercase tracking-widest">
                  Executive Control Center
                </span>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F] flex items-center gap-1">
                  <Wifi className="h-2.5 w-2.5" /> System Online
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Admin Command Dashboard</h1>
              <p className="text-[#78716A] text-sm mt-1">
                Platform telemetry, verification queues, CRM pipeline, and global broadcast control.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBroadcastOpen(true)}
                className="h-10 px-5 bg-[#FF5A36] text-white rounded-xl text-sm font-bold hover:bg-[#E04826] flex items-center gap-2 transition-colors shadow-md shadow-[#FF5A36]/30"
              >
                <Radio className="h-4 w-4" /> Send Broadcast
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-10 px-4 bg-[#3a3733] text-[#A8A196] hover:text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                  <k.icon className="h-5 w-5" style={{ color: k.color }} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#A8A196]" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#211F1D]">{k.value}</p>
                <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{k.label}</p>
                <p className="text-[10px] text-[#A8A196] mt-0.5">{k.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Verification Queue */}
          <div className="lg:col-span-8">
            <div className="bg-[#EFE9DF] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#D8D2C7] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#211F1D]">Compliance Verification Queue</h2>
                  <p className="text-xs text-[#78716A] mt-0.5">Approve or reject registered organization credentials</p>
                </div>
                {queue.length > 0 && (
                  <span className="text-xs font-extrabold text-[#DC2626] bg-[#FEE2E2] px-3 py-1 rounded-full border border-red-200">
                    {queue.length} Pending
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#D8D2C7]">
                    <tr>
                      <th className="py-3 px-5 text-[10px] font-extrabold text-[#57534E] uppercase tracking-widest">Organization</th>
                      <th className="py-3 px-4 text-[10px] font-extrabold text-[#57534E] uppercase tracking-widest">Domain</th>
                      <th className="py-3 px-4 text-[10px] font-extrabold text-[#57534E] uppercase tracking-widest">Documents</th>
                      <th className="py-3 px-4 text-[10px] font-extrabold text-[#57534E] uppercase tracking-widest">Priority</th>
                      <th className="py-3 px-5 text-[10px] font-extrabold text-[#57534E] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D2C7]">
                    {queue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <ShieldCheck className="h-8 w-8 text-[#2F6B4F] mx-auto mb-2" />
                          <p className="text-xs font-bold text-[#211F1D]">All clear</p>
                          <p className="text-xs text-[#78716A] mt-1">No organizations awaiting verification</p>
                        </td>
                      </tr>
                    ) : queue.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="bg-[#FBF7F0] hover:bg-[#F5F0E8] transition-colors"
                      >
                        <td className="py-4 px-5">
                          <p className="text-xs font-bold text-[#211F1D]">{item.orgName}</p>
                          <p className="text-[10px] text-[#78716A] mt-0.5">{item.type} · {item.submittedAt}</p>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-[#57534E]">{item.domain}</td>
                        <td className="py-4 px-4">
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#2F6B4F]">
                            {item.documentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            item.priority === "HIGH"
                              ? "bg-[#FEE2E2] text-[#DC2626]"
                              : "bg-[#EFE9DF] text-[#57534E]"
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleVerifyAction(item.id, "APPROVE")}
                              disabled={verifyActionLoading}
                              className="h-7 px-3 bg-[#2F6B4F] text-white rounded-lg text-[10px] font-bold hover:bg-[#245840] flex items-center gap-1 disabled:opacity-50 transition-colors"
                            >
                              <Check className="h-3 w-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleVerifyAction(item.id, "REJECT")}
                              disabled={verifyActionLoading}
                              className="h-7 px-3 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-[10px] font-bold hover:bg-[#FECACA] flex items-center gap-1 disabled:opacity-50 transition-colors border border-red-200"
                            >
                              <X className="h-3 w-3" /> Reject
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-6">

            {/* System Health */}
            {services.length > 0 && (
              <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#FF5A36]" /> System Health
                </h3>
                <div className="space-y-2">
                  {services.map((svc: any, idx: number) => (
                    <div key={idx} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-3 py-2.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#211F1D]">{svc.name || svc.service}</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        (svc.status || svc.health) === "HEALTHY" || (svc.status || svc.health) === "UP"
                          ? "bg-[#E8F2EC] text-[#2F6B4F]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}>
                        <Wifi className="h-2.5 w-2.5" />
                        {svc.status || svc.health || "OK"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Quick Links */}
            <div className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-extrabold text-[#57534E] uppercase tracking-widest">Control Panels</h3>
              {[
                { label: "Verification Center", href: "/admin/verification-center", icon: ShieldCheck,  color: "#2F6B4F", bg: "#E8F2EC" },
                { label: "CRM Pipeline",        href: "/admin/crm",                 icon: TrendingUp,   color: "#4338CA", bg: "#EEF2FF" },
                { label: "Platform Analytics",  href: "/admin/analytics",           icon: Activity,     color: "#FF5A36", bg: "#FFF0ED" },
                { label: "AI Insights",         href: "/admin/ai-insights",         icon: Sparkles,     color: "#92400E", bg: "#FEF3C7" },
                { label: "Global Grants",       href: "/admin/grants",              icon: Landmark,     color: "#57534E", bg: "#F5F0E8" },
                { label: "Audit Logs",          href: "/admin/audit",               icon: FileText,     color: "#78716A", bg: "#EFE9DF" },
              ].map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-3 p-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl hover:border-[#FF5A36]/40 hover:shadow-sm transition-all group"
                >
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
                    <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} />
                  </div>
                  <span className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors flex-1">{a.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#A8A196] group-hover:text-[#FF5A36] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        {recentActivities.length > 0 && (
          <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#FF5A36]" /> Platform Activity Feed
            </h3>
            <div className="space-y-2">
              {recentActivities.slice(0, 6).map((act: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.04 }}
                  className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 flex items-start gap-3"
                >
                  <div className="h-6 w-6 rounded-full bg-[#FF5A36]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="h-3 w-3 text-[#FF5A36]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#211F1D]">{act.description || act.message}</p>
                    <p className="text-[10px] text-[#A8A196] mt-0.5">{act.timestamp || act.createdAt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Broadcast Modal */}
      <AnimatePresence>
        {broadcastOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setBroadcastOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4 border border-[#E2DCD2]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#FF5A36]/10 flex items-center justify-center">
                    <Radio className="h-4 w-4 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#211F1D]">Global Platform Broadcast</h3>
                    <p className="text-[10px] text-[#78716A]">Message sent to all users across all portals</p>
                  </div>
                </div>
                <button onClick={() => setBroadcastOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#EFE9DF] transition-colors">
                  <X className="h-4 w-4 text-[#A8A196]" />
                </button>
              </div>

              {broadcastDone ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="h-12 w-12 rounded-full bg-[#E8F2EC] flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-[#2F6B4F]" />
                  </div>
                  <p className="text-sm font-extrabold text-[#211F1D]">Broadcast Sent!</p>
                  <p className="text-xs text-[#78716A]">All platform users have been notified.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">
                      Broadcast Message *
                    </label>
                    <textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={4}
                      placeholder="Platform-wide announcement — maintenance windows, new features, policy updates…"
                      className="w-full p-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm resize-none bg-white transition-colors"
                    />
                  </div>
                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-3 mt-4 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#92400E] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#92400E] font-semibold">
                      This message will be immediately sent to all students, experts, and industry partners on the platform.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-5">
                    <button onClick={() => setBroadcastOpen(false)} className="h-9 px-4 border border-[#E2DCD2] text-[#78716A] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={handleSendBroadcast}
                      disabled={!broadcastMessage.trim()}
                      className="h-9 px-5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm shadow-[#FF5A36]/30"
                    >
                      <Send className="h-3.5 w-3.5" /> Send to All Users
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
