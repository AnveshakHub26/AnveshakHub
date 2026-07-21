"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft, Landmark, Calendar, Wallet, CheckCircle2,
  XCircle, Clock, AlertTriangle, MessageSquare, User, Building2,
  Mail, Phone, Globe, MapPin, Hash, Plus, Download, Eye, ArrowUpRight,
  Send, Loader2, Play, HardHat, ShieldCheck, Check, X, Video,
  Layers, CheckSquare, Square, FileText, Star
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Review {
  id: string;
  reviewerId: string;
  score: number;
  comments: string;
  decision: string;
}

interface Application {
  id: string;
  applicantName: string;
  title: string;
  proposalUrl: string | null;
  status: string;
  reviewScore: number | null;
  createdAt: string;
  reviews: Review[];
}

interface GrantProfile {
  id: string;
  title: string;
  description: string;
  agency: string;
  schemeType: string;
  amount: number;
  eligibility: string[];
  dueDate: string | null;
  status: string;
  createdAt: string;
  applications: Application[];
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function GrantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<GrantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Review modal inputs
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewScore, setReviewScore] = useState(9);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/grants/${id}`);
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    setActionLoading(true);
    try {
      await fetch(`/api/admin/grants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_APPLICATION_STATUS",
          applicationId: appId,
          status
        })
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedApp || !reviewComment) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/grants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_REVIEW",
          applicationId: selectedApp.id,
          reviewerScore: reviewScore,
          reviewerComments: reviewComment
        })
      });
      setSelectedApp(null);
      setReviewComment("");
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-start gap-4">
          <Link href="/admin/grants">
            <button className="h-7 w-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 mt-0.5">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </Link>
          <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
            <Landmark className="h-5.5 w-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 truncate">{profile.title}</h1>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-primary border border-blue-150 rounded-full font-bold">
                {profile.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Funding Agency: {profile.agency}</p>
          </div>
        </div>
      </div>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Scheme overview and Applications review lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Scheme Scope & Objective</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{profile.description}</p>
          </div>

          {/* Submitted Applications list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Submitted Proposals Queue</h3>
            <div className="space-y-4">
              {profile.applications.map((app) => (
                <div key={app.id} className="border border-slate-100 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 leading-snug">{app.title}</h4>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Submitted by: {app.applicantName} · score {app.reviewScore || "N/A"}</p>
                    </div>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-bold ${app.status === "APPROVED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{app.status}</span>
                  </div>

                  {app.reviews.length > 0 && (
                    <div className="p-2.5 bg-slate-50 rounded-lg space-y-1.5 text-[10px]">
                      <div className="font-bold text-slate-700">Review Committee Outcomes:</div>
                      {app.reviews.map(r => (
                        <div key={r.id} className="text-slate-550">
                          <span className="font-bold">Scored {r.score}/10:</span> "{r.comments}"
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-50/50">
                    <button onClick={() => setSelectedApp(app)} className="h-7 px-3 border border-slate-200 text-slate-650 hover:bg-slate-50 text-[10px] font-bold rounded-lg flex items-center gap-1">+ Record Review</button>
                    {app.status !== "APPROVED" && (
                      <>
                        <button onClick={() => handleUpdateStatus(app.id, "APPROVED")} disabled={actionLoading} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">Approve Scheme</button>
                        <button onClick={() => handleUpdateStatus(app.id, "REJECTED")} disabled={actionLoading} className="h-7 px-3 border border-red-200 text-red-650 text-[10px] font-bold rounded-lg hover:bg-red-50 flex items-center gap-1">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Eligibility Checklist and Budget Pool */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Eligibility & Capital limits</h3>
            <div className="text-xl font-extrabold text-slate-850">₹{profile.amount.toLocaleString("en-IN")}</div>
            <p className="text-[10px] text-slate-450 mt-0.5">Total funding pool</p>
            
            <div className="mt-4 space-y-2 text-xs">
              {profile.eligibility.map((el, i) => (
                <div key={i} className="flex gap-2 items-start py-1 text-slate-650">
                  <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium leading-tight">{el}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-500">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Key Timelines</h3>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="font-semibold">Published Date</span>
              <span className="font-bold text-slate-800">{new Date(profile.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold">Closing Deadline</span>
              <span className="font-bold text-slate-800">{profile.dueDate ? new Date(profile.dueDate).toLocaleDateString("en-IN") : "N/A"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Record Committee Review Modal ── */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855 truncate">Submit Committee Score: {selectedApp.applicantName}</h3>
                <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Committee Score (Out of 10) *</label>
                  <select value={reviewScore} onChange={(e) => setReviewScore(parseInt(e.target.value))} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Points</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Evaluation & Feedback Comments *</label>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} placeholder="Log primary review feedback for the applicant…" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleSubmitReview} disabled={actionLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {actionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Submit Review
                </button>
                <button onClick={() => setSelectedApp(null)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
