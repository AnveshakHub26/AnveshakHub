"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2, UsersRound, GraduationCap, Briefcase, Calendar, Landmark,
  Wallet, HardHat, RefreshCw, Plus, Radio, CheckSquare, ShieldCheck,
  CheckCircle2, XCircle, ChevronRight, AlertTriangle, AlertCircle, Play,
  Wifi, ShieldAlert, FileText, ChevronDown, Check, X, FileSignature, Sparkles,
  Loader2, Send, ArrowRight
} from "lucide-react";

interface KPIItem {
  count: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  progress: number;
}

interface VerificationItem {
  id: string;
  orgName: string;
  type: string;
  domain: string;
  submittedAt: string;
  documentStatus: string;
  priority: "HIGH" | "STANDARD";
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [kpis, setKpis] = useState<Record<string, KPIItem>>({});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [queue, setQueue] = useState<VerificationItem[]>([]);

  const [selectedVerifyItem, setSelectedVerifyItem] = useState<VerificationItem | null>(null);
  const [verifyDrawerOpen, setVerifyDrawerOpen] = useState(false);
  const [verifyActionLoading, setVerifyActionLoading] = useState(false);

  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastDone, setBroadcastDone] = useState(false);

  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        setKpis(data.kpis);
        setRecentActivities(data.recentActivities);
        setMeetings(data.upcomingMeetings);
        setServices(data.systemHealth);
        setSystemStatus(data.telemetry);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadVerificationQueue = async () => {
    try {
      const res = await fetch("/api/admin/verification-center");
      const data = await res.json();
      if (res.ok) {
        setQueue(data.queue);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([loadMetrics(), loadVerificationQueue()]).finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadMetrics(), loadVerificationQueue()]);
    setRefreshing(false);
  };

  const handleVerifyAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setVerifyActionLoading(true);
    try {
      const res = await fetch(`/api/admin/verification-center/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "APPROVE" ? "VERIFIED" : "REJECTED" }),
      });
      if (res.ok) {
        setQueue((prev) => prev.filter((item) => item.id !== id));
        setVerifyDrawerOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyActionLoading(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage, scope: "GLOBAL" }),
      });
      if (res.ok) {
        setBroadcastDone(true);
        setTimeout(() => {
          setBroadcastOpen(false);
          setBroadcastDone(false);
          setBroadcastMessage("");
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin" />
          <p className="text-xs font-medium text-[#57534E]">Loading Executive Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Top Header Banner */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                Executive Control Center
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
                Admin Command Dashboard
              </h1>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setBroadcastOpen(true)} className="btn-primary text-xs min-h-[40px]">
                <Radio className="h-4 w-4" /> Send Global Broadcast
              </button>
              <button onClick={handleRefresh} disabled={refreshing} className="btn-secondary text-xs min-h-[40px]">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Top 4 Key KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-warm p-5 bg-[#EFE9DF]">
            <div className="flex justify-between items-start">
              <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Verified Industries</p>
              <Building2 className="h-5 w-5 text-[#FF5A36]" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.industries?.count || "48"}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">+12% this quarter</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <div className="flex justify-between items-start">
              <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Subject Experts</p>
              <UsersRound className="h-5 w-5 text-[#FF5A36]" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.experts?.count || "142"}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">+8% active domain advisors</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <div className="flex justify-between items-start">
              <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Active R&D Projects</p>
              <Briefcase className="h-5 w-5 text-[#FF5A36]" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-[#211F1D] mt-2">{kpis.projects?.count || "86"}</p>
            <p className="text-[11px] text-[#2F6B4F] font-semibold mt-1">₹4.2 Cr total funding</p>
          </div>

          <div className="card-warm p-5 bg-[#EFE9DF]">
            <div className="flex justify-between items-start">
              <p className="text-xs text-[#78716A] font-semibold uppercase tracking-wider">Compliance Queue</p>
              <ShieldCheck className="h-5 w-5 text-[#FF5A36]" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-[#FF5A36] mt-2">{queue.length}</p>
            <p className="text-[11px] text-[#FF5A36] font-semibold mt-1">Awaiting audit review</p>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="card-warm bg-[#EFE9DF] overflow-hidden">
          <div className="p-5 border-b border-[#E2DCD2] flex justify-between items-center">
            <div>
              <h2 className="font-heading text-lg font-extrabold text-[#211F1D]">Compliance Verification Queue</h2>
              <p className="text-xs text-[#78716A]">Approve or reject registered organization credentials</p>
            </div>
            <span className="text-xs font-bold text-[#FF5A36] bg-[#FFF0ED] px-3 py-1 rounded-full border border-[#FF5A36]/30">
              {queue.length} Pending
            </span>
          </div>

          <div className="table-container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="table-header">
                  <th className="py-3.5 px-5">Organization Name</th>
                  <th className="py-3.5 px-4">Domain Type</th>
                  <th className="py-3.5 px-4">Document Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#78716A]">
                      No organizations currently awaiting verification.
                    </td>
                  </tr>
                ) : (
                  queue.map((item) => (
                    <tr key={item.id} className="table-row text-xs">
                      <td className="py-3.5 px-5 font-bold text-[#211F1D]">
                        {item.orgName}
                        <span className="block text-[11px] font-normal text-[#78716A]">Submitted {item.submittedAt}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#57534E]">{item.domain}</td>
                      <td className="py-3.5 px-4">
                        <span className="badge-forest">{item.documentStatus}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`badge-${item.priority === "HIGH" ? "ember" : "[#2F6B4F]"}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleVerifyAction(item.id, "APPROVE")}
                          className="btn-primary text-xs py-1.5 px-3 min-h-[36px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyAction(item.id, "REJECT")}
                          className="btn-secondary text-xs py-1.5 px-3 min-h-[36px]"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
