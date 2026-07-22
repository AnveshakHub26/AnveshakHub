"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Search, RefreshCw, Plus, ArrowLeft, CheckCircle2,
  Clock, Award, Loader2, X, DollarSign, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Milestone {
  milestone: string;
  amount: number;
  status: string;
  date: string;
}

interface GrantItem {
  id: string;
  title: string;
  agency: string;
  schemeType: string;
  amount: number;
  disbursedAmount: number;
  remainingAmount: number;
  eligibility: string[];
  dueDate: string;
  status: string;
  milestones: Milestone[];
}

export default function GrantsTrackerPage() {
  const [grants, setGrants] = useState<GrantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("ALL");

  const [addGrantOpen, setAddGrantOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newAgency, setNewAgency] = useState("DPIIT");
  const [newScheme, setNewScheme] = useState("CSR");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchGrants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, agency: agencyFilter });
      const res = await fetch(`/api/industry/finance/grants?${params}`);
      const data = await res.json();
      setGrants(data.grants || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, agencyFilter]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const handleAddGrant = async () => {
    if (!newTitle || !newAmount) return;
    setSaving(true);
    try {
      await fetch("/api/industry/finance/grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          agency: newAgency,
          schemeType: newScheme,
          amount: newAmount,
          dueDate: newDueDate
        })
      });
      setAddGrantOpen(false);
      setNewTitle(""); setNewAmount(""); setNewDueDate("");
      await fetchGrants();
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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/industry/finance" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Grants & CSR Funding Tracker</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track government research grants, DPIIT funding & CSR disbursement schedules</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchGrants} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setAddGrantOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Register Funding Scheme
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search grants by title or funding agency..."
            className="pl-9 pr-3 h-8 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Agency:</span>
          {["ALL", "DPIIT", "DST", "MeitY", "CSR"].map(a => (
            <button
              key={a}
              onClick={() => setAgencyFilter(a)}
              className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                agencyFilter === a ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Grant Cards List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : grants.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <PieChart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Funding Schemes Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Register a new grant or CSR scheme.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grants.map((grant, idx) => {
            const pct = Math.round((grant.disbursedAmount / grant.amount) * 100);
            return (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">{grant.agency}</span>
                        <h3 className="text-xs font-bold text-slate-800">{grant.title}</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Scheme Type: {grant.schemeType} · Application Due: {new Date(grant.dueDate).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-purple-700 block">{formatCurrency(grant.amount)}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">{pct}% Disbursed ({formatCurrency(grant.disbursedAmount)})</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Disbursed: {formatCurrency(grant.disbursedAmount)}</span>
                    <span>Remaining: {formatCurrency(grant.remainingAmount)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Milestone Tranches */}
                {grant.milestones && grant.milestones.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Disbursement Tranches</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {grant.milestones.map((m, i) => (
                        <div key={i} className={`border rounded-xl p-2.5 flex items-center justify-between text-xs ${
                          m.status === "DISBURSED" ? "bg-green-50/50 border-green-100" : "bg-slate-50 border-slate-100"
                        }`}>
                          <div>
                            <p className="font-bold text-slate-700 text-[10px] line-clamp-1">{m.milestone}</p>
                            <p className="text-[8px] text-slate-400 font-semibold">{new Date(m.date).toLocaleDateString("en-IN")}</p>
                          </div>
                          <span className={`text-[9px] font-extrabold ${m.status === "DISBURSED" ? "text-green-700" : "text-slate-400"}`}>
                            {formatCurrency(m.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Grant Modal */}
      <AnimatePresence>
        {addGrantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddGrantOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-primary" /> Register Funding / Grant Scheme
                </h3>
                <button onClick={() => setAddGrantOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Grant / Scheme Title *</label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. DPIIT Clean Energy Scaleup Grant"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Funding Agency</label>
                    <select value={newAgency} onChange={e => setNewAgency(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="DPIIT">DPIIT</option>
                      <option value="DST">DST</option>
                      <option value="MeitY">MeitY</option>
                      <option value="CSR">CSR Corporate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Grant Amount (INR) *</label>
                    <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="e.g. 5000000"
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Application Due Date</label>
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setAddGrantOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddGrant} disabled={saving || !newTitle || !newAmount}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Register Funding Scheme
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
