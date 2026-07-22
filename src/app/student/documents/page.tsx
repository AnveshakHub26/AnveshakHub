"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Download, RefreshCw, ShieldCheck, Plus,
  Loader2, X, CheckCircle2, Award, FileCheck
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

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Upload Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("PROJECT_REPORT");
  const [submitting, setSubmitting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter });
      const res = await fetch(`/api/student/documents?${params}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadDocument = async () => {
    if (!docName.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          category: docCategory
        })
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

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Documents & Verified Credentials Vault</h1>
          <p className="text-xs text-slate-500 mt-0.5">Secure repository for resumes, transcripts, hardware project reports, and NPTEL/IEEE certificates</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDocuments} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setModalOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload File
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-1.5">
        {[
          { key: "ALL", label: "All Files" },
          { key: "RESUME", label: "Resumes" },
          { key: "PROJECT_REPORT", label: "Project Reports" },
          { key: "CERTIFICATE", label: "Certificates" },
          { key: "TRANSCRIPT", label: "Transcripts" }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
              categoryFilter === cat.key ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document Vault List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Documents Found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">{doc.category}</span>
                    <h3 className="text-xs font-bold text-slate-800">{doc.name}</h3>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold">{doc.fileSizeMb} MB · Uploaded {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-blue-600" /> {doc.status}
                </span>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-primary" /> Upload File to Document Vault
                </h3>
                <button onClick={() => setModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Document Name *</label>
                  <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Node 3 Sensor Calibration Report.pdf"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Document Category</label>
                  <select value={docCategory} onChange={e => setDocCategory(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                    <option value="PROJECT_REPORT">Project R&D Report</option>
                    <option value="RESUME">Resume PDF</option>
                    <option value="CERTIFICATE">Certificate / Credential</option>
                    <option value="TRANSCRIPT">Academic Grade Transcript</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleUploadDocument} disabled={submitting || !docName.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Upload File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
