"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, RefreshCw, Plus, LifeBuoy, BookOpen,
  MessageSquare, CheckCircle2, Clock, AlertCircle, Loader2,
  X, Send, User, ChevronDown, ChevronUp
} from "lucide-react";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

interface Faq {
  id: string;
  title: string;
  category: string;
  content: string;
  viewsCount: number;
  helpfulCount: number;
}

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  CRITICAL: { label: "Critical", bg: "bg-red-50",    text: "text-red-700" },
  HIGH:     { label: "High",     bg: "bg-orange-50", text: "text-orange-700" },
  MEDIUM:   { label: "Medium",   bg: "bg-amber-50",  text: "text-amber-700" },
  LOW:      { label: "Low",      bg: "bg-slate-50",  text: "text-slate-600" }
};

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  OPEN:        { label: "Open",        bg: "bg-blue-50",  text: "text-blue-700" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-amber-50", text: "text-amber-700" },
  RESOLVED:    { label: "Resolved",    bg: "bg-green-50", text: "text-green-700" },
  CLOSED:      { label: "Closed",      bg: "bg-slate-100",text: "text-slate-600" }
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("kb");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("kb-01");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [saving, setSaving] = useState(false);

  const fetchSupport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industry/support?search=${search}`);
      const data = await res.json();
      setTickets(data.tickets || []);
      setFaqs(data.faqs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  const handleCreateTicket = async () => {
    if (!subject.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/industry/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority })
      });
      setCreateModalOpen(false);
      setSubject("");
      await fetchSupport();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support & Knowledge Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search self-service documentation, view SLA resolution status, or raise support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSupport} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover">
            <Plus className="h-3.5 w-3.5" /> Submit Support Ticket
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "kb", label: "Knowledge Base & FAQs", icon: BookOpen },
          { key: "tickets", label: `My Support Tickets (${tickets.length})`, icon: LifeBuoy }
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search support articles, FAQs, or ticket numbers..."
          className="pl-10 pr-4 h-10 w-full text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-white shadow-sm"
        />
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
        {/* KNOWLEDGE BASE */}
        {activeTab === "kb" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map(faq => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary shrink-0" /> {faq.title}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2 font-medium">
                        <p>{faq.content}</p>
                        <div className="text-[9px] text-slate-400 font-semibold pt-1">
                          {faq.viewsCount} views · {faq.helpfulCount} found this helpful
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === "tickets" && (
          <div className="space-y-4 text-xs">
            {loading ? (
              <div className="flex items-center justify-center h-36">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-8">No support tickets found.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map(tkt => {
                  const priority = PRIORITY_BADGES[tkt.priority] || PRIORITY_BADGES.MEDIUM;
                  const status = STATUS_BADGES[tkt.status] || STATUS_BADGES.OPEN;
                  return (
                    <div key={tkt.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{tkt.ticketNumber}</span>
                          <h4 className="text-xs font-bold text-slate-800">{tkt.subject}</h4>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold">Assigned to: {tkt.assignedTo} · Opened: {new Date(tkt.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${priority.bg} ${priority.text}`}>{priority.label}</span>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${status.bg} ${status.text}`}>{status.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <LifeBuoy className="h-4 w-4 text-primary" /> Submit Support Ticket
                </h3>
                <button onClick={() => setCreateModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Issue Subject *</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Summary of the technical or billing issue..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="BILLING">Billing & Grants</option>
                      <option value="VERIFICATION">Verification</option>
                      <option value="FEATURE_REQUEST">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setCreateModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleCreateTicket} disabled={saving || !subject}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Submit Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
