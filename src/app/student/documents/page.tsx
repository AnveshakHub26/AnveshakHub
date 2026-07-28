"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Download, RefreshCw, ShieldCheck, Plus,
  Loader2, X, CheckCircle2, Award, FileCheck, Lock, Eye,
  FolderOpen, FileBadge, AlertCircle, ChevronDown
} from "lucide-react";

interface StudentDocument {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
  fileSizeMb: number;
  status: string;
  credentialId?: string;
  uploadedAt: string;
}

const CATEGORIES = ["ALL", "PROJECT_REPORT", "CERTIFICATE", "RESUME", "NDA", "OTHER"];

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PROJECT_REPORT: { label: "Project Report", color: "#4338CA", bg: "#EEF2FF", icon: FileText },
  CERTIFICATE:    { label: "Certificate",     color: "#2F6B4F", bg: "#E8F2EC", icon: Award },
  RESUME:         { label: "Resume / CV",     color: "#FF5A36", bg: "#FFF0ED", icon: FileBadge },
  NDA:            { label: "NDA / Legal",     color: "#92400E", bg: "#FEF3C7", icon: Lock },
  OTHER:          { label: "Other",           color: "#57534E", bg: "#F5F0E8", icon: FolderOpen },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  VERIFIED:   { label: "Verified",   color: "#2F6B4F", bg: "#E8F2EC" },
  PENDING:    { label: "Pending",    color: "#92400E", bg: "#FEF3C7" },
  REJECTED:   { label: "Rejected",   color: "#DC2626", bg: "#FEE2E2" },
  UPLOADED:   { label: "Uploaded",   color: "#4338CA", bg: "#EEF2FF" },
};

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dragOver, setDragOver] = useState(false);

  // Upload Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("PROJECT_REPORT");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter });
      const res = await fetch(`/api/student/documents?${params}`);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : (data.documents || []));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleUploadDocument = async () => {
    if (!docName.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: docName, category: docCategory })
      });
      setModalOpen(false);
      setDocName("");
      await fetchDocuments();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const docsList = Array.isArray(documents) ? documents : [];
  const verifiedCount = docsList.filter(d => d.status === "VERIFIED").length;
  const pendingCount  = docsList.filter(d => d.status === "PENDING").length;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#4338CA]/10 text-[#4338CA] uppercase tracking-widest">
              Deliverable Vault
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#211F1D] leading-tight">
            Your Document Archive
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            NDAs, project reports, certificates — securely stored, cryptographically referenced.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDocuments}
            className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="h-9 px-4 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#FF5A36]/30"
          >
            <Upload className="h-3.5 w-3.5" /> Upload Document
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Files",  value: documents.length,  icon: FileText,    color: "#4338CA" },
          { label: "Verified",     value: verifiedCount,     icon: ShieldCheck, color: "#2F6B4F" },
          { label: "Awaiting Review", value: pendingCount,   icon: AlertCircle, color: "#92400E" },
          { label: "Categories",   value: CATEGORIES.length - 1, icon: FolderOpen, color: "#FF5A36" },
        ].map((s) => (
          <div key={s.label} className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.color + "18" }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#211F1D]">{s.value}</p>
              <p className="text-[10px] font-semibold text-[#78716A] uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const meta = cat === "ALL" ? null : CATEGORY_META[cat];
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`h-8 px-4 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#211F1D] text-white shadow-sm"
                  : "bg-[#EFE9DF] text-[#57534E] hover:bg-[#E2DCD2]"
              }`}
            >
              {cat === "ALL" ? "All Files" : meta?.label}
            </button>
          );
        })}
      </div>

      {/* Drag-Drop Zone (shown when no documents or as prompt) */}
      {!loading && documents.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); setModalOpen(true); }}
          onClick={() => setModalOpen(true)}
          className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#FF5A36] bg-[#FFF0ED]"
              : "border-[#E2DCD2] bg-[#EFE9DF]/50 hover:border-[#FF5A36]/50 hover:bg-[#FFF0ED]/30"
          }`}
        >
          <div className="h-14 w-14 rounded-2xl bg-[#FF5A36]/10 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-[#FF5A36]" />
          </div>
          <p className="text-sm font-bold text-[#211F1D]">Drop files here or click to upload</p>
          <p className="text-xs text-[#78716A] mt-1 max-w-xs">
            Upload your project reports, certificates, resume, and NDAs to your secure deliverable vault.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs text-[#78716A] font-semibold">Loading your vault…</p>
        </div>
      )}

      {/* Documents Grid */}
      {!loading && documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {documents.map((doc, idx) => {
              const catMeta  = CATEGORY_META[doc.category] || CATEGORY_META["OTHER"];
              const statMeta = STATUS_META[doc.status]     || STATUS_META["UPLOADED"];
              const CatIcon  = catMeta.icon;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-[#EFE9DF] rounded-2xl p-5 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all group border border-transparent hover:border-[#D8D2C7]"
                >
                  {/* Doc Header */}
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: catMeta.bg }}>
                      <CatIcon className="h-5 w-5" style={{ color: catMeta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#211F1D] truncate group-hover:text-[#FF5A36] transition-colors">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: catMeta.bg, color: catMeta.color }}>
                        {catMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Meta Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#78716A] font-semibold">
                      {doc.fileSizeMb ? `${doc.fileSizeMb} MB` : "—"}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-full text-[10px]"
                      style={{ background: statMeta.bg, color: statMeta.color }}>
                      {doc.status === "VERIFIED" && <ShieldCheck className="h-3 w-3 inline mr-0.5" />}
                      {statMeta.label}
                    </span>
                  </div>

                  {/* Credential ID (if verified) */}
                  {doc.credentialId && (
                    <div className="bg-[#FBF7F0] rounded-xl px-3 py-2 flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-[#2F6B4F]" />
                      <span className="text-[10px] font-mono font-bold text-[#2F6B4F] truncate">
                        {doc.credentialId}
                      </span>
                    </div>
                  )}

                  {/* Uploaded Date */}
                  <p className="text-[10px] text-[#A8A196] font-semibold">
                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-[#D8D2C7] pt-3">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-8 bg-[#211F1D] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FF5A36] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      className="h-8 px-3 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-bold flex items-center gap-1 hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4 border border-[#E2DCD2]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#FF5A36]/10 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#211F1D]">Add to Vault</h3>
                    <p className="text-[10px] text-[#78716A]">Securely store a new document</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#EFE9DF] transition-colors">
                  <X className="h-4 w-4 text-[#A8A196]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">
                    Document Name *
                  </label>
                  <input
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="e.g. Soil Sensor Calibration Report — Phase 2"
                    className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white appearance-none pr-8 transition-colors"
                    >
                      {Object.entries(CATEGORY_META).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A196] pointer-events-none" />
                  </div>
                </div>

                {/* File picker (visual only — real upload handled server-side) */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#E2DCD2] rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#FF5A36]/50 hover:bg-[#FFF0ED]/30 transition-all"
                >
                  <Upload className="h-6 w-6 text-[#A8A196]" />
                  <p className="text-xs font-semibold text-[#57534E]">Click to select a file</p>
                  <p className="text-[10px] text-[#A8A196]">PDF, DOCX, PNG — max 20 MB</p>
                  <input ref={fileRef} type="file" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-5">
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-9 px-4 border border-[#E2DCD2] text-[#78716A] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={submitting || !docName.trim()}
                  className="h-9 px-5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm shadow-[#FF5A36]/30"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save to Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
