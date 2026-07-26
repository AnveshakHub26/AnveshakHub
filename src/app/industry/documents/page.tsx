"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, RefreshCw, Plus, Download, Eye, Loader2,
  Shield, AlertTriangle, Lock, Clock, History, CheckCircle2,
  X, Upload, Tag, Filter, FileCode, FileSpreadsheet
} from "lucide-react";

interface DocItem {
  id: string;
  name: string;
  docType: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  uploadedBy: string;
  description: string;
  expiresAt: string | null;
  accessLevel: string;
  approvalStatus: string;
  tags: string[];
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  expiringSoon: number;
  confidential: number;
  pendingApproval: number;
}

const ACCESS_LEVEL_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  PUBLIC:       { label: "Public",       bg: "bg-[#E8F2EC]",  text: "text-[#2F6B4F]" },
  INTERNAL:     { label: "Internal",     bg: "bg-[#FFF0ED]",   text: "text-[#FF5A36]" },
  RESTRICTED:   { label: "Restricted",   bg: "bg-[#FEF3C7]",  text: "text-[#B45309]" },
  CONFIDENTIAL: { label: "Confidential", bg: "bg-[#FEE2E2]",    text: "text-[#C0392B]" }
};

const DOC_TYPE_LABELS: Record<string, string> = {
  MOU: "MoU Agreement",
  TECHNICAL_SPEC: "Technical Spec",
  NDA: "NDA Agreement",
  AUDIT_REPORT: "Audit Certificate",
  FINANCIAL: "Financial Ledger",
  OTHER: "Document"
};

