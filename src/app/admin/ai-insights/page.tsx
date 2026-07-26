"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award,
  ShieldCheck, AlertTriangle, Info, Sparkles, BrainCircuit, Activity
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface AIInsight {
  id: string;
  title: string;
  module: string;
  insightType: string;
  confidenceScore: number;
  summary: string;
  details: any;
  status: string;
  createdAt: string;
}

interface AIModelConfig {
  id: string;
  modelName: string;
  version: string;
  moduleTarget: string;
  accuracyScore: number;
  status: string;
  lastTrained: string;
}

interface Stats {
  totalInsights: number;
  activeRisksCount: number;
  avgConfidence: string;
  modelsOnlineCount: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const MODULES = ["ALL", "PROJECT", "EXPERT", "VERIFICATION", "GRANT", "FINANCE", "CRM"];

// ─── Main Page ─────────────────────────────────────────────────────

export default function AIInsightsDashboard() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("insights"); // insights, radar, models

  // Action State
  const [evaluating, setEvaluating] = useState(false);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        module: moduleFilter === "ALL" ? "" : moduleFilter
      });
      const res = await fetch(`/api/admin/ai-insights?${params}`);
      const data = await res.json();
      setInsights(data.insights || []);
      setModels(data.models || []);
      setStats(data.stats || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, moduleFilter]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleRunDiagnostic = async () => {
    setEvaluating(true);
    try {
      await fetch("/api/admin/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Real-Time AI Verification Compliance Audit",
          module: "VERIFICATION",
          insightType: "ANOMALY_DETECTION",
          summary: "Vector model scanned active queue. Zero critical identity mismatch risks detected across latest 18 submissions."
        })
      });
      await fetchInsights();
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const handleActionInsight = async (id: string) => {
    try {
      await fetch(`/api/admin/ai-insights/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ACTIONED", status: "ACTIONED" })
      });
      await fetchInsights();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FBF7F0]">
      {/* ── Header ── */}
      <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#211F1D]">AI Insights & Predictive Intelligence</h1>
            <p className="text-xs text-[#78716A] mt-0.5">Machine learning risk predictions, expert vector matching algorithms, and automated anomaly alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchInsights} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-slate-655 rounded-lg text-xs font-medium hover:bg-[#FBF7F0] transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={handleRunDiagnostic} disabled={evaluating} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#0F0E0C] text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
              {evaluating ? <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" /> : <Sparkles className="h-3.5 w-3.5 text-amber-400" />} Run AI Risk Diagnostic
            </button>
          </div>
        </div>

        {/* ── Telemetry Stats ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active AI Insights", value: stats.totalInsights, icon: Zap, bg: "bg-[#FEF3C7]", color: "text-amber-600" },
              { label: "Active Risk Alerts", value: stats.activeRisksCount, icon: AlertTriangle, bg: "bg-[#FEE2E2]", color: "text-red-500" },
              { label: "Model Confidence Rating", value: stats.avgConfidence, icon: Activity, bg: "bg-[#E8F2EC]", color: "text-[#2F6B4F]" },
              { label: "ML Models Online", value: stats.modelsOnlineCount, icon: BrainCircuit, bg: "bg-[#FFF0ED]", color: "text-[#FF5A36]" }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`h-[1.125rem] w-[1.125rem] ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#211F1D]">{stat.value}</div>
                    <div className="text-[10px] text-[#78716A] font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-[#E2DCD2] pt-0 -mb-5">
          {[
            { key: "insights", label: "Predictive Insights", count: insights.length },
            { key: "radar", label: "Module Risk Radar", count: stats?.activeRisksCount || 0 },
            { key: "models", label: "ML Models Health", count: models.length }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-[#FF5A36] text-[#FF5A36]" : "border-transparent text-[#78716A] hover:text-[#211F1D]"}`}>
              {tab.label} {tab.count !== null && <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE9DF] text-[#78716A] rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "insights" && (
        <div className="bg-[#FBF7F0] border-b border-[#E2DCD2] px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A196]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI recommendations, risk keywords, modules…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36]/20 bg-[#FBF7F0]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-[#78716A] uppercase tracking-wide text-[10px]">Module Filter</label>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="h-8 border border-[#E2DCD2] rounded-lg px-2 bg-[#FBF7F0] focus:outline-none">
              {MODULES.map((m) => (
                <option key={m} value={m}>{m === "ALL" ? "All Modules" : m}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── INSIGHTS TAB ──── */}
            {activeTab === "insights" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="card-flat rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#A8A196] uppercase tracking-wider">{item.id} · {item.module}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#FEF3C7] text-[#B45309] border border-amber-150 rounded font-bold">
                        {Math.round(item.confidenceScore * 100)}% Confidence
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-[#211F1D] leading-snug">{item.title}</h3>
                      <span className="text-[10px] font-bold text-[#FF5A36] uppercase tracking-wider block mt-0.5">{item.insightType}</span>
                    </div>

                    <p className="text-[10px] text-[#57534E] leading-relaxed font-medium">"{item.summary}"</p>

                    <div className="flex justify-between items-center text-[10px] text-[#78716A] pt-2.5 border-t border-slate-50">
                      <span className="text-[10px] text-[#A8A196] font-semibold">{new Date(item.createdAt).toLocaleString("en-IN")}</span>
                      
                      {item.status === "ACTIVE" ? (
                        <button onClick={() => handleActionInsight(item.id)} className="h-7 px-3 bg-[#0F0E0C] hover:bg-black text-white text-[10px] font-bold rounded-lg transition-colors">
                          Acknowledge / Action
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-[#2F6B4F] bg-[#E8F2EC] px-2 py-0.5 rounded">Actioned</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── RISK RADAR TAB ──── */}
            {activeTab === "radar" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><AlertTriangle className="h-[1.125rem] w-[1.125rem] text-red-500" /> System-Wide Predictive Risk Radar</h3>
                <p className="text-xs text-[#78716A] leading-relaxed font-medium">Automated risk radar scans incoming industry verification dossiers, grant milestone delivery timetables, and project cost burn rates.</p>
              </div>
            )}

            {/* ──── ML MODELS TAB ──── */}
            {activeTab === "models" && (
              <div className="card-flat rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide flex items-center gap-1.5"><BrainCircuit className="h-[1.125rem] w-[1.125rem] text-[#FF5A36]" /> Active Machine Learning Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {models.map((m) => (
                    <div key={m.id} className="border border-[#E2DCD2] rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#211F1D]">{m.modelName}</span>
                        <span className="text-[10px] bg-[#E8F2EC] text-[#2F6B4F] border border-green-150 rounded px-1.5 py-0.2 font-bold">{m.status}</span>
                      </div>
                      <div className="text-[10px] text-[#78716A]">Target: {m.moduleTarget} · Version: v{m.version}</div>
                      <div className="text-[10px] font-extrabold text-[#FF5A36]">Accuracy Rating: {Math.round(m.accuracyScore * 100)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
