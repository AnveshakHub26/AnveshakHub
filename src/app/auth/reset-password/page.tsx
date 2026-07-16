"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2, Eye, EyeOff, Lock, ArrowLeft, ShieldCheck,
  Loader2, AlertCircle, CheckCircle2, XCircle, HelpCircle
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.26, delay: i * 0.06, ease: "easeOut" } })
};

// ─── Password Rules ────────────────────────────────────────────────────────────
const rules = [
  { id: "length",    label: "At least 12 characters",   test: (p: string) => p.length >= 12 },
  { id: "uppercase", label: "One uppercase letter",      test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter",      test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "One number",                test: (p: string) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character",     test: (p: string) => /[^A-Za-z0-9]/.test(p) }
];

// ─── Strength Meter ────────────────────────────────────────────────────────────
function getStrength(password: string): { score: number; label: string; color: string; bg: string } {
  const passed = rules.filter(r => r.test(password)).length;
  if (!password) return { score: 0, label: "", color: "bg-slate-200", bg: "bg-slate-100" };
  if (passed <= 1)  return { score: 20, label: "Very Weak",  color: "bg-red-500",    bg: "bg-red-50" };
  if (passed === 2) return { score: 40, label: "Weak",       color: "bg-orange-500", bg: "bg-orange-50" };
  if (passed === 3) return { score: 60, label: "Fair",       color: "bg-amber-500",  bg: "bg-amber-50" };
  if (passed === 4) return { score: 80, label: "Strong",     color: "bg-blue-500",   bg: "bg-blue-50" };
  return                    { score: 100, label: "Very Strong", color: "bg-emerald-500", bg: "bg-emerald-50" };
}

// ─── Password Field ─────────────────────────────────────────────────────────────
function PasswordField({
  id, label, value, onChange, disabled, hasError, autoComplete, placeholder
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  disabled?: boolean; hasError?: boolean; autoComplete?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          id={id} type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "Enter password"}
          disabled={disabled} autoComplete={autoComplete}
          aria-invalid={hasError}
          className={[
            "w-full h-11 pl-10 pr-10 rounded-xl border text-sm font-medium placeholder-slate-400 outline-none transition-all focus:ring-4",
            disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "bg-white",
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800"
          ].join(" ")}
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(s => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errors, setErrors]         = useState<{ password?: string; confirm?: string }>({});

  const strength = useMemo(() => getStrength(password), [password]);
  const allRulesPassed = rules.every(r => r.test(password));
  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm;

  const validate = () => {
    const errs: { password?: string; confirm?: string } = {};
    if (!allRulesPassed) errs.password = "Password does not meet all requirements.";
    if (!confirm) errs.confirm = "Please confirm your new password.";
    else if (password !== confirm) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // API Integration Point: POST /api/auth/reset-password { token, password }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-3 px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-sm text-secondary tracking-tight hidden sm:block">AnveshakHub</span>
        </Link>
        <a href="mailto:support@anveshakhub.com"
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
          <HelpCircle className="h-4 w-4" /> Help
        </a>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">

            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors mb-5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Reset</p>
                  <h1 className="text-lg font-black text-secondary tracking-tight">Create New Password</h1>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your new password must be strong, unique, and different from previously used passwords.
              </p>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 13 }}
                      className="h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </motion.div>
                    <h2 className="text-sm font-extrabold text-secondary mb-2">Password Updated</h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-xs mx-auto">
                      Your password has been successfully updated. You will be redirected to login in a moment.
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-primary">Redirecting to Login…</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* New Password */}
                    <div>
                      <PasswordField
                        id="new-password" label="New Password" value={password}
                        onChange={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
                        disabled={submitting} hasError={!!errors.password}
                        autoComplete="new-password" placeholder="Create a strong password"
                      />

                      {/* Strength Meter */}
                      {password.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password Strength</span>
                            <span className={`text-[10px] font-black ${
                              strength.score >= 80 ? "text-emerald-600" :
                              strength.score >= 60 ? "text-primary" :
                              strength.score >= 40 ? "text-amber-600" : "text-red-600"
                            }`}>{strength.label}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${strength.score}%` }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className={`h-full rounded-full ${strength.color}`}
                            />
                          </div>

                          {/* Rules checklist */}
                          <div className="mt-3 grid grid-cols-1 gap-1">
                            {rules.map(rule => {
                              const passed = rule.test(password);
                              return (
                                <div key={rule.id} className="flex items-center gap-2">
                                  {passed
                                    ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    : <XCircle className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                                  <span className={`text-[10px] font-medium ${passed ? "text-emerald-700" : "text-slate-400"}`}>
                                    {rule.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      <AnimatePresence>
                        {errors.password && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <PasswordField
                        id="confirm-password" label="Confirm New Password" value={confirm}
                        onChange={v => { setConfirm(v); setErrors(e => ({ ...e, confirm: undefined })); }}
                        disabled={submitting} hasError={!!errors.confirm}
                        autoComplete="new-password" placeholder="Repeat your new password"
                      />
                      <AnimatePresence>
                        {confirm.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="mt-1.5">
                            {passwordsMatch ? (
                              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Passwords match
                              </p>
                            ) : (
                              <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                                <XCircle className="h-3 w-3" /> Passwords do not match
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <AnimatePresence>
                        {errors.confirm && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.confirm}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Link href="/auth/login"
                        className="h-12 px-5 inline-flex items-center justify-center border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                      </Link>
                      <button type="submit" disabled={submitting || !allRulesPassed || !passwordsMatch}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-primary/30">
                        {submitting
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating Password…</>
                          : <><ShieldCheck className="h-4 w-4" /> Update Password</>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                For security, password reset links expire after <span className="font-bold text-slate-600">15 minutes</span>.
                Previously used passwords cannot be reused.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
