"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Star, BookOpen, Award, Link2,
  Loader2, MessageSquare, Briefcase, Globe, Send, User,
  CheckCircle2, ExternalLink, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface Discussion {
  id: string;
  authorName: string;
  content: string;
  messageType: string;
  createdAt: string;
}

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Publication {
  title: string;
  journal: string;
  year: number;
}

interface ExpertDetail {
  id: string;
  name: string;
  designation: string;
  institution: string;
  department: string;
  bio: string;
  domains: string[];
  skills: string[];
  yearsOfExp: number;
  rating: number;
  reviewsCount: number;
  availability: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  publications: number;
  citations: number;
  hIndex: number;
  linkedinUrl: string | null;
  googleScholar: string | null;
  orcid: string | null;
  certifications: Array<{ title: string; issuer: string; year: number }>;
  publications_list: Publication[];
  assignedProjects: Array<{ id: string; name: string; status: string }>;
  reviews: Review[];
  discussions: Discussion[];
}

const MESSAGE_TYPE_STYLES: Record<string, string> = {
  GENERAL:  "bg-slate-50 border-slate-100",
  QUESTION: "bg-blue-50 border-blue-100",
  FEEDBACK: "bg-green-50 border-green-100",
  PROPOSAL: "bg-purple-50 border-purple-100"
};

export default function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [expert, setExpert] = useState<ExpertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("GENERAL");
  const [sending, setSending] = useState(false);

  const fetchExpert = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/industry/experts/${id}`);
      const data = await res.json();
      setExpert(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpert();
  }, [fetchExpert]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !expert) return;
    setSending(true);
    try {
      const res = await fetch(`/api/industry/experts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_DISCUSSION", content: newMessage, authorName: "Rajesh Sharma", messageType })
      });
      const data = await res.json();
      if (data.success && data.discussion) {
        setExpert({ ...expert, discussions: [...expert.discussions, data.discussion] });
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!expert) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Back & Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/industry/marketplace" className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{expert.institution}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[9px] font-semibold text-slate-400">{expert.department}</span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 mt-0.5">{expert.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expert.linkedinUrl && (
            <a href={expert.linkedinUrl} target="_blank" rel="noopener noreferrer"
               className="h-8 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-blue-600" /> LinkedIn
            </a>
          )}
          <button onClick={fetchExpert} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Profile Banner */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary-border rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center text-xl shrink-0">
            {expert.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-slate-900">{expert.name}</h2>
            <p className="text-xs text-slate-600 font-semibold">{expert.designation}</p>
            <p className="text-xs text-slate-400 font-semibold">{expert.institution} · {expert.department}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {expert.domains.map((d, i) => (
                <span key={i} className="text-[8px] bg-primary-light text-primary-text border border-primary-border px-2 py-0.5 rounded font-bold">{d}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 shrink-0 text-center">
            {[
              { label: "Rating", value: `★ ${expert.rating}`, sub: `${expert.reviewsCount} reviews` },
              { label: "Experience", value: `${expert.yearsOfExp}yr`, sub: "Industry" },
              { label: "H-Index", value: expert.hIndex, sub: `${expert.citations} citations` },
              { label: "Projects", value: expert.completedProjectsCount, sub: "Completed" }
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-2.5">
                <div className="text-sm font-extrabold text-primary">{stat.value}</div>
                <div className="text-[8px] text-slate-500 font-bold">{stat.label}</div>
                <div className="text-[8px] text-slate-400 font-semibold">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "profile", label: "Profile & Credentials", icon: User },
          { key: "discussions", label: `Collaboration Thread (${expert.discussions.length})`, icon: MessageSquare },
          { key: "projects", label: `Assigned Projects (${expert.assignedProjects.length})`, icon: Briefcase },
          { key: "reviews", label: `Reviews (${expert.reviews.length})`, icon: Star }
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

      {/* Workspace Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Biography</h3>
                  <p className="text-slate-700 font-semibold leading-relaxed">{expert.bio}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.skills.map((s, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Key Publications</h3>
                  <div className="space-y-2">
                    {expert.publications_list?.map((pub, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl p-3 space-y-0.5">
                        <p className="font-bold text-slate-800">{pub.title}</p>
                        <p className="text-[9px] text-primary font-bold">{pub.journal}</p>
                        <p className="text-[8px] text-slate-400 font-semibold">{pub.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Certifications</h3>
                  {expert.certifications?.map((cert, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Award className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">{cert.title}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{cert.issuer} · {cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Academic Links</h3>
                  {expert.googleScholar && (
                    <a href={expert.googleScholar} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-primary hover:underline font-semibold">
                      <BookOpen className="h-3.5 w-3.5" /> Google Scholar
                    </a>
                  )}
                  {expert.orcid && (
                    <p className="flex items-center gap-2 text-slate-500 font-semibold">
                      <Globe className="h-3.5 w-3.5" /> ORCID: {expert.orcid}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* DISCUSSIONS */}
          {activeTab === "discussions" && (
            <motion.div key="discussions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {expert.discussions.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-8">No messages yet. Start the collaboration thread.</p>
                ) : expert.discussions.map(d => (
                  <div key={d.id} className={`border rounded-xl p-3.5 space-y-1.5 ${MESSAGE_TYPE_STYLES[d.messageType] || MESSAGE_TYPE_STYLES.GENERAL}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" /> {d.authorName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-slate-400 font-semibold">{d.messageType}</span>
                        <span className="text-[8px] text-slate-400 font-semibold">{new Date(d.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 font-semibold leading-relaxed">{d.content}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex gap-2 items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Type:</label>
                  {["GENERAL", "QUESTION", "PROPOSAL"].map(t => (
                    <button key={t} onClick={() => setMessageType(t)}
                      className={`h-6 px-2 rounded text-[9px] font-bold border ${messageType === t ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Write your message, question or proposal..."
                    className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-xs"
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  />
                  <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}
                    className="h-9 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1">
                    {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ASSIGNED PROJECTS */}
          {activeTab === "projects" && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-xs">
              {expert.assignedProjects.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-8">No projects currently linked with this expert.</p>
              ) : expert.assignedProjects.map(p => (
                <div key={p.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary-light rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                        p.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        p.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>{p.status.replace("_", " ")}</span>
                    </div>
                  </div>
                  <Link href={`/industry/projects/${p.id}`} className="h-7 px-3 bg-slate-50 border border-slate-200 hover:border-primary rounded-lg text-[10px] font-bold text-slate-600 hover:text-primary flex items-center gap-1 transition-colors">
                    View Project <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </motion.div>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-xs">
              {expert.reviews.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-8">No reviews yet.</p>
              ) : expert.reviews.map(r => (
                <div key={r.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">{r.reviewer}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-[8px] text-slate-400 font-semibold ml-1">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-semibold leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
