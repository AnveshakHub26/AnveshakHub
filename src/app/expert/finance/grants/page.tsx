"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Award, ArrowLeft, RefreshCw, Loader2, Building2, CheckCircle2,
  Calendar, DollarSign
} from "lucide-react";
import Link from "next/link";

interface ResearchGrant {
  id: string;
  title: string;
  agency: string;
  totalGrantAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  status: string;
  startDate: string;
  endDate: string;
}

export default function ExpertResearchGrantsPage() {
  const [grants, setGrants] = useState<ResearchGrant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/finance/grants");
      const data = await res.json();
      setGrants(data.grants || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

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

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/finance" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Research Grants & CSR Funding Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">Government DST/SERB core research grants & CSR sponsored project allocations</p>
          </div>
        </div>
        <button onClick={fetchGrants} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Grants Cards */}
      <div className="space-y-4">
        {grants.map((g, idx) => {
          const utilPct = Math.round((g.disbursedAmount / g.totalGrantAmount) * 100);
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">{g.agency}</span>
                  <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Grant Duration: {new Date(g.startDate).toLocaleDateString("en-IN")} – {new Date(g.endDate).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 block">{formatCurrency(g.totalGrantAmount)}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">{g.status}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Disbursed: <strong className="text-slate-900">{formatCurrency(g.disbursedAmount)}</strong></span>
                  <span className="text-slate-500">{utilPct}% Utilized</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${utilPct}%` }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
