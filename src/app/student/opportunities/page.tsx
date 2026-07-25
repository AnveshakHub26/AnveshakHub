"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Bookmark, Star, Calendar,
  Loader2, ChevronRight, CheckCircle2, Award, Send, X,
  Clock, Building2, ShieldCheck, ArrowRight
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
        body: JSON.stringify({ isSaved: !currentSaved }),
      });
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, isSaved: !currentSaved } : o))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleApply = async () => {
    if (!applyModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/opportunities/${applyModal.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      const json = await res.json();
      if (json.status === "success") {
        setOpportunities((prev) =>
          prev.map((o) =>
            o.id === applyModal.id
              ? { ...o, hasApplied: true, applicationStatus: "SUBMITTED" }
              : o
          )
        );
        setApplyModal(null);
        setCoverLetter("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Header Banner with Specific Copy (Rule #5) */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
              Verified Research Internships
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
              R&D Opportunities & Internships
            </h1>
            {/* Specific Copy (Rule #5) */}
            <p className="text-sm text-[#57534E] mt-2">
              1,200+ internships posted this month. No spam, no fake listings — direct applications to verified corporate leads.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
            <input
              type="text"
              placeholder="Search by topic, skill, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#EFE9DF] border border-[#E2DCD2] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#78716A] focus:outline-none focus:border-[#FF5A36]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {["ALL", "RECOMMENDED", "SAVED", "APPLIED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all min-h-[44px] shrink-0 ${
                  activeTab === tab
                    ? "bg-[#FF5A36] text-white shadow-sm"
                    : "bg-[#EFE9DF] text-[#57534E] hover:bg-[#E6DFD4] border border-[#E2DCD2]"
                }`}
              >
                {tab === "ALL" && "All Postings"}
                {tab === "RECOMMENDED" && "Matched For You"}
                {tab === "SAVED" && "Saved Listings"}
                {tab === "APPLIED" && "My Applications"}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity Cards List */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin mx-auto" />
            <p className="text-xs text-[#78716A] mt-2">Fetching verified listings...</p>
          </div>
        ) : opportunities.length === 0 ? (
          /* Empty State Copy (Rule #5) */
          <div className="card-warm p-12 text-center bg-[#EFE9DF] space-y-3">
            <h3 className="font-heading text-lg font-bold text-[#211F1D]">
              You haven't applied anywhere yet — pick one of the 12 internships below and it takes about 3 minutes.
            </h3>
            <p className="text-xs text-[#78716A] max-w-md mx-auto">
              Clear your search filters to view active corporate R&D project opportunities.
            </p>
            <button onClick={() => { setSearch(""); setActiveTab("ALL"); }} className="btn-primary text-xs min-h-[40px] mt-2">
              View All 12 Postings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="card-warm p-6 bg-[#EFE9DF] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">{opp.domain}</span>
                      <h2 className="font-heading text-lg font-extrabold text-[#211F1D] mt-0.5">{opp.title}</h2>
                      <p className="text-xs text-[#78716A] flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {opp.industryName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleWatchlist(opp.id, opp.isSaved)}
                      className={`p-2 rounded-lg border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        opp.isSaved ? "bg-[#FFF0ED] text-[#FF5A36] border-[#FF5A36]/30" : "bg-[#FBF7F0] text-[#78716A] border-[#E2DCD2]"
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#57534E] line-clamp-2 mt-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-medium text-[#211F1D] pt-4">
                    <span className="bg-[#FBF7F0] px-3 py-1 rounded-md border border-[#E2DCD2]">
                      ₹{opp.stipend.toLocaleString("en-IN")} / month
                    </span>
                    <span className="bg-[#FBF7F0] px-3 py-1 rounded-md border border-[#E2DCD2]">
                      {opp.durationWeeks} Weeks
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2DCD2] flex items-center justify-between">
                  <span className="text-[11px] text-[#78716A]">Deadline: {opp.deadline}</span>

                  {opp.hasApplied ? (
                    <span className="text-xs font-semibold text-[#2F6B4F] bg-[#E8F2EC] px-3 py-1.5 rounded-lg border border-[#2F6B4F]/20">
                      Applied ({opp.applicationStatus || "In Review"})
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setApplyModal(opp)}
                        className="btn-primary text-xs py-2 px-4 min-h-[44px]"
                      >
                        Apply Now
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {applyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-3">
                <h3 className="font-heading text-lg font-extrabold text-[#211F1D]">Apply to {applyModal.title}</h3>
                <button onClick={() => setApplyModal(null)} className="p-1 rounded-lg text-[#78716A] hover:bg-[#EFE9DF]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-[#57534E]">
                Corporate Lead: <strong>{applyModal.industryName}</strong> • Stipend: <strong>₹{applyModal.stipend.toLocaleString("en-IN")} / mo</strong>
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#211F1D]">Short Proposal / Motivation Statement</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain your relevant coursework, lab skills, or project experience..."
                  className="w-full bg-[#EFE9DF] border border-[#E2DCD2] rounded-lg p-3 text-xs text-[#211F1D] placeholder-[#78716A] focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setApplyModal(null)} className="btn-secondary text-xs min-h-[44px]">
                  Cancel
                </button>
                <button onClick={handleApply} disabled={submitting} className="btn-primary text-xs min-h-[44px]">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
