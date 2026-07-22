"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, RefreshCw, Bookmark, Star, Calendar,
  Loader2, ChevronRight, CheckCircle2, Award, ArrowUpRight,
  FileText, Clock, Send, X, Layers
} from "lucide-react";
import Link from "next/link";

interface Opportunity {
  id: string;
  title: string;
  industryName: string;
  domain: string;
  budget: number;
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

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");

  const [proposalModal, setProposalModal] = useState<Opportunity | null>(null);
  const [proposedBudget, setProposedBudget] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("16");
  const [proposalText, setProposalText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, tab: activeTab, domain: domainFilter });
      const res = await fetch(`/api/expert/opportunities?${params}`);
      const data = await res.json();
      setOpportunities(data.opportunities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab, domainFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleToggleWatchlist = async (oppId: string, currentSaved: boolean) => {
    try {
      await fetch(`/api/expert/opportunities/${oppId}`, {
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

  const handleSubmitProposal = async () => {
    if (!proposalModal || !proposalText.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/expert/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: proposalModal.id,
          proposedBudget,
          durationWeeks,
          proposal: proposalText
        })
      });
      setProposalModal(null);
      setProposalText(""); setProposedBudget("");
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
          <h1 className="text-xl font-bold text-slate-900">Industry Opportunities & RFPs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Discover research problem statements, submit Expression of Interest (EOI) proposals & engage with industry partners</p>
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
            { key: "APPLIED", label: "Submitted Proposals" }
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
            placeholder="Search problem statements, domain or industry partner..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Opportunities Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Try switching tabs or adjusting search criteria.</p>
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
                    title={opp.isSaved ? "Saved in Watchlist" : "Save to Watchlist"}
                  >
                    <Bookmark className={`h-4 w-4 ${opp.isSaved ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>

                  <Link
                    href={`/expert/opportunities/${opp.id}`}
                    className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    Details <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  {!opp.hasApplied ? (
                    <button
                      onClick={() => {
                        setProposalModal(opp);
                        setProposedBudget(opp.budget.toString());
                      }}
                      className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5"
                    >
                      <Send className="h-3 w-3" /> Submit EOI
                    </button>
                  ) : (
                    <span className="h-8 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> {opp.applicationStatus || "Applied"}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">{opp.description}</p>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="text-slate-900 font-extrabold">{formatCurrency(opp.budget)} Grants/Budget</span>
                  <span>·</span>
                  <span>{opp.durationWeeks} Weeks Estimated</span>
                  <span>·</span>
                  <span>Deadline: {new Date(opp.deadline).toLocaleDateString("en-IN")}</span>
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

      {/* Submit Proposal Modal */}
      <AnimatePresence>
        {proposalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setProposalModal(null)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary-light text-primary uppercase">{proposalModal.domain}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">Submit Expression of Interest (EOI)</h3>
                </div>
                <button onClick={() => setProposalModal(null)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Proposed R&D Budget (INR) *</label>
                    <input
                      type="number"
                      value={proposedBudget}
                      onChange={e => setProposedBudget(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Duration (Weeks)</label>
                    <input
                      type="number"
                      value={durationWeeks}
                      onChange={e => setDurationWeeks(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Technical Approach & Proposal Summary *</label>
                  <textarea
                    value={proposalText}
                    onChange={e => setProposalText(e.target.value)}
                    rows={5}
                    placeholder="Outline your research methodology, expected deliverables, SIMULINK/ROS2 architecture, and student intern involvement..."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setProposalModal(null)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitProposal} disabled={submitting || !proposalText.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit EOI Proposal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
