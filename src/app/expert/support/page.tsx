"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, RefreshCw, Plus, MessageSquare, BookOpen,
  ChevronRight, Loader2, X, Send, ShieldCheck
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

export default function ExpertSupportPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [ticketModal, setTicketModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSupport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search });
      const res = await fetch(`/api/expert/support?${params}`);
      const data = await res.json();
      setFaqs(data.faqs || []);
      setTickets(data.tickets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  const handleSubmitTicket = async () => {
    if (!subject.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/expert/support", {
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Expert Support & Knowledge Helpdesk</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search FAQs, submit technical tickets & track resolution status with AnveshakHub support engineers</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSupport} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setTicketModal(true)} className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Create Support Ticket
          </button>
        </div>
      </div>

      {/* Search FAQs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Search Knowledge Base & FAQs</h3>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search EOI submission, honorariums, document uploads, or meeting scheduling FAQs..."
            className="pl-10 pr-4 h-10 w-full text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map(faq => (
            <div key={faq.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-1.5">
              <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-primary-light text-primary uppercase">{faq.category}</span>
              <h4 className="text-xs font-bold text-slate-800">{faq.question}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Your Active Support Tickets</h3>
        <div className="space-y-2">
          {tickets.map(tkt => (
            <div key={tkt.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{tkt.ticketNumber}</span>
                  <h4 className="text-xs font-bold text-slate-800">{tkt.subject}</h4>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold">{tkt.category} · Created {new Date(tkt.createdAt).toLocaleDateString("en-IN")}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                  tkt.status === "RESOLVED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}>{tkt.status}</span>
                <Link href={`/expert/support/${tkt.id}`} className="h-7 px-3 border border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg text-[10px] font-bold flex items-center gap-1">
                  View Thread <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {ticketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setTicketModal(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" /> Create Support Ticket
                </h3>
                <button onClick={() => setTicketModal(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Subject *</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Issue uploading Sprint 2 report PDF"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-8 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-bold">
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="REIMBURSEMENT">Finance / Payout</option>
                      <option value="VERIFICATION">Verification Credential</option>
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
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Detailed Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the issue or assistance needed..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setTicketModal(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleSubmitTicket} disabled={submitting || !subject.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Submit Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
