"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Video, RefreshCw, FileText, CheckCircle2, Clock,
  Users, Save, Plus, Loader2, Check, File
} from "lucide-react";
import Link from "next/link";

interface MeetingWorkspace {
  id: string;
  title: string;
  orgName: string;
  projectName: string;
  startTime: string;
  endTime: string;
  platform: string;
  videoLink: string;
  status: string;
  agenda: string;
  momNotes: string;
  actionItems: Array<{ id: string; title: string; assignee: string; status: string; dueDate: string }>;
  participants: Array<{ name: string; role: string }>;
  documents: Array<{ id: string; name: string; url: string }>;
}

export default function MeetingWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const [mtg, setMtg] = useState<MeetingWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mom");

  // MoM State
  const [momNotes, setMomNotes] = useState("");
  const [savingMom, setSavingMom] = useState(false);

  // New Action Item State
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionAssignee, setNewActionAssignee] = useState("");

  const fetchWorkspace = useCallback(async () => {
    setLoading(true);
    try {
      const { id } = await params;
      const res = await fetch(`/api/expert/meetings/${id}`);
      const data = await res.json();
      setMtg(data);
      setMomNotes(data.momNotes || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleSaveMom = async () => {
    if (!mtg) return;
    setSavingMom(true);
    try {
      await fetch(`/api/expert/meetings/${mtg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SAVE_MOM", momNotes })
      });
      await fetchWorkspace();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingMom(false);
    }
  };

  const handleToggleActionItem = async (itemId: string, currentStatus: string) => {
    if (!mtg) return;
    try {
      await fetch(`/api/expert/meetings/${mtg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_ACTION",
          actionItemId: itemId,
          actionItemStatus: currentStatus === "DONE" ? "IN_PROGRESS" : "DONE"
        })
      });
      await fetchWorkspace();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddActionItem = async () => {
    if (!mtg || !newActionTitle.trim()) return;
    try {
      await fetch(`/api/expert/meetings/${mtg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_ACTION",
          newActionTitle,
          assignee: newActionAssignee
        })
      });
      setNewActionTitle(""); setNewActionAssignee("");
      await fetchWorkspace();
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

  if (!mtg) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/expert/meetings" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900">{mtg.title}</h1>
            <p className="text-xs text-slate-500 font-semibold">{mtg.orgName} · {mtg.projectName || "General R&D Sync"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchWorkspace} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={mtg.videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
          >
            <Video className="h-3.5 w-3.5" /> Join Call
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "mom", label: "Minutes of Meeting (MoM)", icon: FileText },
          { key: "actions", label: `Action Items (${mtg.actionItems.length})`, icon: CheckCircle2 },
          { key: "participants", label: `Participants (${mtg.participants.length})`, icon: Users },
          { key: "docs", label: `Shared Files (${mtg.documents.length})`, icon: File }
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
        {/* MOM EDITOR TAB */}
        {activeTab === "mom" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Minutes of Meeting (MoM) Editor</h3>
              <button onClick={handleSaveMom} disabled={savingMom}
                className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {savingMom ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save MoM Notes
              </button>
            </div>

            <textarea
              value={momNotes}
              onChange={e => setMomNotes(e.target.value)}
              rows={10}
              placeholder="Record key technical decisions, hardware test observations, deliverable deadlines discussed during the call..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed font-sans"
            />
          </div>
        )}

        {/* ACTION ITEMS TAB */}
        {activeTab === "actions" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Follow-up Action Checklist</h3>
            <div className="space-y-2">
              {mtg.actionItems.map(act => (
                <div key={act.id} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleActionItem(act.id, act.status)}
                      className={`h-5 w-5 rounded border flex items-center justify-center ${
                        act.status === "DONE" ? "bg-green-500 text-white border-green-500" : "border-slate-300 bg-white"
                      }`}
                    >
                      {act.status === "DONE" && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <span className={`font-bold ${act.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>{act.title}</span>
                      <p className="text-[9px] text-slate-400 font-semibold">Assignee: {act.assignee} · Due: {act.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Action Item */}
            <div className="flex gap-2 max-w-lg border-t border-slate-100 pt-3">
              <input value={newActionTitle} onChange={e => setNewActionTitle(e.target.value)} placeholder="Add new action item task..."
                className="h-8 px-3 border border-slate-200 rounded-lg flex-1 text-xs" />
              <input value={newActionAssignee} onChange={e => setNewActionAssignee(e.target.value)} placeholder="Assignee..."
                className="h-8 px-3 border border-slate-200 rounded-lg w-32 text-xs" />
              <button onClick={handleAddActionItem} className="h-8 px-3 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-hover">Add</button>
            </div>
          </div>
        )}

        {/* PARTICIPANTS TAB */}
        {activeTab === "participants" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Session Participants Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mtg.participants.map((p, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
