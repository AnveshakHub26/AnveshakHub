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
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/finance" className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D] hover:bg-[#EFE9DF]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">Research Grants & CSR Funding Directory</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Government DST/SERB core research grants & CSR sponsored project allocations</p>
          </div>
        </div>
        <button onClick={fetchGrants} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
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
              className="card-flat rounded-2xl p-6 space-y-4 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[8px] font-extrabold px-2 py-0.5 rounded bg-purple-50 text-purple-700 uppercase">{g.agency}</span>
                  <h3 className="text-sm font-bold text-[#211F1D]">{g.title}</h3>
                  <p className="text-xs text-[#A8A196] font-semibold">
                    Grant Duration: {new Date(g.startDate).toLocaleDateString("en-IN")} – {new Date(g.endDate).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#211F1D] block">{formatCurrency(g.totalGrantAmount)}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F2EC] text-[#2F6B4F]">{g.status}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#57534E]">Disbursed: <strong className="text-[#211F1D]">{formatCurrency(g.disbursedAmount)}</strong></span>
                  <span className="text-[#78716A]">{utilPct}% Utilized</span>
                </div>
                <div className="h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A36] rounded-full" style={{ width: `${utilPct}%` }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
