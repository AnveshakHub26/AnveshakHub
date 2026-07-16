"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2, UsersRound, GraduationCap, Briefcase, Calendar, Landmark,
  Wallet, HardHat, RefreshCw, Plus, Radio, CheckSquare, ShieldCheck,
  CheckCircle2, XCircle, ChevronRight, AlertTriangle, AlertCircle, Play,
  Wifi, ShieldAlert, FileText, ChevronDown, Check, X, FileSignature, Sparkles,
  Loader2, Send
} from "lucide-react";

// Reusable Types
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // States loaded from backend REST APIs
  const [kpis, setKpis] = useState<Record<string, KPIItem>>({});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [queue, setQueue] = useState<VerificationItem[]>([]);

  // Drawer / Detail modal selection
  const [selectedVerifyItem, setSelectedVerifyItem] = useState<VerificationItem | null>(null);
  const [verifyDrawerOpen, setVerifyDrawerOpen] = useState(false);
  const [verifyActionLoading, setVerifyActionLoading] = useState(false);

  // Broadcast Modal State
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Load metrics from REST API
  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        setKpis(data.kpis);
        setRecentActivities(data.recentActivities);
        setMeetings(data.meetings);
        setServices(data.services);
        setSystemStatus(data.systemStatus);
      }

      const qRes = await fetch("/api/admin/verify");
      const qData = await qRes.json();
      if (qRes.ok) {
        setQueue(qData.queue);
      }
    } catch (e) {
      console.error("Failed to load dashboard metrics", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMetrics();
  };

  // Quick Verification Actions (Approve / Reject)
  const handleVerifyAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setVerifyActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, comment: "Processed via Admin Action dashboard" })
      });
      if (res.ok) {
        // Remove from local list
        setQueue(prev => prev.filter(item => item.id !== id));
        setVerifyDrawerOpen(false);
        // Refresh KPIs to update totals
        loadMetrics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyActionLoading(false);
    }
  };

  // Broadcast submit API
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setVerifyActionLoading(true);
    setTimeout(() => {
      setVerifyActionLoading(false);
      setBroadcastDone(true);
      setBroadcastMessage("");
      setTimeout(() => {
        setBroadcastDone(false);
        setBroadcastOpen(false);
      }, 1500);
    }, 1200);
  };

  // Skeletons while loading initially
  if (loading) {
    return (
      <div className="p-8 space-y-6 flex-grow">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex-grow relative z-10">
      
      {/* ── Dashboard Hero / Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-secondary tracking-tight">Executive Control Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Platform telemetry, operational compliance review, and CRM pipelines metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={["h-3.5 w-3.5", refreshing ? "animate-spin" : ""].join(" ")} />
            Sync Telemetry
          </button>
          <button
            onClick={() => setBroadcastOpen(true)}
            className="h-9 px-4 inline-flex items-center gap-1.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Radio className="h-3.5 w-3.5" />
            Broadcast Notification
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: "totalIndustries", label: "Total Partners", icon: Building2, color: "text-blue-600 bg-blue-50" },
          { key: "pendingIndustries", label: "Pending Verification", icon: FileSignature, color: "text-amber-600 bg-amber-50" },
          { key: "approvedExperts", label: "Certified Experts", icon: UsersRound, color: "text-purple-600 bg-purple-50" },
          { key: "activeProjects", label: "Ongoing Projects", icon: Briefcase, color: "text-emerald-600 bg-emerald-50" },
          { key: "revenue", label: "Monthly Revenue", icon: Wallet, color: "text-slate-600 bg-slate-50" }
        ].map(({ key, label, icon: Icon, color }) => {
          const item = kpis[key];
          if (!item) return null;
          return (
            <div key={key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{item.count}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className={[
                  "text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5",
                  item.change > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  item.change < 0 ? "bg-red-50 text-red-700 border-red-100" : "bg-slate-50 text-slate-500 border-slate-100"
                ].join(" ")}>
                  {item.change > 0 ? "+" : ""}{item.change}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold">Monthly Rate</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full mt-3.5 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Analytics Row (Custom SVGs) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Industry Growth Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider">Industry & Expert Onboarding Trend</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Monthly registration counts for Q1-Q2 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] font-black text-slate-500">
                <span className="h-2 w-2 rounded-full bg-primary block" /> Industry
              </span>
              <span className="flex items-center gap-1 text-[9px] font-black text-slate-500">
                <span className="h-2 w-2 rounded-full bg-purple-500 block" /> Experts
              </span>
            </div>
          </div>

          {/* SVG Chart area */}
          <div className="my-6">
            <svg viewBox="0 0 500 160" className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Data points paths */}
              {/* Industry Line (Primary Blue) */}
              <path
                d="M 30 130 Q 120 90, 210 110 T 390 50 T 480 30"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Expert Line (Purple) */}
              <path
                d="M 30 140 Q 120 120, 210 98 T 390 70 T 480 58"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Markers */}
              {[
                { cx: 30, cy: 130, v: 42, label: "Jan" },
                { cx: 120, cy: 90, v: 84, label: "Feb" },
                { cx: 210, cy: 110, v: 72, label: "Mar" },
                { cx: 300, cy: 70, v: 120, label: "Apr" },
                { cx: 390, cy: 50, v: 140, label: "May" },
                { cx: 480, cy: 30, v: 180, label: "Jun" }
              ].map((pt) => (
                <g key={pt.label} className="group cursor-pointer">
                  <circle cx={pt.cx} cy={pt.cy} r="4" fill="#2563EB" stroke="white" strokeWidth="1" />
                  <text x={pt.cx} y="156" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">{pt.label}</text>
                  <text x={pt.cx} y={pt.cy - 8} textAnchor="middle" fontSize="8" fill="#2563EB" fontWeight="black" className="opacity-0 group-hover:opacity-100 transition-opacity">{pt.v}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-slate-450 border-t border-slate-100 pt-3">
            <span>Overall average platform conversion: <span className="text-primary font-black">82%</span></span>
            <a href="#" className="text-primary hover:underline">Download Detailed CSV</a>
          </div>
        </div>

        {/* System telemetry status side grid */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <HardHat className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider">Telemetry Monitoring</h2>
          </div>

          <div className="space-y-4 flex-grow flex flex-col justify-center">
            {[
              { label: "CPU Compute Load", value: systemStatus.cpu, status: "Normal" },
              { label: "RAM Utilization", value: systemStatus.memory, status: "Normal" },
              { label: "Storage Capacity", value: systemStatus.disk, status: "Safe" }
            ].map(({ label, value, status }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-secondary">{value}% ({status})</span>
                </div>
                <div className="h-2 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.6 }}
                    className={[
                      "h-full rounded-full",
                      value > 80 ? "bg-red-500" : value > 60 ? "bg-amber-500" : "bg-primary"
                    ].join(" ")}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-[9px] font-black text-slate-450">
            <div>
              <p>API LATENCY</p>
              <p className="text-sm text-secondary font-black mt-0.5">{systemStatus.apiResponseMs}ms</p>
            </div>
            <div>
              <p>REDIS HITRATE</p>
              <p className="text-sm text-secondary font-black mt-0.5">{systemStatus.cacheHitRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Verification Queue & Meetings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Compliance Verification Queue Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                Compliance Verification Queue
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Approve or audit registered organizations before activation</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-250 px-2 py-0.5 rounded-full">
              {queue.length} Awaiting
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-5">Organization</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Action Required</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.length > 0 ? (
                  queue.map((item) => (
                    <tr key={item.id} className="text-xs hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-bold text-slate-800">{item.orgName}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.type} · Submitted {item.submittedAt}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{item.domain}</td>
                      <td className="py-3.5 px-4">
                        <span className={[
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          item.documentStatus === "UPLOADED" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                          item.documentStatus === "UNDER_REVIEW" ? "bg-blue-50 text-primary border-blue-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        ].join(" ")}>
                          {item.documentStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={[
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                          item.priority === "HIGH" ? "bg-red-50 text-red-700 border-red-200" : "bg-slate-100 text-slate-500 border-slate-200"
                        ].join(" ")}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedVerifyItem(item); setVerifyDrawerOpen(true); }}
                          className="h-8 px-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-[10px] font-bold shadow-sm cursor-pointer"
                        >
                          Audit Details
                        </button>
                        <button
                          onClick={() => handleVerifyAction(item.id, "APPROVE")}
                          className="h-8 w-8 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                          aria-label="Quick Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">
                      All organization verifications have been fully audited and completed.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Services Checklist & Logs */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-xs font-extrabold text-secondary uppercase tracking-wider">Service Clusters Status</h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-pulse" />
            </div>
            <div className="space-y-3">
              {services.map(s => (
                <div key={s.name} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-650 font-bold">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400">{s.latencyMs}ms</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Meeting Calendar</p>
            <div className="space-y-2">
              {meetings.map(m => (
                <div key={m.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-750 truncate">{m.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{m.time} · {m.participants.join(", ")}</p>
                  </div>
                  <a
                    href={m.link} target="_blank" rel="noopener noreferrer"
                    className="h-8 px-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider inline-flex items-center shrink-0"
                  >
                    Join Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Action Log timeline ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Control Log Audit timeline</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          {recentActivities.map((act) => (
            <div key={act.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between h-28 relative">
              <div>
                <span className="text-[9px] font-black text-primary uppercase tracking-wider">{act.category}</span>
                <h4 className="text-xs font-bold text-slate-800 mt-1">{act.event}</h4>
                <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{act.description}</p>
              </div>
              <span className="text-[9px] text-slate-400 font-bold block mt-3">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Auditing details Side Drawer modal ── */}
      <Dialog.Root open={verifyDrawerOpen} onOpenChange={setVerifyDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl focus:outline-none p-8 overflow-y-auto"
            aria-describedby="drawer-desc"
          >
            {selectedVerifyItem && (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Compliance Audit</span>
                    <Dialog.Title className="text-sm font-extrabold text-secondary mt-1">{selectedVerifyItem.orgName}</Dialog.Title>
                    <p id="drawer-desc" className="text-[10px] text-slate-400 font-semibold mt-0.5">Registration Ref: {selectedVerifyItem.id}</p>
                  </div>
                  <Dialog.Close asChild>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors">
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  {/* Org summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    {[
                      { label: "Legal Entity Type", value: selectedVerifyItem.type },
                      { label: "Industry Vertical", value: selectedVerifyItem.domain },
                      { label: "Submission Date", value: selectedVerifyItem.submittedAt },
                      { label: "Document Registry Check", value: selectedVerifyItem.documentStatus }
                    ].map(field => (
                      <div key={field.label} className="flex justify-between items-center text-xs">
                        <span className="text-slate-450 font-semibold">{field.label}</span>
                        <span className="text-slate-800 font-bold text-right">{field.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Documents uploaded list */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">Submitted Credentials Verification</h4>
                    <div className="space-y-2.5">
                      {[
                        "Certificate of Incorporation (CIN).pdf",
                        "Tax Registration & GSTIN.pdf",
                        "DPIIT Certificate (Startup Only).pdf"
                      ].map(docName => (
                        <div key={docName} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-primary transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                            <span className="text-xs text-slate-700 font-bold truncate">{docName}</span>
                          </div>
                          <a href="#" className="text-[9px] font-black text-primary uppercase tracking-wider hover:underline shrink-0">Preview Document</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational warnings */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-2.5">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                      Approved organizations gain automatic access credentials to post projects, assign experts and claim government grant pipelines. Ensure all statutory records check out.
                    </p>
                  </div>

                  {/* Drawer CTA actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleVerifyAction(selectedVerifyItem.id, "REJECT")}
                      disabled={verifyActionLoading}
                      className="h-11 px-5 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Profile
                    </button>
                    <button
                      onClick={() => handleVerifyAction(selectedVerifyItem.id, "APPROVE")}
                      disabled={verifyActionLoading}
                      className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {verifyActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShieldCheck className="h-4.5 w-4.5" /> Confirm Compliance & Approve</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Broadcast Message Modal ── */}
      <Dialog.Root open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none px-4"
            aria-describedby="broadcast-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Radio className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <Dialog.Title className="text-sm font-extrabold text-secondary">Broadcast System Announcement</Dialog.Title>
                    <p id="broadcast-desc" className="text-[10px] text-slate-400 mt-0.5">Send alerts to all registered system stakeholders</p>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="p-6">
                {!broadcastDone ? (
                  <form onSubmit={handleBroadcast} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notification Banner Text</label>
                      <textarea
                        required
                        rows={4}
                        value={broadcastMessage}
                        onChange={e => setBroadcastMessage(e.target.value)}
                        placeholder="Type system alert messages here..."
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>
                    <div className="flex gap-3 justify-end pt-1">
                      <Dialog.Close asChild>
                        <button type="button" className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={verifyActionLoading}
                        className="h-9 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        {verifyActionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Send className="h-3.5 w-3.5" /> Send Broadcast</>}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-100 mb-4">
                      <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-extrabold text-secondary">Broadcast Complete</h3>
                    <p className="text-xs text-slate-500 mt-2">Notification has been successfully queued for dissemination.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
