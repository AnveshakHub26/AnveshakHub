"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, Filter, RefreshCw, Plus, Eye, CheckCircle2,
  AlertTriangle, Loader2, Star, User, Building2, Globe, Heart,
  ShieldCheck, Award, MessageSquare, Send, Check, X, ArrowUpRight, Zap
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Opportunity {
  id: string;
  title: string;
  description: string;
  domain: string;
  budget: number;
  requirements: string[];
  status: string;
  createdAt: string;
  industry: {
    orgName: string;
    orgType: string;
  };
  applicationsCount: number;
}

interface MatchRecommendation {
  expertId: string;
  name: string;
  matchScore: number;
  reason: string;
  skills: string[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function ExpertMarketplaceHub() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs: opportunities, directory, recommendations, moderation
  const [activeTab, setActiveTab] = useState("opportunities");

  // Search & filter state
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Proposal modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [proposalText, setProposalText] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);

  // Publish opportunity wizard state
  const [publishOpen, setPublishOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubDesc, setPubDesc] = useState("");
  const [pubDomain, setPubDomain] = useState("AI & Smart Grids");
  const [pubBudget, setPubBudget] = useState("");
  const [pubReqs, setPubReqs] = useState("");
  const [pubLoading, setPubLoading] = useState(false);

  // Bookmarking lists
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch opportunities
      const oppParams = new URLSearchParams({
        search,
        domain: domainFilter === "ALL" ? "" : domainFilter
      });
      const resOpp = await fetch(`/api/admin/marketplace/opportunities?${oppParams}`);
      const dataOpp = await resOpp.json();
      setOpportunities(dataOpp.opportunities || []);

