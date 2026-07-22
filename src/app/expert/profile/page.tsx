"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, RefreshCw, Star, BookOpen, Award, Link2, Save,
  Loader2, MessageSquare, Briefcase, Globe, Plus, ShieldCheck,
  FileText, CheckCircle2, Clock, X, ExternalLink
} from "lucide-react";

interface Publication {
  title: string;
  journal: string;
  year: number;
  doi: string;
  citations: number;
}

interface Patent {
  title: string;
  patentNumber: string;
  status: string;
  year: number;
}

interface ExpertProfile {
  id: string;
  name: string;
  designation: string;
  institution: string;
  department: string;
  yearsOfExp: number;
  bio: string;
  rating: number;
  reviewsCount: number;
  availabilityStatus: string;
  hourlyRate: number;
  preferredHoursPerWeek: number;
  verificationStatus: string;
  linkedinUrl: string;
  googleScholar: string;
  orcid: string;
  skills: string[];
  domains: string[];
  certifications: Array<{ title: string; issuer: string; year: number }>;
  employmentHistory: Array<{ role: string; organization: string; duration: string }>;
  publications_list: Publication[];
  patents: Patent[];
  documents: Array<{ id: string; name: string; docType: string; fileUrl: string; status: string }>;
}

export default function ExpertProfilePage() {
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Edit State
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Publication Modal State
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubJournal, setPubJournal] = useState("");
  const [pubYear, setPubYear] = useState("2026");
  const [pubDoi, setPubDoi] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/expert/profile");
      const data = await res.json();
      setProfile(data);
      setBio(data.bio || "");
      setHourlyRate(data.hourlyRate?.toString() || "3500");
      setHoursPerWeek(data.preferredHoursPerWeek?.toString() || "12");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveOverview = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch("/api/expert/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          hourlyRate,
          preferredHoursPerWeek: hoursPerWeek,
          skills: profile.skills
        })
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleAddPublication = async () => {
    if (!pubTitle || !pubJournal) return;
    setSaving(true);
    try {
      await fetch("/api/expert/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPublication: {
            title: pubTitle,
            journal: pubJournal,
            year: pubYear,
            doi: pubDoi
          }
        })
      });
      setPubModalOpen(false);
      setPubTitle(""); setPubJournal(""); setPubDoi("");
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header Profile Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center text-2xl shrink-0">
            {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{profile.name}</h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-600" /> {profile.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold">{profile.designation}</p>
            <p className="text-xs text-slate-400 font-semibold">{profile.institution} · {profile.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {profile.googleScholar && (
            <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer"
               className="h-8 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Scholar
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
               className="h-8 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-blue-600" /> LinkedIn
            </a>
          )}
          <button onClick={fetchProfile} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 -mb-2.5">
        {[
          { key: "overview", label: "Overview & Bio", icon: User },
          { key: "skills", label: `Skills & Domains (${profile.skills.length})`, icon: Award },
          { key: "publications", label: `Publications & Patents (${profile.publications_list.length})`, icon: BookOpen },
          { key: "documents", label: `Verification Documents (${profile.documents.length})`, icon: FileText }
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Professional Biography & Preferences</h3>
              <button onClick={handleSaveOverview} disabled={saving}
                className="h-8 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Overview
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Biography</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Hourly Consulting Rate (INR)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Preferred Consulting Hours / Week</label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={e => setHoursPerWeek(e.target.value)}
                    className="w-full h-8 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs font-bold"
                  />
                </div>
              </div>

              {/* Employment History */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Employment History</h4>
                <div className="space-y-2">
                  {profile.employmentHistory?.map((emp, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{emp.role}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{emp.organization}</p>
                      </div>
                      <span className="text-[9px] font-bold text-primary">{emp.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS & DOMAINS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Managed Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)}><X className="h-3 w-3 text-slate-400 hover:text-red-500" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm pt-2">
                <input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Add new skill tag..."
                  className="h-8 px-3 border border-slate-200 rounded-lg flex-1 text-xs"
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                />
                <button onClick={handleAddSkill} className="h-8 px-3 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-hover">Add</button>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Research Domain Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {profile.domains.map((domain, i) => (
                  <span key={i} className="text-xs bg-primary-light text-primary border border-primary-border px-3 py-1 rounded-xl font-bold">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PUBLICATIONS & PATENTS TAB */}
        {activeTab === "publications" && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Peer-Reviewed Publications</h3>
              <button onClick={() => setPubModalOpen(true)} className="h-8 px-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Publication
              </button>
            </div>

            <div className="space-y-3">
              {profile.publications_list.map((pub, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-1 bg-slate-50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800">{pub.title}</p>
                    <span className="text-[9px] font-bold text-primary shrink-0">{pub.year}</span>
                  </div>
                  <p className="text-[9px] text-primary font-bold">{pub.journal}</p>
                  <div className="flex items-center gap-3 text-[8px] text-slate-400 font-semibold pt-1">
                    <span>DOI: {pub.doi}</span>
                    <span>·</span>
                    <span>{pub.citations} Citations</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Patents */}
            {profile.patents && profile.patents.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Patents & IP Rights</h3>
                <div className="space-y-2">
                  {profile.patents.map((pat, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{pat.title}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">Patent #: {pat.patentNumber}</p>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                        pat.status === "GRANTED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>{pat.status} ({pat.year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VERIFICATION & DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Verification & Institutional Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.documents.map(doc => (
                <div key={doc.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center font-bold">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{doc.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{doc.docType}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Publication Modal */}
      <AnimatePresence>
        {pubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPubModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-primary" /> Add Research Publication
                </h3>
                <button onClick={() => setPubModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Paper Title *</label>
                  <input value={pubTitle} onChange={e => setPubTitle(e.target.value)} placeholder="Title of publication..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Journal / Conference Name *</label>
                  <input value={pubJournal} onChange={e => setPubJournal(e.target.value)} placeholder="e.g. IEEE Transactions on Smart Grid"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Publication Year</label>
                    <input type="number" value={pubYear} onChange={e => setPubYear(e.target.value)}
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">DOI / Link</label>
                    <input value={pubDoi} onChange={e => setPubDoi(e.target.value)} placeholder="10.1109/TSG.2026..."
                      className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setPubModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddPublication} disabled={saving || !pubTitle || !pubJournal}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Add Publication
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
