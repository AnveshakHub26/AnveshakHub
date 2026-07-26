"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Calendar, RefreshCw, Plus, Clock, ChevronRight,
  Loader2, X, Send
} from "lucide-react";
import Link from "next/link";

interface StudentMeeting {
  id: string;
  title: string;
  orgName: string;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string;
  status: string;
  agenda?: string;
}

export default function StudentMeetingsPage() {
  const [meetings, setMeetings] = useState<StudentMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Request Call Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/meetings");
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleRequestCall = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/student/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, agenda })
      });
      setModalOpen(false);
      setTitle(""); setAgenda("");
      await fetchMeetings();
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
          <h1 className="text-xl font-bold text-[#211F1D]">Student Meetings & Collaboration Sessions</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Schedule and join video calls with lead expert mentors, industry hosts & project teams</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchMeetings} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => setModalOpen(true)} className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Request Review Session
          </button>
        </div>
      </div>

      {/* Meetings Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <Video className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Meetings Scheduled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((mtg, idx) => (
            <motion.div
              key={mtg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-flat rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#FFF0ED] text-[#FF5A36] uppercase">{mtg.platform}</span>
                  <h3 className="text-sm font-bold text-[#211F1D] group-hover:text-[#FF5A36] transition-colors mt-1">{mtg.title}</h3>
                  <p className="text-xs text-[#78716A] font-semibold">{mtg.orgName}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F2EC] text-[#2F6B4F] border border-green-200">{mtg.status}</span>
              </div>

              <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 text-xs font-semibold text-[#57534E] space-y-1">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#A8A196]" /> {new Date(mtg.startTime).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2DCD2] flex items-center justify-between gap-2">
                <a
                  href={mtg.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Video className="h-3.5 w-3.5" /> Join Call
                </a>

                <Link
                  href={`/student/meetings/${mtg.id}`}
                  className="h-8 px-3 border border-[#E2DCD2] hover:border-[#FF5A36] text-[#57534E] hover:text-[#FF5A36] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  MoM & Actions <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Call Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#FBF7F0] rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#E2DCD2] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#211F1D] flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-[#FF5A36]" /> Request Mentor Review Session
                </h3>
                <button onClick={() => setModalOpen(false)}><X className="h-4 w-4 text-[#A8A196] hover:text-[#57534E]" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Session Title *</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Node 3 Sensor Calibration Review"
                    className="w-full h-8 px-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#78716A] uppercase block mb-1">Agenda & Technical Items</label>
                  <textarea value={agenda} onChange={e => setAgenda(e.target.value)} rows={3} placeholder="Topics to cover during the video call..."
                    className="w-full p-2.5 border border-[#E2DCD2] rounded-lg focus:outline-none focus:border-[#FF5A36] text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-4">
                <button onClick={() => setModalOpen(false)} className="h-8 px-3 border border-[#E2DCD2] text-[#78716A] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">Cancel</button>
                <button onClick={handleRequestCall} disabled={submitting || !title.trim()}
                  className="h-8 px-4 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5">
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />} Request Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
