"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, CheckCircle2, Award, ShieldCheck,
  Calendar, Clock, Send, Loader2, Bookmark, Check, FileText, Sparkles
} from "lucide-react";
import Link from "next/link";
import HumanEmptyState from "@/components/ui/human-empty-state";

interface OpportunityDetail {
  id: string;
  title: string;
  industryName: string;
  domain: string;
  stipend: number;
  durationWeeks: number;
  deadline: string;
  status: string;
  isSaved: boolean;
  hasApplied: boolean;
  applicationStatus?: string;
  description: string;
  requirements: string[];
  scopeOfWork: string;
  eligibilityScore: number;
}

export default function StudentOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/student/opportunities/${id}`);
      const data = await res.json();
      setOpp(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleApply = async () => {
    if (!opp) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/student/opportunities/${opp.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      if (res.ok) {
        setApplySuccess(true);
        setOpp({ ...opp, hasApplied: true, applicationStatus: "SUBMITTED" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-sm font-semibold text-[#57534E]">Loading opportunity specification…</p>
        </div>
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] p-8">
        <HumanEmptyState
          title="Opportunity Not Found"
          description="This research internship position may have closed or reached candidate review capacity."
          actionLabel="Back to Opportunities"
          actionHref="/student/opportunities"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20 text-left">
      
      {/* Header Banner */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            href="/student/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78716A] hover:text-[#211F1D] mb-4 link-inline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Opportunities List
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-[#FF5A36] uppercase tracking-wider">{opp.domain}</span>
                <span className="badge-forest text-[10px] font-bold">
                  <ShieldCheck className="h-3 w-3" /> SLA Governed
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4]">
                  {opp.eligibilityScore}% Match Score
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#211F1D] mt-1">
                {opp.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#57534E] font-semibold flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4 text-[#FF5A36]" />
                {opp.industryName}
              </p>
            </div>

            <div className="card-flat p-4 bg-[#FBF7F0] rounded-2xl shrink-0 space-y-1">
              <span className="text-[10px] font-bold text-[#78716A] uppercase tracking-wider block">Stipend & Duration</span>
              <p className="font-heading text-2xl font-extrabold text-[#2F6B4F]">
                {formatCurrency(opp.stipend)} <span className="text-xs text-[#57534E] font-normal">/ month</span>
              </p>
              <p className="text-xs text-[#78716A] font-semibold">{opp.durationWeeks} Weeks • Deadline {opp.deadline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Scope & Requirements */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h2 className="font-heading text-base font-bold text-[#211F1D]">
              Research Internship Overview
            </h2>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              {opp.description}
            </p>
          </div>

          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h2 className="font-heading text-base font-bold text-[#211F1D]">
              Detailed Scope of Work & Deliverables
            </h2>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium whitespace-pre-line">
              {opp.scopeOfWork || opp.description}
            </p>
          </div>

          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h2 className="font-heading text-base font-bold text-[#211F1D]">
              Candidate Prerequisites & Skill Requirements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opp.requirements.map((req, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#EFE9DF] border border-[#E2DCD2] flex items-start gap-2 text-xs font-semibold text-[#211F1D]">
                  <CheckCircle2 className="h-4 w-4 text-[#FF5A36] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Application Form / Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-flat p-6 rounded-3xl bg-[#FBF7F0] space-y-4">
            <h3 className="font-heading text-base font-bold text-[#211F1D] border-b border-[#E2DCD2] pb-3">
              Application Status
            </h3>

            {opp.hasApplied || applySuccess ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#E8F2EC] border border-[#BBD9C8] text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-[#2F6B4F] mx-auto" />
                  <h4 className="font-heading text-sm font-bold text-[#211F1D]">
                    Application Submitted
                  </h4>
                  <p className="text-xs text-[#2F6B4F] font-semibold">
                    Your research application is in faculty evaluation queue. Corporate leads respond within 5-7 days.
                  </p>
                </div>
                <Link href="/student/projects" className="btn-secondary w-full justify-center text-xs">
                  View My Applications
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#57534E] font-medium">
                  Submit a brief cover statement explaining your research experience relevant to this position.
                </p>

                <div>
                  <label className="form-label">Cover Statement (Optional)</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe relevant coursework, ROS/Python experience, or past lab projects..."
                    className="input-field text-xs"
                  />
                </div>

                <button
                  onClick={handleApply}
                  disabled={submitting}
                  className="btn-primary w-full justify-center text-xs py-3"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Submit Application</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
