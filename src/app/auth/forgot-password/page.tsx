"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2, Mail, ArrowLeft, ShieldCheck, Loader2,
  AlertCircle, CheckCircle2, HelpCircle, Clock, RefreshCw
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.26, delay: i * 0.06, ease: "easeOut" } })
};

type PageState = "idle" | "loading" | "success" | "error" | "rate_limited";

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordPage() {
  const [email, setEmail]           = useState("");
  const [pageState, setPageState]   = useState<PageState>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cooldown, setCooldown]     = useState(0);
  const [sentCount, setSentCount]   = useState(0);

  // Countdown timer
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    const id = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = useCallback(() => {
    if (!email) { setEmailError("Official email address is required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid email address."); return false; }
    setEmailError(null);
    return true;
  }, [email]);

  // API Integration Point: POST /api/auth/forgot-password → { success: boolean }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (sentCount >= 3) { setPageState("rate_limited"); return; }
    setPageState("loading");
    setTimeout(() => {
      setSentCount(c => c + 1);
      setPageState("success");
      startCooldown();
    }, 1400);
  };

  const handleResend = () => {
    if (cooldown > 0 || sentCount >= 3) return;
    setPageState("loading");
    setTimeout(() => {
      setSentCount(c => c + 1);
      setPageState("success");
      startCooldown();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-3 px-6 sm:px-10 flex items-center justify-between">
        <BrandLogo size="sm" />
        <a href="mailto:support@anveshakhub.com"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
          <HelpCircle className="h-4 w-4" /> Help
        </a>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            {/* Top bar */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
              <Link href="/auth/login"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors mb-5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Recovery</p>
                  <h1 className="text-lg font-black text-secondary tracking-tight">Forgot Your Password?</h1>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your registered organization email address. We will send you a secure password reset link valid for 15 minutes.
              </p>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">

                {/* Success state */}
                {pageState === "success" && (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                      className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </motion.div>
                    <h2 className="text-sm font-extrabold text-secondary mb-2">Reset Link Sent</h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">
                      We've sent a secure password reset link to:
                    </p>
                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 mb-5">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">{email}</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-left space-y-1.5">
                      {[
                        "Check your inbox — the link expires in 15 minutes.",
                        "Check spam if you don't see it within 2 minutes.",
                        "Only one reset link is active at a time."
                      ].map(tip => (
                        <p key={tip} className="text-[10px] text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {tip}
                        </p>
                      ))}
                    </div>

                    {/* Resend */}
                    <div className="flex items-center justify-center gap-3">
                      {cooldown > 0 ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          Resend in <span className="font-black text-primary tabular-nums">{cooldown}s</span>
                        </div>
                      ) : sentCount < 3 ? (
                        <button onClick={handleResend}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                          <RefreshCw className="h-3.5 w-3.5" /> Resend Reset Link
                        </button>
                      ) : (
                        <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" /> Resend limit reached.{" "}
                          <a href="mailto:support@anveshakhub.com" className="underline">Contact support</a>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Rate limited */}
                {pageState === "rate_limited" && (
                  <motion.div key="rate-limit"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-4"
                  >
                    <div className="h-14 w-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-7 w-7 text-amber-600" />
                    </div>
                    <h2 className="text-sm font-extrabold text-secondary mb-2">Too Many Requests</h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-5">
                      You've requested the maximum number of password reset links. Please check your inbox or contact support.
                    </p>
                    <a href="mailto:support@anveshakhub.com"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white rounded-xl px-5 h-10 text-xs font-bold transition-colors">
                      Contact Support
                    </a>
                  </motion.div>
                )}

                {/* Form */}
                {pageState !== "success" && pageState !== "rate_limited" && (
                  <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div>
                      <label htmlFor="reset-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          id="reset-email" type="email" value={email}
                          onChange={e => { setEmail(e.target.value); setEmailError(null); }}
                          placeholder="you@organization.com"
                          disabled={pageState === "loading"}
                          autoComplete="email"
                          aria-invalid={!!emailError}
                          className={[
                            "w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium placeholder-slate-400 outline-none transition-all focus:ring-4",
                            pageState === "loading" ? "opacity-50 bg-slate-50" : "bg-white",
                            emailError ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800"
                          ].join(" ")}
                        />
                      </div>
                      <AnimatePresence>
                        {emailError && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {emailError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <button type="submit" disabled={pageState === "loading"}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary/30">
                      {pageState === "loading"
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending Reset Link…</>
                        : <><ShieldCheck className="h-4 w-4" /> Send Reset Link</>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Link href="/auth/login" className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Login
              </Link>
              <Link href="/auth/verification-status" className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                Track Verification Status
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
