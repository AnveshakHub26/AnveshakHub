"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, RefreshCw, Star, BookOpen, Award, Link2, Save,
  Loader2, Briefcase, Plus, ShieldCheck, FileText, X,
  Code2, ExternalLink, Download, Globe,
  GraduationCap, BadgeCheck, Sparkles, Pencil, ChevronRight
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

const TABS = [
  { key: "overview",        label: "Profile & Bio",         icon: User },
  { key: "skills",          label: "Skills",                icon: Award },
  { key: "projects",        label: "Projects",              icon: Briefcase },
  { key: "certifications",  label: "Certifications",        icon: FileText },
];

const VERIFICATION_META: Record<string, { color: string; bg: string; label: string }> = {
  VERIFIED:   { color: "#2F6B4F", bg: "#E8F2EC", label: "Verified" },
  PENDING:    { color: "#92400E", bg: "#FEF3C7", label: "Pending Review" },
  UNVERIFIED: { color: "#DC2626", bg: "#FEE2E2", label: "Not Verified" },
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [bio, setBio]                 = useState("");
  const [githubUrl, setGithubUrl]     = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [newSkill, setNewSkill]       = useState("");

  const [projModalOpen, setProjModalOpen] = useState(false);
  const [projTitle, setProjTitle]         = useState("");
  const [projRole, setProjRole]           = useState("");
  const [projDesc, setProjDesc]           = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/student/profile");
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

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSaveOverview = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, githubUrl, linkedinUrl, portfolioUrl, skills: profile.skills })
      });
      await fetchProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const projectsList = Array.isArray(profile?.projectsList) ? profile.projectsList : [];
  const certifications = Array.isArray(profile?.certifications) ? profile.certifications : [];
  const achievements = Array.isArray(profile?.achievements) ? profile.achievements : [];
  const careerInterests = Array.isArray(profile?.careerInterests) ? profile.careerInterests : [];

  const handleAddSkill = () => {
    if (!newSkill.trim() || !profile) return;
    if (!skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...skills, newSkill.trim()] });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: skills.filter(s => s !== skill) });
  };

  const handleAddProject = async () => {
    if (!projTitle.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newProject: { title: projTitle, role: projRole, description: projDesc } })
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        <p className="text-xs text-[#78716A] font-semibold">Loading your profile…</p>
      </div>
    );
  }

  if (!profile) return null;

  const profileName = profile?.name || "Student Researcher";
  const initials   = profileName.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase() || "SR";
  const verMeta    = VERIFICATION_META[profile?.verificationStatus || "UNVERIFIED"] || VERIFICATION_META["UNVERIFIED"];

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Profile Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#211F1D] rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-[#FF5A36]/15 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-32 h-24 w-24 bg-[#4338CA]/15 blur-2xl rounded-full" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#FF5A36] to-[#FF8C6B] text-white font-extrabold flex items-center justify-center text-3xl flex-shrink-0 shadow-lg shadow-[#FF5A36]/30">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">{profile.name}</h1>
              {profile.usn && (
                <span className="text-[10px] font-mono font-extrabold bg-[#3a3733] text-[#A8A196] px-2 py-0.5 rounded">
                  {profile.usn}
                </span>
              )}
              <span
                className="text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: verMeta.bg, color: verMeta.color }}
              >
                <BadgeCheck className="h-3 w-3" /> {verMeta.label}
              </span>
            </div>
            <p className="text-[#A8A196] text-sm font-semibold mt-1">
              {profile.institution || "Institution Not Set"} {profile.degree ? `· ${profile.degree}` : ""} {profile.branch ? `in ${profile.branch}` : ""}
            </p>
            <p className="text-[#78716A] text-xs font-semibold mt-0.5">
              {profile.cgpa ? `CGPA ${profile.cgpa} · ` : ""}{profile.semester ? `Semester ${profile.semester} · ` : ""}{profile.email}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="h-7 px-3 bg-[#3a3733] text-[#A8A196] hover:text-white hover:bg-[#4a4745] rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors">
                  <Code2 className="h-3 w-3" /> GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="h-7 px-3 bg-[#3a3733] text-[#A8A196] hover:text-white hover:bg-[#4a4745] rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors">
                  <Link2 className="h-3 w-3" /> LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                  className="h-7 px-3 bg-[#3a3733] text-[#A8A196] hover:text-white hover:bg-[#4a4745] rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors">
                  <Globe className="h-3 w-3" /> Portfolio
                </a>
              )}
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} download
                  className="h-7 px-3 bg-[#FF5A36]/20 text-[#FF5A36] hover:bg-[#FF5A36]/30 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors">
                  <Download className="h-3 w-3" /> Resume
                </a>
              )}
            </div>
          </div>

          <button
            onClick={fetchProfile}
            className="h-8 w-8 rounded-lg bg-[#3a3733] flex items-center justify-center text-[#78716A] hover:text-white transition-colors flex-shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Skills",         value: skills.length,         color: "#FF5A36", bg: "#FFF0ED",  icon: Award },
          { label: "Projects",       value: projectsList.length,   color: "#4338CA", bg: "#EEF2FF",  icon: Briefcase },
          { label: "Certifications", value: certifications.length, color: "#2F6B4F", bg: "#E8F2EC",  icon: FileText },
          { label: "Achievements",   value: achievements.length,   color: "#92400E", bg: "#FEF3C7",  icon: Star },
        ].map((s) => (
          <div key={s.label} className="bg-[#EFE9DF] rounded-2xl p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#211F1D]">{s.value}</p>
              <p className="text-[10px] text-[#78716A] font-semibold uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-[#E2DCD2] overflow-x-auto scrollbar-none">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap -mb-px ${
                activeTab === t.key
                  ? "border-[#FF5A36] text-[#FF5A36]"
                  : "border-transparent text-[#78716A] hover:text-[#211F1D]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Bio & Career Interests */}
            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
                <Pencil className="h-4 w-4 text-[#FF5A36]" /> Research Bio
              </h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Tell your story — what research excites you, what problems you want to solve, your long-term ambitions…"
                className="w-full p-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm leading-relaxed resize-none bg-white transition-colors"
              />
              {profile.careerInterests && profile.careerInterests.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest mb-2">Career Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.careerInterests.map((ci) => (
                      <span key={ci} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFF0ED] text-[#FF5A36] border border-[#FFCFC4]">
                        {ci}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[#FF5A36]" /> Professional Links
              </h3>
              {[
                { label: "GitHub", value: githubUrl, setter: setGithubUrl, placeholder: "github.com/yourhandle" },
                { label: "LinkedIn", value: linkedinUrl, setter: setLinkedinUrl, placeholder: "linkedin.com/in/yourprofile" },
                { label: "Portfolio", value: portfolioUrl, setter: setPortfolioUrl, placeholder: "yourportfolio.dev" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">
                    {field.label}
                  </label>
                  <input
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveOverview}
                disabled={saving}
                className="w-full h-10 bg-[#FF5A36] text-white rounded-xl text-sm font-bold hover:bg-[#E04826] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors mt-2 shadow-sm shadow-[#FF5A36]/30"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-[#EFE9DF] rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#211F1D] flex items-center gap-2">
                <Award className="h-4 w-4 text-[#FF5A36]" /> Technical Skills & Competencies
              </h3>
              <span className="text-xs font-bold text-[#78716A]">{profile.skills.length} skills</span>
            </div>

            {/* Add Skill */}
            <div className="flex items-center gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }}
                placeholder="Add a skill (e.g. MATLAB, Python, IoT)"
                className="flex-1 h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
              />
              <button
                onClick={handleAddSkill}
                className="h-10 px-4 bg-[#FF5A36] text-white rounded-xl text-sm font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <motion.div
                  key={skill}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 h-8 px-3 bg-[#FBF7F0] border border-[#E2DCD2] rounded-full text-xs font-bold text-[#211F1D] hover:border-[#FF5A36] transition-colors group"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="h-4 w-4 rounded-full flex items-center justify-center text-[#A8A196] hover:text-[#FF5A36] transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </motion.div>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-xs text-[#78716A] py-4">No skills added yet. Add your first skill above.</p>
              )}
            </div>

            <button
              onClick={handleSaveOverview}
              disabled={saving}
              className="h-9 px-5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm shadow-[#FF5A36]/30"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save Skills
            </button>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#211F1D]">Projects Portfolio</h3>
              <button
                onClick={() => setProjModalOpen(true)}
                className="h-9 px-4 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#FF5A36]/30"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>

            {profile.projectsList.length === 0 ? (
              <div className="bg-[#EFE9DF] rounded-2xl p-12 text-center">
                <Briefcase className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
                <p className="text-sm font-bold text-[#211F1D]">No projects yet</p>
                <p className="text-xs text-[#78716A] mt-1">Add your first project to showcase your R&D work.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projectsList.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-[#EFE9DF] rounded-2xl p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all border border-transparent hover:border-[#D8D2C7]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-[#211F1D]">{proj.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF5A36] mt-1 inline-block">
                          {proj.role}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">{proj.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Certifications Tab */}
        {activeTab === "certifications" && (
          <motion.div
            key="certifications"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-extrabold text-[#211F1D]">Certifications & Achievements</h3>

            {/* Certifications */}
            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-extrabold text-[#57534E] uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2F6B4F]" /> Certifications
              </h4>
              {profile.certifications.length === 0 ? (
                <p className="text-xs text-[#78716A]">No certifications added yet.</p>
              ) : (
                <div className="space-y-3">
                  {profile.certifications.map((cert, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between hover:border-[#2F6B4F]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-[#E8F2EC] flex items-center justify-center">
                          <ShieldCheck className="h-4 w-4 text-[#2F6B4F]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#211F1D]">{cert.title}</p>
                          <p className="text-[10px] text-[#78716A] font-semibold">{cert.issuer}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#2F6B4F]">{cert.year}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-[#EFE9DF] rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-extrabold text-[#57534E] uppercase tracking-widest flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-[#92400E]" /> Achievements & Awards
              </h4>
              {profile.achievements.length === 0 ? (
                <p className="text-xs text-[#78716A]">No achievements added yet.</p>
              ) : (
                <div className="space-y-3">
                  {profile.achievements.map((ach, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-4 flex items-center justify-between hover:border-[#92400E]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                          <Star className="h-4 w-4 text-[#92400E]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#211F1D]">{ach.title}</p>
                          <p className="text-[10px] text-[#78716A] font-semibold">{ach.issuer}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#92400E]">{ach.year}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {projModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setProjModalOpen(false)}
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
                    <Briefcase className="h-4 w-4 text-[#FF5A36]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#211F1D]">Add Project</h3>
                    <p className="text-[10px] text-[#78716A]">Showcase your R&D work</p>
                  </div>
                </div>
                <button
                  onClick={() => setProjModalOpen(false)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[#EFE9DF] transition-colors"
                >
                  <X className="h-4 w-4 text-[#A8A196]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Project Title *</label>
                  <input
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Soil Moisture Monitoring System with LoRa"
                    className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Your Role</label>
                  <input
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    placeholder="e.g. Lead Hardware Engineer"
                    className="w-full h-10 px-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm font-semibold bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#78716A] uppercase tracking-widest block mb-1.5">Description</label>
                  <textarea
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    rows={3}
                    placeholder="Brief description of the project, technologies used, and outcomes achieved…"
                    className="w-full p-3 border border-[#E2DCD2] rounded-xl focus:outline-none focus:border-[#FF5A36] text-sm resize-none bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#E2DCD2] pt-4 mt-5">
                <button
                  onClick={() => setProjModalOpen(false)}
                  className="h-9 px-4 border border-[#E2DCD2] text-[#78716A] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  disabled={saving || !projTitle.trim()}
                  className="h-9 px-5 bg-[#FF5A36] text-white rounded-xl text-xs font-bold hover:bg-[#E04826] flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm shadow-[#FF5A36]/30"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Add to Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
