"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2,
  HelpCircle,
  CheckCircle2,
  Clock,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Send,
  Phone,
  Globe,
  BookOpen,
  Bell,
  MessageSquare,
  AlertCircle,
  Loader2,
  Hourglass,
  ClipboardCheck,
  Search,
  Unlock,
  FileSearch
} from "lucide-react";
import Footer from "@/components/footer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegistrationSummary {
  orgName?: string;
  email?: string;
  orgType?: string;
  state?: string;
  industryDomain?: string;
  submittedAt?: string;
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: i * 0.07, ease: "easeOut" }
  })
};

const panelVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut", delay: 0.15 } }
};

// ─── Timeline Data ────────────────────────────────────────────────────────────
const timelineStages = [
  {
    id: 1,
    label: "Registration Submitted",
    description: "Your organization profile and all required information have been received.",
    duration: "Instant",
    status: "completed" as const,
    icon: ClipboardCheck
  },
  {
    id: 2,
    label: "Email Verified",
    description: "Your official organization email address has been verified and confirmed.",
    duration: "Completed",
    status: "completed" as const,
    icon: BadgeCheck
  },
  {
    id: 3,
    label: "Organization Verification",
    description: "Our compliance team reviews your organization credentials and profile information.",
    duration: "1–2 Business Days",
    status: "active" as const,
    icon: FileSearch
  },
  {
    id: 4,
    label: "Document Review",
    description: "Submitted documents are reviewed against MCA, state, and regulatory records.",
    duration: "2–3 Business Days",
    status: "pending" as const,
    icon: Search
  },
  {
    id: 5,
    label: "Approval Decision",
    description: "Final approval or additional information request is communicated to your registered email.",
    duration: "Within 5 Business Days",
    status: "pending" as const,
    icon: ShieldCheck
  },
  {
    id: 6,
    label: "Dashboard Access",
    description: "Upon approval, your Industry Dashboard is activated and full platform access is granted.",
    duration: "Immediately After Approval",
    status: "pending" as const,
    icon: Unlock
  }
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How long does verification take?",
    a: "Organization verification typically takes 2–3 business days. Complex registrations with multiple entities may take up to 5 business days. You will be notified by email at each stage of the process."
  },
  {
    q: "Can I edit my registration after submission?",
    a: "Registered information cannot be edited once submitted for verification. If critical information needs correction, please contact our support team at support@anveshakhub.com with your organization name and registered email."
  },
  {
    q: "What happens if verification fails?",
    a: "If verification is unsuccessful, our compliance team will send a detailed email outlining the reason and the information required. You will have an opportunity to resubmit with corrected information."
  },
  {
    q: "How will I know when I am approved?",
    a: "You will receive an official approval notification to your registered organization email address. The email will contain your login credentials and instructions to access your Industry Dashboard."
  },
  {
    q: "Can I upload additional documents later?",
    a: "Yes. During the document review stage, you may receive a request from our team for supplementary documents. You can upload these through the secure document portal linked in the email notification."
  }
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "completed" | "active" | "pending" }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-2.5 w-2.5" /> Completed
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
      <Hourglass className="h-2.5 w-2.5" /> Pending
    </span>
  );
}

