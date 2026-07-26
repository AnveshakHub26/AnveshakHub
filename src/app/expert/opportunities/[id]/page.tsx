"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bookmark, Calendar, CheckCircle2, Award, Clock,
  Send, RefreshCw, Loader2, Building2, Check, FileText, X
} from "lucide-react";
import Link from "next/link";

interface OpportunityDetail {
  id: string;
  title: string;
  industryName: string;
  domain: string;
  budget: number;
  durationWeeks: number;
  deadline: string;
  status: string;
  isSaved: boolean;
  hasApplied: boolean;
  description: string;
  requirements: string[];
  scopeOfWork: string;
  eligibilityScore: number;
  matchingSkills: string[];
  application: {
    id: string;
    proposedBudget: number;
    durationWeeks: number;
    status: string;
    proposal: string;
    createdAt: string;
  } | null;
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [opp, setOpp] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/expert/opportunities/${id}`);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!opp) return null;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header Back Bar */}
      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/opportunities" className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D] hover:bg-[#FBF7F0]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-primary-light text-primary uppercase">{opp.domain}</span>
            <h1 className="text-base font-bold text-[#211F1D] mt-0.5">{opp.title}</h1>
          </div>
        </div>
        <button onClick={fetchDetail} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Info Box */}
      <div className="bg-white border border-[#E2DCD2] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#FFF0ED] text-primary flex items-center justify-center font-extrabold text-base">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#211F1D]">{opp.industryName}</h2>
              <p className="text-xs text-[#78716A] font-semibold">Eligibility Match: <span className="text-emerald-700 font-bold">{opp.eligibilityScore}%</span></p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold text-[#211F1D] block">{formatCurrency(opp.budget)}</span>
            <span className="text-[9px] text-[#A8A196] font-semibold block">{opp.durationWeeks} Weeks Estimated</span>
          </div>
        </div>

        {/* Status Alert if Applied */}
        {opp.application && (
          <div className="bg-[#E8F2EC]/60 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>You submitted an EOI proposal for this opportunity on {new Date(opp.application.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-green-200 text-green-800 uppercase">{opp.application.status}</span>
          </div>
        )}

        {/* Detailed Scope */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-[#211F1D] uppercase tracking-wide text-[10px]">Problem Statement Overview</h3>
          <p className="text-[#57534E] font-medium leading-relaxed">{opp.description}</p>
        </div>

        {/* Scope Breakdown */}
        {opp.scopeOfWork && (
          <div className="space-y-2 text-xs border-t border-[#E2DCD2] pt-3">
            <h3 className="font-bold text-[#211F1D] uppercase tracking-wide text-[10px]">Scope of Work & Deliverables</h3>
            <pre className="text-[#57534E] font-sans leading-relaxed whitespace-pre-wrap">{opp.scopeOfWork}</pre>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-2 text-xs border-t border-[#E2DCD2] pt-3">
          <h3 className="font-bold text-[#211F1D] uppercase tracking-wide text-[10px]">Technical Requirements</h3>
          <ul className="space-y-1">
            {opp.requirements.map((req, i) => (
              <li key={i} className="flex items-center gap-2 text-[#57534E] font-medium">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
