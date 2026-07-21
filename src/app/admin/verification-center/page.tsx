"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck, ShieldAlert, Building2, UsersRound, GraduationCap,
  Handshake, Package, Landmark, Code2, FileText, Search, Filter,
  ChevronDown, ChevronUp, Check, X, Clock, AlertTriangle, Eye,
  UserPlus, ArrowUpRight, RefreshCw, Download, MoreHorizontal,
  CheckSquare, Square, ChevronLeft, ChevronRight, Loader2,
  Bell, TrendingUp, BarChart3, Calendar, Radio
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface VerificationRequest {
  id: string;
  orgName: string;
  orgType: string;
  email: string;
  phone: string;
  type: string;
  stage: string;
  priority: string;
  assignedOfficer: string | null;
  riskScore: number;
  fraudFlag: boolean;
  duplicateFlag: boolean;
  submittedAt: string;
  domain: string;
  city: string;
  state: string;
  documentsCount: number;
  documentsApproved: number;
}

interface Stats {
  total: number;
  byType: Record<string, number>;
  byStage: Record<string, number>;
  avgProcessingDays: number;
  approvalRate: number;
  todayApproved: number;
  todayRejected: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const TABS = [
  { key: "ALL", label: "All Requests", icon: ShieldCheck },
  { key: "INDUSTRY", label: "Industries", icon: Building2 },
  { key: "EXPERT", label: "Experts", icon: UsersRound },
  { key: "STUDENT", label: "Students", icon: GraduationCap },
  { key: "PARTNER", label: "Partners", icon: Handshake },
  { key: "VENDOR", label: "Vendors", icon: Package },
  { key: "GOVERNMENT", label: "Government", icon: Landmark },
  { key: "CONTRIBUTOR", label: "Contributors", icon: Code2 },
];

const STAGE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  SUBMITTED:             { label: "Submitted",          color: "text-slate-600",   bg: "bg-slate-100" },
  INITIAL_REVIEW:        { label: "Initial Review",     color: "text-blue-600",    bg: "bg-blue-50" },
  DOCUMENT_VERIFICATION: { label: "Doc Verification",   color: "text-amber-600",   bg: "bg-amber-50" },
  BUSINESS_VALIDATION:   { label: "Business Validation",color: "text-purple-600",  bg: "bg-purple-50" },
  MEETING_SCHEDULED:     { label: "Meeting Scheduled",  color: "text-teal-600",    bg: "bg-teal-50" },
  COMPLIANCE_REVIEW:     { label: "Compliance Review",  color: "text-orange-600",  bg: "bg-orange-50" },
  APPROVAL_COMMITTEE:    { label: "Approval Committee", color: "text-indigo-600",  bg: "bg-indigo-50" },
  APPROVED:              { label: "Approved",           color: "text-green-600",   bg: "bg-green-50" },
  REJECTED:              { label: "Rejected",           color: "text-red-600",     bg: "bg-red-50" },
  ON_HOLD:               { label: "On Hold",            color: "text-yellow-600",  bg: "bg-yellow-50" },
};

