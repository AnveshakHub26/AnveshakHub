"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  UsersRound, Search, Filter, LayoutGrid, List,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  TrendingUp, Star, Award, Calendar, RefreshCw, Download,
  Plus, Eye, ArrowUpRight, Loader2, ShieldCheck, Clock,
  UserPlus, Mail, Phone, MapPin, Building, Check, X,
  AlertTriangle, Play, HelpCircle, HardHat, ShieldAlert, FileText, CheckSquare, Square
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Expert {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  designation: string;
  institution: string;
  department: string | null;
  yearsOfExp: number;
  rating: number;
  availability: "AVAILABLE" | "BUSY" | "ON_LEAVE";
  skills: string[];
  domains: string[];
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  projectsCount: number;
  studentsCount: number;
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  avgRating: number;
  availableCount: number;
  domainsList: string[];
  skillsList: string[];
}

// ─── Constants ─────────────────────────────────────────────────────

const AVAILABILITY_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  AVAILABLE: { label: "Available", color: "text-green-700", bg: "bg-green-50", dot: "bg-green-500" },
  BUSY:      { label: "Busy",      color: "text-amber-700",  bg: "bg-amber-50",  dot: "bg-amber-500" },
  ON_LEAVE:  { label: "On Leave",  color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-500" },
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:    { label: "Active",    color: "text-green-700", bg: "bg-green-50" },
  PENDING:   { label: "Pending",   color: "text-blue-700",  bg: "bg-blue-50" },
  SUSPENDED: { label: "Suspended", color: "text-slate-600", bg: "bg-slate-100" },
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function ExpertDirectoryPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  
  // Table state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [bulkLoading, setBulkLoading] = useState(false);
  
  // Assign Project Modal State
  const [allocatingExpertId, setAllocatingExpertId] = useState<string | null>(null);
  
  const LIMIT = 12;

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        domain: domainFilter === "ALL" ? "" : domainFilter,
        status: statusFilter === "ALL" ? "" : statusFilter,
        availability: availabilityFilter === "ALL" ? "" : availabilityFilter,
        page: String(page),
        limit: String(LIMIT),
        sortBy,
        sortDir,
      });
      const res = await fetch(`/api/admin/experts?${params}`);
      const data = await res.json();
      setExperts(data.experts || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, domainFilter, statusFilter, availabilityFilter, page, sortBy, sortDir]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, domainFilter, statusFilter, availabilityFilter]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const allSelected = experts.length > 0 && experts.every((e) => selected.has(e.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(experts.map((e) => e.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const executeBulkAction = async (action: string) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      // API call
      await new Promise((r) => setTimeout(r, 600));
      setSelected(new Set());
      await fetchExperts();
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
            <h1 className="text-xl font-bold text-slate-900">Expert Advisor Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage academic researchers, technical experts, and project supervisors</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchExperts} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export Data
            </button>
            <Link href="/admin/verification-center">
              <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Onboard Expert
              </button>
            </Link>
          </div>
        </div>

        {/* ── Telemetry Row ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Vetted Experts", value: stats.total, icon: UsersRound, bg: "bg-blue-50", color: "text-primary" },
              { label: "Active Project Leads", value: stats.active, icon: Award, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Average Advisor Rating", value: `${stats.avgRating} / 5.0`, icon: Star, bg: "bg-amber-50", color: "text-amber-600" },
              { label: "Available Today", value: stats.availableCount, icon: Calendar, bg: "bg-green-50", color: "text-green-600" },
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

      {/* ── Filter Toolbar ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts, domains, institutions, skills…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          <Filter className="h-3.5 w-3.5" /> Filters
          {(domainFilter !== "ALL" || statusFilter !== "ALL" || availabilityFilter !== "ALL") && (
            <span className="ml-0.5 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {[domainFilter !== "ALL", statusFilter !== "ALL", availabilityFilter !== "ALL"].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* View mode toggle */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden ml-auto">
          <button onClick={() => setView("grid")} className={`h-8 px-3 flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView("table")} className={`h-8 px-3 flex items-center justify-center transition-colors ${view === "table" ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{selected.size} selected</span>
              <button onClick={() => executeBulkAction("ACTIVATE")} disabled={bulkLoading} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg transition-colors">
                Bulk Activate
              </button>
              <button onClick={() => executeBulkAction("SUSPEND")} disabled={bulkLoading} className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-colors">
                Bulk Suspend
              </button>
              <button onClick={() => setSelected(new Set())} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Advanced Filters ── */}
      <AnimatePresence>
        {showFilters && stats && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Domain</label>
                <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Domains</option>
                  {stats.domainsList.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Availability</label>
                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All States</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
              {(domainFilter !== "ALL" || statusFilter !== "ALL" || availabilityFilter !== "ALL") && (
                <button onClick={() => { setDomainFilter("ALL"); setStatusFilter("ALL"); setAvailabilityFilter("ALL"); }} className="text-xs text-primary hover:underline font-medium">Reset Filters</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : experts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <UsersRound className="h-10 w-10 mb-2" />
            <p className="text-sm font-semibold">No experts found</p>
            <p className="text-xs">Adjust your search criteria and try again.</p>
          </div>
        ) : view === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {experts.map((exp) => {
              const avail = AVAILABILITY_STYLES[exp.availability] || AVAILABILITY_STYLES.AVAILABLE;
              const statusBadge = STATUS_STYLES[exp.status] || STATUS_STYLES.ACTIVE;
              return (
                <motion.div
                  key={exp.id}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                      {exp.user.name.split(" ").slice(0,2).map((n) => n[0]).join("")}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${avail.bg} ${avail.color}`}>
                        <span className={`w-1 h-1 rounded-full ${avail.dot}`} /> {avail.label}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${statusBadge.bg} ${statusBadge.color}`}>{statusBadge.label}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">{exp.user.name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">{exp.designation}</p>
                    <p className="text-[9px] text-slate-400 font-medium truncate">{exp.institution}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">★ {exp.rating}</span>
                    <span>·</span>
                    <span>{exp.yearsOfExp} yrs exp</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {exp.domains.slice(0, 2).map((d) => (
                      <span key={d} className="text-[9px] px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500 font-medium">{d}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{exp.projectsCount}</div>
                      <div className="text-[9px] text-slate-400">Projects</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{exp.studentsCount}</div>
                      <div className="text-[9px] text-slate-400">Interns</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <Link href={`/admin/experts/${exp.id}`} className="flex-1">
                      <button className="w-full h-8 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1">
                        <Eye className="h-3 w-3" /> Profile
                      </button>
                    </Link>
                    <button
                      onClick={() => setAllocatingExpertId(exp.id)}
                      className="h-8 px-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors text-[10px] font-semibold"
                    >
                      Allocate
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Table View */
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
                    { key: "name", label: "Expert Advisor" },
                    { key: "institution", label: "Affiliation" },
                    { key: "rating", label: "Rating" },
                    { key: "yearsOfExp", label: "Experience" },
                    { key: "availability", label: "Availability" },
                    { key: "status", label: "Status" },
                    { key: "projectsCount", label: "Projects" },
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
                {experts.map((exp) => {
                  const avail = AVAILABILITY_STYLES[exp.availability] || AVAILABILITY_STYLES.AVAILABLE;
                  const statusBadge = STATUS_STYLES[exp.status] || STATUS_STYLES.ACTIVE;
                  return (
                    <tr key={exp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pl-5">
                        <button onClick={() => toggleOne(exp.id)} className="text-slate-400 hover:text-slate-600">
                          {selected.has(exp.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{exp.user.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{exp.user.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700">{exp.institution}</div>
                        {exp.department && <div className="text-[10px] text-slate-400">{exp.department}</div>}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">★ {exp.rating}</td>
                      <td className="py-3 px-3 text-slate-600">{exp.yearsOfExp} years</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${avail.bg} ${avail.color}`}>
                          <span className={`w-1 h-1 rounded-full ${avail.dot}`} /> {avail.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${statusBadge.bg} ${statusBadge.color}`}>{statusBadge.label}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700">{exp.projectsCount} active</div>
                        <div className="text-[10px] text-slate-400">{exp.studentsCount} students</div>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/admin/experts/${exp.id}`}>
                            <button className="h-7 px-2.5 bg-primary text-white rounded-lg text-[9px] font-bold hover:bg-blue-700">View</button>
                          </Link>
                          <button onClick={() => setAllocatingExpertId(exp.id)} className="h-7 px-2.5 border border-slate-200 rounded-lg text-[9px] hover:bg-slate-50 font-semibold text-slate-600">Allocate</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Allocation Modal ── */}
      <AnimatePresence>
        {allocatingExpertId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAllocatingExpertId(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-bold text-slate-800 mb-4">Allocate Expert to Project</h3>
              <p className="text-xs text-slate-500 mb-4">Assign expert guide to lead a collaborative industry problem statement.</p>
              
              <div className="space-y-3">
                {[
                  { name: "Solar Micro-Grid for IIT Madras", client: "Solaris Power Pvt Ltd" },
                  { name: "Avionics Telemetry Hub", client: "Vayu Aerospace Solutions" },
                  { name: "Medical Imaging Diagnostic Accelerator", client: "BioGen Diagnostics LLP" }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={async () => {
                      await fetch(`/api/admin/experts/${allocatingExpertId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "ALLOCATE_PROJECT", projectId: `proj-00${idx + 1}` }),
                      });
                      setAllocatingExpertId(null);
                      fetchExperts();
                    }}
                    className="w-full flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-blue-50 transition-all text-left"
                  >
                    <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{p.client}</span>
                  </button>
                ))}
              </div>
              
              <button onClick={() => setAllocatingExpertId(null)} className="mt-4 w-full h-8 text-xs text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