      // Fetch reviews and recommendations
      const resReviews = await fetch("/api/admin/marketplace/reviews");
      const dataReviews = await resReviews.json();
      setReviews(dataReviews.reviews || []);
      setRecommendations(dataReviews.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, domainFilter]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  const handleApplyOpportunity = async () => {
    if (!selectedOpp || !proposalText) return;
    setProposalLoading(true);
    try {
      await fetch(`/api/admin/marketplace/opportunities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_PROPOSAL",
          opportunityId: selectedOpp.id,
          proposal: proposalText,
          expertId: "exp-001"
        })
      });
      setProposalModalOpen(false);
      setProposalText("");
      await fetchMarketplace();
    } catch (e) {
      console.error(e);
    } finally {
      setProposalLoading(false);
    }
  };

  const handlePublishOpportunity = async () => {
    if (!pubTitle || !pubBudget) return;
    setPubLoading(true);
    try {
      await fetch("/api/admin/marketplace/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pubTitle,
          description: pubDesc,
          domain: pubDomain,
          budget: parseFloat(pubBudget),
          requirements: pubReqs.split(",").map(r => r.trim()).filter(Boolean),
          industry: { orgName: "BioGen Diagnostics LLP", orgType: "Enterprise Partner" }
        })
      });
      setPublishOpen(false);
      setPubTitle("");
      setPubDesc("");
      setPubBudget("");
      setPubReqs("");
      await fetchMarketplace();
    } catch (e) {
      console.error(e);
    } finally {
      setPubLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">B2B Expert Marketplace</h1>
            <p className="text-xs text-slate-500 mt-0.5">Explore open research calls, send matching recommendations, and invite verified subject experts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchMarketplace} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Hub
            </button>
            <button onClick={() => setPublishOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Publish Consultant Opportunity
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-0 mt-5 border-t border-slate-100 pt-0 -mb-5">
          {[
            { key: "opportunities", label: "Consulting Opportunities", count: opportunities.length },
            { key: "recommendations", label: "AI Match recommendations", count: recommendations.length },
            { key: "reviews", label: "Moderation & Reviews", count: reviews.length }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {tab.label} <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full font-bold">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "opportunities" && (
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunity titles, scopes, requirements…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Filter className="h-3.5 w-3.5" /> Domain Filter
          </button>
        </div>
      )}

      {/* Domain Filters Panel */}
      <AnimatePresence>
        {showFilters && activeTab === "opportunities" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Domain</label>
                <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Domains</option>
                  <option value="AI & Smart Grids">AI & Smart Grids</option>
                  <option value="BioTech">BioTech</option>
                  <option value="Aerospace">Aerospace</option>
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

            {/* ──── OPPORTUNITIES TAB ──── */}
            {activeTab === "opportunities" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map((opp) => (
                  <motion.div
                    key={opp.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{opp.id}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-primary rounded font-bold">{opp.domain}</span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug h-8 line-clamp-2">{opp.title}</h3>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {opp.industry.orgName} · <span className="text-green-600 font-bold">{opp.industry.orgType}</span>
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 h-7 font-medium">"{opp.description}"</p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {opp.requirements.map(r => (
                        <span key={r} className="text-[8px] bg-slate-50 border border-slate-100 text-slate-650 px-1.5 py-0.2 rounded font-semibold">{r}</span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold leading-none">Consulting Budget</span>
                        <span className="font-extrabold text-slate-850 text-xs">{formatCurrency(opp.budget)}</span>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <button onClick={() => toggleBookmark(opp.id)} className="h-8 w-8 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 flex items-center justify-center">
                          <Heart className={`h-4 w-4 ${bookmarks.includes(opp.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOpp(opp);
                            setProposalModalOpen(true);
                          }}
                          className="h-8 px-3.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          Apply <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ──── RECOMMENDATIONS TAB ──── */}
            {activeTab === "recommendations" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><Zap className="h-4.5 w-4.5 text-primary fill-current" /> compliance matching telemetry</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified recommendations linking featured experts and current consulting bids</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec) => (
                    <div key={rec.expertId} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800">{rec.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-150 rounded-full font-bold">{rec.matchScore}% Match Score</span>
                        </div>
                        <p className="text-[10px] text-slate-500 italic mt-2">"{rec.reason}"</p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {rec.skills.map(s => (
                            <span key={s} className="text-[8px] bg-blue-50/50 border border-blue-100 text-primary px-2 py-0.5 rounded font-semibold">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-50 flex gap-2 justify-end">
                        <button className="h-8 px-4 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold">Direct Invite</button>
                        <button className="h-8 px-3 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl text-[10px] font-semibold">View Profile</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ──── MODERATION & REVIEWS TAB ──── */}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reviews List */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Client Testimonials & Ratings</h3>
                  
                  <div className="divide-y divide-slate-100">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">{rev.reviewerName}</span>
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed">"{rev.comment}"</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{new Date(rev.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-primary" /> Compliance Moderation</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <div className="font-semibold text-slate-800">DPIIT Audit Check</div>
                      <p className="text-[10px] text-slate-500">Ensure consultings match the legal limits of government R&D grants.</p>
                    </div>

                    <button className="w-full h-8 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-colors">Run Audit Check</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Proposal Application Modal ── */}
      <AnimatePresence>
        {proposalModalOpen && selectedOpp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setProposalModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850 truncate">Submit Proposal for '{selectedOpp.title}'</h3>
                <button onClick={() => setProposalModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-500 leading-normal">You are applying as a consultant for this project. Outline your proposal, methodology, and availability checks.</p>
                
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Proposal & Scope Details *</label>
                  <textarea value={proposalText} onChange={(e) => setProposalText(e.target.value)} rows={5} placeholder="Describe how your expertise connects with the requirements…" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleApplyOpportunity} disabled={proposalLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {proposalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Submit Proposal
                </button>
                <button onClick={() => setProposalModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Publish Opportunity Wizard Modal ── */}
      <AnimatePresence>
        {publishOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPublishOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850">Publish Consultant Call</h3>
                <button onClick={() => setPublishOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Opportunity Title *</label>
                  <input value={pubTitle} onChange={(e) => setPubTitle(e.target.value)} placeholder="e.g. DNA Sequencing AI Architect" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Detailed Description *</label>
                  <textarea value={pubDesc} onChange={(e) => setPubDesc(e.target.value)} rows={3} placeholder="Outline research consulting expectations…" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Research Domain *</label>
                    <select value={pubDomain} onChange={(e) => setPubDomain(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      <option value="AI & Smart Grids">AI & Smart Grids</option>
                      <option value="BioTech">BioTech</option>
                      <option value="Aerospace">Aerospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Consulting Budget (INR) *</label>
                    <input type="number" value={pubBudget} onChange={(e) => setPubBudget(e.target.value)} placeholder="e.g. 500000" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Key Requirements (comma separated)</label>
                  <input value={pubReqs} onChange={(e) => setPubReqs(e.target.value)} placeholder="e.g. Ph.D, 5+ Yrs Exp, PyTorch" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handlePublishOpportunity} disabled={pubLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {pubLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Publish Call
                </button>
                <button onClick={() => setPublishOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
