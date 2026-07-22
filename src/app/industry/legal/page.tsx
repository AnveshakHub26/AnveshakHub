"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Search, RefreshCw, Plus, FileSignature, CheckCircle2,
  Clock, AlertTriangle, FileText, Loader2, X, ChevronRight, User,
  Calendar, Lock, ExternalLink
} from "lucide-react";

interface LegalAgreement {
  id: string;
  title: string;
  agreementType: string;
  targetEntity: string;
  entityName: string;
  fileUrl: string | null;
  version: string;
  status: string;
  effectiveDate: string | null;
  expiryDate: string | null;
  eSignatureStatus: string;
  signedAt: string | null;
  renewalReminderDays: number;
  createdBy: string;
  projectId: string | null;
}

interface Stats {
  total: number;
  active: number;
  underReview: number;
  pendingESign: number;
}

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  ACTIVE:       { label: "Active",       bg: "bg-green-50",  text: "text-green-700" },
  UNDER_REVIEW: { label: "Under Review", bg: "bg-amber-50",  text: "text-amber-700" },
  DRAFT:        { label: "Draft",        bg: "bg-slate-100", text: "text-slate-600" },
  EXPIRED:      { label: "Expired",      bg: "bg-red-50",    text: "text-red-700" }
};

const ESIGN_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  SIGNED:   { label: "Signed",   bg: "bg-green-50", text: "text-green-700" },
  PENDING:  { label: "Pending",  bg: "bg-amber-50", text: "text-amber-700" },
  DECLINED: { label: "Declined", bg: "bg-red-50",   text: "text-red-700" }
};

export default function LegalStudioPage() {
  const [agreements, setAgreements] = useState<LegalAgreement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [initModalOpen, setInitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<LegalAgreement | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("MOU");
  const [newTarget, setNewTarget] = useState("ORGANIZATION");
  const [newEntityName, setNewEntityName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, agreementType: typeFilter, status: statusFilter });
      const res = await fetch(`/api/industry/legal?${params}`);
      const data = await res.json();
      setAgreements(data.agreements || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  const handleInitiate = async () => {
    if (!newTitle || !newEntityName) return;
    setSaving(true);
    try {
      await fetch("/api/industry/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          agreementType: newType,
          targetEntity: newTarget,
          entityName: newEntityName,
          notes: newNotes
        })
      });
      setInitModalOpen(false);
      setNewTitle(""); setNewEntityName(""); setNewNotes("");
      await fetchAgreements();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSign = async (agreementId: string) => {
    try {
      await fetch(`/api/industry/legal/${agreementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXECUTE_ESIGN", eSignatureStatus: "SIGNED", status: "ACTIVE" })
      });
      await fetchAgreements();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Legal Agreements & Compliance Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage NDAs, MoUs, Contracts, IP Agreements and E-Signatures securely</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAgreements} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setInitModalOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Initiate Agreement
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Legal Agreements", value: stats.total, icon: Shield, color: "text-primary bg-blue-50" },
            { label: "Active & Executed", value: stats.active, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
            { label: "Under Legal Review", value: stats.underReview, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Pending E-Signatures", value: stats.pendingESign, icon: FileSignature, color: "text-purple-600 bg-purple-50" }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-800">{s.value}</div>
                  <div className="text-[9px] text-slate-500 font-semibold">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agreements by title or partner institution..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Type:</span>
            {["ALL", "NDA", "MOU", "CONTRACT", "IP_AGREEMENT"].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`h-7 px-2.5 text-[9px] font-bold rounded-lg border transition-all ${
                  typeFilter === t ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
            {["ALL", "ACTIVE", "UNDER_REVIEW", "DRAFT"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-7 px-2.5 text-[9px] font-bold rounded-lg border transition-all ${
                  statusFilter === s ? "bg-slate-800 text-white border-slate-800" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agreements Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : agreements.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Shield className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Legal Agreements Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Initiate a new NDA, MoU or Contract workflow.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agreements.map((item, idx) => {
            const status = STATUS_STYLES[item.status] || STATUS_STYLES.DRAFT;
            const esign = ESIGN_STYLES[item.eSignatureStatus] || ESIGN_STYLES.PENDING;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-extrabold shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{item.agreementType}</span>
                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{item.title}</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold truncate">Partner: {item.entityName}</p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-400 font-medium">
                      <span>Created by {item.createdBy}</span>
                      <span>·</span>
                      <span>Version v{item.version}</span>
                      {item.expiryDate && (
                        <>
                          <span>·</span>
                          <span>Expires: {new Date(item.expiryDate).toLocaleDateString("en-IN")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded block ${status.bg} ${status.text}`}>{status.label}</span>
                    <span className={`text-[8px] font-semibold text-slate-400 block mt-1`}>E-Sign: {esign.label}</span>
                  </div>

                  {item.eSignatureStatus === "PENDING" ? (
                    <button
                      onClick={() => handleSign(item.id)}
                      className="h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <FileSignature className="h-3 w-3" /> Sign Agreement
                    </button>
                  ) : item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <FileText className="h-3 w-3" /> Document
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Initiate Agreement Modal */}
      <AnimatePresence>
        {initModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setInitModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" /> Initiate Legal Agreement Workflow
                </h3>
                <button onClick={() => setInitModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agreement Title *</label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Master R&D MoU - IIT Madras"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agreement Type</label>
                    <select value={newType} onChange={e => setNewType(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                      <option value="MOU">MoU Agreement</option>
                      <option value="NDA">NDA Agreement</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="IP_AGREEMENT">IP Agreement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Target Entity</label>
                    <select value={newTarget} onChange={e => setNewTarget(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                      <option value="ORGANIZATION">Organization / Institution</option>
                      <option value="EXPERT">Subject Expert</option>
                      <option value="STUDENT">Student Intern</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Partner Entity / Contact Name *</label>
                  <input value={newEntityName} onChange={e => setNewEntityName(e.target.value)} placeholder="e.g. IIT Madras - Electrical Dept"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Notes & Scope</label>
                  <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} rows={3} placeholder="Scope, indemnity clauses, IP shares..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setInitModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleInitiate} disabled={saving || !newTitle || !newEntityName}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Initiate Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
