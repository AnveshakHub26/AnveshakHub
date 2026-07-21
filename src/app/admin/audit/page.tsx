"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderSearch, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap, ShieldAlert, History
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}

// ─── Constants ─────────────────────────────────────────────────────

const MODULES = ["ALL", "AUTH", "CRM", "FINANCE", "GRANTS", "SETTINGS", "OPERATIONS", "HR"];

// ─── Main Page ─────────────────────────────────────────────────────

export default function AuditSecurityLedger() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        module: moduleFilter === "ALL" ? "" : moduleFilter
      });
      const res = await fetch(`/api/admin/audit?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, moduleFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Audit & Security compliance</h1>
            <p className="text-xs text-slate-500 mt-0.5">Audit system events, track workforce permission updates, and export regulatory logs</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLogs} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-655 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button className="h-8 px-4 inline-flex items-center gap-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
              <Download className="h-3.5 w-3.5" /> Export Log CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, action keywords, descriptions…"
            className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">Module Filter</label>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 bg-white focus:outline-none">
            {MODULES.map(m => <option key={m} value={m}>{m === "ALL" ? "All Modules" : m}</option>)}
          </select>
        </div>
      </div>

      {/* ── Main Workspace Content: Timeline Action Log feed ── */}
      <div className="flex-1 overflow-auto p-8 max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><History className="h-4.5 w-4.5 text-primary" /> Compliance Activity Timeline</h3>

            <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="relative text-xs">
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[30px] top-0 h-4 w-4 rounded-full border bg-white flex items-center justify-center border-slate-200 shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 rounded font-bold px-1.5">{log.module}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{log.ipAddress}</span>
                    </div>

                    <p className="text-slate-600 leading-relaxed font-medium">"{log.details}"</p>

                    <div className="text-[9px] text-slate-400 font-semibold mt-1">
                      Triggered by: {log.userEmail} · {new Date(log.timestamp).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
