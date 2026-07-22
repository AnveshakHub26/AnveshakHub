"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, DollarSign, RefreshCw, Plus, Clock, CheckCircle2,
  FileText, Download, Loader2, X, Send, Award, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

interface FinanceMetrics {
  kpis: {
    totalEarnings: number;
    honorariumIncome: number;
    activeGrantsTotal: number;
    pendingReimbursements: number;
  };
  earningsHistory: Array<{
    id: string;
    project: string;
    amount: number;
    type: string;
    status: string;
    date: string;
  }>;
  reimbursements: Array<{
    id: string;
    title: string;
    category: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function ExpertFinancePage() {
  const [data, setData] = useState<FinanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("earnings");

  // Reimbursement Claim Modal
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimTitle, setClaimTitle] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [category, setCategory] = useState("TRAVEL");
  const [submitting, setSubmitting] = useState(false);

  const fetchFinance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/finance");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const handleSubmitClaim = async () => {
    if (!claimTitle.trim() || !claimAmount) return;
    setSubmitting(true);
    try {
      await fetch("/api/expert/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: claimTitle, amount: claimAmount, category })
      });
      setClaimOpen(false);
      setClaimTitle(""); setClaimAmount("");
      await fetchFinance();
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Earnings, Grants & Financial Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track R&D consultancy honorariums, research grant allocations, expense claims & transaction invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/expert/finance/grants" className="h-8 px-3 border border-slate-200 hover:border-primary text-slate-700 hover:text-primary rounded-lg text-xs font-bold flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-primary" /> Research Grants Directory
          </Link>
          <button onClick={fetchFinance} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setClaimOpen(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Submit Expense Claim
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.totalEarnings)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Total Disbursed Earnings</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 font-bold">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.honorariumIncome)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Consultancy Honorariums</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.activeGrantsTotal)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Active R&D Grants</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.kpis.pendingReimbursements)}</div>
            <div className="text-[9px] text-slate-400 font-bold">Pending Expense Claims</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "earnings", label: "Consultancy & Milestone Earnings", icon: DollarSign },
          { key: "reimbursements", label: `Reimbursements & Claims (${data.reimbursements.length})`, icon: Clock }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
                activeTab === t.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[320px]">
        {/* EARNINGS TAB */}
        {activeTab === "earnings" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Itemized Consultancy Payout History</h3>
            <div className="space-y-2">
              {data.earningsHistory.map(ern => (
                <div key={ern.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div>
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{ern.type}</span>
                    <p className="font-bold text-slate-800 mt-1">{ern.project}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{new Date(ern.date).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block">{formatCurrency(ern.amount)}</span>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">{ern.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REIMBURSEMENTS TAB */}
        {activeTab === "reimbursements" && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Expense Reimbursement Claims</h3>
              <button onClick={() => setClaimOpen(true)} className="h-7 px-3 bg-primary text-white rounded-lg font-bold text-[10px] hover:bg-primary-hover flex items-center gap-1">
                <Plus className="h-3 w-3" /> Submit New Claim
              </button>
            </div>

            <div className="space-y-2">
              {data.reimbursements.map(rmb => (
                <div key={rmb.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div>
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">{rmb.category}</span>
                    <p className="font-bold text-slate-800 mt-1">{rmb.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{new Date(rmb.date).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block">{formatCurrency(rmb.amount)}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                      rmb.status === "DISBURSED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>{rmb.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reimbursement Claim Modal */}
      <AnimatePresence>
        {claimOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setClaimOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-primary" /> Submit Expense Reimbursement
                </h3>
                <button onClick={() => setClaimOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Expense Title *</label>
                  <input value={claimTitle} onChange={e => setClaimTitle(e.target.value)} placeholder="e.g. Flight travel for Solaris site inspection"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Amount (INR) *</label>
                    <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} placeholder="12500"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="TRAVEL">Travel & Stay</option>
                      <option value="LAB_EQUIPMENT">Lab Equipment & Hardware</option>
                      <option value="PUBLICATION_FEE">Publication Fee</option>
                      <option value="OTHER">Other Expense</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setClaimOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitClaim} disabled={submitting || !claimTitle.trim() || !claimAmount}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit Claim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
