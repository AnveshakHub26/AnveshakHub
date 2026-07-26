"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Landmark, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Grant {
  id: string;
  title: string;
  description: string;
  agency: string;
  schemeType: string;
  amount: number;
  eligibility: string[];
  dueDate: string;
  status: string;
  applicationsCount: number;
}

interface Stats {
  total: number;
  totalFunding: number;
  applicationsCount: number;
  openCount: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const SCHEME_TYPES: Record<string, string> = {
  GOVT_GRANT: "Government Grant",
  GOVT_SCHEME: "Government Scheme",
  CSR_FUNDING: "CSR Funding",
  STARTUP_INDIA: "Startup India Program",
  MSME_SCHEME: "MSME Scheme",
  INNOVATION_CHALLENGE: "Innovation Challenge",
  RESEARCH_FUNDING: "Research Funding",
  UNIVERSITY_GRANT: "University Grant",
  INCUBATION_PROGRAM: "Incubation Program",
  ACCELERATOR_PROGRAM: "Accelerator Program",
  INVESTOR_OPP: "Investor Opportunity"
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function GrantsConsoleHub() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("schemes"); // schemes, applications, eligibility

  // Eligibility wizard
  const [eligOpen, setEligOpen] = useState(false);
  const [eligDpiit, setEligDpiit] = useState(true);
  const [eligMou, setEligMou] = useState(true);
  const [eligTrl, setEligTrl] = useState("TRL-5");
  const [eligResult, setEligResult] = useState<number | null>(null);

  // Publish scheme modal state
  const [publishOpen, setPublishOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubDesc, setPubDesc] = useState("");
  const [pubAgency, setPubAgency] = useState("");
  const [pubSchemeType, setPubSchemeType] = useState("GOVT_GRANT");
  const [pubAmount, setPubAmount] = useState("");
  const [pubElig, setPubElig] = useState("");
  const [pubDueDate, setPubDueDate] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchGrants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        agency: agencyFilter === "ALL" ? "" : agencyFilter,
        page: String(page),
        limit: String(LIMIT)
      });
      const res = await fetch(`/api/admin/grants?${params}`);
      const data = await res.json();
      let list: Grant[] = data.grants || [];

      if (typeFilter !== "ALL") {
        list = list.filter(g => g.schemeType === typeFilter);
      }

      setGrants(list);
      setTotal(list.length);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, agencyFilter, typeFilter, page]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const handlePublishGrant = async () => {
    if (!pubTitle || !pubAmount || !pubAgency) return;
    setPublishLoading(true);
    try {
      await fetch("/api/admin/grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pubTitle,
          description: pubDesc,
          agency: pubAgency,
          schemeType: pubSchemeType,
          amount: parseFloat(pubAmount),
          eligibility: pubElig.split(",").map(e => e.trim()).filter(Boolean),
          dueDate: pubDueDate ? new Date(pubDueDate).toISOString() : null
        })
      });
      setPublishOpen(false);
      setPubTitle("");
      setPubDesc("");
      setPubAgency("");
      setPubAmount("");
      setPubElig("");
      setPubDueDate("");
      await fetchGrants();
    } catch (e) {
      console.error(e);
    } finally {
      setPublishLoading(false);
    }
  };

  const calculateEligibility = () => {
    let score = 0;
    if (eligDpiit) score += 40;
    if (eligMou) score += 30;
    if (eligTrl === "TRL-5" || eligTrl === "TRL-6") score += 30;
    else if (eligTrl === "TRL-4") score += 15;
    setEligResult(score);
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Government Grants & Funding Management</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Track innovation schemes, Startup India allocations, research funding, CSR pipelines, and committee scores</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEligOpen(true)} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-semibold hover:bg-[#FBF7F0] transition-colors">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-current" /> Eligibility Checker
            </button>
            <button onClick={fetchGrants} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setPublishOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] transition-colors">
              <Plus className="h-3.5 w-3.5" /> Publish Scheme
            </button>
          </div>
        </div>

        {/* ── Funding Dashboard Analytics ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Portals", value: stats.total, icon: Landmark, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" },
              { label: "Committed Funds Pool", value: formatCurrency(stats.totalFunding), icon: Wallet, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
              { label: "Proposals Submitted", value: stats.applicationsCount, icon: UsersRound, bg: "bg-[#FF5A36]/50", color: "text-[#FF5A36]/600" },
              { label: "Audit Success Rate", value: "88%", icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-650" }
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
            { key: "schemes", label: "Funding Opportunities", count: grants.length },
            { key: "applications", label: "Evaluations queue", count: stats?.applicationsCount || 0 },
            { key: "compliance", label: "Compliance & Audits", count: null }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-[#FF5A36] text-[#FF5A36]" : "border-transparent text-[#78716A] hover:text-[#211F1D]"}`}>
              {tab.label} {tab.count !== null && <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE9DF] text-[#78716A] rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "schemes" && (
        <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme titles, agencies, requirements…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-[#FF5A36] bg-[#FFF0ED] text-[#FF5A36]" : "border-[#E2DCD2] text-[#57534E] hover:bg-[#EFE9DF]"}`}
          >
            <Filter className="h-3.5 w-3.5" /> Scheme Filters
          </button>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && activeTab === "schemes" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#FBF7F0] border-b border-[#E2DCD2]">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">Agency</label>
                <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)} className="h-7 text-xs border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36]">
                  <option value="ALL">All Agencies</option>
                  <option value="MeitY">MeitY</option>
                  <option value="DST">DST</option>
                  <option value="Solaris Power Pvt Ltd">Solaris Power</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">Funding Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-7 text-xs border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36]">
                  <option value="ALL">All Funding Types</option>
                  {Object.entries(SCHEME_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
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
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── SCHEMES TAB ──── */}
            {activeTab === "schemes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grants.map((g) => (
                  <motion.div
                    key={g.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="card-flat rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wider">{g.id}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#FFF0ED] border border-blue-100 rounded text-[#FF5A36] font-bold">
                        {SCHEME_TYPES[g.schemeType] || SCHEME_TYPES.GOVT_GRANT}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#211F1D] leading-snug h-8 line-clamp-2">{g.title}</h3>
                      <p className="text-[10px] text-[#A8A196] font-semibold mt-1">Agency: {g.agency}</p>
                    </div>

                    <p className="text-[10px] text-[#78716A] line-clamp-2 h-7 font-medium leading-relaxed">"{g.description}"</p>

                    <div className="flex justify-between items-center text-[10px] text-[#78716A] pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[10px] text-[#A8A196] uppercase block font-semibold leading-none">Funding Pool</span>
                        <span className="font-extrabold text-slate-855 text-xs">{formatCurrency(g.amount)}</span>
                      </div>
                      
                      <Link href={`/admin/grants/${g.id}`}>
                        <button className="h-8 px-3.5 bg-[#FF5A36] hover:bg-[#E04826] text-white rounded-xl text-[10px] font-bold transition-colors flex items-center gap-1">
                          Open Details <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── EVALUATION TAB ──── */}
            {activeTab === "applications" && (
              <div className="card-flat rounded-2xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs text-[#211F1D]">
                  <thead className="bg-[#FBF7F0] border-b border-slate-150 text-[10px] font-bold text-[#A8A196] uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3">Applicant Organization</th>
                      <th className="px-6 py-3">Scheme Title</th>
                      <th className="px-6 py-3">Submission Date</th>
                      <th className="px-6 py-3 text-center">Score</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    <tr className="hover:bg-[#EFE9DF]/50">
                      <td className="px-6 py-4 font-bold text-[#211F1D]">Solaris Power Pvt Ltd</td>
                      <td className="px-6 py-4">Grid Synced Embedded Serial Telemetry Driver</td>
                      <td className="px-6 py-4 text-[#78716A]">10/07/2026</td>
                      <td className="px-6 py-4 text-center font-bold">88 / 100</td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] px-2 py-0.5 bg-[#FEF3C7] text-[#B45309] border border-amber-100 rounded">UNDER_REVIEW</span></td>
                    </tr>
                    <tr className="hover:bg-[#EFE9DF]/50">
                      <td className="px-6 py-4 font-bold text-[#211F1D]">BioGen Diagnostics LLP</td>
                      <td className="px-6 py-4">Clinical Convolutional Image Accelerator Proposal</td>
                      <td className="px-6 py-4 text-[#78716A]">12/07/2026</td>
                      <td className="px-6 py-4 text-center font-bold">94 / 100</td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] px-2 py-0.5 bg-[#E8F2EC] text-[#2F6B4F] border border-green-100 rounded">APPROVED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ──── COMPLIANCE TAB ──── */}
            {activeTab === "compliance" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> DPIIT Eligibility Rules Engine</h3>
                <p className="text-xs text-[#78716A] leading-relaxed font-medium">Auto-assess applicant organizations matching DPIIT regulations (Minimum equity levels, capital rules, CSR thresholds) before releasing funds.</p>
                <button className="h-8 px-4 bg-[#0F0E0C] text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Run Eligibility Sweep</button>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Eligibility Checker Modal ── */}
      <AnimatePresence>
        {eligOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEligOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1"><Zap className="h-4 w-4 text-amber-500 fill-current" /> Scheme Eligibility Validator</h3>
                <button onClick={() => setEligOpen(false)} className="text-[#A8A196] hover:text-slate-655"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-[#78716A]">Assess eligibility parameters before launching custom committee reviews.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-[#211F1D]">DPIIT Registered Startup Status *</span>
                    <button onClick={() => setEligDpiit(!eligDpiit)} className={`h-6 px-2.5 rounded text-[10px] font-bold ${eligDpiit ? "bg-[#E8F2EC] text-[#2F6B4F] border border-green-150" : "bg-[#FEE2E2] text-[#C0392B] border border-red-150"}`}>
                      {eligDpiit ? "DPIIT Verified" : "Not Registered"}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-semibold text-[#211F1D]">Active Educational MoU Signed *</span>
                    <button onClick={() => setEligMou(!eligMou)} className={`h-6 px-2.5 rounded text-[10px] font-bold ${eligMou ? "bg-[#E8F2EC] text-[#2F6B4F] border border-green-150" : "bg-[#FEE2E2] text-[#C0392B] border border-red-150"}`}>
                      {eligMou ? "MoU Active" : "No Active MoU"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#211F1D]">Technology Readiness Level (TRL) *</span>
                    <select value={eligTrl} onChange={(e) => setEligTrl(e.target.value)} className="h-8 border border-[#E2DCD2] rounded px-1.5 text-xs bg-[#FBF7F0]">
                      <option value="TRL-3">TRL-3 (Research Stage)</option>
                      <option value="TRL-4">TRL-4 (Lab Proof)</option>
                      <option value="TRL-5">TRL-5 (Component Sync)</option>
                      <option value="TRL-6">TRL-6 (System Pilot)</option>
                    </select>
                  </div>
                </div>

                {eligResult !== null && (
                  <div className="p-3.5 bg-[#FFF0ED]/50 border border-blue-150 rounded-xl space-y-1">
                    <div className="font-bold text-[#211F1D]">Compatibility Score: {eligResult}%</div>
                    <p className="text-[10px] text-[#78716A]">
                      {eligResult >= 70 
                        ? "Meets eligibility limits. Proceed to committee review queue."
                        : "Requires active MoU links or TRL validation checks before proposal submittal."}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-3.5 mt-4">
                <button onClick={calculateEligibility} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg font-bold hover:bg-[#E04826]">Run Validation Check</button>
                <button onClick={() => { setEligResult(null); setEligOpen(false); }} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg font-semibold hover:bg-[#EFE9DF]">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Publish Scheme Wizard Modal ── */}
      <AnimatePresence>
        {publishOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPublishOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Publish Funding Scheme</h3>
                <button onClick={() => setPublishOpen(false)} className="text-[#A8A196] hover:text-[#57534E]"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Scheme Title *</label>
                  <input value={pubTitle} onChange={(e) => setPubTitle(e.target.value)} placeholder="e.g. DST Smart Grid R&D Call" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Detailed Description *</label>
                  <textarea value={pubDesc} onChange={(e) => setPubDesc(e.target.value)} rows={3} placeholder="Outline research boundaries and goals…" className="w-full p-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Funding Agency *</label>
                    <input value={pubAgency} onChange={(e) => setPubAgency(e.target.value)} placeholder="e.g. MeitY or DST" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Grant Pool (INR) *</label>
                    <input type="number" value={pubAmount} onChange={(e) => setPubAmount(e.target.value)} placeholder="e.g. 15000000" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Scheme Type *</label>
                    <select value={pubSchemeType} onChange={(e) => setPubSchemeType(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]">
                      {Object.entries(SCHEME_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Due Date</label>
                    <input type="date" value={pubDueDate} onChange={(e) => setPubDueDate(e.target.value)} className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Key Eligibility Criteria (comma separated)</label>
                  <input value={pubElig} onChange={(e) => setPubElig(e.target.value)} placeholder="e.g. DPIIT registered, 1 Ph.D lead" className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0]" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-3.5 mt-4">
                <button onClick={handlePublishGrant} disabled={publishLoading} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg font-bold flex items-center gap-1 hover:bg-[#E04826]">
                  {publishLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Publish Scheme
                </button>
                <button onClick={() => setPublishOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg font-semibold hover:bg-[#EFE9DF]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
