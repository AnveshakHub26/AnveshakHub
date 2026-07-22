"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, RefreshCw, Star, BookOpen, Award, Link2, Save,
  Loader2, Briefcase, Plus, ShieldCheck, FileText, X,
  Code2, ExternalLink, Download
} from "lucide-react";

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  usn: string;
  institution: string;
  degree: string;
  branch: string;
  semester: number;
  cgpa: number;
  bio: string;
  skills: string[];
  resumeUrl: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  verificationStatus: string;
  careerInterests: string[];
  certifications: Array<{ title: string; issuer: string; year: number }>;
  achievements: Array<{ title: string; issuer: string; year: number }>;
  projectsList: Array<{ title: string; role: string; description: string }>;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Edit Bio / Links State
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Add Project Modal State
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projRole, setProjRole] = useState("");
  const [projDesc, setProjDesc] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/profile");
      const data = await res.json();
      setProfile(data);
      setBio(data.bio || "");
      setGithubUrl(data.githubUrl || "");
      setLinkedinUrl(data.linkedinUrl || "");
      setPortfolioUrl(data.portfolioUrl || "");
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
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio,
          githubUrl,
          linkedinUrl,
          portfolioUrl,
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

  const handleAddProject = async () => {
    if (!projTitle.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newProject: {
            title: projTitle,
            role: projRole,
            description: projDesc
          }
        })
      });
      setProjModalOpen(false);
      setProjTitle(""); setProjRole(""); setProjDesc("");
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
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center text-2xl shrink-0">
            {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{profile.name}</h1>
              <span className="text-[8px] font-mono font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{profile.usn}</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-600" /> {profile.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold">{profile.institution} · {profile.degree}</p>
            <p className="text-xs text-slate-400 font-semibold">CGPA: {profile.cgpa} · Semester {profile.semester}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="h-8 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5" /> GitHub
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="h-8 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5">
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
          { key: "overview", label: "Academic & Bio", icon: User },
          { key: "skills", label: `Skills & Competencies (${profile.skills.length})`, icon: Award },
          { key: "projects", label: `Projects Portfolio (${profile.projectsList.length})`, icon: Briefcase },
          { key: "certifications", label: `Certifications (${profile.certifications.length})`, icon: FileText }
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
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Personal Biography & Career Profiles</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">GitHub Profile URL</label>
                  <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">LinkedIn Profile URL</label>
                  <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Portfolio Website URL</label>
                  <input value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
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
                  placeholder="Add skill tag..."
                  className="h-8 px-3 border border-slate-200 rounded-lg flex-1 text-xs"
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                />
                <button onClick={handleAddSkill} className="h-8 px-3 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-hover">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Academic R&D Projects Showcase</h3>
              <button onClick={() => setProjModalOpen(true)} className="h-8 px-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {profile.projectsList.map((p, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">{p.title}</p>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{p.role}</span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === "certifications" && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide text-[10px]">Certifications & Honors</h3>
            <div className="space-y-2">
              {profile.certifications.map((c, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{c.issuer}</p>
                  </div>
                  <span className="text-[9px] font-bold text-primary">{c.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {projModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setProjModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] max-w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-primary" /> Add R&D Project
                </h3>
                <button onClick={() => setProjModalOpen(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Project Title *</label>
                  <input value={projTitle} onChange={e => setProjTitle(e.target.value)} placeholder="Project title..."
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Your Role</label>
                  <input value={projRole} onChange={e => setProjRole(e.target.value)} placeholder="e.g. Lead Hardware Intern"
                    className="w-full h-8 px-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Description & Key Achievements</label>
                  <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} rows={3} placeholder="Technical methodology and outcomes..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-xs resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-4">
                <button onClick={() => setProjModalOpen(false)} className="h-8 px-3 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddProject} disabled={saving || !projTitle.trim()}
                  className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
                  {saving && <Loader2 className="h-3 w-3 animate-spin" />} Add Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