export default function CentralDocumentsPage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState("ALL");
  const [accessFilter, setAccessFilter] = useState("ALL");

  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadName, setUploadName] = useState("");
  const [uploadDocType, setUploadDocType] = useState("TECHNICAL_SPEC");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadAccess, setUploadAccess] = useState("RESTRICTED");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadExpires, setUploadExpires] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, docType: docTypeFilter, accessLevel: accessFilter });
      const res = await fetch(`/api/industry/documents?${params}`);
      const data = await res.json();
      setDocuments(data.documents || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, docTypeFilter, accessFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async () => {
    if (!uploadName.trim()) return;
    setUploading(true);
    try {
      await fetch("/api/industry/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uploadName,
          docType: uploadDocType,
          description: uploadDesc,
          accessLevel: uploadAccess,
          tags: uploadTags.split(",").map(t => t.trim()).filter(Boolean),
          expiresAt: uploadExpires || null
        })
      });
      setUploadModalOpen(false);
      setUploadName(""); setUploadDesc(""); setUploadTags(""); setUploadExpires("");
      await fetchDocuments();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const getDaysUntilExpiry = (iso: string | null) => {
    if (!iso) return null;
    const diff = new Date(iso).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Central Document Repository</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Enterprise Document Vault with version control, access controls & automated expiry alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDocuments} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setUploadModalOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Upload className="h-3.5 w-3.5" /> Upload Document
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Repository Files", value: stats.total, icon: FileText, color: "text-[#FF5A36] bg-[#FFF0ED]" },
            { label: "Expiring in < 120 Days", value: stats.expiringSoon, icon: AlertTriangle, color: "text-amber-600 bg-[#FEF3C7]" },
            { label: "Confidential Vault Assets", value: stats.confidential, icon: Lock, color: "text-[#C0392B] bg-[#FEE2E2]" },
            { label: "Pending Approval", value: stats.pendingApproval, icon: Clock, color: "text-purple-600 bg-purple-50" }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="card-flat rounded-2xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                  <Icon className="h-[1.125rem] w-[1.125rem]" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-[#211F1D]">{s.value}</div>
                  <div className="text-[10px] text-[#78716A] font-semibold">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 space-y-3">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents by name, description, tags..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36]"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#A8A196] uppercase">Category:</span>
            {["ALL", "MOU", "TECHNICAL_SPEC", "NDA", "AUDIT_REPORT", "FINANCIAL"].map(t => (
              <button
                key={t}
                onClick={() => setDocTypeFilter(t)}
                className={`h-7 px-2.5 text-[10px] font-bold rounded-lg border transition-all ${
                  docTypeFilter === t ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2] hover:bg-[#E6DFD4]"
                }`}
              >
                {t === "ALL" ? "All Types" : DOC_TYPE_LABELS[t] || t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#A8A196] uppercase">Access:</span>
            {["ALL", "PUBLIC", "INTERNAL", "RESTRICTED", "CONFIDENTIAL"].map(a => (
              <button
                key={a}
                onClick={() => setAccessFilter(a)}
                className={`h-7 px-2.5 text-[10px] font-bold rounded-lg border transition-all ${
                  accessFilter === a ? "bg-[#1C1917] text-white border-slate-800" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2] hover:bg-[#E6DFD4]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : documents.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <FileText className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Documents Found</p>
          <p className="text-[10px] text-[#A8A196] mt-1">Try adjusting your filters or upload a new file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => {
            const access = ACCESS_LEVEL_STYLES[doc.accessLevel] || ACCESS_LEVEL_STYLES.RESTRICTED;
            const daysLeft = getDaysUntilExpiry(doc.expiresAt);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-flat rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-9 w-9 rounded-xl bg-[#FFF0ED] text-[#FF5A36] flex items-center justify-center shrink-0">
                      {doc.mimeType?.includes("sheet") ? <FileSpreadsheet className="h-[1.125rem] w-[1.125rem]" /> : <FileText className="h-[1.125rem] w-[1.125rem]" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${access.bg} ${access.text}`}>
                        {access.label}
                      </span>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D]">
                        v{doc.version}.0
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors line-clamp-1">{doc.name}</h3>
                    <p className="text-[10px] text-[#A8A196] font-semibold mt-0.5">{DOC_TYPE_LABELS[doc.docType] || doc.docType} · {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>

                  <p className="text-[10px] text-[#78716A] font-medium leading-relaxed line-clamp-2">{doc.description}</p>

                  {/* Expiry Badge if applicable */}
                  {daysLeft !== null && (
                    <div className={`text-[8px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                      daysLeft <= 0 ? "bg-[#FEE2E2] text-[#C0392B]" : daysLeft <= 120 ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#FBF7F0] text-[#78716A]"
                    }`}>
                      <Clock className="h-3 w-3" />
                      {daysLeft <= 0 ? "EXPIRED" : `Expires in ${daysLeft} days (${new Date(doc.expiresAt!).toLocaleDateString("en-IN")})`}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((t, i) => (
                      <span key={i} className="text-[8px] bg-[#EFE9DF] text-[#57534E] px-1.5 py-0.5 rounded font-semibold">#{t}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                  <span className="text-[8px] text-[#A8A196] font-semibold">Uploaded by {doc.uploadedBy}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="h-7 px-2.5 bg-[#FBF7F0] border border-[#E2DCD2] hover:border-[#FF5A36] rounded-lg text-[10px] font-bold text-[#57534E] hover:text-[#FF5A36] flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> Details
                    </button>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-7 px-2.5 bg-[#FF5A36] text-white rounded-lg text-[10px] font-bold hover:bg-[#E04826] flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Download
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Upload Document Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-[#FF5A36]" /> Upload to Enterprise Vault
                </h3>
                <button onClick={() => setUploadModalOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Document Name *</label>
                  <input value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="e.g. Master MoU 2026.pdf"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Category</label>
                    <select value={uploadDocType} onChange={e => setUploadDocType(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs">
                      <option value="MOU">MoU Agreement</option>
                      <option value="TECHNICAL_SPEC">Technical Spec</option>
                      <option value="NDA">NDA Agreement</option>
                      <option value="AUDIT_REPORT">Audit Certificate</option>
                      <option value="FINANCIAL">Financial Ledger</option>
                      <option value="OTHER">Other Asset</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Access Level</label>
                    <select value={uploadAccess} onChange={e => setUploadAccess(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs">
                      <option value="PUBLIC">Public</option>
                      <option value="INTERNAL">Internal</option>
                      <option value="RESTRICTED">Restricted</option>
                      <option value="CONFIDENTIAL">Confidential</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Description</label>
                  <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} rows={2} placeholder="Summary of contents..."
                    className="w-full p-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Tags (comma separated)</label>
                    <input value={uploadTags} onChange={e => setUploadTags(e.target.value)} placeholder="MoU, Clean Energy, IIT"
                      className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Expiration Date (Optional)</label>
                    <input type="date" value={uploadExpires} onChange={e => setUploadExpires(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-4">
                <button onClick={() => setUploadModalOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">Cancel</button>
                <button onClick={handleUpload} disabled={uploading || !uploadName}
                  className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
                  {uploading && <Loader2 className="h-3 w-3 animate-spin" />} Upload Asset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Detail Drawer */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDoc(null)}>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-[#FBF7F0] h-full w-[420px] max-w-full shadow-2xl p-6 overflow-y-auto space-y-5"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-[#E2DCD2] pb-3">
                <div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D] uppercase">{selectedDoc.docType}</span>
                  <h3 className="text-sm font-bold text-[#211F1D] mt-1">{selectedDoc.name}</h3>
                </div>
                <button onClick={() => setSelectedDoc(null)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#A8A196] uppercase block">Description</span>
                  <p className="text-[#211F1D] font-medium leading-relaxed">{selectedDoc.description || "No description provided."}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3">
                  <div>
                    <span className="text-[8px] text-[#A8A196] font-bold block uppercase">Access Level</span>
                    <span className="font-bold text-[#211F1D]">{selectedDoc.accessLevel}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#A8A196] font-bold block uppercase">Version</span>
                    <span className="font-bold text-[#211F1D]">v{selectedDoc.version}.0</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#A8A196] font-bold block uppercase">File Size</span>
                    <span className="font-bold text-[#211F1D]">{(selectedDoc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#A8A196] font-bold block uppercase">Downloads</span>
                    <span className="font-bold text-[#211F1D]">{selectedDoc.downloadCount} times</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2DCD2] pt-4 flex gap-2">
                <a href={selectedDoc.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 h-9 bg-[#FF5A36] text-white rounded-lg font-bold hover:bg-[#E04826] flex items-center justify-center gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download File
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
