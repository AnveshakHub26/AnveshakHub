"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import BrandLogo from "@/components/brand-logo";
import {
  Building2,
  HelpCircle,
  RefreshCw,
  Download,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Info,
  PauseCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Bell,
  FileUp,
  Eye,
  ShieldCheck,
  BadgeCheck,
  Layers,
  Calendar,
  Hash,
  Mail,
  Hourglass,
  TrendingUp,
  FileText,
  Upload,
  Search,
  Lock,
  Users,
  Server,
  Zap,
  LogIn
} from "lucide-react";
import Footer from "@/components/footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type StageStatus = "completed" | "in_progress" | "pending" | "action_required" | "on_hold";
type BadgeVariant = "pending" | "in_progress" | "action_required" | "under_review" | "approved" | "rejected" | "on_hold";

interface TimelineStage {
  id: number;
  label: string;
  description: string;
  status: StageStatus;
  estimatedCompletion: string;
  lastUpdated?: string;
}

interface PendingAction {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  type: "upload" | "review" | "sign" | "clarify";
}

interface HistoryEvent {
  id: string;
  event: string;
  description: string;
  timestamp: string;
  status: StageStatus;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "action";
}

interface RegistrationRecord {
  orgName: string;
  orgType: string;
  registrationId: string;
  registrationDate: string;
  email: string;
  currentStage: string;
  currentStageId: number;
  overallProgress: number;
  status: BadgeVariant;
  verificationPriority: "standard" | "expedited";
  estimatedCompletion: string;
}

// ─── Mock Data (API-ready: replace with real API responses) ──────────────────
const mockRegistration: RegistrationRecord = {
  orgName: "Aether Technologies Pvt. Ltd.",
  orgType: "Private Limited",
  registrationId: "AH-7F3K9P2M",
  registrationDate: "16 Jul 2026, 14:32 IST",
  email: "ad*****@aethertech.in",
  currentStage: "Organization Verification",
  currentStageId: 4,
  overallProgress: 38,
  status: "in_progress",
  verificationPriority: "standard",
  estimatedCompletion: "19 Jul 2026"
};

const mockTimeline: TimelineStage[] = [
  { id: 1, label: "Registration Submitted", description: "Organization profile, credentials and all required information received by AnveshakHub.", status: "completed", estimatedCompletion: "Instant", lastUpdated: "16 Jul 2026, 14:32 IST" },
  { id: 2, label: "Email Verified", description: "Official organization email address confirmed and ownership verified.", status: "completed", estimatedCompletion: "Instant", lastUpdated: "16 Jul 2026, 14:38 IST" },
  { id: 3, label: "Initial Validation", description: "Automated checks completed — profile completeness, data format, and duplicate detection passed.", status: "completed", estimatedCompletion: "~15 min", lastUpdated: "16 Jul 2026, 14:52 IST" },
  { id: 4, label: "Organization Verification", description: "Compliance team is reviewing your organization credentials, registration numbers and publicly available records.", status: "in_progress", estimatedCompletion: "1–2 Business Days", lastUpdated: "16 Jul 2026, 15:10 IST" },
  { id: 5, label: "Document Verification", description: "Submitted documents will be reviewed and cross-referenced against regulatory and government records.", status: "pending", estimatedCompletion: "2–3 Business Days", lastUpdated: undefined },
  { id: 6, label: "Technical Review", description: "Platform compatibility and technical onboarding requirements are evaluated for your organization type.", status: "pending", estimatedCompletion: "1 Business Day", lastUpdated: undefined },
  { id: 7, label: "Compliance Review", description: "Final regulatory and compliance screening before approval decision is issued.", status: "pending", estimatedCompletion: "1–2 Business Days", lastUpdated: undefined },
  { id: 8, label: "Final Approval", description: "Approval decision communicated to your registered organization email address.", status: "pending", estimatedCompletion: "Within 5 Business Days", lastUpdated: undefined },
  { id: 9, label: "Dashboard Activation", description: "Industry Dashboard activated. Full platform access granted upon approval.", status: "pending", estimatedCompletion: "Immediately After Approval", lastUpdated: undefined }
];

