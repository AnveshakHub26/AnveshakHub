"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, RefreshCw, Plus, MessageSquare, BookOpen,
  ChevronRight, Loader2, X, Send, ShieldCheck, ChevronDown,
  AlertCircle, CheckCircle2, Clock, LifeBuoy
} from "lucide-react";
import Link from "next/link";

interface FAQ {
  id: string;
  question: string;
  category: string;
  answer: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

const PRIORITY_META: Record<string, { label: string; color: string; bg: string }> = {
  LOW:    { label: "Low",    color: "#57534E", bg: "#F5F0E8" },
  MEDIUM: { label: "Medium", color: "#92400E", bg: "#FEF3C7" },
  HIGH:   { label: "High",   color: "#DC2626", bg: "#FEE2E2" },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  OPEN:       { label: "Open",       color: "#4338CA", bg: "#EEF2FF",  icon: AlertCircle },
  IN_PROGRESS:{ label: "In Progress",color: "#92400E", bg: "#FEF3C7",  icon: Clock },
  RESOLVED:   { label: "Resolved",   color: "#2F6B4F", bg: "#E8F2EC",  icon: CheckCircle2 },
};

export default function StudentSupportPage() {
  const [faqs, setFaqs]       = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const [ticketModal, setTicketModal] = useState(false);
  const [subject, setSubject]         = useState("");
  const [category, setCategory]       = useState("TECHNICAL");
  const [priority, setPriority]       = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const fetchSupport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search });
      const res    = await fetch(`/api/student/support?${params}`);
      const data   = await res.json();
      setFaqs(data.faqs || []);
      setTickets(data.tickets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchSupport(); }, [fetchSupport]);

  const handleSubmitTicket = async () => {
    if (!subject.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/student/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority, description })
      });
      setTicketModal(false);
      setSubject(""); setDescription("");
      await fetchSupport();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#4338CA]/10 text-[#4338CA] uppercase tracking-widest">
            Help Center
          </span>
          <h1 className="text-2xl font-extrabold text-[#211F1D] mt-1">
            Student Support
          </h1>
          <p className="text-sm text-[#78716A] mt-1">
            Search our knowledge base or raise a helpdesk ticket — we're here to help.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSupport} className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTicketModal(true)}
            className="h-9 px-4 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#FF5A36]/30"
          >
            <Plus className="h-3.5 w-3.5" /> New Support Ticket
          </button>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen,    title: "Knowledge Base",    desc: "Browse articles and guides",          color: "#4338CA", bg: "#EEF2FF" },
          { icon: MessageSquare, title: "Live Chat",       desc: "Get instant answers from our team",   color: "#2F6B4F", bg: "#E8F2EC" },
          { icon: LifeBuoy,    title: "Priority Support",  desc: "Escalate critical issues fast",        color: "#FF5A36", bg: "#FFF0ED" },
        ].map((c) => (
          <div key={c.title} className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-default">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
              <c.icon className="h-5 w-5" style={{ color: c.color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#211F1D]">{c.title}</p>
              <p className="text-[11px] text-[#78716A]">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Search */}
      <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#FF5A36]" /> Frequently Asked Questions
        </h3>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A196]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs — applications, stipends, uploads, meetings…"
            className="pl-10 pr-4 h-10 w-full text-sm border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] bg-[#FBF7F0] transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 text-[#FF5A36] animate-spin" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="h-8 w-8 text-[#D8D2C7] mx-auto mb-2" />
            <p className="text-xs text-[#78716A] font-semibold">No FAQs match your search</p>
          </div>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[#F5F0E8] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase mt-0.5 flex-shrink-0 bg-[#FFF0ED] text-[#FF5A36]"
                    >
                      {faq.category}
                    </span>
                    <p className="text-xs font-bold text-[#211F1D]">{faq.question}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-[#A8A196] flex-shrink-0 mt-0.5 transition-transform ${expandedFaq === faq.id ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-[#E2DCD2] pt-3">
                        <p className="text-xs text-[#57534E] leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Support Tickets */}
      <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#FF5A36]" /> Your Support Tickets
          </h3>
          <span className="text-xs font-bold text-[#78716A]">{tickets.length} tickets</span>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheck className="h-8 w-8 text-[#2F6B4F] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#211F1D]">No open tickets</p>
            <p className="text-xs text-[#78716A] mt-1">All good! Raise a ticket if you need help.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((tkt, idx) => {
              const statusMeta   = STATUS_META[tkt.status] || STATUS_META["OPEN"];
              const priorityMeta = PRIORITY_META[tkt.priority] || PRIORITY_META["MEDIUM"];
              const StatusIcon   = statusMeta.icon;
              return (
                <motion.div
                  key={tkt.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#FF5A36]/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: statusMeta.bg }}>
                      <StatusIcon className="h-4 w-4" style={{ color: statusMeta.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#D8D2C7] text-[#211F1D]">
                          {tkt.ticketNumber}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded"
                          style={{ background: priorityMeta.bg, color: priorityMeta.color }}>
                          {priorityMeta.label} Priority
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#211F1D] mt-1 truncate">{tkt.subject}</h4>
                      <p className="text-[10px] text-[#A8A196] font-semibold mt-0.5">
                        {tkt.category} · {new Date(tkt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] font-extrabold px-2 py-1 rounded-full hidden sm:block"
                      style={{ background: statusMeta.bg, color: statusMeta.color }}>
                      {statusMeta.label}
                    </span>
                    <Link
                      href={`/student/support/${tkt.id}`}
                      className="h-8 px-3 border border-[#E2DCD2] hover:border-[#FF5A36] text-[#57534E] hover:text-[#FF5A36] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      View <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {ticketModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setTicketModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[520px] max-w-full mx-4 border border-[#E2DCD2]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#FF5A36]/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#211F1D]">Create Support Ticket</h3>
                    <p className="text-[10px] text-[#78716A]">Our team responds within 2–4 hours</p>
                  </div>
                </div>
                <button
                  onClick={() => setTicketModal(false)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#EFE9DF] transition-colors"
                >
                  <X className="h-4 w-4 text-[#A8A196]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Subject *</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Issue uploading Sprint 2 report PDF"
                    className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl bg-white focus:outline-none focus:border-[#FF5A36] text-sm font-semibold transition-colors"
                    >
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="REIMBURSEMENT">Stipend / Finance</option>
                      <option value="VERIFICATION">Verification</option>
                      <option value="FEATURE_REQUEST">Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl bg-white focus:outline-none focus:border-[#FF5A36] text-sm font-semibold transition-colors"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the issue in detail — steps to reproduce, screenshots, error messages…"
                    className="w-full p-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm resize-none bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-5">
                <button
                  onClick={() => setTicketModal(false)}
                  className="h-9 px-4 border border-[#E2DCD2] text-[#78716A] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTicket}
                  disabled={submitting || !subject.trim()}
                  className="h-9 px-5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm shadow-[#FF5A36]/30"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <Send className="h-3.5 w-3.5" /> Submit Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
