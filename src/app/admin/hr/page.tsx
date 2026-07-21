"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersRound, Search, Filter, RefreshCw, Download, Plus, Eye,
  Loader2, Calendar, TrendingUp, Wallet, CheckCircle2,
  Clock, CheckSquare, Square, X, Building2, Award, HardHat,
  ShieldCheck, AlertTriangle, Info, Zap, UserCheck, Inbox, ShieldAlert
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  status: string;
  joinedDate: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface Stats {
  total: number;
  activeCount: number;
  leavesPending: number;
  assetsAssigned: number;
}

// ─── Constants ─────────────────────────────────────────────────────

const DEPARTMENTS = {
  ADMIN: "Administration",
  CRM: "CRM & Partnerships",
  FINANCE: "Financial Governance",
  VERIFICATION: "Verification Center",
  OPERATIONS: "Systems & SLA Ops"
};

// ─── Main Page ─────────────────────────────────────────────────────

export default function HumanResourcesConsole() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("directory"); // directory, leaves, assets, training

  // Add Employee Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empRole, setEmpRole] = useState("COORDINATOR");
  const [empDept, setEmpDept] = useState("CRM");
  const [empDesig, setEmpDesig] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Sourced Assets assignment state
  const [assetOpen, setAssetOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [assetName, setAssetName] = useState("");
  const [assetSerial, setAssetSerial] = useState("");
  const [assetLoading, setAssetLoading] = useState(false);

  const fetchHR = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        department: deptFilter === "ALL" ? "" : deptFilter
      });
      const res = await fetch(`/api/admin/hr?${params}`);
      const data = await res.json();
      setEmployees(data.employees || []);
      setStats(data.stats || null);

      // Fetch leaves for admin view
      const leaveRes = await fetch(`/api/admin/hr/emp-001`);
      const leaveData = await leaveRes.json();
      setLeaves(leaveData.leaves || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter]);

  useEffect(() => {
    fetchHR();
  }, [fetchHR]);

  const handleOnboard = async () => {
    if (!empName || !empEmail || !empDesig) return;
    setAddLoading(true);
    try {
      await fetch("/api/admin/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: empName,
          email: empEmail,
          role: empRole,
          department: empDept,
          designation: empDesig
        })
      });
      setAddOpen(false);
      setEmpName("");
      setEmpEmail("");
      setEmpDesig("");
      await fetchHR();
    } catch (e) {
      console.error(e);
    } finally {
      setAddLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId: string, status: string) => {
    try {
      await fetch(`/api/admin/hr/emp-001`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_LEAVE", leaveId, status })
      });
      await fetchHR();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignAsset = async () => {
    if (!selectedEmp || !assetName || !assetSerial) return;
    setAssetLoading(true);
    try {
      await fetch(`/api/admin/hr/${selectedEmp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ASSIGN_ASSET", assetName, assetSerial })
      });
      setAssetOpen(false);
      setAssetName("");
      setAssetSerial("");
      setSelectedEmp(null);
      await fetchHR();
    } catch (e) {
      console.error(e);
    } finally {
      setAssetLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this employee?")) return;
    try {
      await fetch(`/api/admin/hr/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DEACTIVATE" })
      });
      await fetchHR();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Workforce & Operations HR</h1>
            <p className="text-xs text-slate-500 mt-0.5">Administer internal verification officers, coordinators, leave logs, and institutional hardware assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchHR} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setAddOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Onboard Employee
            </button>
          </div>
        </div>

        {/* ── Stats widgets ── */}
        {stats && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Employees", value: stats.activeCount, icon: UserCheck, bg: "bg-blue-50", color: "text-primary" },
              { label: "Leaves Pending", value: stats.leavesPending, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
              { label: "Hardware Assets Assigned", value: stats.assetsAssigned, icon: Inbox, bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Access Level Audited", value: "100%", icon: ShieldCheck, bg: "bg-teal-50", color: "text-teal-650" }
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

        {/* Tab switcher */}
        <div className="flex items-center gap-0 mt-5 border-t border-slate-100 pt-0 -mb-5">
          {[
            { key: "directory", label: "Workforce Directory", count: employees.length },
            { key: "leaves", label: "Leave Approvals", count: leaves.filter(l => l.status === "PENDING").length },
            { key: "training", label: "Workforce Training", count: null }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {tab.label} {tab.count !== null && <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded-full font-bold">{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      {activeTab === "directory" && (
        <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee names, emails, design…"
              className="w-full pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-colors ${showFilters ? "border-primary bg-blue-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <Filter className="h-3.5 w-3.5" /> Department Filters
          </button>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && activeTab === "directory" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-b border-slate-100">
            <div className="px-8 py-3.5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Department</label>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white focus:outline-none focus:border-primary">
                  <option value="ALL">All Departments</option>
                  {Object.entries(DEPARTMENTS).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ──── WORKFORCE DIRECTORY TAB ──── */}
            {activeTab === "directory" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp) => (
                  <motion.div
                    key={emp.id}
                    whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{emp.id}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-primary font-bold">
                        {DEPARTMENTS[emp.department as keyof typeof DEPARTMENTS] || emp.department}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{emp.name}</h3>
                      <p className="text-[9px] text-slate-455 font-semibold mt-0.5">{emp.designation}</p>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium">{emp.email}</p>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold leading-none">Joined</span>
                        <span className="font-bold text-slate-700">{new Date(emp.joinedDate).toLocaleDateString("en-IN")}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedEmp(emp); setAssetOpen(true); }} className="h-7 px-3 border border-slate-200 text-slate-650 text-[9px] font-bold rounded-lg hover:bg-slate-50 transition-colors">
                          Assign Asset
                        </button>
                        <button onClick={() => handleDeactivate(emp.id)} className="h-7 px-3 border border-red-100 text-red-650 hover:bg-red-50 text-[9px] font-bold rounded-lg transition-colors">
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ──── LEAVE APPROVALS TAB ──── */}
            {activeTab === "leaves" && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3">Employee Name</th>
                      <th className="px-6 py-3">Leave Type</th>
                      <th className="px-6 py-3">Timelines</th>
                      <th className="px-6 py-3">Reason</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {leaves.map((lv) => (
                      <tr key={lv.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-800">{lv.employeeName}</td>
                        <td className="px-6 py-4"><span className="text-[9px] px-2 py-0.5 bg-blue-50 text-primary border border-blue-100 rounded font-bold">{lv.leaveType}</span></td>
                        <td className="px-6 py-4 text-slate-500">{lv.startDate} to {lv.endDate}</td>
                        <td className="px-6 py-4 text-slate-450 italic">"{lv.reason}"</td>
                        <td className="px-6 py-4 text-right">
                          {lv.status === "PENDING" ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleLeaveAction(lv.id, "APPROVED")} className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold">Approve</button>
                              <button onClick={() => handleLeaveAction(lv.id, "REJECTED")} className="h-7 px-3 border border-red-200 text-red-650 rounded text-[10px] font-bold hover:bg-red-50">Reject</button>
                            </div>
                          ) : (
                            <span className="text-[9px] bg-slate-100 text-slate-500 rounded font-bold px-2 py-0.5">{lv.status}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ──── TRAINING & COMPLIANCE TAB ──── */}
            {activeTab === "training" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5"><ShieldAlert className="h-4.5 w-4.5 text-primary" /> Internal Compliance Training Logs</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Review and verify mandatory operational security guidelines, verification auditing standards, and B2B marketplace legal clearances for all active platform admins.</p>
                <button className="h-8 px-4 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">Generate Compliance Audit</button>
              </div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* ── Assign Hardware Asset Modal ── */}
      <AnimatePresence>
        {assetOpen && selectedEmp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAssetOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-850 truncate">Assign Asset: {selectedEmp.name}</h3>
                <button onClick={() => setAssetOpen(false)} className="text-slate-400 hover:text-slate-655"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Asset Name *</label>
                  <input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="e.g. MacBook Pro M3 or Keycard" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Serial Number *</label>
                  <input value={assetSerial} onChange={(e) => setAssetSerial(e.target.value)} placeholder="e.g. C02XYZ123ABC" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleAssignAsset} disabled={assetLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {assetLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Assign Asset
                </button>
                <button onClick={() => setAssetOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Onboard Employee Modal ── */}
      <AnimatePresence>
        {addOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAddOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] max-w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-855">Onboard Internal Employee</h3>
                <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Full Name *</label>
                    <input value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="e.g. Rishi Raj Sen" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Gov Email *</label>
                    <input value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} placeholder="e.g. rishi@anveshakhub.gov.in" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Department *</label>
                    <select value={empDept} onChange={(e) => setEmpDept(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      {Object.entries(DEPARTMENTS).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Workforce Access Role *</label>
                    <select value={empRole} onChange={(e) => setEmpRole(e.target.value)} className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white">
                      <option value="COORDINATOR">Lead Outreach Coordinator</option>
                      <option value="VERIFICATION_OFFICER">Verification Officer</option>
                      <option value="FINANCE_OFFICER">Finance Officer</option>
                      <option value="OPERATIONS_LEAD">Operations Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Designation Label *</label>
                  <input value={empDesig} onChange={(e) => setEmpDesig(e.target.value)} placeholder="e.g. Senior Verification Lead" className="w-full h-8 px-2.5 border border-slate-200 rounded-lg bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3.5 mt-4">
                <button onClick={handleOnboard} disabled={addLoading} className="h-8 px-4 bg-primary text-white rounded-lg font-bold flex items-center gap-1 hover:bg-blue-700">
                  {addLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Onboard Staff
                </button>
                <button onClick={() => setAddOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg font-semibold hover:bg-slate-50">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