// ─── Timeline Stage ───────────────────────────────────────────────────────────
function TimelineStage({
  stage,
  custom
}: {
  stage: typeof timelineStages[number];
  custom: number;
}) {
  const Icon = stage.icon;
  return (
    <motion.div
      custom={custom}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex gap-4"
    >
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className={[
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all",
          stage.status === "completed"
            ? "bg-emerald-600 border-emerald-600 text-white"
            : stage.status === "active"
            ? "bg-primary border-primary text-white ring-4 ring-primary/15"
            : "bg-white border-slate-200 text-slate-400"
        ].join(" ")}>
          {stage.status === "completed"
            ? <CheckCircle2 className="h-4.5 w-4.5" />
            : <Icon className="h-4 w-4" />
          }
        </div>
        {stage.id < 6 && (
          <div className={[
            "w-0.5 flex-1 mt-1 rounded-full",
            stage.status === "completed" ? "bg-emerald-200" : "bg-slate-150"
          ].join(" ")} style={{ minHeight: 32 }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-7 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={[
            "text-sm font-extrabold",
            stage.status === "completed" ? "text-emerald-800" :
            stage.status === "active"    ? "text-primary" :
                                           "text-slate-500"
          ].join(" ")}>{stage.label}</span>
          <StatusBadge status={stage.status} />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">{stage.description}</p>
        <div className="mt-1.5 flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400">{stage.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors group"
        aria-expanded={open}
      >
        <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors pr-4">{q}</span>
        <div className="shrink-0">
          {open ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-600 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Enterprise Success Illustration ─────────────────────────────────────────
function SuccessIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-xs mx-auto" aria-hidden="true">
      {/* Background glows */}
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="card1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="card2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" />
          <stop offset="100%" stopColor="#DCFCE7" />
        </linearGradient>
      </defs>

      {/* Background circles */}
      <circle cx="160" cy="100" r="90" fill="url(#glow1)" />
      <circle cx="200" cy="80" r="60" fill="url(#glow2)" />

      {/* Central shield */}
      <rect x="120" y="30" width="80" height="100" rx="12" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
      <rect x="120" y="30" width="80" height="28" rx="12" fill="url(#card1)" />
      <rect x="120" y="46" width="80" height="12" rx="0" fill="url(#card1)" />
      {/* Shield icon in card */}
      <path d="M157 44 L163 44 L163 52 C163 56 160 58 160 58 C160 58 157 56 157 52 Z" fill="#2563EB" />
      {/* Lines in card body */}
      <rect x="128" y="68" width="48" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="128" y="76" width="36" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="128" y="84" width="42" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="128" y="92" width="28" height="3" rx="1.5" fill="#E2E8F0" />
      {/* Verified badge on card */}
      <circle cx="188" cy="62" r="10" fill="#16A34A" />
      <path d="M183 62 L186.5 65.5 L193 59" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Left floating card: email */}
      <rect x="18" y="65" width="82" height="50" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="18" y="65" width="82" height="18" rx="8" fill="url(#card1)" />
      <rect x="18" y="73" width="82" height="10" rx="0" fill="url(#card1)" />
      <circle cx="30" cy="74" r="5" fill="#BFDBFE" />
      <rect x="38" y="71" width="32" height="3" rx="1.5" fill="#93C5FD" />
      <rect x="26" y="90" width="56" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="97" width="40" height="3" rx="1.5" fill="#E2E8F0" />
      {/* Check on email card */}
      <circle cx="88" cy="86" r="7" fill="#22C55E" />
      <path d="M84.5 86 L87 88.5 L91.5 83.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Right floating card: organization */}
      <rect x="222" y="55" width="80" height="55" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="222" y="55" width="80" height="18" rx="8" fill="#F0FDF4" />
      <rect x="222" y="63" width="80" height="10" rx="0" fill="#F0FDF4" />
      <rect x="230" y="80" width="48" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="230" y="87" width="36" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="230" y="94" width="42" height="3" rx="1.5" fill="#E2E8F0" />
      {/* Org icon */}
      <rect x="230" y="59" width="10" height="10" rx="2" fill="#16A34A" />
      <rect x="242" y="61" width="28" height="2.5" rx="1.25" fill="#86EFAC" />
      <rect x="242" y="66" width="20" height="2.5" rx="1.25" fill="#86EFAC" />

      {/* Connecting dotted lines */}
      <line x1="100" y1="90" x2="120" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="200" y1="90" x2="222" y2="82" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

      {/* Bottom status bar */}
      <rect x="80" y="148" width="160" height="36" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <circle cx="97" cy="166" r="8" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
      <path d="M93.5 166 L96 168.5 L100.5 163.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="112" y="160" width="60" height="3" rx="1.5" fill="#1E293B" />
      <rect x="112" y="167" width="45" height="2.5" rx="1.25" fill="#CBD5E1" />
      <rect x="197" y="159" width="30" height="14" rx="5" fill="#2563EB" />
      <rect x="200" y="163" width="24" height="6" rx="3" fill="#2563EB" />
      <rect x="201" y="164" width="22" height="4" rx="2" fill="white" opacity="0.25" />
    </svg>
  );
}

// ─── Support Modal ────────────────────────────────────────────────────────────
function SupportModal({
  open,
  onClose,
  defaultOrg
}: {
  open: boolean;
  onClose: () => void;
  defaultOrg?: string;
}) {
  const [form, setForm] = useState({
    name: "", email: "", organization: defaultOrg ?? "", subject: "", message: ""
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // API Integration Point: POST /api/support/contact
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  useEffect(() => {
    if (!open) { setTimeout(() => setSent(false), 300); }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg focus:outline-none px-4"
          aria-describedby="support-modal-desc"
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
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-extrabold text-secondary">Contact Support</Dialog.Title>
                  <p id="support-modal-desc" className="text-[10px] text-slate-400 mt-0.5">Enterprise Verification Support Desk</p>
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
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
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
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organization <span className="text-red-500">*</span></label>
                    <input
                      required
                      value={form.organization}
                      onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                      placeholder="Organization name"
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all bg-white"
                    >
                      <option value="">Select a subject…</option>
                      <option>Verification Status Enquiry</option>
                      <option>Document Submission Issue</option>
                      <option>Registration Information Correction</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your issue or question in detail…"
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
                      {sending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</> : <><Send className="h-3.5 w-3.5" /> Submit Message</>}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-50 border-2 border-emerald-100 mb-4">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-extrabold text-secondary">Message Sent</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    Our support team has received your message and will respond within 1–2 business hours.
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
export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<RegistrationSummary | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Try to read any saved context (may have been cleared after verification)
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    const submittedAt = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZoneName: "short"
    });

    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSummary({ ...data, submittedAt });
      } catch (_) {
        setSummary({ submittedAt });
      }
    } else {
      setSummary({ submittedAt });
    }
  }, []);

  // Download registration summary
  // API Integration Point: GET /api/registration/summary?token=...
  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const content = [
        "=".repeat(60),
        "  ANVESHAKHUB ENTERPRISE PLATFORM",
        "  Registration Submission Summary",
        "=".repeat(60),
        "",
        `Organization Name    : ${summary?.orgName ?? "N/A"}`,
        `Official Email       : ${summary?.email ?? "N/A"}`,
        `Organization Type    : ${summary?.orgType ?? "N/A"}`,
        `Industry Domain      : ${summary?.industryDomain ?? "N/A"}`,
        `Registered State     : ${summary?.state ?? "N/A"}`,
        `Submission Date/Time : ${summary?.submittedAt ?? "N/A"}`,
        "",
        "REGISTRATION STATUS",
        "-".repeat(40),
        "✓  Registration Submitted",
        "✓  Email Address Verified",
        "○  Organization Verification  [Pending]",
        "○  Document Review            [Pending]",
        "○  Approval Decision          [Pending]",
        "○  Dashboard Access           [Pending]",
        "",
        "WHAT HAPPENS NEXT",
        "-".repeat(40),
        "1. Our compliance team will review your profile within 2–3 business days.",
        "2. You will receive email notifications at each stage.",
        "3. Upon approval, your Industry Dashboard will be activated.",
        "",
        "SUPPORT",
        "-".repeat(40),
        "Email  : support@anveshakhub.com",
        "Phone  : +91-080-4567-8900",
        "Hours  : Mon–Fri, 09:00–18:00 IST",
        "",
        "=".repeat(60),
        "This is a system-generated document.",
        "Reference ID: AH-" + Date.now().toString(36).toUpperCase(),
        "=".repeat(60)
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AnveshakHub_Registration_Summary_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_60%,transparent_100%)] opacity-25 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm text-secondary tracking-tight">AnveshakHub</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSupportModal(true)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <HelpCircle className="h-4 w-4" /> Need Help?
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* ── Step Breadcrumb ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm flex-wrap justify-center">
              {[
                { label: "Organization Info", done: true },
                { label: "Review & Confirm", done: true },
                { label: "Email Verified", done: true },
                { label: "Registration Submitted", done: false, active: true }
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-1.5">
                  <span className={[
                    "text-[10px] font-bold whitespace-nowrap",
                    step.active ? "text-primary" :
                    step.done   ? "text-emerald-600" :
                    "text-slate-400"
                  ].join(" ")}>
                    {step.done
                      ? <span className="inline-flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3 inline" /> {step.label}</span>
                      : step.label
                    }
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-200">›</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Two-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="lg:col-span-8 space-y-6">

              {/* ── Hero Success Card ── */}
              <motion.div
                custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Top banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base font-black text-white tracking-tight">Registration Submitted Successfully</h1>
                    <p className="text-[11px] text-emerald-100 mt-0.5 font-medium">
                      {summary?.submittedAt ? `Submitted on ${summary.submittedAt}` : "Submission complete"}
                    </p>
                  </div>
                  <div className="ml-auto hidden sm:block">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 px-3 py-1.5 rounded-full text-[10px] font-bold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Awaiting Verification
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Illustration */}
                    <div className="md:w-64 shrink-0">
                      <SuccessIllustration />
                    </div>

                    {/* Right copy */}
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-secondary tracking-tight mb-2">
                        {summary?.orgName ? `Thank you, ${summary.orgName}` : "Thank you for registering."}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed mb-5">
                        Your organization has been successfully registered with AnveshakHub and your request
                        has been forwarded to our compliance verification team. We appreciate your interest
                        in collaborating with the AnveshakHub enterprise ecosystem.
                      </p>

                      {/* Checklist */}
                      <div className="space-y-2">
                        {[
                          "Registration form completed and submitted",
                          "Official email address verified",
                          "Organization profile forwarded to compliance team",
                          "Verification pipeline entry confirmed"
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-2.5">
                            <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Verification Timeline ── */}
              <motion.div
                custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-secondary">Verification Timeline</h2>
                      <p className="text-[10px] text-slate-400 mt-0.5">Your registration journey — stage by stage</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> Est. 5 business days
                  </div>
                </div>
                <div className="px-7 py-6">
                  {timelineStages.map((stage, i) => (
                    <TimelineStage key={stage.id} stage={stage} custom={i} />
                  ))}
                </div>
              </motion.div>

              {/* ── What Happens Next ── */}
              <motion.div
                custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7"
              >
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-secondary">What Happens Next?</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">No action required unless contacted by our team</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: FileSearch,
                      title: "Profile Review",
                      desc: "Our verification team will review your organization details, credentials, and submitted documents."
                    },
                    {
                      icon: Mail,
                      title: "Email Notifications",
                      desc: "If additional information is required, you will receive an email notification with specific instructions."
                    },
                    {
                      icon: BadgeCheck,
                      title: "Approval Communication",
                      desc: "Once approved, you will receive access credentials for your Industry Dashboard via your registered email."
                    },
                    {
                      icon: ShieldCheck,
                      title: "No Action Required",
                      desc: "You do not need to take any action unless specifically contacted by our compliance or support team."
                    }
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-secondary">{title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ── Estimated Timelines + Notifications ── */}
              <div className="grid sm:grid-cols-2 gap-5">
                <motion.div
                  custom={3} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Clock className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-extrabold text-secondary">Estimated Timelines</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Registration Review", time: "1–2 Business Days" },
                      { label: "Organization Verification", time: "2–3 Business Days" },
                      { label: "Final Approval", time: "Within 5 Business Days" }
                    ].map(({ label, time }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-[11px] text-slate-600 font-medium">{label}</span>
                        <span className="text-[10px] font-bold text-primary bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[9px] text-slate-400 leading-relaxed">
                    * Timelines may vary based on verification complexity and document availability.
                  </p>
                </motion.div>

                <motion.div
                  custom={4} variants={fadeUp} initial="hidden" animate="visible"
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <Bell className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-extrabold text-secondary">Notification Channels</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Mail, label: "Email Notifications", status: "Active", color: "emerald" },
                      { icon: Globe, label: "Browser Notifications", status: "Coming Soon", color: "amber" },
                      { icon: Phone, label: "SMS Alerts", status: "Future", color: "slate" },
                      { icon: MessageSquare, label: "WhatsApp Updates", status: "Future", color: "slate" }
                    ].map(({ icon: Icon, label, status, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-[11px] text-slate-600 font-medium">{label}</span>
                        </div>
                        <span className={[
                          "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                          color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          color === "amber"   ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-100 text-slate-500 border-slate-200"
                        ].join(" ")}>{status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ── Frequently Asked Questions ── */}
              <motion.div
                custom={5} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-secondary">Frequently Asked Questions</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">Common questions about the verification process</p>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  {faqs.map((faq, i) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
                  ))}
                </div>
              </motion.div>

              {/* ── Success Message ── */}
              <motion.div
                custom={6} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-gradient-to-br from-primary/5 via-blue-50/50 to-slate-50 border border-blue-100 rounded-2xl p-7 text-center"
              >
                <BadgeCheck className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="text-sm font-extrabold text-secondary tracking-tight mb-2">
                  Thank you for choosing AnveshakHub
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                  We look forward to collaborating with your organization and helping transform your ideas
                  into impactful solutions within the AnveshakHub enterprise ecosystem.
                </p>
              </motion.div>

              {/* ── Action Buttons ── */}
              <motion.div
                custom={7} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-wrap gap-3 justify-center sm:justify-start"
              >
                <Link
                  href="/auth/verification-status"
                  className="h-11 px-6 inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/30"
                >
                  <Search className="h-4 w-4" /> Track Verification Status
                </Link>
                <Link
                  href="/auth/login"
                  className="h-11 px-6 inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ArrowRight className="h-4 w-4" /> Go to Login
                </Link>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="h-11 px-6 inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                >
                  {downloading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                  ) : downloadDone ? (
                    <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Downloaded</>
                  ) : (
                    <><Download className="h-4 w-4" /> Download Summary</>
                  )}
                </button>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="h-11 px-6 inline-flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MessageSquare className="h-4 w-4" /> Contact Support
                </button>
              </motion.div>
            </div>

            {/* ═══════════════ RIGHT PANEL (Desktop) ═══════════════ */}
            <motion.aside
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex lg:col-span-4 flex-col gap-4 sticky top-20"
            >
              {/* Registration Status Widget */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Registration Status
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "Application ID", value: `AH-${Date.now().toString(36).toUpperCase().slice(-8)}` },
                    { label: "Organization", value: summary?.orgName ?? "—" },
                    { label: "Email", value: summary?.email ?? "—" },
                    { label: "Type", value: summary?.orgType ?? "—" },
                    { label: "Current Stage", value: "Organization Verification" }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start py-1.5 border-b border-slate-50 last:border-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider w-24 shrink-0">{label}</span>
                      <span className="text-[11px] font-bold text-slate-700 text-right break-all">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <Hourglass className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-700">Awaiting compliance review</p>
                </div>
              </div>

              {/* Support Information */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs font-extrabold text-secondary">Verification Support</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Clock, label: "Business Hours", value: "Mon–Fri, 09:00–18:00 IST" },
                    { icon: Mail, label: "Support Email", value: "support@anveshakhub.com" },
                    { icon: Phone, label: "Support Line", value: "+91-080-4567-8900" }
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3 w-3 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 hover:underline transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Visit Knowledge Base
                  </a>
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <p className="text-xs font-bold text-secondary">Security Notice</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  AnveshakHub will never ask for your password, OTP, or sensitive financial information via email or phone.
                  All communications will originate from <span className="font-bold text-slate-600">@anveshakhub.com</span> domains only.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact Support Modal */}
      <SupportModal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        defaultOrg={summary?.orgName}
      />
    </div>
  );
}
