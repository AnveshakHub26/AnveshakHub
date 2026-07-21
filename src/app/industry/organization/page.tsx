"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Users, UserCheck, RefreshCw, Plus,
  Loader2, Search, X, CheckCircle2, Shield, Pencil,
  Phone, Mail, Globe, FileText, Award
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface Organization {
  id: string; orgName: string; orgType: string; email: string; phone: string;
  website: string; industryDomain: string; businessCategory: string; description: string;
  state: string; city: string; pin: string; addressLine: string;
  verificationStatus: string; gstin: string; cin: string; panNumber: string; dpiitNumber: string;
}
interface Branch {
  id: string; name: string; city: string; state: string; addressLine: string;
  pinCode: string; headName?: string; headEmail?: string; phone?: string;
  isHeadquarters: boolean; status: string;
}
interface Department {
  id: string; name: string; headName?: string; headEmail?: string;
  memberCount: number; description?: string; isActive: boolean;
}
interface Representative {
  id: string; name: string; designation: string; email: string; phone: string;
  isAuthorizedSignatory: boolean; isPrimary: boolean; department?: string;
}
interface OrgUser {
  id: string; name: string; email: string; role: string;
  department?: string; isActive: boolean; invitedAt: string; lastLoginAt?: string;
}

// ─── Constants ─────────────────────────────────────────────────────
const ROLE_STYLES: Record<string, string> = {
  ORG_ADMIN:      "bg-purple-50 text-purple-700 border border-purple-200",
  PROJECT_LEAD:   "bg-blue-50 text-blue-700 border border-blue-200",
  FINANCE_HEAD:   "bg-green-50 text-green-700 border border-green-200",
  HR_COORDINATOR: "bg-amber-50 text-amber-700 border border-amber-200",
  VIEWER:         "bg-slate-100 text-slate-600 border border-slate-200",
};

