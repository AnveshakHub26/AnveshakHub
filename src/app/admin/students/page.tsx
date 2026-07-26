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
  ACTIVE:    { label: "Active",    color: "text-[#2F6B4F]", bg: "bg-[#E8F2EC]" },
  PENDING:   { label: "Pending",   color: "text-[#FF5A36]",  bg: "bg-[#FFF0ED]" },
  SUSPENDED: { label: "Suspended", color: "text-[#57534E]", bg: "bg-[#EFE9DF]" },
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
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Page Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Student Intern Pool</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Track student placement, guide allocations, project milestones, and attendance</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchStudents} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <Download className="h-3.5 w-3.5" /> Export Data
            </button>
            <Link href="/admin/verification-center">
              <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] transition-colors">
                <Plus className="h-3.5 w-3.5" /> Verify Student Application
              </button>
            </Link>
          </div>
        </div>

        {/* ── Telemetry Row ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Student Interns", value: stats.total, icon: GraduationCap, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
              { label: "Verification Queue", value: stats.pending, icon: Clock, bg: "bg-[#FEF3C7]", color: "text-amber-600" },
              { label: "Average CGPA", value: `${stats.avgCgpa} / 10.0`, icon: Award, bg: "bg-[#FF5A36]/50", color: "text-[#FF5A36]/600" },
              { label: "Intern Placement Rate", value: `${stats.matchingRate}%`, icon: TrendingUp, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
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
            placeholder="Search students, university, branch, skills…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-[#FF5A36] bg-[#FFF0ED] text-[#FF5A36]" : "border-[#E2DCD2] text-[#57534E] hover:bg-[#EFE9DF]"}`}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
          {(branchFilter !== "ALL" || statusFilter !== "ALL") && (
            <span className="ml-0.5 w-4 h-4 bg-[#FF5A36] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {[branchFilter !== "ALL", statusFilter !== "ALL"].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Bulk operations */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <span className="text-xs text-[#78716A] font-medium">{selected.size} selected</span>
              <button onClick={() => setAssigningAdvisorOpen(true)} disabled={bulkLoading} className="h-7 px-3 bg-[#FF5A36] hover:bg-[#E04826] text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1">
                <UserPlus className="h-3 w-3" /> Assign Guide
              </button>
              <button onClick={() => executeBulkAction("ACTIVATE")} disabled={bulkLoading} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-colors">
                Activate
              </button>
              <button onClick={() => setSelected(new Set())} className="h-7 w-7 flex items-center justify-center border border-[#E2DCD2] rounded-lg text-[#A8A196] hover:text-[#57534E] hover:bg-[#EFE9DF]">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Filters ── */}
      <AnimatePresence>
        {showFilters && stats && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#FBF7F0] border-b border-[#E2DCD2]">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">Branch</label>
                <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-7 text-xs border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36]">
                  <option value="ALL">All Branches</option>
                  {stats.branchesList.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-7 text-xs border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36]">
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending Verification</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              {(branchFilter !== "ALL" || statusFilter !== "ALL") && (
                <button onClick={() => { setBranchFilter("ALL"); setStatusFilter("ALL"); }} className="text-xs text-[#FF5A36] hover:underline font-semibold">Reset Filters</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table Area ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#A8A196]">
            <GraduationCap className="h-10 w-10 mb-2" />
            <p className="text-sm font-semibold">No student records found</p>
          </div>
        ) : (
          <div className="card-flat rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FBF7F0] border-b border-[#E2DCD2]">
                  <th className="w-8 py-3 pl-5 text-left">
                    <button onClick={toggleAll} className="text-[#A8A196] hover:text-[#57534E]">
                      {allSelected ? <CheckSquare className="h-4 w-4 text-[#FF5A36]" /> : <Square className="h-4 w-4" />}
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
                    <th key={col.key} className="py-3 px-3 text-left font-semibold text-[10px] text-[#78716A] uppercase tracking-wide cursor-pointer hover:text-[#211F1D] select-none" onClick={() => toggleSort(col.key)}>
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                      </span>
                    </th>
                  ))}
                  <th className="py-3 pr-5 text-right font-semibold text-[10px] text-[#78716A] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const statusBadge = STATUS_BADGES[student.status] || STATUS_BADGES.ACTIVE;
                  return (
                    <tr key={student.id} className="border-b border-[#E2DCD2] last:border-0 hover:bg-[#EFE9DF]/50 transition-colors">
                      <td className="py-3 pl-5">
                        <button onClick={() => toggleOne(student.id)} className="text-[#A8A196] hover:text-[#57534E]">
                          {selected.has(student.id) ? <CheckSquare className="h-4 w-4 text-[#FF5A36]" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#211F1D]">{student.user.name}</div>
                        <div className="text-[10px] text-[#A8A196] mt-0.5">{student.user.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#211F1D]">{student.usn || "N/A"}</div>
                        <div className="text-[10px] text-[#A8A196] mt-0.5">{student.degree} · {student.branch}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#211F1D]">{student.institution}</td>
                      <td className="py-3 px-3 font-bold text-[#211F1D]">{student.cgpa}</td>
                      <td className="py-3 px-3">
                        {student.expertName ? (
                          <span className="text-[10px] text-[#211F1D] font-semibold">{student.expertName}</span>
                        ) : (
                          <span className="text-[10px] text-[#A8A196] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {student.industryName ? (
                          <span className="text-[10px] text-[#211F1D] font-semibold">{student.industryName}</span>
                        ) : (
                          <span className="text-[10px] text-[#A8A196] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-20">
                          <div className="flex-1 h-1.5 bg-[#EFE9DF] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${student.attendanceRate >= 90 ? "bg-[#E8F2EC]0" : student.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${student.attendanceRate}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-[#57534E]">{student.attendanceRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${statusBadge.bg} ${statusBadge.color}`}>{statusBadge.label}</span>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <Link href={`/admin/students/${student.id}`}>
                          <button className="h-7 px-3 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-lg font-bold text-[10px]">Review</button>
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
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-[#211F1D] mb-4">Assign Advisor Guide</h3>
              <p className="text-xs text-[#78716A] mb-4">Select guide to supervise the selected student intern(s).</p>
              
              <div className="space-y-2">
                {[
                  { name: "Dr. Arunima Krishnan", id: "exp-001" },
                  { name: "Prof. Rajiv Menon", id: "exp-002" },
                  { name: "Rohan Das", id: "exp-004" }
                ].map((advisor) => (
                  <button
                    key={advisor.id}
                    onClick={() => executeBulkAction("ASSIGN_EXPERT", { expertId: advisor.id })}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E2DCD2] hover:border-[#FF5A36] hover:bg-[#FFF0ED] transition-all text-left"
                  >
                    <div className="h-7 w-7 rounded-lg bg-[#FF5A36]/10 flex items-center justify-center text-xs font-bold text-[#FF5A36]">
                      {advisor.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <span className="text-xs font-semibold text-[#211F1D]">{advisor.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setAssigningAdvisorOpen(false)} className="mt-4 w-full h-8 text-xs text-[#78716A] border border-[#E2DCD2] rounded-xl hover:bg-[#FBF7F0] transition-colors">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
