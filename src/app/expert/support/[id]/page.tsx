"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, RefreshCw, MessageSquare, Send, CheckCircle2,
  Clock, Loader2, User, ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface TicketMessage {
  sender: string;
  text: string;
  timestamp: string;
}

interface SupportTicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  messages: TicketMessage[];
}

export default function TicketWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/expert/support/${id}`);
      const data = await res.json();
      setTicket(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendReply = async () => {
    if (!ticket || !replyText.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/expert/support/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText })
      });
      setReplyText("");
      await fetchTicket();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!ticket) return;
    try {
      await fetch(`/api/expert/support/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE" })
      });
      await fetchTicket();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/support" className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D] hover:bg-[#FBF7F0]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#D8D2C7] text-[#211F1D]">{ticket.ticketNumber}</span>
              <h1 className="text-base font-bold text-[#211F1D]">{ticket.subject}</h1>
            </div>
            <p className="text-xs text-[#78716A] font-semibold">{ticket.category} · Priority: {ticket.priority}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchTicket} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {ticket.status !== "RESOLVED" && (
            <button onClick={handleResolveTicket} className="h-8 px-3 border border-green-200 text-green-700 bg-[#E8F2EC] rounded-lg text-xs font-bold hover:bg-green-100 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      {/* Message Timeline */}
      <div className="bg-white border border-[#E2DCD2] rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-[#211F1D] uppercase tracking-wide border-b border-[#E2DCD2] pb-2">Support Message Timeline</h3>
        <div className="space-y-4">
          {ticket.messages.map((msg, i) => (
            <div key={i} className="border border-[#E2DCD2] rounded-xl p-4 bg-[#FBF7F0] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#211F1D]">{msg.sender}</span>
                <span className="text-[9px] font-bold text-[#A8A196]">{new Date(msg.timestamp).toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-[#57534E] font-medium leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        {ticket.status !== "RESOLVED" && (
          <div className="pt-4 border-t border-[#E2DCD2] space-y-3">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={3}
              placeholder="Type your reply to support engineers..."
              className="w-full p-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed resize-none"
            />
            <div className="flex justify-end">
              <button onClick={handleSendReply} disabled={submitting || !replyText.trim()}
                className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
