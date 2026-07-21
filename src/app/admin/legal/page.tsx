"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap, FileText, Check, ShieldAlert
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface LegalAgreement {
  id: string;
  title: string;
  agreementType: string;
  targetEntity: string;
  entityId: string | null;
  entityName: string;
  fileUrl: string | null;
  version: string;
  status: string;
  effectiveDate: string | null;
  expiryDate: string | null;
  eSignatureStatus: string;
  signedAt: string | null;
  createdBy: string;
}

interface Stats {
  totalAgreements: number;
  activeCount: number;
  pendingSignatures: number;
  expiringIn30Days: number;
  complianceScore: string;
}

// ─── Constants ─────────────────────────────────────────────────────

const AGREEMENT_TYPES: Record<string, string> = {
  NDA: "Non-Disclosure Agreement (NDA)",
  MOU: "Memorandum of Understanding (MoU)",
  CONTRACT: "Master Service Contract",
  IP_AGREEMENT: "IP Assignment & Ownership",
  SERVICE_LEVEL: "Service Level Agreement (SLA)"
};

const TARGET_ENTITIES = {
  ALL: "All Target Entities",
  INDUSTRY: "Industry Partners",
  EXPERT: "Subject Matter Experts",
  STUDENT: "Students & Interns",
  ORGANIZATION: "Institutions & Government"
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function LegalManagementConsole() {
  const [agreements, setAgreements] = useState<LegalAgreement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("repository"); // repository, vault, templates, renewals

  // Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [agreementType, setAgreementType] = useState("NDA");
  const [targetEntity, setTargetEntity] = useState("INDUSTRY");
  const [entityName, setEntityName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchLegal = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        agreementType: typeFilter === "ALL" ? "" : typeFilter,
        targetEntity: entityFilter === "ALL" ? "" : entityFilter
      });
      const res = await fetch(`/api/admin/legal?${params}`);
      const data = await res.json();
      setAgreements(data.agreements || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, entityFilter]);

  useEffect(() => {
    fetchLegal();
  }, [fetchLegal]);

  const handleCreateAgreement = async () => {
    if (!title || !entityName) return;
    setCreateLoading(true);
    try {
      await fetch("/api/admin/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          agreementType,
          targetEntity,
          entityName,
          createdBy: "System Legal Counsel"
        })
      });
      setCreateOpen(false);
      setTitle("");
      setEntityName("");
      await fetchLegal();
    } catch (e) {
      console.error(e);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleApproveAgreement = async (id: string) => {
    try {
      await fetch(`/api/admin/legal/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE", status: "ACTIVE", eSignatureStatus: "SIGNED" })
      });
      await fetchLegal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Legal Governance & Digital Vault</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage NDAs, MoUs, IP assignment contracts, digital signatures, and compliance audit histories</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLegal} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-655 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setCreateOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Create Legal Agreement
            </button>
          </div>
        </div>

        {/* ── Telemetry Stats ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Agreements", value: stats.activeCount, icon: FileSignature, bg: "bg-blue-50", color: "text-primary" },
              { label: "Pending E-Signatures", value: stats.pendingSignatures, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
              { label: "Expiring in 30 Days", value: stats.expiringIn30Days, icon: AlertTriangle, bg: "bg-red-50", color: "text-red-500" },
              { label: "Legal Compliance Audit", value: stats.complianceScore, icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-650" }
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

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-slate-100 pt-0 -mb-5">
          {[
            { key: "repository", label: "Agreement Repository", count: agreements.length },
            { key: "vault", label: "Digital Document Vault", count: null },
            { key: "templates", label: "Legal Templates Library", count: null },
            { key: "renewals", label: "Expiry & Renewals", count: stats?.expiringIn30Days || 0 }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {tab.label} {tab.count !== null && <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "repository" && (
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agreement titles, entity names, IDs…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Filter className="h-3.5 w-3.5" /> Filter Parameters
          </button>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && activeTab === "repository" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Agreement Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Types</option>
                  <option value="NDA">NDA</option>
                  <option value="MOU">MoU</option>
                  <option value="CONTRACT">Master Contract</option>
                  <option value="IP_AGREEMENT">IP Assignment</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Target Entity</label>
                <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  {Object.entries(TARGET_ENTITIES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── REPOSITORY TAB ──── */}
            {activeTab === "repository" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agreements.map((ag) => (
                  <motion.div
                    key={ag.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{ag.id} · v{ag.version}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-primary font-bold">
                        {ag.agreementType}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{ag.title}</h3>
                      <p className="text-[9px] text-slate-450 font-semibold mt-0.5">Target: {ag.entityName} ({ag.targetEntity})</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">E-Signature:</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${ag.eSignatureStatus === "SIGNED" ? "bg-green-50 text-green-700 border border-green-150" : "bg-amber-50 text-amber-700 border border-amber-150"}`}>
                        {ag.eSignatureStatus}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold leading-none">Expires On</span>
                        <span className="font-bold text-slate-700">{ag.expiryDate ? new Date(ag.expiryDate).toLocaleDateString("en-IN") : "N/A"}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {ag.status !== "ACTIVE" && (
                          <button onClick={() => handleApproveAgreement(ag.id)} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[9px] font-bold rounded-lg transition-colors">
                            Approve
                          </button>
                        )}
                        <button className="h-7 px-3 border border-slate-200 text-slate-650 hover:bg-slate-50 text-[9px] font-bold rounded-lg flex items-center gap-1">
                          <Download className="h-3 w-3" /> PDF
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── DIGITAL VAULT TAB ──── */}
            {activeTab === "vault" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-primary" /> Encrypted Digital Vault Architecture</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">All stored agreements and digital signatures are encrypted at rest with MinIO document bucket storage links and RBAC clearance policies.</p>
              </div>
            )}

            {/* ──── TEMPLATES TAB ──── */}
            {activeTab === "templates" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><FileText className="h-4.5 w-4.5 text-primary" /> Standard Legal Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-100 rounded-xl p-3 space-y-1">
                    <div className="font-bold text-slate-800">Standard Bilateral Non-Disclosure Agreement (NDA)</div>
                    <p className="text-[10px] text-slate-450">Version 2.4 · Updated July 2026</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-3 space-y-1">
                    <div className="font-bold text-slate-800">Academic & University Partnership MoU</div>
                    <p className="text-[10px] text-slate-450">Version 1.8 · Updated June 2026</p>
                  </div>
                </div>
              </div>
            )}

            {/* ──── RENEWALS TAB ──── */}
            {activeTab === "renewals" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><Clock className="h-4.5 w-4.5 text-amber-500" /> Expiry & Reminders Center</h3>
                <p className="text-xs text-slate-500 font-medium">Automated email reminders are dispatched to partner legal contacts 30 days prior to contract expiration dates.</p>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Create Agreement Modal ── */}
      <AnimatePresence>
        {createOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCreateOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Draft Legal Agreement</h3>
                <button onClick={() => setCreateOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agreement Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Solaris Master R&D Contract" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agreement Type *</label>
                    <select value={agreementType} onChange={(e) => setAgreementType(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      {Object.entries(AGREEMENT_TYPES).map(([k, v]) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Target Entity *</label>
                    <select value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      <option value="INDUSTRY">Industry Partner</option>
                      <option value="EXPERT">Subject Expert</option>
                      <option value="STUDENT">Student / Intern</option>
                      <option value="ORGANIZATION">Institution</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Entity Name *</label>
                  <input value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="e.g. Solaris Power Pvt Ltd" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleCreateAgreement} disabled={createLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {createLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save & Draft
                </button>
                <button onClick={() => setCreateOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