const PRIORITY_STYLES: Record<string, { color: string; bg: string; dot: string }> = {
  STANDARD: { color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
  HIGH:     { color: "text-amber-700", bg: "bg-amber-50",  dot: "bg-amber-500" },
  URGENT:   { color: "text-orange-700",bg: "bg-orange-50", dot: "bg-orange-500" },
  CRITICAL: { color: "text-red-700",   bg: "bg-red-50",    dot: "bg-red-500" },
};

const OFFICERS = ["Priya Nair", "Karan Mehta", "Anjali Sharma", "Rohan Das"];

// ─── Sub-components ────────────────────────────────────────────────

function StageBadge({ stage }: { stage: string }) {
  const s = STAGE_LABELS[stage] || { label: stage, color: "text-slate-600", bg: "bg-slate-100" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_STYLES[priority] || PRIORITY_STYLES.STANDARD;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.bg} ${p.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
      {priority}
    </span>
  );
}

function RiskBadge({ score }: { score: number }) {
  const color = score <= 25 ? "text-green-600 bg-green-50" : score <= 50 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  const label = score <= 25 ? "Low" : score <= 50 ? "Medium" : "High";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${color}`}>
      <ShieldAlert className="h-3 w-3" />{label} ({score})
    </span>
  );
}

function DocProgress({ approved, total }: { approved: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((approved / total) * 100);
  const color = pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-500 whitespace-nowrap">{approved}/{total}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function VerificationCenterPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const LIMIT = 15;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab === "ALL" ? "" : activeTab,
        stage: stageFilter === "ALL" ? "" : stageFilter,
        priority: priorityFilter === "ALL" ? "" : priorityFilter,
        search,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(`/api/admin/verification-center?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } finally {
      setLoading(false);
    }
  }, [activeTab, stageFilter, priorityFilter, search, page]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);
  useEffect(() => { setPage(1); setSelected(new Set()); }, [activeTab, stageFilter, priorityFilter, search]);

  const allSelected = requests.length > 0 && requests.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(requests.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulkAction = async (action: string) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await fetch("/api/admin/verification-center", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: [...selected] }),
      });
      setSelected(new Set());
      await fetchRequests();
    } finally {
      setBulkLoading(false);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const sortedRequests = [...requests].sort((a, b) => {
    const aVal = ((a as unknown) as Record<string, string | number | null>)[sortBy] ?? "";
    const bVal = ((b as unknown) as Record<string, string | number | null>)[sortBy] ?? "";
    return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });
  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Verification & Approval Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Review, validate and approve all incoming stakeholder registration requests</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchRequests} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Radio className="h-3.5 w-3.5" /> Broadcast Alert
            </button>
          </div>
        </div>

        {/* ── KPI Summary Row ── */}
        {stats && (
          <div className="mt-4 grid grid-cols-4 lg:grid-cols-8 gap-2">
            {TABS.filter(t => t.key !== "ALL").map((tab) => {
              const Icon = tab.icon;
              const count = stats.byType[tab.key] ?? 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-start px-3 py-2 rounded-xl border transition-all text-left ${activeTab === tab.key ? "border-primary bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${activeTab === tab.key ? "text-primary" : "text-slate-400"}`} />
                    <span className="text-[9px] text-slate-500 uppercase tracking-wide font-semibold">{tab.label}</span>
                  </div>
                  <span className={`text-lg font-extrabold mt-0.5 ${activeTab === tab.key ? "text-primary" : "text-slate-800"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Tab Bar ── */}
          <div className="bg-white border-b border-slate-200 px-8">
            <div className="flex items-center gap-0 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const count = stats?.byType[tab.key] ?? stats?.total ?? 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {tab.key !== "ALL" && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key ? "bg-blue-100 text-primary" : "bg-slate-100 text-slate-500"}`}>
                        {stats?.byType[tab.key] ?? 0}
                      </span>
                    )}
                    {tab.key === "ALL" && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key ? "bg-blue-100 text-primary" : "bg-slate-100 text-slate-500"}`}>
                        {stats?.total ?? 0}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search organization, email, domain…"
                className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <Filter className="h-3.5 w-3.5" /> Filters
              {(stageFilter !== "ALL" || priorityFilter !== "ALL") && (
                <span className="ml-0.5 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {[stageFilter !== "ALL", priorityFilter !== "ALL"].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Bulk actions */}
            <AnimatePresence>
              {selected.size > 0 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">{selected.size} selected</span>
                  <button onClick={() => bulkAction("APPROVE")} disabled={bulkLoading} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    {bulkLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Bulk Approve
                  </button>
                  <button onClick={() => bulkAction("REJECT")} disabled={bulkLoading} className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    <X className="h-3 w-3" /> Bulk Reject
                  </button>
                  <button onClick={() => bulkAction("HOLD")} disabled={bulkLoading} className="h-7 px-3 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Put On Hold
                  </button>
                  <button onClick={() => bulkAction("ASSIGN")} disabled={bulkLoading} className="h-7 px-3 border border-slate-300 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <UserPlus className="h-3 w-3" /> Assign
                  </button>
                  <button onClick={() => setSelected(new Set())} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <span>{total} request{total !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* ── Filter Panel ── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
                <div className="px-8 py-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Stage</label>
                    <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 focus:outline-none focus:border-primary bg-white">
                      <option value="ALL">All Stages</option>
                      {Object.entries(STAGE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Priority</label>
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 focus:outline-none focus:border-primary bg-white">
                      <option value="ALL">All Priorities</option>
                      {Object.keys(PRIORITY_STYLES).map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  {(stageFilter !== "ALL" || priorityFilter !== "ALL") && (
                    <button onClick={() => { setStageFilter("ALL"); setPriorityFilter("ALL"); }} className="text-xs text-primary hover:underline">Clear filters</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Table ── */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <ShieldCheck className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">No requests found</p>
                <p className="text-xs mt-0.5">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full min-w-[900px] text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="w-8 py-3 pl-8 text-left">
                      <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600">
                        {allSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                      </button>
                    </th>
                    {[
                      { key: "orgName", label: "Organization" },
                      { key: "type", label: "Type" },
                      { key: "stage", label: "Stage" },
                      { key: "priority", label: "Priority" },
                      { key: "riskScore", label: "Risk" },
                      { key: "documentsApproved", label: "Docs" },
                      { key: "assignedOfficer", label: "Assigned To" },
                      { key: "submittedAt", label: "Submitted" },
                    ].map((col) => (
                      <th key={col.key} className="py-3 px-3 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort(col.key)}>
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {sortedRequests.map((req, i) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${selected.has(req.id) ? "bg-blue-50/50" : "bg-white"}`}
                      >
                        <td className="py-3 pl-8">
                          <button onClick={() => toggleOne(req.id)} className="text-slate-400 hover:text-slate-600">
                            {selected.has(req.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 truncate max-w-[180px]">{req.orgName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">{req.email}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-slate-400">{req.city}, {req.state}</span>
                            {req.fraudFlag && <span className="px-1 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded">FRAUD FLAG</span>}
                            {req.duplicateFlag && <span className="px-1 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-bold rounded">DUPLICATE</span>}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] text-slate-600 font-medium">{req.type}</span>
                          <div className="text-[10px] text-slate-400 mt-0.5">{req.domain}</div>
                        </td>
                        <td className="py-3 px-3"><StageBadge stage={req.stage} /></td>
                        <td className="py-3 px-3"><PriorityBadge priority={req.priority} /></td>
                        <td className="py-3 px-3"><RiskBadge score={req.riskScore} /></td>
                        <td className="py-3 px-3">
                          <DocProgress approved={req.documentsApproved} total={req.documentsCount} />
                        </td>
                        <td className="py-3 px-3">
                          {req.assignedOfficer ? (
                            <span className="text-[10px] text-slate-700 font-medium">{req.assignedOfficer}</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[10px] text-slate-500">{formatDate(req.submittedAt)}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            <Link href={`/admin/verification-center/${req.id}`}>
                              <button className="h-7 px-2.5 inline-flex items-center gap-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors">
                                <Eye className="h-3 w-3" /> Review
                              </button>
                            </Link>
                            <button
                              onClick={() => setAssignModal(req.id)}
                              className="h-7 w-7 inline-flex items-center justify-center border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <UserPlus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>

          {/* ── Pagination ── */}
          {total > LIMIT && (
            <div className="bg-white border-t border-slate-200 px-8 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: Math.ceil(total / LIMIT) }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`h-7 w-7 flex items-center justify-center border rounded-lg text-xs font-medium transition-colors ${page === i + 1 ? "border-primary bg-primary text-white" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(Math.ceil(total / LIMIT), p + 1))} disabled={page >= Math.ceil(total / LIMIT)} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Stats Panel ── */}
        <aside className="w-64 border-l border-slate-200 bg-white flex-shrink-0 overflow-auto">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Approval Statistics</h3>
          </div>
          {stats && (
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Approval Rate</span>
                  <span className="text-sm font-bold text-green-600">{stats.approvalRate}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.approvalRate}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 border border-green-100 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold text-green-600">{stats.todayApproved}</div>
                  <div className="text-[9px] text-green-500 font-medium">Approved Today</div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-extrabold text-red-500">{stats.todayRejected}</div>
                  <div className="text-[9px] text-red-400 font-medium">Rejected Today</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
                <div className="text-xl font-extrabold text-slate-700">{stats.avgProcessingDays}d</div>
                <div className="text-[9px] text-slate-500 font-medium">Avg. Processing Time</div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Pipeline Stage Breakdown</p>
                <div className="space-y-1.5">
                  {Object.entries(stats.byStage).map(([stage, count]) => {
                    const s = STAGE_LABELS[stage];
                    if (!s || !count) return null;
                    const maxCount = Math.max(...Object.values(stats.byStage));
                    return (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] text-slate-500 truncate max-w-[130px]">{s.label}</span>
                          <span className="text-[10px] font-bold text-slate-700">{count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.bg.replace("bg-", "bg-").replace("-50", "-400")}`} style={{ width: `${(count / maxCount) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Verification Officers</p>
                {OFFICERS.map((officer) => (
                  <div key={officer} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                        {officer.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[10px] text-slate-700">{officer}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {Math.floor(Math.random() * 4) + 1} active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ── Assign Modal ── */}
      <AnimatePresence>
        {assignModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAssignModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-slate-800 mb-4">Assign Verification Officer</h3>
              <div className="space-y-2">
                {OFFICERS.map((officer) => (
                  <button key={officer} onClick={async () => {
                    await fetch("/api/admin/verification-center", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "ASSIGN", ids: [assignModal], assignedOfficer: officer }),
                    });
                    setAssignModal(null);
                    fetchRequests();
                  }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-blue-50 transition-all">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {officer.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{officer}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setAssignModal(null)} className="mt-4 w-full h-8 text-xs text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