// ─── Main Page ─────────────────────────────────────────────────────
export default function OrganizationManagement() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("profile");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editDescription, setEditDescription] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [orgRes, brRes, depRes, repRes, usrRes] = await Promise.all([
        fetch("/api/industry/organization"),
        fetch("/api/industry/organization/branches"),
        fetch("/api/industry/organization/departments"),
        fetch("/api/industry/organization/representatives"),
        fetch("/api/industry/organization/users"),
      ]);
      const [orgData, brData, depData, repData, usrData] = await Promise.all([
        orgRes.json(), brRes.json(), depRes.json(), repRes.json(), usrRes.json()
      ]);
      const o = orgData.organization;
      setOrg(o);
      setEditDescription(o.description ?? "");
      setEditWebsite(o.website ?? "");
      setEditPhone(o.phone ?? "");
      setBranches(brData.branches ?? []);
      setDepartments(depData.departments ?? []);
      setRepresentatives(repData.representatives ?? []);
      setOrgUsers(usrData.users ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/industry/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editDescription, website: editWebsite, phone: editPhone })
      });
      setEditMode(false);
      await fetchAll();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleInviteUser = async () => {
    if (!inviteName || !inviteEmail) return;
    try {
      await fetch("/api/industry/organization/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole, orgId: "org-001" })
      });
      setInviteOpen(false);
      setInviteName(""); setInviteEmail(""); setInviteRole("VIEWER");
      await fetchAll();
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  const filteredUsers = orgUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Organization Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage profile, branches, departments, representatives and team</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setInviteOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">
              <Plus className="h-3.5 w-3.5" /> Invite Member
            </button>
          </div>
        </div>

        {org && (
          <div className="mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 w-fit">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-800">{org.orgName}</span>
              <span className="text-emerald-600 mx-1.5">·</span>
              <span className="font-semibold text-emerald-700">{org.verificationStatus}</span>
              <span className="text-emerald-500 mx-1.5">·</span>
              <span className="text-emerald-600 text-[10px]">DPIIT: {org.dpiitNumber} · GSTIN: {org.gstin}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-0 mt-5">
          {[
            { key: "profile",   label: "Organization Profile",   count: null },
            { key: "branches",  label: "Branches & Departments", count: branches.length + departments.length },
            { key: "reps",      label: "Representatives",        count: representatives.length },
            { key: "team",      label: "Team Members",           count: orgUsers.length },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all -mb-0 ${
                activeTab === tab.key ? "border-emerald-500 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {tab.count !== null && <span className="text-[9px] px-1.5 bg-slate-100 text-slate-500 rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && org && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl space-y-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Business Information</h3>
                  {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="h-7 px-3 inline-flex items-center gap-1 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-50">
                      <Pencil className="h-3 w-3" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} disabled={saving} className="h-7 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1">
                        {saving && <Loader2 className="h-3 w-3 animate-spin" />} Save Changes
                      </button>
                      <button onClick={() => setEditMode(false)} className="h-7 px-3 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold hover:bg-slate-50">Cancel</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {([
                    { label: "Organization Name",   value: org.orgName,           icon: Building2 },
                    { label: "Organization Type",   value: org.orgType,           icon: Award },
                    { label: "Industry Domain",     value: org.industryDomain,    icon: FileText },
                    { label: "Business Category",   value: org.businessCategory,  icon: FileText },
                    { label: "CIN Number",          value: org.cin,               icon: Shield },
                    { label: "PAN Number",          value: org.panNumber,         icon: Shield },
                    { label: "GSTIN",               value: org.gstin,             icon: Shield },
                    { label: "DPIIT Registration",  value: org.dpiitNumber,       icon: Shield },
                  ] as const).map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <Icon className="h-2.5 w-2.5" /> {f.label}
                        </label>
                        <p className="font-semibold text-slate-800">{f.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">About Organization</label>
                    {editMode
                      ? <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-xs resize-none" />
                      : <p className="text-slate-700 leading-relaxed font-medium">{org.description}</p>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Globe className="h-2.5 w-2.5" /> Website</label>
                      {editMode
                        ? <input value={editWebsite} onChange={e => setEditWebsite(e.target.value)} className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white text-xs" />
                        : <p className="font-semibold text-blue-600">{org.website}</p>
                      }
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> Phone</label>
                      {editMode
                        ? <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white text-xs" />
                        : <p className="font-semibold text-slate-800">{org.phone}</p>
                      }
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 text-xs">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1"><MapPin className="h-2.5 w-2.5" /> Registered Address</label>
                  <p className="font-semibold text-slate-700">{org.addressLine}, {org.city}, {org.state} — {org.pin}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BRANCHES & DEPARTMENTS TAB ── */}
          {activeTab === "branches" && (
            <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-500" /> Branch Offices ({branches.length})</h3>
                  <button className="h-7 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1"><Plus className="h-3 w-3" /> Add Branch</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {branches.map(b => (
                    <div key={b.id} className="border border-slate-100 rounded-xl p-4 space-y-2 text-xs hover:border-slate-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{b.name}</span>
                        {b.isHeadquarters && <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 font-bold">HQ</span>}
                      </div>
                      <p className="text-[10px] text-slate-500">{b.addressLine}</p>
                      <p className="text-[10px] font-semibold text-slate-600">{b.city}, {b.state} — {b.pinCode}</p>
                      {b.headName && <p className="text-[9px] text-slate-400">Head: {b.headName}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><Building2 className="h-4 w-4 text-indigo-500" /> Departments ({departments.length})</h3>
                  <button className="h-7 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1"><Plus className="h-3 w-3" /> Add Department</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {departments.map(d => (
                    <div key={d.id} className="border border-slate-100 rounded-xl p-4 space-y-2 text-xs hover:border-slate-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{d.name}</span>
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded px-1.5">{d.memberCount} members</span>
                      </div>
                      {d.description && <p className="text-[10px] text-slate-500">{d.description}</p>}
                      {d.headName && <p className="text-[9px] text-slate-400">Head: {d.headName} · {d.headEmail}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── REPRESENTATIVES TAB ── */}
          {activeTab === "reps" && (
            <motion.div key="reps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><UserCheck className="h-4 w-4 text-purple-500" /> Authorized Representatives & Signatories</h3>
                <button className="h-7 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 flex items-center gap-1"><Plus className="h-3 w-3" /> Add Representative</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {representatives.map(rep => (
                  <div key={rep.id} className="border border-slate-100 rounded-2xl p-4 space-y-3 text-xs hover:border-slate-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{rep.name}</div>
                        <div className="text-[9px] text-slate-500 font-semibold mt-0.5">{rep.designation}</div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {rep.isPrimary && <span className="text-[8px] bg-purple-50 text-purple-700 border border-purple-200 rounded px-1.5 font-bold">PRIMARY</span>}
                        {rep.isAuthorizedSignatory && <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 font-bold">SIGNATORY</span>}
                      </div>
                    </div>
                    <div className="space-y-1 text-[9px] text-slate-500">
                      <p className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> {rep.email}</p>
                      <p className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> {rep.phone}</p>
                      {rep.department && <p className="text-slate-400">{rep.department}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TEAM TAB ── */}
          {activeTab === "team" && (
            <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-500" /> Team Members ({orgUsers.length})</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…" className="pl-8 pr-3 h-7 text-[10px] border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-white w-44" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Name", "Email", "Role", "Department", "Status", "Last Login", "Actions"].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-800">{u.name}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px]">{u.email}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[8px] px-2 py-0.5 rounded font-bold ${ROLE_STYLES[u.role] ?? ROLE_STYLES.VIEWER}`}>
                            {u.role.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px]">{u.department ?? "—"}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[9px]">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="py-2.5 px-3">
                          <button className="text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Invite Member Modal ── */}
      <AnimatePresence>
        {inviteOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setInviteOpen(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Invite Team Member</h3>
                <button onClick={() => setInviteOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Full Name *</label>
                  <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Ravi Kumar" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Work Email *</label>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="e.g. ravi@solarispower.in" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Platform Role *</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-400">
                    <option value="ORG_ADMIN">Org Admin</option>
                    <option value="PROJECT_LEAD">Project Lead</option>
                    <option value="FINANCE_HEAD">Finance Head</option>
                    <option value="HR_COORDINATOR">HR Coordinator</option>
                    <option value="VIEWER">Viewer (Read Only)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleInviteUser} className="h-8 px-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 text-xs">Send Invitation</button>
                <button onClick={() => setInviteOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
