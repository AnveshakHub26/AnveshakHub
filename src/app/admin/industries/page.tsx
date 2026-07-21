"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2, Search, Filter, LayoutGrid, List, Map,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  TrendingUp, Users, Briefcase, Star, Download, Plus,
  Eye, ArrowUpRight, Loader2, Globe, MapPin, RefreshCw,
  CheckCircle2, Clock, Zap, Award, Target, BarChart2, X
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Industry {
  id: string;
  orgName: string;
  orgType: string;
  email: string;
  phone: string;
  website: string;
  industryDomain: string;
  businessCategory: string;
  state: string;
  city: string;
  verificationStatus: string;
  lifecycle: string;
  engagementScore: number;
  collaborationScore: number;
  totalProjects: number;
  activeProjects: number;
  expertsAssigned: number;
  studentsAssigned: number;
  totalRevenue: number;
  approvedAt: string;
  tags: string[];
}

interface Stats {
  total: number;
  active: number;
  longTermPartners: number;
  avgEngagement: number;
  domains: string[];
  states: string[];
}

// ─── Constants ─────────────────────────────────────────────────────

const LIFECYCLE_STYLES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  REGISTERED:         { label: "Registered",         color: "text-slate-600",   bg: "bg-slate-100",  dot: "bg-slate-400" },
  VERIFIED:           { label: "Verified",            color: "text-blue-600",    bg: "bg-blue-50",    dot: "bg-blue-500" },
  MEETING_COMPLETED:  { label: "Meeting Done",        color: "text-teal-600",    bg: "bg-teal-50",    dot: "bg-teal-500" },
  OPPORTUNITY_CREATED:{ label: "Opportunity",         color: "text-purple-600",  bg: "bg-purple-50",  dot: "bg-purple-500" },
  EXPERTS_ASSIGNED:   { label: "Experts Assigned",    color: "text-amber-600",   bg: "bg-amber-50",   dot: "bg-amber-500" },
  PROJECT_STARTED:    { label: "Project Active",      color: "text-green-700",   bg: "bg-green-50",   dot: "bg-green-500" },
  PROJECT_COMPLETED:  { label: "Project Completed",   color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  LONG_TERM_PARTNER:  { label: "Long-term Partner",   color: "text-indigo-700",  bg: "bg-indigo-50",  dot: "bg-indigo-500" },
};

const DOMAIN_COLORS: Record<string, string> = {
  "Clean Energy": "bg-green-100 text-green-700",
  "Drone Research": "bg-sky-100 text-sky-700",
  "BioTech Research": "bg-pink-100 text-pink-700",
  "Aerospace": "bg-indigo-100 text-indigo-700",
  "IT Infrastructure": "bg-slate-100 text-slate-700",
};

// ─── Sub-components ────────────────────────────────────────────────

function LifecycleBadge({ lifecycle }: { lifecycle: string }) {
  const s = LIFECYCLE_STYLES[lifecycle] || LIFECYCLE_STYLES.REGISTERED;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-600 w-6 text-right">{score}</span>
    </div>
  );
}

