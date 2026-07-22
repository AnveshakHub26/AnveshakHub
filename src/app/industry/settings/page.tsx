"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Building2, Users, Shield, Lock, Save, Plus,
  RefreshCw, CheckCircle2, Key, Loader2, UserPlus, Globe,
  Phone, Mail, MapPin, X
} from "lucide-react";

interface OrgProfile {
  orgId: string;
  companyName: string;
  cin: string;
  gstin: string;
  logoUrl: string;
  industryDomain: string;
  website: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

interface SecuritySettings {
  ssoEnabled: boolean;
  mfaRequired: boolean;
  allowedDomains: string[];
  ipWhitelist: string[];
  sessionTimeoutMinutes: number;
}

const ROLE_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  ORG_ADMIN:          { label: "Org Admin",          bg: "bg-purple-50", text: "text-purple-700" },
  PROJECT_MANAGER:    { label: "Project Manager",    bg: "bg-blue-50",   text: "text-blue-700" },
  FINANCE_CONTROLLER: { label: "Finance Controller", bg: "bg-green-50",  text: "text-green-700" },
  LEGAL_OFFICER:      { label: "Legal Officer",      bg: "bg-amber-50",  text: "text-amber-700" }
};

export default function OrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("PROJECT_MANAGER");
  const [inviting, setInviting] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/industry/settings");
      const data = await res.json();
      setProfile(data.profile);
      setTeam(data.teamMembers || []);
      setSecurity(data.security);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch("/api/industry/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile })
      });
      await fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (!security) return;
    setSaving(true);
    try {
      await fetch("/api/industry/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ security })
      });
      await fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await fetch("/api/industry/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "INVITE_TEAM_MEMBER", inviteEmail, inviteRole })
      });
      setInviteModalOpen(false);
      setInviteEmail("");
      await fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Organization Settings & Security</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage company profile, RBAC team permissions, MFA/SSO rules & platform configurations</p>
        </div>
        <button onClick={fetchSettings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "profile", label: "Organization Profile", icon: Building2 },
          { key: "team", label: `Team & RBAC Roles (${team.length})`, icon: Users },
          { key: "security", label: "Security & Auth (MFA/SSO)", icon: Shield }
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
        {/* PROFILE TAB */}
        {activeTab === "profile" && profile && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Company Branding & Contact Info</h3>
              <button onClick={handleSaveProfile} disabled={saving}
                className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Company Name</label>
                <input value={profile.companyName} onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Industry Domain</label>
                <input value={profile.industryDomain} onChange={e => setProfile({ ...profile, industryDomain: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Corporate Identification Number (CIN)</label>
                <input value={profile.cin} onChange={e => setProfile({ ...profile, cin: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-mono" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">GSTIN Number</label>
                <input value={profile.gstin} onChange={e => setProfile({ ...profile, gstin: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-mono" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Official Contact Email</label>
                <input value={profile.contactEmail} onChange={e => setProfile({ ...profile, contactEmail: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
                <input value={profile.contactPhone} onChange={e => setProfile({ ...profile, contactPhone: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Registered Address</label>
                <input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Team Members & RBAC Permissions</h3>
              <button onClick={() => setInviteModalOpen(true)}
                className="h-8 px-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                <UserPlus className="h-3.5 w-3.5" /> Invite Member
              </button>
            </div>

            <div className="space-y-2">
              {team.map(member => {
                const role = ROLE_BADGES[member.role] || ROLE_BADGES.PROJECT_MANAGER;
                return (
                  <div key={member.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary-light text-primary font-bold flex items-center justify-center text-xs">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${role.bg} ${role.text}`}>
                        {role.label}
                      </span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                        member.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && security && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Authentication & Access Enforcement</h3>
              <button onClick={handleSaveSecurity} disabled={saving}
                className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Rules
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">Require Multi-Factor Authentication (MFA)</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Enforce authenticator app (TOTP) or SMS OTP for all team logins</p>
                </div>
                <input type="checkbox" checked={security.mfaRequired}
                  onChange={e => setSecurity({ ...security, mfaRequired: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer" />
              </div>

              <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">Enterprise Single Sign-On (SSO)</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Allow SAML 2.0 / OAuth2 authentication via Azure AD or Google Workspace</p>
                </div>
                <input type="checkbox" checked={security.ssoEnabled}
                  onChange={e => setSecurity({ ...security, ssoEnabled: e.target.checked })}
                  className="h-4 w-4 accent-primary cursor-pointer" />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">IP Whitelist (comma separated)</label>
                <input value={security.ipWhitelist.join(", ")}
                  onChange={e => setSecurity({ ...security, ipWhitelist: e.target.value.split(",").map(i => i.trim()) })}
                  placeholder="103.28.180.12, 182.72.15.98"
                  className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-mono" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4 text-primary" /> Invite Team Member
                </h3>
                <button onClick={() => setInviteModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Corporate Email *</label>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@solarispower.in"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Assigned RBAC Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="FINANCE_CONTROLLER">Finance Controller</option>
                    <option value="LEGAL_OFFICER">Legal Officer</option>
                    <option value="ORG_ADMIN">Organization Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setInviteModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleInvite} disabled={inviting || !inviteEmail}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {inviting && <Loader2 className="h-3 w-3 animate-spin" />} Send Invite
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
