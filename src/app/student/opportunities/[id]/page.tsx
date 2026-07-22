"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, CheckCircle2, Award, Check, RefreshCw,
  Loader2
} from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/opportunities" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-primary-light text-primary uppercase">{opp.domain}</span>
            <h1 className="text-base font-bold text-slate-900 mt-0.5">{opp.title}</h1>
          </div>
        </div>
        <button onClick={fetchDetail} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main Info Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-extrabold text-base">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{opp.industryName}</h2>
              <p className="text-xs text-slate-500 font-semibold">Eligibility Match: <span className="text-emerald-700 font-bold">{opp.eligibilityScore}%</span></p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-900 block">{formatCurrency(opp.stipend)} / Month</span>
            <span className="text-[9px] text-slate-400 font-semibold block">{opp.durationWeeks} Weeks</span>
          </div>
        </div>

        {/* Application Status Banner */}
        {opp.hasApplied && (
          <div className="bg-green-50/60 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Your application for this position has been submitted and reviewed.</span>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-green-200 text-green-800 uppercase">{opp.applicationStatus || "Applied"}</span>
          </div>
        )}

        {/* Scope */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Role Description</h3>
          <p className="text-slate-600 font-medium leading-relaxed">{opp.description}</p>
        </div>

        {opp.scopeOfWork && (
          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Scope of Tasks</h3>
            <pre className="text-slate-600 font-sans leading-relaxed whitespace-pre-wrap">{opp.scopeOfWork}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
