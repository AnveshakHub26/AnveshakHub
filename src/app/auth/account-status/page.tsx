"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import BrandLogo from "@/components/brand-logo";
import {
  Building2,
  Lock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  HelpCircle,
  Clock,
  Phone,
  Mail,
  UserX,
  FileText,
  BadgeAlert,
  Loader2,
  Send,
  X,
  CheckCircle2
} from "lucide-react";
import Footer from "@/components/footer";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, delay: i * 0.06, ease: "easeOut" }
  })
};

type LockReason = "failed_logins" | "temporary_suspension" | "verification_pending" | "disabled" | "policy_violation";

interface LockStatus {
  reasonKey: LockReason;
  title: string;
  statusBadge: string;
  badgeColor: string;
  description: string;
  estimatedUnlock: string | null;
  instructions: string[];
}

const lockDetails: Record<LockReason, LockStatus> = {
  failed_logins: {
    reasonKey: "failed_logins",
    title: "Account Temporarily Locked",
    statusBadge: "Locked (Brute-Force Protection)",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    description: "Your account has been temporarily locked due to too many failed sign-in attempts. This is a security measure to protect your credentials.",
    estimatedUnlock: "30 Minutes (Autounlock enabled)",
    instructions: [
      "Wait for the autounlock countdown to expire.",
      "Ensure you are entering the correct password.",
      "If you forgot your password, return to login and use the recovery link."
    ]
  },
  temporary_suspension: {
    reasonKey: "temporary_suspension",
    title: "Account Temporarily Suspended",
    statusBadge: "Suspended",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    description: "Your account has been temporarily suspended by an administrator or because of abnormal account activity.",
    estimatedUnlock: "Pending Admin Review",
    instructions: [
      "Contact your organization administrator to review your role state.",
      "Check your official mailbox for a suspension notice email.",
      "Submit an appeal if you believe this is an error."
    ]
  },
  verification_pending: {
    reasonKey: "verification_pending",
    title: "Organization Verification Pending",
    statusBadge: "Awaiting Compliance Approval",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Your organization registration is currently undergoing manual compliance checks. Platform access will be enabled once verification completes.",
    estimatedUnlock: "1–2 Business Days",
    instructions: [
      "Monitor your email for notifications from the AnveshakHub compliance team.",
      "Ensure any requested verification documents have been fully submitted.",
      "You can track the live progress via the Registration Status portal."
    ]
  },
  disabled: {
    reasonKey: "disabled",
    title: "Account Deactivated",
    statusBadge: "Deactivated / Terminated",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-350",
    description: "This stakeholder account has been deactivated. This typically occurs when an organization offboards an employee or if registration is rejected.",
    estimatedUnlock: "Permanent (No autounlock)",
    instructions: [
      "Verify with your enterprise HR or project coordinator.",
      "Create a new stakeholder profile if your role has changed.",
      "Submit a retrieval request to the helpdesk if deactivated in error."
    ]
  },
  policy_violation: {
    reasonKey: "policy_violation",
    title: "Security Policy Violation",
    statusBadge: "Suspended (Compliance Action)",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    description: "Your account was flagged for violating the AnveshakHub Enterprise Terms of Use or security access policies.",
    estimatedUnlock: "Requires Compliance Audit",
    instructions: [
      "Review the Enterprise Collaboration Guidelines and acceptable use terms.",
      "All sessions and operations associated with this ID have been terminated.",
      "Contact security audit support to request a case review."
    ]
  }
};