function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <motion.div whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 transition-all">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <LifecycleBadge lifecycle={industry.lifecycle} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800 leading-tight">{industry.orgName}</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">{industry.orgType}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] text-slate-500">{industry.city}, {industry.state}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${DOMAIN_COLORS[industry.industryDomain] || "bg-slate-100 text-slate-600"}`}>
          {industry.industryDomain}
        </span>
        {industry.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">#{tag}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
          <span>Engagement</span><span className="font-semibold text-slate-700">{industry.engagementScore}%</span>
        </div>
        <ScoreBar score={industry.engagementScore} color={industry.engagementScore >= 80 ? "bg-green-500" : industry.engagementScore >= 60 ? "bg-amber-500" : "bg-red-400"} />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
        <div className="text-center">
          <div className="text-sm font-extrabold text-slate-800">{industry.totalProjects}</div>
          <div className="text-[9px] text-slate-500">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-slate-800">{industry.expertsAssigned}</div>
          <div className="text-[9px] text-slate-500">Experts</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-slate-800">{industry.studentsAssigned}</div>
          <div className="text-[9px] text-slate-500">Students</div>
        </div>
      </div>
      <Link href={`/admin/industries/${industry.id}`}>
        <button className="w-full h-7 bg-primary text-white rounded-xl text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
          <Eye className="h-3 w-3" /> View Profile
        </button>
      </Link>
    </motion.div>
  );
}

function MapView({ industries }: { industries: Industry[] }) {
  const byState: Record<string, Industry[]> = {};
  industries.forEach((i) => {
    if (!byState[i.state]) byState[i.state] = [];
    byState[i.state].push(i);
  });
  return (
    <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(byState).map(([state, inds]) => (
        <motion.div key={state} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-800">{state}</h3>
            <span className="ml-auto text-[10px] px-2 py-0.5 bg-blue-50 text-primary rounded-full font-semibold">{inds.length}</span>
          </div>
          <div className="space-y-2">
            {inds.map((ind) => (
              <Link key={ind.id} href={`/admin/industries/${ind.id}`}>
                <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 truncate">{ind.orgName}</p>
                    <p className="text-[9px] text-slate-500">{ind.industryDomain}</p>
                  </div>
                  <LifecycleBadge lifecycle={ind.lifecycle} />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "card" | "map">("table");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("engagementScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const LIMIT = 20;

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, domain: domainFilter, lifecycle: lifecycleFilter, state: stateFilter, page: String(page), limit: String(LIMIT), sortBy, sortDir });
      const res = await fetch(`/api/admin/industries?${params}`);
      const data = await res.json();
      setIndustries(data.industries || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } finally {
      setLoading(false);
    }
  }, [search, domainFilter, lifecycleFilter, stateFilter, page, sortBy, sortDir]);

  useEffect(() => { fetchIndustries(); }, [fetchIndustries]);
  useEffect(() => { setPage(1); }, [search, domainFilter, lifecycleFilter, stateFilter]);

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const formatRevenue = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Industry Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage all verified industry partners across the AnveshakHub ecosystem</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchIndustries} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <Link href="/admin/verification-center">
              <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Onboard Industry
              </button>
            </Link>
          </div>
        </div>

        {/* ── KPI Row ── */}
        {stats && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { label: "Total Industries", value: stats.total, icon: Building2, color: "text-primary", bg: "bg-blue-50" },
              { label: "Active Partners", value: stats.active, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Long-term Partners", value: stats.longTermPartners, icon: Award, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Avg Engagement", value: `${stats.avgEngagement}%`, icon: Target, color: "text-green-600", bg: "bg-green-50" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className={`flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white`}>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${kpi.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-slate-800">{kpi.value}</div>
                    <div className="text-[10px] text-slate-500">{kpi.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, domain, city…" className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <Filter className="h-3.5 w-3.5" /> Filters
          {(domainFilter || lifecycleFilter || stateFilter) && (
            <span className="ml-0.5 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {[domainFilter, lifecycleFilter, stateFilter].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* View Switcher */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden ml-auto">
          {[
            { key: "table", icon: List },
            { key: "card", icon: LayoutGrid },
            { key: "map", icon: Map },
          ].map(({ key, icon: Icon }) => (
            <button key={key} onClick={() => setView(key as "table" | "card" | "map")} className={`h-8 px-2.5 flex items-center justify-center transition-colors ${view === key ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">{total} partner{total !== 1 ? "s" : ""}</span>
      </div>

      {/* ── Filters ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3 flex flex-wrap items-center gap-4">
              {[
                { label: "Domain", value: domainFilter, onChange: setDomainFilter, options: stats?.domains || [] },
                { label: "Lifecycle", value: lifecycleFilter, onChange: setLifecycleFilter, options: Object.keys(LIFECYCLE_STYLES) },
                { label: "State", value: stateFilter, onChange: setStateFilter, options: stats?.states || [] },
              ].map(({ label, value, onChange, options }) => (
                <div key={label} className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
                  <select value={value} onChange={(e) => onChange(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                    <option value="">All {label}s</option>
                    {options.map((o) => <option key={o} value={o}>{LIFECYCLE_STYLES[o]?.label || o}</option>)}
                  </select>
                </div>
              ))}
              {(domainFilter || lifecycleFilter || stateFilter) && (
                <button onClick={() => { setDomainFilter(""); setLifecycleFilter(""); setStateFilter(""); }} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : industries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Building2 className="h-10 w-10 mb-2" /><p className="text-sm font-medium">No industries found</p>
          </div>
        ) : view === "card" ? (
          <div className="p-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {industries.map((ind, i) => (
              <motion.div key={ind.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <IndustryCard industry={ind} />
              </motion.div>
            ))}
          </div>
        ) : view === "map" ? (
          <MapView industries={industries} />
        ) : (
          /* Table View */
          <table className="w-full min-w-[900px] text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  { key: "orgName", label: "Organization" },
                  { key: "industryDomain", label: "Domain" },
                  { key: "lifecycle", label: "Lifecycle" },
                  { key: "engagementScore", label: "Engagement" },
                  { key: "totalProjects", label: "Projects" },
                  { key: "expertsAssigned", label: "Experts" },
                  { key: "totalRevenue", label: "Revenue" },
                  { key: "approvedAt", label: "Member Since" },
                ].map((col) => (
                  <th key={col.key} className="py-3 px-4 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none" onClick={() => toggleSort(col.key)}>
                    <span className="flex items-center gap-1">{col.label} {sortBy === col.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}</span>
                  </th>
                ))}
                <th className="py-3 px-4 text-left font-semibold text-[10px] text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {industries.map((ind, i) => (
                  <motion.tr key={ind.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-slate-100 bg-white hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{ind.orgName}</div>
                          <div className="text-[10px] text-slate-400">{ind.city}, {ind.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${DOMAIN_COLORS[ind.industryDomain] || "bg-slate-100 text-slate-600"}`}>{ind.industryDomain}</span>
                    </td>
                    <td className="py-3 px-4"><LifecycleBadge lifecycle={ind.lifecycle} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 w-28">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ind.engagementScore >= 80 ? "bg-green-500" : ind.engagementScore >= 60 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${ind.engagementScore}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{ind.engagementScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-slate-700">{ind.totalProjects}</div>
                      <div className="text-[9px] text-slate-400">{ind.activeProjects} active</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-slate-700">{ind.expertsAssigned}</div>
                      <div className="text-[9px] text-slate-400">{ind.studentsAssigned} students</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 text-xs">{formatRevenue(ind.totalRevenue)}</td>
                    <td className="py-3 px-4 text-[10px] text-slate-500">
                      {new Date(ind.approvedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/industries/${ind.id}`}>
                        <button className="h-7 px-3 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" /> View
                        </button>
                      </Link>
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
              <button key={i} onClick={() => setPage(i + 1)} className={`h-7 w-7 flex items-center justify-center border rounded-lg text-xs font-medium transition-colors ${page === i + 1 ? "border-primary bg-primary text-white" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(Math.ceil(total / LIMIT), p + 1))} disabled={page >= Math.ceil(total / LIMIT)} className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
