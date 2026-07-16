"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2,
  ArrowLeft,
  HelpCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Lock,
  Clock,
  X,
  Check,
  Pencil,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  BadgeCheck,
  FileSearch,
  Layers,
  Server,
  Info
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface OnboardingDraft {
  orgName?: string;
  email?: string;
  phone?: string;
  orgType?: string;
  [key: string]: string | undefined;
}

type VerificationError =
  | "incorrect"
  | "expired"
  | "limit_exceeded"
  | "network"
  | "server"
  | "duplicate"
  | null;

type ScreenState = "idle" | "verifying" | "success" | "error";

const MAX_RESEND_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 60;
const AUTO_REDIRECT_SECONDS = 3;

// ─── Animation Variants ──────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

const panelVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut", delay: 0.1 } }
};

const shakeVariants: Variants = {
  shake: {
    x: [-12, 12, -10, 10, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 }
  }
};

const successRingVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: "spring", stiffness: 220, damping: 14, delay: 0.05 }
  }
};

const checkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1, opacity: 1,
    transition: { duration: 0.4, delay: 0.2, ease: "easeOut" }
  }
};

// ─── Error Config ────────────────────────────────────────────────────────────
const errorConfig: Record<
  NonNullable<VerificationError>,
  { title: string; message: string; icon: typeof AlertCircle; color: string; action?: string }
> = {
  incorrect: {
    title: "Incorrect Verification Code",
    message: "The code you entered does not match. Please check the code and try again.",
    icon: AlertCircle,
    color: "red",
    action: "Try Again"
  },
  expired: {
    title: "Code Has Expired",
    message: "Your verification code has expired. Please request a new code to continue.",
    icon: Clock,
    color: "amber",
    action: "Resend Code"
  },
  limit_exceeded: {
    title: "Too Many Attempts",
    message: "You have exceeded the maximum number of verification attempts. Please contact support.",
    icon: AlertTriangle,
    color: "red",
    action: "Contact Support"
  },
  network: {
    title: "Network Error",
    message: "Unable to reach our servers. Please check your connection and try again.",
    icon: WifiOff,
    color: "slate",
    action: "Retry"
  },
  server: {
    title: "Server Error",
    message: "An unexpected error occurred on our end. Our team has been notified.",
    icon: Server,
    color: "red",
    action: "Retry"
  },
  duplicate: {
    title: "Already Verified",
    message: "This email address has already been verified. Please proceed to login.",
    icon: BadgeCheck,
    color: "emerald"
  }
};

