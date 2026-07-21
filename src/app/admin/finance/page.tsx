"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, ArrowUpRight, TrendingUp, TrendingDown, Landmark,
  ShieldCheck, AlertTriangle, FileText, X, Check, ArrowRight
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface CostCenter {
  id: string;
  name: string;
  code: string;
  budget: number;
  allocated: number;
}

interface Transaction {
  id: string;
  costCenterCode: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  referenceId: string | null;
  category: string;
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  allocatedBudget: number;
  totalBudget: number;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function FinanceControlConsole() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Create Transaction Drawer inputs
  const [txOpen, setTxOpen] = useState(false);
  const [newType, setNewType] = useState("EXPENSE");
  const [newCC, setNewCC] = useState("RD-UNI-2026");
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRef, setNewRef] = useState("");
  const [newCategory, setNewCategory] = useState("Equipment");
  const [txLoading, setTxLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 10;

  const fetchFinance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        type: typeFilter === "ALL" ? "" : typeFilter,
        page: String(page),
        limit: String(LIMIT)
      });
      const res = await fetch(`/api/admin/finance?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setCostCenters(data.costCenters || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, page]);

  useEffect(() => {
    fetchFinance();
  }, [fetchFinance]);

  const handleCreateTransaction = async () => {
    if (!newAmount || !newDesc) return;
    setTxLoading(true);
    try {
      await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costCenterCode: newCC,
          type: newType,
          amount: parseFloat(newAmount),
          description: newDesc,
          referenceId: newRef || null,
          category: newCategory
        })
      });
      setTxOpen(false);
      setNewAmount("");
      setNewDesc("");
      setNewRef("");
      await fetchFinance();
    } catch (e) {
      console.error(e);
    } finally {
      setTxLoading(false);
    }
  };

  const handleReconcile = async (txId: string) => {
    try {
      await fetch("/api/admin/finance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RECONCILE", txId, status: "RECONCILED" })
      });
      await fetchFinance();
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Financial Governance & Control</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track R&D project budgets, manage MeitY/DST research grant disbursements, and audit invoice payment trails</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchFinance} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setTxOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Record Transaction
            </button>
          </div>
        </div>

        {/* ── Ecosystem Governance Ratios ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Project Budgets", value: "₹1.7Cr", icon: TrendingUp, bg: "bg-green-50", color: "text-green-600" },
              { label: "Disbursed Research Funds", value: "₹65.0L", icon: TrendingDown, bg: "bg-red-50", color: "text-red-500" },
              { label: "Net Platform Margin", value: formatCurrency(stats.netProfit), icon: Wallet, bg: stats.netProfit >= 0 ? "bg-emerald-50" : "bg-red-50", color: stats.netProfit >= 0 ? "text-emerald-600" : "text-red-500" },
              { label: "Allocated Cost Center Pool", value: formatCurrency(stats.allocatedBudget), icon: Landmark, bg: "bg-blue-50", color: "text-primary" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-slate-800">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Main Workspace: Left ledgers, Right audits ── */}
      <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Cost Center allocation ledgers & Project Health */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Cost Center Budget Sheets</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Budget allocations for fiscal year 2026</p>
            </div>

            <div className="space-y-4">
              {costCenters.map((cc) => {
                const consumedPct = Math.min(Math.round((cc.allocated / cc.budget) * 100), 100);
                return (
                  <div key={cc.id} className="space-y-2 border border-slate-100 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 truncate max-w-[170px]">{cc.name}</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{cc.code}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">{formatCurrency(cc.budget)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-450 font-bold uppercase">
                        <span>Consumed</span>
                        <span>{consumedPct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${consumedPct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project specific financial health ratios */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Project Financial Health</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="font-semibold text-slate-650">Solar Micro-Grid (IITM)</span>
                <span className="text-green-600 font-bold">Stable (1.2x burn)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold text-slate-650">MRI Diagnostic Accelerator</span>
                <span className="text-amber-600 font-bold">Under Review (0.8x burn)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Transaction Ledgers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-150">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ledger Transaction Audits</h3>
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter description, categories…"
                  className="h-8 px-2.5 text-xs border border-slate-200 rounded-lg bg-white w-48"
                />
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{tx.description}</div>
                        <div className="text-[9px] text-slate-400 font-semibold">{tx.costCenterCode} · {tx.referenceId || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-550 font-semibold">{tx.category}</td>
                      <td className={`px-4 py-3.5 text-right font-bold ${tx.type === "REVENUE" ? "text-green-600" : "text-slate-800"}`}>
                        {tx.type === "REVENUE" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[8px] px-2 py-0.5 rounded font-bold border ${tx.status === "RECONCILED" ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {tx.status !== "RECONCILED" && (
                          <button onClick={() => handleReconcile(tx.id)} className="h-6 px-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] rounded-md transition-colors">
                            Reconcile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ── Record Transaction Drawer Modal ── */}
      <AnimatePresence>
        {txOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setTxOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Record Financial Transaction</h3>
                <button onClick={() => setTxOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Transaction Type *</label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      <option value="EXPENSE">Expense Outgo</option>
                      <option value="REVENUE">Revenue Inflow</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Cost Center Code *</label>
                    <select value={newCC} onChange={(e) => setNewCC(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      {costCenters.map(cc => <option key={cc.id} value={cc.code}>{cc.code} ({cc.name.split(" ")[0]})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Transaction Category *</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      <option value="Equipment">Equipment Purchase</option>
                      <option value="Stipend">Stipend payout</option>
                      <option value="Platform Fee">Platform Fee commission</option>
                      <option value="Taxation">Taxation reserves</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Reference Code (RefId)</label>
                    <input value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="e.g. PRJ-001 or GNT-001" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Transaction Amount (INR) *</label>
                    <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="e.g. 250000" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Ledger Description *</label>
                    <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="e.g. Incubation hardware server purchase Solaris" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleCreateTransaction} disabled={txLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {txLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Record Log
                </button>
                <button onClick={() => setTxOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