const mockPendingActions: PendingAction[] = [
  {
    id: "pa-1",
    title: "Upload Certificate of Incorporation",
    description: "Please re-upload a clearer scan of your Certificate of Incorporation (CIN). The previously uploaded document was partially blurred.",
    dueDate: "18 Jul 2026",
    priority: "high",
    type: "upload"
  }
];

const mockHistory: HistoryEvent[] = [
  { id: "h4", event: "Organization Verification Started", description: "Compliance team has begun reviewing your organization credentials.", timestamp: "16 Jul 2026, 15:10 IST", status: "in_progress" },
  { id: "h3", event: "Initial Validation Passed", description: "Automated checks cleared — no duplicates or format issues detected.", timestamp: "16 Jul 2026, 14:52 IST", status: "completed" },
  { id: "h2", event: "Email Address Verified", description: "Ownership of the official organization email address confirmed.", timestamp: "16 Jul 2026, 14:38 IST", status: "completed" },
  { id: "h1", event: "Registration Submitted", description: "Organization profile and all required documents received by AnveshakHub.", timestamp: "16 Jul 2026, 14:32 IST", status: "completed" }
];

const mockNotifications: Notification[] = [
  { id: "n3", title: "Verification Started", message: "Your organization verification has officially started. No action is required at this time.", timestamp: "16 Jul 2026, 15:10 IST", read: false, type: "info" },
  { id: "n2", title: "Document Upload Required", message: "A clearer copy of your Certificate of Incorporation is required. Please re-upload at your earliest convenience.", timestamp: "16 Jul 2026, 15:05 IST", read: false, type: "action" },
  { id: "n1", title: "Registration Received", message: "Your registration has been successfully received and entered into our verification pipeline.", timestamp: "16 Jul 2026, 14:32 IST", read: true, type: "success" }
];

