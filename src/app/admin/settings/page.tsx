"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, UsersRound, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap, ShieldAlert, Key, Globe, EyeOff
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface SettingItem {
  id: string;
  key: string;
  value: string;
  category: string;
}

interface OrgProfile {
  name: string;
  domain: string;
  logoUrl: string;
  supportEmail: string;
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function SettingsConsole() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("profile"); // profile, security, keys, integrations

  // Security policy states
  const [passLength, setPassLength] = useState("12");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [require2fa, setRequire2fa] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Org Profile States
  const [orgName, setOrgName] = useState("");
  const [orgDomain, setOrgDomain] = useState("");
  const [orgEmail, setOrgEmail] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      const list: SettingItem[] = data.settings || [];
      setSettings(list);
      setOrgProfile(data.orgProfile || null);

      if (data.orgProfile) {
        setOrgName(data.orgProfile.name);
        setOrgDomain(data.orgProfile.domain);
        setOrgEmail(data.orgProfile.supportEmail);
      }

      // Populate security parameters
      const lenItem = list.find(s => s.key === "PASSWORD_MIN_LENGTH");
      const timeoutItem = list.find(s => s.key === "SESSION_TIMEOUT_MINUTES");
      const faItem = list.find(s => s.key === "TWO_FACTOR_REQUIRED");

      if (lenItem) setPassLength(lenItem.value);
      if (timeoutItem) setSessionTimeout(timeoutItem.value);
      if (faItem) setRequire2fa(faItem.value === "true");

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdateSetting = async (key: string, value: string) => {
    setUpdating(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      await fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveProfile = async () => {
    setUpdating(true);
    try {
      // Simulate profile saving POST / PATCH
      await new Promise(resolve => setTimeout(resolve, 800));
      alert("Organization profile successfully updated.");
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">System Settings & Console</h1>
            <p className="text-xs text-slate-500 mt-0.5">Central settings console categorizing security password policies, organization profile values, and API keys</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSettings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-655 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-slate-100 pt-0 -mb-5">
          {[
            { key: "profile", label: "Organization Profile", icon: Globe },
            { key: "security", label: "Security & Passwords", icon: ShieldAlert },
            { key: "keys", label: "Storage & API Keys", icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                <Icon className="h-3.5 w-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── PROFILE TAB ──── */}
            {activeTab === "profile" && orgProfile && (
              <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ecosystem Profile Metadata</h3>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Organization Title *</label>
                    <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Dedicated Platform Domain *</label>
                    <input value={orgDomain} onChange={(e) => setOrgDomain(e.target.value)} className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Support Email Address *</label>
                    <input value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button onClick={handleSaveProfile} disabled={updating} className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-1">
                    {updating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Update Profile
                  </button>
                </div>
              </div>
            )}

            {/* ──── SECURITY TAB ──── */}
            {activeTab === "security" && (
              <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldAlert className="h-4.5 w-4.5 text-primary" /> Global Security Policies</h3>
                
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span>Minimum Password Length *</span>
                      <p className="text-[9px] text-slate-450 font-normal mt-0.5">Enforces longer passphrase complexity limits for logins.</p>
                    </div>
                    <select value={passLength} onChange={(e) => { setPassLength(e.target.value); handleUpdateSetting("PASSWORD_MIN_LENGTH", e.target.value); }} className="h-8 border border-slate-200 rounded-lg px-2 bg-white">
                      <option value="8">8 Characters</option>
                      <option value="12">12 Characters</option>
                      <option value="16">16 Characters</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span>Session Expiration Timeout *</span>
                      <p className="text-[9px] text-slate-450 font-normal mt-0.5">Auto expires inactive sessions to prevent terminal hijack.</p>
                    </div>
                    <select value={sessionTimeout} onChange={(e) => { setSessionTimeout(e.target.value); handleUpdateSetting("SESSION_TIMEOUT_MINUTES", e.target.value); }} className="h-8 border border-slate-200 rounded-lg px-2 bg-white">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span>Require Two-Factor Auth (2FA) *</span>
                      <p className="text-[9px] text-slate-450 font-normal mt-0.5">Force all administration workforce officers to pass OTP steps.</p>
                    </div>
                    <button onClick={() => { setRequire2fa(!require2fa); handleUpdateSetting("TWO_FACTOR_REQUIRED", String(!require2fa)); }} className={`h-7 px-3 rounded-lg text-[10px] font-bold border transition-colors ${require2fa ? "bg-green-50 text-green-700 border-green-150" : "bg-red-50 text-red-700 border-red-150"}`}>
                      {require2fa ? "MFA Required" : "Optional"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ──── KEYS TAB ──── */}
            {activeTab === "keys" && (
              <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Storage Provider & API Keys</h3>
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div>
                      <span>MinIO Document Storage Node</span>
                      <p className="text-[9px] text-slate-450 font-normal mt-0.5">Primary host node link target for NDA/MOU document vaults.</p>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 rounded px-2 py-0.5">https://minio.anveshakhub.gov.in</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span>Platform API Authorization Key</span>
                      <p className="text-[9px] text-slate-450 font-normal mt-0.5">Symmetric secret key configured for client integrations.</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-slate-50 rounded px-2 py-1 select-all">anveshak_key_prod_abc123z</span>
                      <button className="h-6 w-6 border border-slate-200 rounded flex items-center justify-center text-slate-400 hover:text-slate-600"><EyeOff className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
