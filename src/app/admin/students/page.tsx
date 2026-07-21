"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  GraduationCap, Search, Filter, LayoutGrid, List,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  TrendingUp, Award, Calendar, RefreshCw, Download,
  Plus, Eye, ArrowUpRight, Loader2, ShieldCheck, Clock,
  UserPlus, Mail, Phone, MapPin, Building, Check, X,
  AlertTriangle, Play, HelpCircle, HardHat, ShieldAlert, FileText, CheckSquare, Square
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Student {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  usn: string | null;
  institution: string;
  degree: string;
  branch: string;
  semester: number;
  cgpa: number;
  skills: string[];
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  verificationStatus: "APPROVED" | "PENDING" | "REJECTED";
  expertName: string | null;
  industryName: string | null;
  projectName: string | null;
  attendanceRate: number;
  milestonesCount: number;
  milestonesCompleted: number;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  avgCgpa: number;
  matchingRate: number;
  branchesList: string[];
  institutionsList: string[];
}

// ─── Constants ─────────────────────────────────────────────────────

const STATUS_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: "Active",    color: "text-green-700", bg: "bg-green-50" },
  PENDING:   { label: "Pending",   color: "text-blue-700",  bg: "bg-blue-50" },
  SUSPENDED: { label: "Suspended", color: "text-slate-600", bg: "bg-slate-100" },
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  
  // Table state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("cgpa");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [bulkLoading, setBulkLoading] = useState(false);
  
  // Assign Advisor Modal State
  const [assigningAdvisorOpen, setAssigningAdvisorOpen] = useState(false);
  
  const LIMIT = 15;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        branch: branchFilter === "ALL" ? "" : branchFilter,
        status: statusFilter === "ALL" ? "" : statusFilter,
        page: String(page),
        limit: String(LIMIT),
        sortBy,
        sortDir,
      });
      const res = await fetch(`/api/admin/students?${params}`);
      const data = await res.json();
      setStudents(data.students || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, branchFilter, statusFilter, page, sortBy, sortDir]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, branchFilter, statusFilter]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const allSelected = students.length > 0 && students.every((s) => selected.has(s.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(students.map((s) => s.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const executeBulkAction = async (action: string, extra?: object) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: [...selected], ...extra }),
      });
      setSelected(new Set());
      setAssigningAdvisorOpen(false);
      await fetchStudents();
    } catch (e) {
      console.error(e);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Student Intern Pool</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track student placement, guide allocations, project milestones, and attendance</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStudents} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export Data
            </button>
            <Link href="/admin/verification-center">
              <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Verify Student Application
              </button>
            </Link>
          </div>
        </div>

        {/* ── Telemetry Row ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Student Interns", value: stats.total, icon: GraduationCap, bg: "bg-blue-50", color: "text-primary" },
              { label: "Verification Queue", value: stats.pending, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
              { label: "Average CGPA", value: `${stats.avgCgpa} / 10.0`, icon: Award, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Intern Placement Rate", value: `${stats.matchingRate}%`, icon: TrendingUp, bg: "bg-green-50", color: "text-green-600" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-800">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students, university, branch, skills…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
          {(branchFilter !== "ALL" || statusFilter !== "ALL") && (
            <span className="ml-0.5 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {[branchFilter !== "ALL", statusFilter !== "ALL"].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Bulk operations */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{selected.size} selected</span>
              <button onClick={() => setAssigningAdvisorOpen(true)} disabled={bulkLoading} className="h-7 px-3 bg-primary hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1">
                <UserPlus className="h-3 w-3" /> Assign Guide
              </button>
              <button onClick={() => executeBulkAction("ACTIVATE")} disabled={bulkLoading} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-colors">
                Activate
              </button>
              <button onClick={() => setSelected(new Set())} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Filters ── */}
      <AnimatePresence>
        {showFilters && stats && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Branch</label>
                <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Branches</option>
                  {stats.branchesList.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending Verification</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              {(branchFilter !== "ALL" || statusFilter !== "ALL") && (
                <button onClick={() => { setBranchFilter("ALL"); setStatusFilter("ALL"); }} className="text-xs text-primary hover:underline font-semibold">Reset Filters</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table Area ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <GraduationCap className="h-10 w-10 mb-2" />
            <p className="text-sm font-semibold">No student records found</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="w-8 py-3 pl-5 text-left">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                    </button>
                  </th>
                  {[
                    { key: "name", label: "Student Candidate" },
                    { key: "usn", label: "USN / Branch" },
                    { key: "institution", label: "University" },
                    { key: "cgpa", label: "GPA" },
                    { key: "expertName", label: "Assigned Advisor" },
                    { key: "industryName", label: "Industry Attachment" },
                    { key: "attendanceRate", label: "Attendance" },
                    { key: "status", label: "Status" },
                  ].map((col) => (
                    <th key={col.key} className="py-3 px-3 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort(col.key)}>
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </span>
                    </th>
                  ))}
                  <th className="py-3 pr-5 text-right font-semibold text-[10px] text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const statusBadge = STATUS_BADGES[student.status] || STATUS_BADGES.ACTIVE;
                  return (
                    <tr key={student.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-5">
                        <button onClick={() => toggleOne(student.id)} className="text-slate-400 hover:text-slate-600">
                          {selected.has(student.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{student.user.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{student.user.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700">{student.usn || "N/A"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{student.degree} · {student.branch}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{student.institution}</td>
                      <td className="py-3 px-3 font-bold text-slate-700">{student.cgpa}</td>
                      <td className="py-3 px-3">
                        {student.expertName ? (
                          <span className="text-[10px] text-slate-700 font-semibold">{student.expertName}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {student.industryName ? (
                          <span className="text-[10px] text-slate-700 font-semibold">{student.industryName}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-20">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${student.attendanceRate >= 90 ? "bg-green-500" : student.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${student.attendanceRate}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-650">{student.attendanceRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${statusBadge.bg} ${statusBadge.color}`}>{statusBadge.label}</span>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <Link href={`/admin/students/${student.id}`}>
                          <button className="h-7 px-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-bold text-[10px]">Review</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Advisor Assignment Modal ── */}
      <AnimatePresence>
        {assigningAdvisorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAssigningAdvisorOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-slate-800 mb-4">Assign Advisor Guide</h3>
              <p className="text-xs text-slate-500 mb-4">Select guide to supervise the selected student intern(s).</p>
              
              <div className="space-y-2">
                {[
                  { name: "Dr. Arunima Krishnan", id: "exp-001" },
                  { name: "Prof. Rajiv Menon", id: "exp-002" },
                  { name: "Rohan Das", id: "exp-004" }
                ].map((advisor) => (
                  <button
                    key={advisor.id}
                    onClick={() => executeBulkAction("ASSIGN_EXPERT", { expertId: advisor.id })}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {advisor.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{advisor.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setAssigningAdvisorOpen(false)} className="mt-4 w-full h-8 text-xs text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