// ─── Helper: Mask Email ───────────────────────────────────────────────────────
function maskEmail(email: string): string {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  if (name.length <= 3) return `${name[0]}****@${domain}`;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 3))}${name.slice(-1)}@${domain}`;
}

// ─── Countdown Component ─────────────────────────────────────────────────────
function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / total) * circumference;

  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="40" height="40">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
        <circle
          cx="20" cy="20" r={radius}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className="text-[10px] font-black text-primary tabular-nums leading-none">
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── OTP Input Component ──────────────────────────────────────────────────────
interface OtpInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
  hasError?: boolean;
}

function OtpInput({ value, onChange, disabled, hasError }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...value];
    next[idx] = char;
    onChange(next);
    if (char && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0) {
        refs.current[idx - 1]?.focus();
        const next = [...value];
        next[idx - 1] = "";
        onChange(next);
      } else {
        const next = [...value];
        next[idx] = "";
        onChange(next);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      refs.current[idx + 1]?.focus();
    } else if (e.key === "Enter") {
      // Trigger verify from OTP box
      refs.current[idx]?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    const focus = Math.min(pasted.length, 5);
    refs.current[focus]?.focus();
  };

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="Verification code input"
    >
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          aria-label={`Digit ${idx + 1} of 6`}
          className={[
            "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl border-2 transition-all duration-150 outline-none select-none",
            "focus:ring-4",
            disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "bg-white cursor-text",
            hasError
              ? "border-red-300 bg-red-50/50 text-red-700 focus:border-red-500 focus:ring-red-500/20"
              : digit
              ? "border-primary bg-blue-50/40 text-primary focus:border-primary focus:ring-primary/20"
              : "border-slate-200 text-slate-800 focus:border-primary focus:ring-primary/20"
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Progress Step Component ──────────────────────────────────────────────────
interface ProgressStepProps {
  index: number;
  label: string;
  sublabel: string;
  state: "completed" | "active" | "pending";
  isLast?: boolean;
}

function ProgressStep({ index, label, sublabel, state, isLast }: ProgressStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={[
          "h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black transition-all",
          state === "completed" ? "bg-emerald-600 text-white" :
          state === "active"    ? "bg-primary text-white ring-4 ring-primary/20" :
                                  "bg-slate-100 text-slate-400"
        ].join(" ")}>
          {state === "completed" ? <Check className="h-3.5 w-3.5" /> : index}
        </div>
        {!isLast && (
          <div className={[
            "w-0.5 flex-1 mt-1 rounded-full transition-colors",
            state === "completed" ? "bg-emerald-300" : "bg-slate-150"
          ].join(" ")} style={{ minHeight: 24 }} />
        )}
      </div>
      <div className="pb-5 min-w-0">
        <p className={[
          "text-xs font-bold",
          state === "active" ? "text-primary" :
          state === "completed" ? "text-emerald-700" :
          "text-slate-400"
        ].join(" ")}>{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{sublabel}</p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EmailVerificationPage() {
  const router = useRouter();

  // Draft data
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);
  const [loading, setLoading] = useState(true);

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [screenState, setScreenState] = useState<ScreenState>("idle");
  const [verificationError, setVerificationError] = useState<VerificationError>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Resend state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Auto-redirect countdown
  const [redirectCountdown, setRedirectCountdown] = useState(AUTO_REDIRECT_SECONDS);

  // UI
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // Refs for API-ready integration
  const verifyRequestRef = useRef<AbortController | null>(null);

  // ── Load draft ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    if (saved) {
      try { setDraft(JSON.parse(saved)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  // ── Guard: redirect if no draft ────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !draft?.email) {
      router.push("/auth/register/industry");
    }
  }, [loading, draft, router]);

  // ── Resend countdown timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  // ── Auto-redirect after success ────────────────────────────────────────────
  useEffect(() => {
    if (screenState !== "success") return;
    if (redirectCountdown <= 0) {
      router.push("/auth/registration-success");
      return;
    }
    const id = setTimeout(() => setRedirectCountdown(p => p - 1), 1000);
    return () => clearTimeout(id);
  }, [screenState, redirectCountdown, router]);

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  // API-ready: replace setTimeout with actual fetch call
  const handleVerify = useCallback(() => {
    const code = otp.join("");
    if (code.length !== 6) {
      setShakeKey(k => k + 1);
      return;
    }

    if (attemptCount >= 5) {
      setVerificationError("limit_exceeded");
      setScreenState("error");
      return;
    }

    // Cancel any in-flight request
    verifyRequestRef.current?.abort();
    verifyRequestRef.current = new AbortController();

    setScreenState("verifying");
    setVerificationError(null);

    /*
     * API Integration Point:
     * POST /api/auth/verify-email
     * Body: { email: draft.email, otp: code }
     * Headers: { "X-Request-ID": uuid(), "X-Org-Id": draft.orgId }
     * signal: verifyRequestRef.current.signal
     */
    setTimeout(() => {
      setAttemptCount(c => c + 1);

      // Demo: 123456 = success, 000000 = expired, anything else = incorrect
      if (code === "123456") {
        localStorage.removeItem("anveshakhub_industry_onboarding");
        setScreenState("success");
      } else if (code === "000000") {
        setVerificationError("expired");
        setScreenState("error");
        setShakeKey(k => k + 1);
        setOtp(Array(6).fill(""));
      } else {
        setVerificationError("incorrect");
        setScreenState("error");
        setShakeKey(k => k + 1);
        setOtp(Array(6).fill(""));
      }
    }, 1400);
  }, [otp, attemptCount, draft]);

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = useCallback(() => {
    if (resendCooldown > 0 || isResending) return;
    if (resendAttempts >= MAX_RESEND_ATTEMPTS) return;

    setIsResending(true);
    setVerificationError(null);
    setOtp(Array(6).fill(""));

    /*
     * API Integration Point:
     * POST /api/auth/resend-otp
     * Body: { email: draft.email }
     * Rate limited by Redis on backend
     */
    setTimeout(() => {
      setIsResending(false);
      setResendAttempts(c => c + 1);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setScreenState("idle");
    }, 1000);
  }, [resendCooldown, isResending, resendAttempts]);

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const handleCancelConfirm = () => {
    localStorage.removeItem("anveshakhub_industry_onboarding");
    router.push("/auth/role-selection");
  };

  // ── Loading guard ──────────────────────────────────────────────────────────
  if (loading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  const maskedEmail = maskEmail(draft.email ?? "");
  const isDisabled = screenState === "verifying" || screenState === "success";
  const canResend = resendCooldown === 0 && !isResending && resendAttempts < MAX_RESEND_ATTEMPTS;
  const resendExhausted = resendAttempts >= MAX_RESEND_ATTEMPTS;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">

      {/* ── Background Decoration ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[360px] h-[360px] bg-blue-300/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/auth/register/review")}
              aria-label="Back to review"
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-sm text-secondary tracking-tight hidden sm:block">AnveshakHub</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Security indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Lock className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <button
              aria-label="Help"
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-grow flex items-start justify-center py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-6xl">

          {/* ── Step Progress Pill ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
              {[
                { label: "Organization Info", done: true },
                { label: "Review & Confirm", done: true },
                { label: "Email Verification", done: false, active: true },
                { label: "Registration Submitted", done: false }
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-1.5">
                  <span className={[
                    "text-[10px] font-bold",
                    step.active ? "text-primary" :
                    step.done  ? "text-emerald-600" :
                    "text-slate-400"
                  ].join(" ")}>
                    {step.done ? <span className="inline-flex items-center gap-0.5"><CheckCircle2 className="h-3 w-3" /> {step.label}</span> : step.label}
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-300 text-xs">›</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Two-Column Layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ─────────────── LEFT: Verification Card ─────────────── */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 xl:col-span-7"
            >
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">

                {/* Card Header */}
                <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 3 of 4</p>
                      <h1 className="text-lg font-black text-secondary tracking-tight leading-tight">
                        Verify Your Official Email Address
                      </h1>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We have sent a 6-digit verification code to your registered organization email address.
                    Enter the code below to confirm ownership and continue registration.
                  </p>
                </div>

                {/* Email Display */}
                <div className="px-8 py-4 bg-slate-50/60 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Email Sent To</p>
                        <p className="text-sm font-bold text-slate-700 truncate">{maskedEmail}</p>
                      </div>
                    </div>
                    <Link
                      href="/auth/register/industry"
                      className="h-8 px-3 shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
                    >
                      <Pencil className="h-3 w-3" /> Change Email
                    </Link>
                  </div>
                </div>

                {/* OTP Section */}
                <div className="px-8 py-8">
                  <AnimatePresence mode="wait">
                    {screenState !== "success" ? (
                      <motion.div
                        key="otp-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-5">
                          Enter 6-Digit Verification Code
                        </p>

                        {/* OTP Inputs with shake */}
                        <motion.div
                          key={shakeKey}
                          variants={shakeVariants}
                          animate={verificationError === "incorrect" || verificationError === "expired" ? "shake" : undefined}
                          className="mb-6"
                        >
                          <OtpInput
                            value={otp}
                            onChange={(next) => {
                              setOtp(next);
                              if (verificationError) setVerificationError(null);
                              if (screenState === "error") setScreenState("idle");
                            }}
                            disabled={isDisabled}
                            hasError={!!verificationError}
                          />
                        </motion.div>

                        {/* Error Banner */}
                        <AnimatePresence>
                          {verificationError && verificationError !== "limit_exceeded" && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -6, height: 0 }}
                              className="mb-5 overflow-hidden"
                            >
                              <div className={[
                                "flex items-start gap-2.5 rounded-xl px-4 py-3 border text-xs",
                                verificationError === "expired" || verificationError === "network"
                                  ? "bg-amber-50 border-amber-200 text-amber-800"
                                  : "bg-red-50 border-red-200 text-red-800"
                              ].join(" ")}>
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold">{errorConfig[verificationError].title}</p>
                                  <p className="mt-0.5 font-medium opacity-80">{errorConfig[verificationError].message}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {verificationError === "limit_exceeded" && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -6, height: 0 }}
                              className="mb-5 overflow-hidden"
                            >
                              <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 border bg-red-50 border-red-200">
                                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold text-red-800">Too Many Failed Attempts</p>
                                  <p className="text-xs font-medium text-red-700 mt-0.5 opacity-80">
                                    Your account has been temporarily locked for security. Please contact support.
                                  </p>
                                  <a
                                    href="mailto:support@anveshakhub.com"
                                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-red-700 hover:underline"
                                  >
                                    <HelpCircle className="h-3 w-3" /> Contact Support
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Verify Button */}
                        <button
                          onClick={handleVerify}
                          disabled={isDisabled || otp.join("").length !== 6 || verificationError === "limit_exceeded"}
                          className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
                          aria-label="Verify email address"
                        >
                          {screenState === "verifying" ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Verifying Identity…
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-4 w-4" />
                              Verify Email Address
                            </>
                          )}
                        </button>

                        {/* Resend & Actions */}
                        <div className="mt-6 flex flex-col items-center gap-3">
                          {!resendExhausted ? (
                            <div className="flex items-center gap-3">
                              {resendCooldown > 0 ? (
                                <div className="flex items-center gap-2">
                                  <CountdownRing seconds={resendCooldown} total={RESEND_COOLDOWN_SECONDS} />
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-500">Resend available in</p>
                                    <p className="text-xs font-black text-primary tabular-nums">
                                      {String(Math.floor(resendCooldown / 60)).padStart(2, "0")}:{String(resendCooldown % 60).padStart(2, "0")}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={handleResend}
                                  disabled={!canResend}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isResending ? (
                                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                                  ) : (
                                    <><RefreshCw className="h-3.5 w-3.5" /> Resend Verification Code</>
                                  )}
                                </button>
                              )}
                              <span className="text-slate-200">|</span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {MAX_RESEND_ATTEMPTS - resendAttempts} attempt{MAX_RESEND_ATTEMPTS - resendAttempts !== 1 ? "s" : ""} remaining
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Resend limit reached.{" "}
                              <a href="mailto:support@anveshakhub.com" className="underline hover:no-underline">
                                Contact Support
                              </a>
                            </div>
                          )}

                          <button
                            onClick={() => setShowCancelModal(true)}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-600 transition-colors"
                          >
                            Cancel Registration
                          </button>
                        </div>

                        {/* Demo hint */}
                        <div className="mt-6 flex items-start gap-2 bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3">
                          <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            <span className="font-bold text-primary">Demo Mode: </span>
                            Enter <code className="bg-white border border-blue-100 px-1 rounded font-mono text-primary">123456</code> to verify successfully,{" "}
                            <code className="bg-white border border-blue-100 px-1 rounded font-mono text-amber-600">000000</code> to test an expired code, or any other code for an error state.
                          </p>
                        </div>
                      </motion.div>

                    ) : (
                      /* ── Success State ── */
                      <motion.div
                        key="success-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-4"
                      >
                        {/* Animated Check Ring */}
                        <div className="flex justify-center mb-6">
                          <div className="relative h-24 w-24">
                            {/* Outer pulse ring */}
                            <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1.15, opacity: 0 }}
                              transition={{ duration: 1, repeat: 2, ease: "easeOut" }}
                              className="absolute inset-0 rounded-full bg-emerald-400"
                            />
                            <motion.div
                              variants={successRingVariants}
                              initial="hidden"
                              animate="visible"
                              className="absolute inset-0 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center"
                            >
                              <svg width="40" height="40" viewBox="0 0 40 40">
                                <motion.path
                                  variants={checkVariants}
                                  initial="hidden"
                                  animate="visible"
                                  d="M8 20 L17 29 L32 11"
                                  stroke="#16a34a"
                                  strokeWidth="3.5"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Identity Verified</span>
                          </div>
                          <h2 className="text-xl font-black text-secondary tracking-tight">Email Address Confirmed</h2>
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                            Your organization's official email address has been successfully verified.
                            Your registration has been submitted to the AnveshakHub compliance team.
                          </p>
                        </motion.div>

                        {/* What happens next */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                          className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-left"
                        >
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> What Happens Next?
                          </p>
                          <ul className="space-y-2">
                            {[
                              "A confirmation email has been sent to your organization's inbox.",
                              "The AnveshakHub compliance team will review your credentials within 24 business hours.",
                              "Upon approval, your secure organization dashboard will be activated."
                            ].map((item) => (
                              <li key={item} className="flex items-start gap-2 text-[10px] text-slate-600 leading-relaxed">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>

                        {/* Auto-redirect countdown */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.55 }}
                          className="mt-6 flex flex-col items-center gap-3"
                        >
                          {redirectCountdown > 0 ? (
                            <p className="text-[10px] text-slate-400 font-medium">
                              Redirecting to confirmation page in{" "}
                              <span className="font-black text-primary">{redirectCountdown}s</span>…
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-400 font-medium">Redirecting…</p>
                          )}
                          <Link
                            href="/auth/registration-success"
                            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-blue-700 rounded-xl text-xs font-bold text-white shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Continue to Confirmation
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">OTP expires in 10 minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600 font-bold">Secured by AnveshakHub</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ─────────────── RIGHT: Info Panel (Desktop) ─────────────── */}
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col gap-4"
            >
              {/* Registration Progress */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Registration Pipeline
                </p>
                <ProgressStep index={1} label="Organization Profile" sublabel="Submitted and reviewed" state="completed" />
                <ProgressStep index={2} label="Review & Confirm" sublabel="All sections verified" state="completed" />
                <ProgressStep
                  index={3}
                  label="Email Verification"
                  sublabel="Confirm email ownership"
                  state={screenState === "success" ? "completed" : "active"}
                />
                <ProgressStep index={4} label="Under Compliance Review" sublabel="AnveshakHub team review" state="pending" isLast />
              </div>

              {/* Security Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <p className="text-xs font-extrabold text-secondary">Security Information</p>
                </div>
                <ul className="space-y-3">
                  {[
                    { icon: Lock, text: "Your verification code is encrypted in transit and never stored on our frontend." },
                    { icon: ShieldCheck, text: "Email verification ensures only authorized representatives can register your organization." },
                    { icon: Eye, text: "Your email address will never be shared with third parties under any circumstances." },
                    { icon: Server, text: "OTP validation happens exclusively on our secure backend — never client-side." }
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3 w-3 text-slate-500" />
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Email Verification */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <FileSearch className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs font-extrabold text-secondary">Why Verification Is Required</p>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Confirms you are an authorized representative of the organization.",
                    "Prevents fraudulent or duplicate organization registrations.",
                    "Ensures enterprise communication channels are correctly configured.",
                    "Required by our compliance framework before entering the review pipeline."
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <HelpCircle className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Need Help?</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Enterprise Support Desk</p>
                  </div>
                </div>
                <a
                  href="mailto:support@anveshakhub.com"
                  className="h-8 px-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
                >
                  Contact Support
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Cancel Registration Modal ── */}
      <Dialog.Root open={showCancelModal} onOpenChange={setShowCancelModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none"
            aria-describedby="cancel-modal-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-7 mx-4"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <Dialog.Title className="text-sm font-extrabold text-secondary">Cancel Registration?</Dialog.Title>
                  <p id="cancel-modal-desc" className="text-xs text-slate-500 mt-1 leading-relaxed">
                    This will permanently delete your saved organization profile and all entered information.
                    You will need to start the registration process from the beginning.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Keep Registration
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Discard & Cancel
                </button>
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 h-7 w-7 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
