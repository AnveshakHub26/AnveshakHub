"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  FileSignature, Search, ShieldCheck, CheckCircle2, XCircle, AlertTriangle,
  Loader2, Eye, Calendar, Building2, MapPin, Mail, Hash, UserCheck, X, FileText, Check
} from "lucide-react";

interface VerificationItem {
  id: string;
  orgName: string;
  type: string;
  domain: string;
  submittedAt: string;
  documentStatus: string;
  priority: "HIGH" | "STANDARD";
}

export default function VerificationQueuePage() {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<VerificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Auditing Actions States
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [auditComment, setAuditComment] = useState("");

  const [typeStats, setTypeStats] = useState<any[]>([]);

  const loadQueue = async () => {
    try {
      const res = await fetch("/api/admin/verify");
      const data = await res.json();
      if (res.ok) {
        setQueue(data.queue);
      }
      const statsRes = await fetch("/api/admin/industry-verification/stats");
      const statsData = await statsRes.json();
      if (statsRes.ok) {
        setTypeStats(statsData.byType || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, comment: auditComment || "Manually audited via Verification Queue" })
      });
      if (res.ok) {
        setQueue(prev => prev.filter(item => item.id !== id));
        setDrawerOpen(false);
        setAuditComment("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQueue = queue.filter(item =>
    item.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 space-y-6 flex-grow">
        <div className="h-7 w-48 bg-[#D8D2C7] animate-pulse rounded-lg" />
        <div className="h-96 bg-[#D8D2C7] animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex-grow relative z-10 flex flex-col">
      {/* ── Heading ── */}
      <div>
        <h1 className="text-xl font-black text-[#211F1D] tracking-tight">Compliance & Verification Registry</h1>
        <p className="text-xs text-[#78716A] mt-0.5">Perform statutory checks, audit legal credentials, and certify prospective partners.</p>
      </div>

      {/* ── Search and Filters ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A196] pointer-events-none" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search pending organizations by name or domain..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2DCD2] text-xs font-medium placeholder-slate-400 outline-none focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/20 transition-all bg-[#FBF7F0]"
          />
        </div>
        <span className="text-[10px] font-bold text-[#A8A196] bg-[#EFE9DF] border border-[#E2DCD2] px-3 py-1.5 rounded-xl">
          {filteredQueue.length} Record{filteredQueue.length !== 1 ? "s" : ""} Found
        </span>
      </div>

      {/* ── Queue Table Card ── */}
      <div className="card-flat rounded-2xl overflow-hidden flex-grow flex flex-col justify-between">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2DCD2] text-[10px] font-bold text-[#A8A196] uppercase bg-[#FBF7F0]">
                <th className="py-3.5 px-6">Organization Details</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Industry Domain</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Credential Status</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredQueue.length > 0 ? (
                filteredQueue.map(item => (
                  <tr key={item.id} className="text-xs hover:bg-[#EFE9DF]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#FBF7F0] border border-[#E2DCD2] flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-[#78716A]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#211F1D] leading-tight">{item.orgName}</p>
                          <p className="text-[10px] text-[#78716A] font-bold uppercase tracking-wider mt-1">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#57534E]">{item.type}</td>
                    <td className="py-4 px-4 font-semibold text-[#57534E]">{item.domain}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-[#211F1D]">{item.submittedAt}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={[
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        item.documentStatus === "UPLOADED" ? "bg-[#E8F2EC] text-[#2F6B4F] border-emerald-250" :
                        item.documentStatus === "UNDER_REVIEW" ? "bg-[#FFF0ED] text-[#FF5A36] border-[#FFCFC4]" :
                        "bg-[#FEF3C7] text-[#B45309] border-amber-200"
                      ].join(" ")}>
                        {item.documentStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={[
                        "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border",
                        item.priority === "HIGH" ? "bg-[#FEE2E2] text-[#C0392B] border-[#FECACA]" : "bg-[#EFE9DF] text-[#78716A] border-[#E2DCD2]"
                      ].join(" ")}>
                        {item.priority === "HIGH" ? "Urgently Required" : "Standard"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => { setSelectedItem(item); setDrawerOpen(true); }}
                        className="h-8 px-3 bg-[#FBF7F0] border border-[#E2DCD2] text-[#57534E] hover:bg-[#FBF7F0] rounded-lg text-[10px] font-bold shadow-[var(--shadow-sm)] cursor-pointer"
                      >
                        Audit Details
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "APPROVE")}
                        className="h-8 w-8 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                        aria-label="Approve Profile"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#A8A196] font-medium">
                    No matching pending verifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Side Audit Drawer Modal ── */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 right-0 top-0 bottom-0 w-full max-w-lg bg-[#FBF7F0] border-l border-[#E2DCD2] shadow-2xl focus:outline-none p-8 overflow-y-auto"
            aria-describedby="audit-drawer-desc"
          >
            {selectedItem && (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-[#FF5A36] uppercase tracking-widest">Compliance Review</span>
                    <Dialog.Title className="text-sm font-extrabold text-[#211F1D] mt-1">{selectedItem.orgName}</Dialog.Title>
                    <p id="audit-drawer-desc" className="text-[10px] text-[#A8A196] font-semibold mt-0.5">Registration Ref: {selectedItem.id}</p>
                  </div>
                  <Dialog.Close asChild>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg text-[#A8A196] hover:text-[#57534E] hover:bg-[#EFE9DF] transition-colors">
                      <X className="h-[1.125rem] w-[1.125rem]" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  {/* Detailed credentials */}
                  <div className="card-flat rounded-2xl p-5 space-y-3">
                    {[
                      { label: "Entity Constitution", value: selectedItem.type },
                      { label: "Research Verticals", value: selectedItem.domain },
                      { label: "Submitted Timestamp", value: selectedItem.submittedAt },
                      { label: "Statutory Status", value: selectedItem.documentStatus }
                    ].map(field => (
                      <div key={field.label} className="flex justify-between items-center text-xs">
                        <span className="text-[#78716A] font-semibold">{field.label}</span>
                        <span className="text-[#211F1D] font-bold text-right">{field.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Documents checklist */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#A8A196] uppercase tracking-widest mb-3.5">Attached Documentation Registry</h4>
                    <div className="space-y-2.5">
                      {[
                        "Statutory Registration Certificate.pdf",
                        "Tax Returns Statement (AY 2025-26).pdf",
                        "Board Authorization Resolution.pdf"
                      ].map(docName => (
                        <div key={docName} className="p-3.5 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl flex items-center justify-between gap-3 shadow-[var(--shadow-sm)] hover:border-[#FF5A36] transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-[1.125rem] w-[1.125rem] text-[#FF5A36] shrink-0" />
                            <span className="text-xs text-[#211F1D] font-bold truncate">{docName}</span>
                          </div>
                          <a href="#" className="text-[10px] font-black text-[#FF5A36] uppercase tracking-wider hover:underline shrink-0">Open PDF</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Comments input */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#78716A] uppercase tracking-wider mb-1.5">Compliance Notes & Auditor Comments</label>
                    <textarea
                      value={auditComment}
                      onChange={e => setAuditComment(e.target.value)}
                      placeholder="Specify reasons for approval, or document deficiencies for re-upload query..."
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E2DCD2] text-xs font-medium text-[#211F1D] placeholder-slate-400 outline-none focus:border-[#FF5A36] focus:ring-3 focus:ring-[#FF5A36]/20 transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Warning advice */}
                  <div className="bg-[#FEF3C7] border border-amber-250 rounded-xl p-4 flex gap-2.5">
                    <AlertTriangle className="h-[1.125rem] w-[1.125rem] text-[#B45309] shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                      Statutory audits are immutable once recorded. AnveshakHub maintains compliance check logs for forensic review and regulatory reporting.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#E2DCD2]">
                    <button
                      onClick={() => handleAction(selectedItem.id, "REJECT")}
                      disabled={actionLoading}
                      className="h-11 px-5 border border-[#FECACA] hover:bg-[#FEE2E2] text-red-650 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Profile
                    </button>
                    <button
                      onClick={() => handleAction(selectedItem.id, "APPROVE")}
                      disabled={actionLoading}
                      className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[var(--shadow-sm)]"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShieldCheck className="h-[1.125rem] w-[1.125rem]" /> Certify Organization Partner</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
