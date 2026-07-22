"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Star, BookOpen, Briefcase, Globe,
  Loader2, RefreshCw, ChevronRight, X, CheckCircle2, ExternalLink,
  Award, Clock, Send
} from "lucide-react";
import Link from "next/link";

interface Expert {
  id: string;
  name: string;
  designation: string;
  institution: string;
  department: string;
  bio: string;
  domains: string[];
  skills: string[];
  yearsOfExp: number;
  rating: number;
  reviewsCount: number;
  availability: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  publications: number;
  linkedinUrl: string | null;
}

const AVAILABILITY_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  AVAILABLE:           { label: "Available",          bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  PARTIALLY_AVAILABLE: { label: "Partly Available",   bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  UNAVAILABLE:         { label: "Unavailable",        bg: "bg-slate-100", text: "text-slate-500",  dot: "bg-slate-400" }
};

const DOMAIN_FILTERS = ["ALL", "AI/ML", "Clean Energy", "Hardware & IoT", "Robotics & Control", "Power Electronics", "Biotech"];

export default function ExpertMarketplacePage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [hireModal, setHireModal] = useState<Expert | null>(null);
  const [hireMessage, setHireMessage] = useState("");
  const [hireProjectId, setHireProjectId] = useState("prj-001");
  const [hiringSaving, setHiringSaving] = useState(false);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, domain: domainFilter });
      const res = await fetch(`/api/industry/experts?${params}`);
      const data = await res.json();
      setExperts(data.experts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, domainFilter]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const handleHire = async () => {
    if (!hireModal || !hireMessage.trim()) return;
    setHiringSaving(true);
    try {
      await fetch("/api/industry/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertId: hireModal.id,
          projectId: hireProjectId,
          message: hireMessage,
          engagementType: "PROJECT_CONSULTATION"
        })
      });
      setHireModal(null);
      setHireMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setHiringSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Expert Collaboration Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Discover and engage subject-matter experts for project mentorship, consultation, and collaboration</p>
        </div>
        <button onClick={fetchExperts} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, institution, domain or skill..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Domain:</span>
          {DOMAIN_FILTERS.map(d => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                domainFilter === d ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Expert Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : experts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Experts Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {experts.map((expert, idx) => {
            const avail = AVAILABILITY_STYLES[expert.availability] || AVAILABILITY_STYLES.AVAILABLE;
            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                {/* Top section */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-light text-primary font-extrabold flex items-center justify-center text-base shrink-0">
                      {expert.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors truncate">
                          {expert.name}
                        </h3>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 ${avail.bg} ${avail.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${avail.dot}`} />{avail.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">{expert.designation}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{expert.institution}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-medium">{expert.bio}</p>

                  {/* Domain Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {expert.domains.map((d, i) => (
                      <span key={i} className="text-[8px] bg-primary-light text-primary-text border border-primary-border px-2 py-0.5 rounded font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: "Exp.", value: `${expert.yearsOfExp}yr` },
                      { label: "Rating", value: `★ ${expert.rating}` },
                      { label: "Projects", value: expert.completedProjectsCount },
                      { label: "Pubs.", value: expert.publications }
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className="text-[10px] font-extrabold text-slate-700">{stat.value}</div>
                        <div className="text-[8px] text-slate-400 font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHireModal(expert)}
                      className="flex-1 h-7 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-hover transition-colors"
                    >
                      Invite to Collaborate
                    </button>
                    <Link
                      href={`/industry/marketplace/${expert.id}`}
                      className="h-7 px-2.5 border border-slate-200 text-slate-600 hover:text-primary hover:border-primary rounded-lg flex items-center gap-1 text-[10px] font-bold transition-colors"
                    >
                      Profile <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Hire / Invite Modal */}
      <AnimatePresence>
        {hireModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setHireModal(null)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Invite Expert to Collaborate</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{hireModal.name} · {hireModal.institution}</p>
                </div>
                <button onClick={() => setHireModal(null)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Link to Project</label>
                  <select
                    value={hireProjectId}
                    onChange={e => setHireProjectId(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                  >
                    <option value="prj-001">Solar Micro-Grid for IIT Madras</option>
                    <option value="prj-004">Autonomous Rover Control Module</option>
                    <option value="">General Consultation (No Project)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Invitation Message *</label>
                  <textarea
                    value={hireMessage}
                    onChange={e => setHireMessage(e.target.value)}
                    rows={4}
                    placeholder={`Introduce your project and explain how ${hireModal.name.split(" ")[0]}'s expertise would help...`}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={() => setHireModal(null)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleHire}
                  disabled={hiringSaving || !hireMessage.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5"
                >
                  {hiringSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
