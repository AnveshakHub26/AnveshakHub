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
  CRITICAL: { label: "Critical", bg: "bg-[#FEE2E2]",    text: "text-[#C0392B]" },
  HIGH:     { label: "High",     bg: "bg-[#FFF4ED]", text: "text-[#C2410C]" },
  MEDIUM:   { label: "Medium",   bg: "bg-[#FEF3C7]",  text: "text-[#B45309]" },
  LOW:      { label: "Low",      bg: "bg-[#EFE9DF]",  text: "text-[#57534E]" }
};

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  OPEN:        { label: "Open",        bg: "bg-[#FFF0ED]",  text: "text-[#FF5A36]" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-[#FEF3C7]", text: "text-[#B45309]" },
  RESOLVED:    { label: "Resolved",    bg: "bg-[#E8F2EC]", text: "text-[#2F6B4F]" },
  CLOSED:      { label: "Closed",      bg: "bg-[#EFE9DF]",text: "text-[#57534E]" }
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
          <h1 className="text-xl font-bold text-[#211F1D]">Support & Knowledge Center</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Search self-service documentation, view SLA resolution status, or raise support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSupport} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setCreateModalOpen(true)} className="h-8 px-4 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Plus className="h-3.5 w-3.5" /> Submit Support Ticket
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2DCD2] -mb-2.5">
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
                activeTab === t.key ? "border-[#FF5A36] text-[#FF5A36]" : "border-transparent text-[#78716A] hover:text-[#211F1D]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A196]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search support articles, FAQs, or ticket numbers..."
          className="pl-10 pr-4 h-10 w-full text-xs border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] bg-[#FBF7F0] shadow-[var(--shadow-sm)]"
        />
      </div>

      {/* Tab Content */}
      <div className="card-flat rounded-2xl p-6 min-h-[360px]">
        {/* KNOWLEDGE BASE */}
        {activeTab === "kb" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map(faq => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="border border-[#E2DCD2] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-[#211F1D] hover:bg-[#FBF7F0] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-[#FF5A36] shrink-0" /> {faq.title}
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-[#A8A196]" /> : <ChevronDown className="h-4 w-4 text-[#A8A196]" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-[#FBF7F0] border-t border-[#E2DCD2] text-xs text-[#57534E] leading-relaxed space-y-2 font-medium">
                        <p>{faq.content}</p>
                        <div className="text-[10px] text-[#A8A196] font-semibold pt-1">
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
                <Loader2 className="h-6 w-6 animate-spin text-[#FF5A36]" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-[10px] text-[#A8A196] text-center py-8">No support tickets found.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map(tkt => {
                  const priority = PRIORITY_BADGES[tkt.priority] || PRIORITY_BADGES.MEDIUM;
                  const status = STATUS_BADGES[tkt.status] || STATUS_BADGES.OPEN;
                  return (
                    <div key={tkt.id} className="border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between hover:shadow-[var(--shadow-sm)] transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D]">{tkt.ticketNumber}</span>
                          <h4 className="text-xs font-bold text-[#211F1D]">{tkt.subject}</h4>
                        </div>
                        <p className="text-[10px] text-[#A8A196] font-semibold">Assigned to: {tkt.assignedTo} · Opened: {new Date(tkt.createdAt).toLocaleDateString("en-IN")}</p>
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
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-1.5">
                  <LifeBuoy className="h-4 w-4 text-[#FF5A36]" /> Submit Support Ticket
                </h3>
                <button onClick={() => setCreateModalOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Issue Subject *</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Summary of the technical or billing issue..."
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs font-bold">
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="BILLING">Billing & Grants</option>
                      <option value="VERIFICATION">Verification</option>
                      <option value="FEATURE_REQUEST">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}
                      className="w-full h-8 px-2 border border-[#E2DCD2] rounded-lg bg-[#FBF7F0] focus:outline-none focus:border-[#FF5A36] text-xs font-bold">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-4">
                <button onClick={() => setCreateModalOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">Cancel</button>
                <button onClick={handleCreateTicket} disabled={saving || !subject}
                  className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
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
