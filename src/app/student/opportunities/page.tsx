"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, RefreshCw, Bookmark, Star, Calendar,
  Loader2, ChevronRight, CheckCircle2, Award, Send, X,
  DollarSign, Clock, Building2
} from "lucide-react";
import Link from "next/link";

interface StudentOpportunity {
  id: string;
  title: string;
  industryName: string;
  domain: string;
  stipend: number;
  durationWeeks: number;
  deadline: string;
  status: string;
  isRecommended: boolean;
  isSaved: boolean;
  hasApplied: boolean;
  applicationStatus?: string;
  description: string;
  requirements: string[];
  eligibilityScore: number;
  createdAt: string;
}

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<StudentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const [applyModal, setApplyModal] = useState<StudentOpportunity | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, tab: activeTab });
      const res = await fetch(`/api/student/opportunities?${params}`);
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleToggleWatchlist = async (oppId: string, currentSaved: boolean) => {
    try {
      await fetch(`/api/student/opportunities/${oppId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_SAVE", isSaved: !currentSaved })
      });
      const updated = opportunities.map(o => o.id === oppId ? { ...o, isSaved: !currentSaved } : o);
      setOpportunities(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applyModal || !coverLetter.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/student/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: applyModal.id,
          coverLetter
        })
      });
      setApplyModal(null);
      setCoverLetter("");
      await fetchOpportunities();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Internship & Project Opportunities</h1>
          <p className="text-xs text-slate-500 mt-0.5">Apply for industry R&D internships, hardware testbed roles & student research stipends</p>
        </div>
        <button onClick={fetchOpportunities} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { key: "ALL", label: "All Opportunities" },
            { key: "RECOMMENDED", label: "Recommended for You" },
            { key: "SAVED", label: "Saved Watchlist" },
            { key: "APPLIED", label: "Submitted Applications" }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`h-8 px-3.5 text-xs font-bold rounded-lg border transition-all ${
                activeTab === t.key ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search opportunities by title, domain or industry partner..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Opportunities Found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-primary-light text-primary border border-primary-border">
                      {opp.domain}
                    </span>
                    {opp.isRecommended && (
                      <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        ★ Recommended ({opp.eligibilityScore}% Match)
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{opp.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{opp.industryName}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleWatchlist(opp.id, opp.isSaved)}
                    className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${
                      opp.isSaved ? "bg-amber-50 text-amber-600 border-amber-200" : "border-slate-200 text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${opp.isSaved ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>

                  <Link
                    href={`/student/opportunities/${opp.id}`}
                    className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    Details <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  {!opp.hasApplied ? (
                    <button
                      onClick={() => setApplyModal(opp)}
                      className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" /> Apply Now
                    </button>
                  ) : (
                    <span className="h-8 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> {opp.applicationStatus || "Applied"}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">{opp.description}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="text-slate-900 font-extrabold">{formatCurrency(opp.stipend)} / Month Stipend</span>
                  <span>·</span>
                  <span>{opp.durationWeeks} Weeks</span>
                </div>
                <div className="flex gap-1">
                  {opp.requirements.map((req, i) => (
                    <span key={i} className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">{req}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {applyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setApplyModal(null)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary-light text-primary uppercase">{applyModal.domain}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">Apply for Internship</h3>
                </div>
                <button onClick={() => setApplyModal(null)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Statement of Interest & Cover Note *</label>
                  <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={5}
                    placeholder="Briefly describe your course background, C++/MATLAB projects, and why you are interested in this R&D role..."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setApplyModal(null)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitApplication} disabled={submitting || !coverLetter.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
