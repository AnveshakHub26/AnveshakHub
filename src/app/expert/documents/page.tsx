"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, RefreshCw, Upload, Download, CheckCircle2,
  FileCheck, ShieldCheck, Loader2, X, Plus, ExternalLink
} from "lucide-react";
import Link from "next/link";

interface ExpertDoc {
  id: string;
  name: string;
  category: string;
  docType: string;
  fileUrl: string;
  version: string;
  status: string;
  fileSize: string;
  uploadedBy: string;
  createdAt: string;
}

export default function ExpertDocumentsPage() {
  const [documents, setDocuments] = useState<ExpertDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("DELIVERABLE");
  const [docType, setDocType] = useState("DELIVERABLE_REPORT");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, category: categoryFilter });
      const res = await fetch(`/api/expert/documents?${params}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadDocument = async () => {
    if (!docName.trim()) return;
    setUploading(true);
    try {
      await fetch("/api/expert/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: docName, category, docType, fileUrl })
      });
      setUploadOpen(false);
      setDocName(""); setFileUrl("");
      await fetchDocuments();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Expert Documents & Deliverables Vault</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Secure repository for project deliverables, agreements (NDAs/MoUs), research papers & IP records</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDocuments} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setUploadOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Upload className="h-3.5 w-3.5" /> Upload Document
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents by name or document type..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { key: "ALL", label: "All Vault" },
            { key: "AGREEMENT", label: "Agreements / NDAs" },
            { key: "DELIVERABLE", label: "Deliverable Reports" },
            { key: "RESEARCH", label: "Research Papers" },
            { key: "IP_RECORD", label: "IP & Patents" }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                categoryFilter === cat.key ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : documents.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <FileText className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Documents Found</p>
          <p className="text-[10px] text-[#A8A196] mt-1">Upload research deliverables or project agreements to store in vault.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card-flat rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] text-[#FF5A36] flex items-center justify-center font-extrabold shrink-0">
                  <FileText className="h-5 w-5 text-[#FF5A36]" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D]">{doc.version}</span>
                    <h3 className="text-xs font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors truncate">{doc.name}</h3>
                  </div>
                  <p className="text-[10px] text-[#A8A196] font-semibold truncate">
                    Uploaded by {doc.uploadedBy} · {doc.fileSize} · {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#E8F2EC] text-[#2F6B4F] border border-green-200">{doc.status}</span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 border border-[#E2DCD2] hover:border-[#FF5A36] text-[#57534E] hover:text-[#FF5A36] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3 w-3" /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setUploadOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-[#FF5A36]" /> Upload Vault Document
                </h3>
                <button onClick={() => setUploadOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Document Name *</label>
                  <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. MoU Agreement - Solaris Power.pdf"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs font-bold">
                      <option value="DELIVERABLE">Deliverable Report</option>
                      <option value="AGREEMENT">Agreement / NDA</option>
                      <option value="RESEARCH">Research Paper</option>
                      <option value="IP_RECORD">IP & Patent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Document Type</label>
                    <input value={docType} onChange={e => setDocType(e.target.value)} placeholder="e.g. DELIVERABLE_REPORT"
                      className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">File Storage URL</label>
                  <input value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://storage.anvesha.in/docs/..."
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-4">
                <button onClick={() => setUploadOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">Cancel</button>
                <button onClick={handleUploadDocument} disabled={uploading || !docName.trim()}
                  className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
                  {uploading && <Loader2 className="h-3 w-3 animate-spin" />} Upload File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