const mockFaqs = [
  { q: "How long does verification take?", a: "Standard verification takes 2–5 business days. Complex registrations or those requiring additional documents may take longer. You will receive email updates at each stage." },
  { q: "Can I update my registration information?", a: "Registered information cannot be edited after submission. If a critical correction is required, please contact our verification team directly with your Registration ID." },
  { q: "What if my documents are rejected?", a: "If a document fails review, you will receive a detailed notification explaining the reason and the required corrective action. You can re-upload the corrected document through this portal." },
  { q: "How do I contact the verification support team?", a: "Use the 'Contact Verification Team' button on this page. Include your Registration ID in all communications to ensure fast routing. Response time is typically within 1–2 business hours." },
  { q: "What happens after approval?", a: "Upon approval, you will receive your login credentials and onboarding instructions via your registered organization email. Your Industry Dashboard will be activated and you can log in immediately." }
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.26, delay: i * 0.06, ease: "easeOut" }
  })
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const badgeConfig: Record<BadgeVariant, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  pending:         { label: "Pending",         icon: Hourglass,     classes: "bg-slate-100 text-slate-600 border-slate-200" },
  in_progress:     { label: "In Progress",     icon: Loader2,       classes: "bg-blue-50 text-primary border-blue-200" },
  action_required: { label: "Action Required", icon: AlertTriangle, classes: "bg-amber-50 text-amber-700 border-amber-200" },
  under_review:    { label: "Under Review",    icon: Search,        classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  approved:        { label: "Approved",        icon: BadgeCheck,    classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected:        { label: "Rejected",        icon: XCircle,       classes: "bg-red-50 text-red-700 border-red-200" },
  on_hold:         { label: "On Hold",         icon: PauseCircle,   classes: "bg-orange-50 text-orange-700 border-orange-200" }
};

function StatusBadge({ variant, size = "sm" }: { variant: BadgeVariant; size?: "xs" | "sm" }) {
  const cfg = badgeConfig[variant];
  const Icon = cfg.icon;
  const isSpinning = variant === "in_progress";
  return (
    <span className={[
      "inline-flex items-center gap-1 rounded-full border font-bold",
      size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
      cfg.classes
    ].join(" ")}>
      <Icon className={["h-2.5 w-2.5", isSpinning ? "animate-spin" : ""].join(" ")} />
      {cfg.label}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high:   "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low:    "bg-slate-100 text-slate-500 border-slate-200"
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${map[priority]}`}>
      {priority}
    </span>
  );
}

// ─── Timeline Stage ───────────────────────────────────────────────────────────
function TimelineStage({ stage, custom }: { stage: TimelineStage; custom: number }) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate="visible" className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={[
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all",
          stage.status === "completed"       ? "bg-emerald-600 border-emerald-600 text-white" :
          stage.status === "in_progress"     ? "bg-primary border-primary text-white ring-4 ring-primary/15" :
          stage.status === "action_required" ? "bg-amber-500 border-amber-500 text-white ring-4 ring-amber-500/20" :
          stage.status === "on_hold"         ? "bg-orange-400 border-orange-400 text-white" :
                                               "bg-white border-slate-200 text-slate-400"
        ].join(" ")}>
          {stage.status === "completed"       ? <CheckCircle2 className="h-4 w-4" /> :
           stage.status === "in_progress"     ? <Loader2 className="h-4 w-4 animate-spin" /> :
           stage.status === "action_required" ? <AlertTriangle className="h-4 w-4" /> :
           stage.status === "on_hold"         ? <PauseCircle className="h-4 w-4" /> :
                                               <span className="text-[11px] font-black">{stage.id}</span>}
        </div>
        {stage.id < 9 && (
          <div className={[
            "w-0.5 rounded-full mt-1",
            stage.status === "completed" ? "bg-emerald-200" :
            stage.status === "in_progress" ? "bg-blue-200" : "bg-slate-150"
          ].join(" ")} style={{ minHeight: 28 }} />
        )}
      </div>

      <div className="pb-6 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={[
            "text-xs font-extrabold",
            stage.status === "completed"       ? "text-emerald-800" :
            stage.status === "in_progress"     ? "text-primary" :
            stage.status === "action_required" ? "text-amber-700" :
                                                 "text-slate-500"
          ].join(" ")}>{stage.label}</span>
          {stage.status === "completed"       && <StatusBadge variant="approved" size="xs" />}
          {stage.status === "in_progress"     && <StatusBadge variant="in_progress" size="xs" />}
          {stage.status === "action_required" && <StatusBadge variant="action_required" size="xs" />}
          {stage.status === "on_hold"         && <StatusBadge variant="on_hold" size="xs" />}
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-1.5">{stage.description}</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium">{stage.estimatedCompletion}</span>
          </div>
          {stage.lastUpdated && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-medium">Updated: {stage.lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── History Event ────────────────────────────────────────────────────────────
function HistoryEventRow({ event, custom }: { event: HistoryEvent; custom: number }) {
  const dotColor =
    event.status === "completed"   ? "bg-emerald-500" :
    event.status === "in_progress" ? "bg-primary" :
    event.status === "action_required" ? "bg-amber-500" : "bg-slate-300";

  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate="visible"
      className="flex gap-3 py-3 border-b border-slate-100 last:border-0"
    >
      <div className="flex flex-col items-center pt-1.5">
        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-slate-700">{event.event}</p>
          <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap shrink-0">{event.timestamp}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{event.description}</p>
      </div>
    </motion.div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────
function NotificationCard({
  notif,
  onRead
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) {
  const typeConfig = {
    info:    { icon: Info,          bg: "bg-blue-50",   border: "border-blue-100",   dot: "bg-primary" },
    success: { icon: CheckCircle2,  bg: "bg-emerald-50",border: "border-emerald-100",dot: "bg-emerald-500" },
    warning: { icon: AlertTriangle, bg: "bg-amber-50",  border: "border-amber-100",  dot: "bg-amber-500" },
    action:  { icon: AlertTriangle, bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500" }
  };
  const cfg = typeConfig[notif.type];
  const Icon = cfg.icon;

  return (
    <div
      onClick={() => onRead(notif.id)}
      className={[
        "flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:shadow-sm",
        cfg.bg, cfg.border,
        !notif.read ? "ring-1 ring-offset-0" : "opacity-75"
      ].join(" ")}
    >
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-white border ${cfg.border}`}>
        <Icon className="h-3.5 w-3.5 text-current" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold text-slate-800 leading-snug">{notif.title}</p>
          {!notif.read && <span className={`h-2 w-2 rounded-full shrink-0 mt-1 ${cfg.dot}`} />}
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
        <p className="text-[9px] text-slate-400 mt-1 font-medium">{notif.timestamp}</p>
      </div>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible"
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors group"
        aria-expanded={open}
      >
        <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors pr-4">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
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

// ─── Support Modal ────────────────────────────────────────────────────────────
function SupportModal({ open, onClose, regId }: { open: boolean; onClose: () => void; regId: string }) {
  const [form, setForm] = useState({ name: "", organization: "", registrationId: regId, subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // API Integration Point: POST /api/verification/support-request
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  useEffect(() => {
    if (!open) setTimeout(() => setSent(false), 300);
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg focus:outline-none px-4"
          aria-describedby="support-desc"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-extrabold text-secondary">Contact Verification Team</Dialog.Title>
                  <p id="support-desc" className="text-[10px] text-slate-400 mt-0.5">Enterprise Verification Support Desk</p>
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
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organization <span className="text-red-500">*</span></label>
                      <input required value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Organization name"
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registration ID</label>
                    <input value={form.registrationId} readOnly
                      className="w-full h-9 px-3 rounded-lg border border-slate-100 bg-slate-50 text-xs font-mono font-bold text-slate-600 outline-none cursor-default" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject <span className="text-red-500">*</span></label>
                    <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all bg-white">
                      <option value="">Select a subject…</option>
                      <option>Verification Status Enquiry</option>
                      <option>Document Re-upload Request</option>
                      <option>Registration Information Correction</option>
                      <option>Verification Delay Escalation</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your query in detail. Include any relevant information…"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-medium placeholder-slate-400 outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 transition-all resize-none" />
                  </div>
                  <div className="flex gap-3 justify-end pt-1">
                    <Dialog.Close asChild>
                      <button type="button" className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                    </Dialog.Close>
                    <button type="submit" disabled={sending}
                      className="h-9 px-5 bg-primary hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                      {sending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</> : <><Send className="h-3.5 w-3.5" /> Send Message</>}
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
                    Our verification team has received your message and will respond within 1–2 business hours.
                  </p>
                  <Dialog.Close asChild>
                    <button className="mt-5 h-9 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">Done</button>
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
export default function VerificationStatusPage() {
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [uploadingAction, setUploadingAction] = useState<string | null>(null);
  const [uploadedActions, setUploadedActions] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Refresh status ──────────────────────────────────────────────────────────
  // API Integration Point: GET /api/verification/status?id=regId
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshed(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} IST`);
    }, 1500);
  }, [isRefreshing]);

  // ── Mark notification read ──────────────────────────────────────────────────
  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // ── Mark all read ───────────────────────────────────────────────────────────
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // ── Download summary ────────────────────────────────────────────────────────
  // API Integration Point: GET /api/verification/summary?id=regId
  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const content = [
        "=".repeat(60),
        "  ANVESHAKHUB ENTERPRISE PLATFORM",
        "  Verification Status Report",
        "=".repeat(60),
        "",
        `Registration ID     : ${mockRegistration.registrationId}`,
        `Organization        : ${mockRegistration.orgName}`,
        `Organization Type   : ${mockRegistration.orgType}`,
        `Registered Email    : ${mockRegistration.email}`,
        `Registration Date   : ${mockRegistration.registrationDate}`,
        `Current Stage       : ${mockRegistration.currentStage}`,
        `Overall Progress    : ${mockRegistration.overallProgress}%`,
        `Estimated Completion: ${mockRegistration.estimatedCompletion}`,
        "",
        "VERIFICATION STAGES",
        "-".repeat(40),
        ...mockTimeline.map(s => `${s.status === "completed" ? "✓" : s.status === "in_progress" ? "▶" : "○"}  Stage ${s.id}: ${s.label} [${s.status.replace("_", " ").toUpperCase()}]`),
        "",
        "SUPPORT",
        "-".repeat(40),
        "Email  : support@anveshakhub.com",
        "Phone  : +91-080-4567-8900",
        "Hours  : Mon–Fri, 09:00–18:00 IST",
        "",
        "=".repeat(60),
        "Report generated at: " + new Date().toLocaleString("en-IN"),
        "=".repeat(60)
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AnveshakHub_VerificationStatus_${mockRegistration.registrationId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    }, 1200);
  };

  // ── Upload action (simulated) ───────────────────────────────────────────────
  const handleUpload = (actionId: string) => {
    setUploadingAction(actionId);
    // API Integration Point: POST /api/verification/upload?actionId=...
    setTimeout(() => {
      setUploadingAction(null);
      setUploadedActions(prev => new Set([...prev, actionId]));
    }, 1800);
  };

  const reg = mockRegistration;
  const pendingActionsToShow = mockPendingActions.filter(a => !uploadedActions.has(a.id));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_30%,#000_60%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" />
            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Hash className="h-3 w-3 text-slate-500" />
              <span className="text-[10px] font-black text-slate-600 font-mono tracking-wider">{reg.registrationId}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications bell */}
            <button
              onClick={markAllRead}
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              aria-label={`${unreadCount} unread notifications`}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSupportModal(true)}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
            <Link
              href="/auth/login"
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* ── Page Title ── */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-secondary tracking-tight">Registration Verification Status</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Track the progress of your organization verification with AnveshakHub.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-slate-400 font-medium">Last updated: {lastRefreshed}</span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm disabled:opacity-60"
                >
                  <RefreshCw className={["h-3.5 w-3.5", isRefreshing ? "animate-spin" : ""].join(" ")} />
                  {isRefreshing ? "Refreshing…" : "Refresh Status"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Two-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="lg:col-span-8 space-y-6">

              {/* ── Overall Progress Banner ── */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-xs font-extrabold text-secondary">Overall Verification Progress</span>
                      <StatusBadge variant={reg.status} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${reg.overallProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-black text-primary w-10 text-right">{reg.overallProgress}%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Current Stage: <span className="font-bold text-slate-700">{reg.currentStage}</span>
                      {" · "}Est. Completion: <span className="font-bold text-slate-700">{reg.estimatedCompletion}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 shrink-0">
                    <span className="text-2xl font-black text-primary">{reg.currentStageId}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">of 9 Stages</span>
                  </div>
                </div>
              </motion.div>

              {/* ── Pending Actions ── */}
              <AnimatePresence>
                {pendingActionsToShow.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border-2 border-amber-300 rounded-2xl shadow-sm overflow-hidden">
                      <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-amber-700" />
                        </div>
                        <div>
                          <h2 className="text-sm font-extrabold text-amber-900">Action Required</h2>
                          <p className="text-[10px] text-amber-700 mt-0.5">
                            {pendingActionsToShow.length} pending action{pendingActionsToShow.length !== 1 ? "s" : ""} — verification is paused until completed
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-amber-100">
                        {pendingActionsToShow.map((action) => (
                          <div key={action.id} className="px-6 py-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                                  {action.type === "upload" && <Upload className="h-3.5 w-3.5 text-amber-700" />}
                                  {action.type === "review" && <Eye className="h-3.5 w-3.5 text-amber-700" />}
                                  {action.type === "sign"   && <FileText className="h-3.5 w-3.5 text-amber-700" />}
                                  {action.type === "clarify"&& <Info className="h-3.5 w-3.5 text-amber-700" />}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <p className="text-xs font-extrabold text-secondary">{action.title}</p>
                                    <PriorityBadge priority={action.priority} />
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-relaxed">{action.description}</p>
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Calendar className="h-3 w-3 text-amber-600" />
                                    <span className="text-[10px] font-bold text-amber-700">Due by {action.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                              {action.type === "upload" && (
                                <button
                                  onClick={() => handleUpload(action.id)}
                                  disabled={uploadingAction === action.id}
                                  className="h-9 px-4 shrink-0 inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                  {uploadingAction === action.id
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
                                    : <><FileUp className="h-3.5 w-3.5" /> Re-upload Document</>}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Current Status ── */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
              >
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-secondary">Current Verification Status</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">Live status — updated by the compliance team</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      <p className="text-xs font-extrabold text-primary">{reg.currentStage}</p>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Your registration is currently under organization verification. Our compliance team is reviewing
                      your credentials against MCA, state registrar and regulatory records.
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-3 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      No action is required from your side at this time.
                    </p>
                  </div>
                  <div className="sm:w-48 space-y-3">
                    {[
                      { label: "Review Team", value: "Compliance", icon: Users },
                      { label: "Priority", value: reg.verificationPriority === "expedited" ? "Expedited" : "Standard", icon: Zap },
                      { label: "Est. Complete", value: reg.estimatedCompletion, icon: Clock }
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-2.5 py-2 border-b border-slate-100 last:border-0">
                        <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="h-3 w-3 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="text-[11px] font-bold text-slate-700">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── Verification Timeline ── */}
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Layers className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-secondary">Verification Pipeline</h2>
                      <p className="text-[10px] text-slate-400 mt-0.5">9-stage enterprise verification lifecycle</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Est. 5 business days total
                  </div>
                </div>
                <div className="px-7 py-6">
                  {mockTimeline.map((stage, i) => (
                    <TimelineStage key={stage.id} stage={stage} custom={i} />
                  ))}
                </div>
              </motion.div>

              {/* ── Verification History ── */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-secondary">Verification Activity Log</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">Chronological record of all completed actions</p>
                  </div>
                </div>
                <div className="px-6 py-2">
                  {mockHistory.map((event, i) => (
                    <HistoryEventRow key={event.id} event={event} custom={i} />
                  ))}
                </div>
              </motion.div>

              {/* ── FAQ ── */}
              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-secondary">Frequently Asked Questions</h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">Common questions about the verification pipeline</p>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  {mockFaqs.map((faq, i) => <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />)}
                </div>
              </motion.div>

              {/* ── Action Buttons ── */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
                className="flex flex-wrap gap-3"
              >
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="h-11 px-5 inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                >
                  {downloading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
                    : downloadDone ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Downloaded</>
                    : <><Download className="h-4 w-4" /> Download Status Report</>}
                </button>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="h-11 px-5 inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MessageSquare className="h-4 w-4" /> Contact Verification Team
                </button>
                <Link
                  href="/auth/login"
                  className="h-11 px-5 inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-secondary rounded-xl text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <LogIn className="h-4 w-4" /> Return to Login
                </Link>
              </motion.div>
            </div>

            {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
            <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 sticky top-20">

              {/* Registration Summary */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <p className="text-xs font-extrabold text-secondary">Registration Summary</p>
                  </div>
                  <StatusBadge variant={reg.status} />
                </div>
                <div className="p-5 space-y-2.5">
                  {[
                    { label: "Organization",   value: reg.orgName,           icon: Building2 },
                    { label: "Type",           value: reg.orgType,           icon: Layers },
                    { label: "Reg ID",         value: reg.registrationId,    icon: Hash },
                    { label: "Submitted",      value: reg.registrationDate,  icon: Calendar },
                    { label: "Email",          value: reg.email,             icon: Mail },
                    { label: "Priority",       value: reg.verificationPriority === "expedited" ? "Expedited" : "Standard", icon: Zap }
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
                      <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3 w-3 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] font-bold text-slate-700 break-words leading-snug mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.18 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <p className="text-xs font-extrabold text-secondary">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  {notifications.map(n => (
                    <NotificationCard key={n.id} notif={n} onRead={markRead} />
                  ))}
                </div>
              </motion.div>

              {/* Support Info */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.24 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <p className="text-xs font-extrabold text-secondary">Verification Support</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Clock,  label: "Business Hours",  value: "Mon–Fri, 09:00–18:00 IST" },
                    { icon: Mail,   label: "Support Email",   value: "support@anveshakhub.com" },
                    { icon: Server, label: "Response Time",   value: "1–2 Business Hours" }
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
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="mt-4 w-full h-9 inline-flex items-center justify-center gap-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Contact Verification Team
                </button>
              </motion.div>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-[11px] font-bold text-secondary">Security Reminder</p>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  AnveshakHub will never request your password or OTP via email or phone. 
                  All official communications come from <span className="font-bold text-slate-600">@anveshakhub.com</span> addresses only.
                </p>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {/* Support Modal */}
      <SupportModal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        regId={reg.registrationId}
      />
    </div>
  );
}
