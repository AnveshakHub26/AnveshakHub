"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, GraduationCap, UserCheck, ArrowRight,
  CheckCircle2, ShieldCheck, Sparkles, HelpCircle, X, Loader2, Send
} from "lucide-react";
import BrandLogo from "@/components/brand-logo";

const ROLES = [
  {
    id: "industry",
    title: "Industry / Organization",
    subtitle: "Companies, startups, MSMEs, research bodies, government agencies",
    icon: Building2,
    badge: "Dynamic Registration",
    features: [
      "Post R&D problem statements",
      "Sponsor applied research projects",
      "Access vetted domain experts & talent",
    ],
    cta: "Continue as Industry",
    href: "/auth/register/industry",
    color: "#FF5A36",
  },
  {
    id: "expert",
    title: "Subject Matter Expert",
    subtitle: "Professors, PhD holders, researchers, industry consultants",
    icon: GraduationCap,
    badge: "Credential Verification",
    features: [
      "Lead R&D milestones and deliverables",
      "Supervise and mentor student researchers",
      "Earn consulting fees via secure escrow",
    ],
    cta: "Continue as Expert",
    href: "/auth/register/expert",
    color: "#2F6B4F",
  },
  {
    id: "student",
    title: "Student Researcher",
    subtitle: "Students, postgrads, young researchers seeking R&D internships",
    icon: UserCheck,
    badge: "Student Verification",
    features: [
      "Apply to funded internship positions",
      "Execute real research milestones",
      "Earn certificates & skill endorsements",
    ],
    cta: "Continue as Student",
    href: "/auth/register/student",
    color: "#B45309",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpForm, setHelpForm] = useState({ name: "", email: "", message: "" });
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpSent, setHelpSent] = useState(false);

  const handleProceed = () => {
    const role = ROLES.find((r) => r.id === selected);
    if (role) router.push(role.href);
  };

  const handleHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    setHelpSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setHelpSent(true);
    setHelpSubmitting(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-app)" }}>
      {/* Top bar */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <BrandLogo />
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium link-inline" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <span className="font-semibold" style={{ color: "var(--brand)" }}>Sign in</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Page heading */}
        <div className="text-center mb-12">
          <span className="badge-ember badge text-xs mb-4 inline-flex">Select Your Role</span>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
            How will you use AnveshakHub?
          </h1>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Choose the role that best describes you. Each role has different verification requirements and access levels.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className="text-left rounded-2xl p-6 transition-all"
                style={{
                  backgroundColor: isSelected ? "var(--bg-elevated)" : "var(--bg-surface)",
                  border: `2px solid ${isSelected ? role.color : "var(--border)"}`,
                  boxShadow: isSelected ? `0 0 0 4px ${role.color}18` : "var(--shadow-xs)",
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${role.color}15`, color: role.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className="h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? role.color : "var(--border-muted)",
                      backgroundColor: isSelected ? role.color : "transparent",
                    }}
                  >
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                </div>

                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: role.color }}
                >
                  {role.badge}
                </span>

                <h2 className="mt-1 text-base font-extrabold leading-tight" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
                  {role.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {role.subtitle}
                </p>

                <ul className="mt-4 space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-body)" }}>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: role.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleProceed}
            disabled={!selected}
            className="btn-primary btn-lg"
          >
            {selected
              ? `${ROLES.find((r) => r.id === selected)?.cta} →`
              : "Select a Role to Continue"}
          </button>

          <button
            onClick={() => setHelpOpen(true)}
            className="text-sm font-medium link-inline flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            <HelpCircle className="h-4 w-4" />
            Not sure which role to choose?
          </button>
        </div>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(33,31,29,0.5)", backdropFilter: "blur(4px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
                  Not Sure Where to Start?
                </h3>
                <button onClick={() => setHelpOpen(false)} className="btn-ghost btn-sm !px-2" style={{ color: "var(--text-muted)" }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              {helpSent ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--success)" }} />
                  <p className="font-semibold" style={{ color: "var(--text-heading)" }}>Message sent!</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>We'll get back to you within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleHelp} className="space-y-3">
                  <div>
                    <label className="form-label">Your Name</label>
                    <input type="text" required value={helpForm.name} onChange={(e) => setHelpForm((p) => ({ ...p, name: e.target.value }))} placeholder="Dr. Ramesh Sharma" className="input-field" />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input type="email" required value={helpForm.email} onChange={(e) => setHelpForm((p) => ({ ...p, email: e.target.value }))} placeholder="ramesh@example.com" className="input-field" />
                  </div>
                  <div>
                    <label className="form-label">How can we help?</label>
                    <textarea required value={helpForm.message} onChange={(e) => setHelpForm((p) => ({ ...p, message: e.target.value }))} placeholder="Describe your background and what you're looking to do..." className="input-field" rows={3} />
                  </div>
                  <button type="submit" disabled={helpSubmitting} className="btn-primary w-full">
                    {helpSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
