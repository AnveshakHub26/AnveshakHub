"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle, RefreshCw, Clock
} from "lucide-react";

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    const id = setInterval(() => {
      setCooldown((p) => {
        if (p <= 1) { clearInterval(id); return 0; }
        return p - 1;
      });
    }, 1000);
  };

  const validate = useCallback(() => {
    if (!email) { setEmailError("Email address is required."); return false; }
    if (!email.includes("@")) { setEmailError("Enter a valid institutional or corporate email."); return false; }
    setEmailError(null);
    return true;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setSentCount((c) => c + 1);
        startCooldown();
      } else {
        setError("We couldn't find that email. Double-check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSentCount((c) => c + 1);
        startCooldown();
      }
    } catch {
      // silent
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "var(--bg-app)" }}>
      <div className="w-full max-w-md space-y-8">

        {/* Brand */}
        <div className="text-center">
          <div className="inline-block mb-6">
            <BrandLogo />
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
            Reset your password
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your registered email and we&apos;ll send a reset link within 60 seconds.
          </p>
        </div>

        {/* Card */}
        <div className="card-flat rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {error && (
                  <div className="alert alert-danger">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Request failed</p>
                      <p className="text-xs mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="email"
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                      onBlur={validate}
                      placeholder="name@company.com or name@university.edu"
                      className={`input-field pl-10 ${emailError ? "input-error" : ""}`}
                    />
                  </div>
                  {emailError && <p className="form-error">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : "Send Reset Link"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-4"
              >
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto" style={{ backgroundColor: "var(--success-subtle)", color: "var(--success)" }}>
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
                    Reset link sent
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    We sent a secure link to <strong style={{ color: "var(--text-heading)" }}>{email}</strong>.
                    Check your inbox and spam folder.
                  </p>
                </div>

                <div className="alert alert-success text-left">
                  <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>Link expires in 30 minutes. Sent {sentCount} time{sentCount > 1 ? "s" : ""}.</p>
                </div>

                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                  className="btn-secondary w-full"
                >
                  {resending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : cooldown > 0
                    ? <><Clock className="h-4 w-4" /> Resend in {cooldown}s</>
                    : <><RefreshCw className="h-4 w-4" /> Resend Email</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium link-inline" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
