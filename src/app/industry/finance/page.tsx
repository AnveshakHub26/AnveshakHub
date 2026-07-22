"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, RefreshCw, Plus,
  Search, FileText, ArrowUpRight, ArrowDownRight, Loader2, X,
  Briefcase, CheckCircle2, PieChart, Layers
} from "lucide-react";
import Link from "next/link";

interface FinanceDashboardData {
  summary: {
    totalAllocatedBudget: number;
    totalUtilizedFunds: number;
    remainingBudget: number;
    totalGrantsDisbursed: number;
    pendingInvoicesCount: number;
    pendingInvoicesAmount: number;
  };
  costCenters: Array<{
    id: string;
    code: string;
    name: string;
    allocated: number;
    spent: number;
    utilization: number;
  }>;
  projectBudgets: Array<{
    id: string;
    name: string;
    totalBudget: number;
    spent: number;
    status: string;
  }>;
  monthlyBurnRate: Array<{
    month: string;
    revenue: number;
    expense: number;
  }>;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  costCenterCode: string;
  costCenterName: string;
  status: string;
  description: string;
  referenceId: string | null;
  category: string;
  paymentMethod: string;
  createdAt: string;
}

export default function EnterpriseFinancePage() {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [txSearch, setTxSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [addTxOpen, setAddTxOpen] = useState(false);

  // Form State
  const [txType, setTxType] = useState("EXPENSE");
  const [txAmount, setTxAmount] = useState("");
  const [txCostCenter, setTxCostCenter] = useState("CC-RND");
  const [txDesc, setTxDesc] = useState("");
  const [txCategory, setTxCategory] = useState("Equipment");
  const [txMethod, setTxMethod] = useState("BANK_TRANSFER");
  const [txRef, setTxRef] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchFinance = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, txRes] = await Promise.all([
        fetch("/api/industry/finance/dashboard"),
        fetch(`/api/industry/finance/transactions?search=${txSearch}&type=${typeFilter}`)
      ]);
      const dashData = await dashRes.json();
      const txData = await txRes.json();
      setData(dashData);
      setTransactions(txData.transactions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [txSearch, typeFilter]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const handleAddTx = async () => {
    if (!txAmount || !txDesc) return;
    setSaving(true);
    try {
      await fetch("/api/industry/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: txType,
          amount: txAmount,
          costCenterCode: txCostCenter,
          description: txDesc,
          category: txCategory,
          paymentMethod: txMethod,
          referenceId: txRef
        })
      });
      setAddTxOpen(false);
      setTxAmount(""); setTxDesc(""); setTxRef("");
      await fetchFinance();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enterprise Finance & Budget Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time budget utilization, cost center allocation & financial transaction ledger</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/industry/finance/grants" className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">
            <PieChart className="h-3.5 w-3.5 text-primary" /> Grants & CSR Tracker
          </Link>
          <button onClick={fetchFinance} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setAddTxOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Log Transaction
          </button>
        </div>
      </div>

      {/* High-Impact Stat Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wide">Total Allocated Budget</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-extrabold text-slate-900">{formatCurrency(data.summary.totalAllocatedBudget)}</div>
            <p className="text-[9px] text-slate-400 font-semibold">Authorized for FY 2026</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wide">Utilized Funds</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-lg font-extrabold text-emerald-700">{formatCurrency(data.summary.totalUtilizedFunds)}</div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(data.summary.totalUtilizedFunds / data.summary.totalAllocatedBudget) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wide">Remaining Reserves</span>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-extrabold text-blue-700">{formatCurrency(data.summary.remainingBudget)}</div>
            <p className="text-[9px] text-slate-400 font-semibold">Available for project expansion</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wide">Grants Received</span>
              <PieChart className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-extrabold text-purple-700">{formatCurrency(data.summary.totalGrantsDisbursed)}</div>
            <p className="text-[9px] text-purple-600 font-bold">DPIIT & DST Schemes</p>
          </div>
        </div>
      )}

      {/* Cost Center Breakdown */}
      {data && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Cost Center Budget Allocation</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Budget spent across R&D, stipends, CSR, and platform operations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.costCenters.map(cc => (
              <div key={cc.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{cc.code}</span>
                  <span className="text-[9px] font-bold text-slate-700">{cc.utilization}%</span>
                </div>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{cc.name}</p>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {formatCurrency(cc.spent)} / {formatCurrency(cc.allocated)}
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${cc.utilization}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Ledger & Transactions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Financial Transaction Ledger</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Complete record of revenues, expenses, equipment purchases & stipends</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={txSearch}
                onChange={e => setTxSearch(e.target.value)}
                placeholder="Search ledger..."
                className="pl-8 pr-3 h-8 w-44 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            {["ALL", "EXPENSE", "REVENUE"].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`h-8 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                  typeFilter === t ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-36">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-[10px] text-slate-400 text-center py-8">No transaction entries found.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold ${
                    tx.type === "REVENUE" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}>
                    {tx.type === "REVENUE" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{tx.description}</p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 font-semibold mt-0.5">
                      <span>{tx.costCenterName}</span>
                      <span>·</span>
                      <span>Ref: {tx.referenceId}</span>
                      <span>·</span>
                      <span>{new Date(tx.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold block ${tx.type === "REVENUE" ? "text-emerald-700" : "text-slate-900"}`}>
                    {tx.type === "REVENUE" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 block mt-0.5">{tx.paymentMethod.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Transaction Modal */}
      <AnimatePresence>
        {addTxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddTxOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-primary" /> Log Financial Transaction
                </h3>
                <button onClick={() => setAddTxOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Transaction Type</label>
                    <select value={txType} onChange={e => setTxType(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="EXPENSE">EXPENSE</option>
                      <option value="REVENUE">REVENUE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Amount (INR) *</label>
                    <input type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="e.g. 50000"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cost Center</label>
                  <select value={txCostCenter} onChange={e => setTxCostCenter(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                    <option value="CC-RND">R&D Prototyping & Equipment (CC-RND)</option>
                    <option value="CC-STIPEND">Student Intern Stipends (CC-STIPEND)</option>
                    <option value="CC-CSR">CSR Clean Energy (CC-CSR)</option>
                    <option value="CC-OPS">Compliance & Ops (CC-OPS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Description *</label>
                  <input value={txDesc} onChange={e => setTxDesc(e.target.value)} placeholder="e.g. Equipment invoice payment"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Payment Method</label>
                    <select value={txMethod} onChange={e => setTxMethod(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs">
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="NEFT">NEFT / RTGS</option>
                      <option value="DIRECT_DEBIT">Direct Debit</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Reference / Invoice #</label>
                    <input value={txRef} onChange={e => setTxRef(e.target.value)} placeholder="INV-2026-090"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setAddTxOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddTx} disabled={saving || !txAmount || !txDesc}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Record Ledger Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