// ─── Support Modal ────────────────────────────────────────────────────────────
function StatusSupportModal({
  open,
  onClose,
  reasonTitle,
  reasonKey
}: {
  open: boolean;
  onClose: () => void;
  reasonTitle: string;
  reasonKey: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", subject: `Account Lock appeal - ${reasonKey}`, message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // API Integration Point: POST /api/auth/appeal-status
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => setSent(false), 300);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg focus:outline-none px-4"
          aria-describedby="status-support-desc"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <BadgeAlert className="h-4.5 w-4.5 text-red-600" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-extrabold text-secondary">Submit Appeal & Support Request</Dialog.Title>
                  <p id="status-support-desc" className="text-[10px] text-slate-400 mt-0.5">AnveshakHub Account Access Resolution Desk</p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-6">
              {!sent ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Official Email <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Locked Reason Reference</label>
                    <input
                      value={reasonTitle}
                      readOnly
                      className="w-full h-9 px-3 rounded-lg border border-slate-150 bg-slate-50 text-xs font-bold text-slate-600 outline-none cursor-default"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Appeal Message <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Explain the context of your lock state or request verification details update..."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-1">
                    <Dialog.Close asChild>
                      <button type="button" className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      disabled={sending}
                      className="h-9 px-5 bg-primary hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      {sending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…</> : <><Send className="h-3.5 w-3.5" /> Submit Appeal</>}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-100 mb-4">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-secondary">Appeal Submitted</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    We have received your appeal. A compliance officer will audit your security flags and contact you at your official email address within 24 hours.
                  </p>
                  <Dialog.Close asChild>
                    <button className="mt-5 h-9 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">
                      Done
                    </button>
                  </Dialog.Close>
                </div>
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountStatusPage() {
  const [activeReason, setActiveReason] = useState<LockReason>("failed_logins");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const status = lockDetails[activeReason];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-32 right-0 w-[420px] h-[420px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-3 px-6 sm:px-10 flex items-center justify-between">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSupportModal(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <HelpCircle className="h-4 w-4" /> Help
          </button>
        </div>
      </header>

      {/* Page Layout */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl"
        >
          {/* Quick Reason Switcher (Simulating different backend status flags) */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {(["failed_logins", "temporary_suspension", "verification_pending", "disabled", "policy_violation"] as LockReason[]).map(key => (
              <button
                key={key}
                onClick={() => setActiveReason(key)}
                className={[
                  "px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all shadow-sm",
                  activeReason === key
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                ].join(" ")}
              >
                {lockDetails[key].title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* ─────────────── LEFT: Main Security Card ─────────────── */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              {/* Header Banner */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <UserX className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <span className={[
                      "inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider mb-1",
                      status.badgeColor
                    ].join(" ")}>
                      {status.statusBadge}
                    </span>
                    <h1 className="text-lg font-black text-secondary tracking-tight">
                      {status.title}
                    </h1>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {status.description}
                </p>
              </div>

              {/* Status information details */}
              <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Unlock Time</p>
                    <p className="text-xs font-extrabold text-secondary mt-1 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {status.estimatedUnlock ?? "Autounlock unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy Category</p>
                    <p className="text-xs font-extrabold text-secondary mt-1 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-slate-400" />
                      Compliance & Identity
                    </p>
                  </div>
                </div>
              </div>

              {/* Action plan / Recovery instructions */}
              <div className="px-8 py-7">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Recommended Recovery Instructions
                </p>
                <div className="space-y-3">
                  {status.instructions.map((inst, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-[10px] font-black text-slate-500">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {inst}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-3 flex-wrap">
                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="h-11 px-5 inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/30"
                  >
                    <MessageSquare className="h-4 w-4" /> Contact Security Desk
                  </button>
                  <Link
                    href="/auth/login"
                    className="h-11 px-5 inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <ArrowLeft className="h-4 w-4" /> Return to Login
                  </Link>
                </div>
              </div>
            </div>

            {/* ─────────────── RIGHT: Compliance / Support Panel ─────────────── */}
            <div className="lg:col-span-5 space-y-4">
              {/* Security info card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-xs font-extrabold text-secondary">Compliance Notice</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  AnveshakHub enforces strict data governance, organization verification guidelines and authentication throttling to safeguard proprietary IP and institutional data.
                </p>
                <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-xl flex gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-semibold text-red-800 leading-relaxed">
                    Multiple failed attempts with security lock status may trigger automated security logs forwarded to your Organization Administrator.
                  </p>
                </div>
              </div>

              {/* Support details */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-extrabold text-secondary">Enterprise Helpdesk</p>
                </div>
                <div className="space-y-3.5">
                  {[
                    { icon: Clock, label: "Business Hours", value: "Mon–Fri, 09:00–18:00 IST" },
                    { icon: Mail, label: "Compliance Email", value: "compliance@anveshakhub.com" },
                    { icon: Phone, label: "Security Hotline", value: "+91-080-4567-8999" }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] font-bold text-slate-700 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Base Link */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <FileText className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-750">Security Policy</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Access Control FAQ</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="h-8 px-3 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  View FAQ
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Appeal Support Modal */}
      <StatusSupportModal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        reasonTitle={status.title}
        reasonKey={status.reasonKey}
      />
    </div>
  );
}
