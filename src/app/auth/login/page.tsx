"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2,
  HelpCircle, ShieldCheck, Loader2, AlertTriangle,
  Users, Globe, TrendingUp, BadgeCheck, ArrowRight, Zap
} from "lucide-react";

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.27, delay: i * 0.06, ease: "easeOut" } })
};
const shakeVariants: Variants = {
  shake: { x: [-10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.45 } }
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type LoginState = "idle" | "loading" | "error" | "success";
type LoginError = "invalid_credentials" | "account_locked" | "not_verified" | "network" | "server" | null;

const errorMessages: Record<NonNullable<LoginError>, { title: string; message: string }> = {
  invalid_credentials: { title: "Invalid Credentials", message: "The email or password you entered is incorrect. Please try again." },
  account_locked:      { title: "Account Locked",      message: "Your account has been temporarily locked due to too many failed attempts." },
  not_verified:        { title: "Account Not Verified", message: "Your organization is pending verification. Check your verification status." },
  network:             { title: "Network Error",        message: "Unable to reach our servers. Please check your connection and try again." },
  server:              { title: "Server Error",         message: "An unexpected error occurred. Our team has been notified." }
};

// ─── Enterprise Dark Panel ─────────────────────────────────────────────────────
function EnterprisePanel() {
  return (
    <div className="hidden lg:flex flex-col w-[44%] bg-secondary min-h-screen relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full px-10 py-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-white p-2 rounded-xl">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm tracking-tight">AnveshakHub</p>
            <p className="text-slate-400 text-[10px] font-medium">Enterprise Collaboration Platform</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Network illustration */}
          <svg viewBox="0 0 360 220" className="w-full max-w-sm mx-auto mb-8" aria-hidden="true">
            <defs>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="110" r="60" fill="url(#hubGlow)" />
            <circle cx="180" cy="110" r="38" fill="#1e40af" fillOpacity="0.2" stroke="#2563EB" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="180" cy="110" r="22" fill="#2563EB" fillOpacity="0.15" />
            <rect x="169" y="99" width="22" height="22" rx="5" fill="#2563EB" />
            <path d="M175 112 L179 116 L186 108" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {[
              { cx: 62, cy: 58, label: "Industry", color: "#10b981" },
              { cx: 298, cy: 58, label: "Research", color: "#8b5cf6" },
              { cx: 40, cy: 162, label: "Investor", color: "#f59e0b" },
              { cx: 320, cy: 162, label: "Academia", color: "#06b6d4" },
              { cx: 180, cy: 24, label: "Govt", color: "#f87171" }
            ].map(({ cx, cy, label, color }) => (
              <g key={label}>
                <line x1={cx} y1={cy} x2="180" y2="110" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                <circle cx={cx} cy={cy} r="20" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" />
                <circle cx={cx} cy={cy} r="7" fill={color} fillOpacity="0.85" />
                <text x={cx} y={cy + 34} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="ui-sans-serif, system-ui, sans-serif">{label}</text>
              </g>
            ))}
            <circle cx="180" cy="110" r="55" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.15" />
            <circle cx="180" cy="110" r="75" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.08" />
          </svg>

          <h2 className="text-xl font-black text-white tracking-tight text-center mb-2">
            One Platform. Every Stakeholder.
          </h2>
          <p className="text-sm text-slate-400 text-center leading-relaxed max-w-xs mx-auto mb-8">
            Bridging industries, academia, researchers, investors and government agencies in one secure enterprise ecosystem.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Users, value: "2,400+", label: "Organizations" },
              { icon: Globe, value: "18+", label: "Verticals" },
              { icon: TrendingUp, value: "96%", label: "Approval Rate" }
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <Icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <p className="text-sm font-black text-white">{value}</p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {[
              { icon: ShieldCheck, text: "256-bit end-to-end encrypted sessions" },
              { icon: BadgeCheck,  text: "ISO 27001-aligned security framework" },
              { icon: Zap,         text: "JWT + RBAC authentication architecture" }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex items-center justify-between">
          <p className="text-[10px] text-slate-600 font-medium">© 2026 AnveshakHub Pvt. Ltd.</p>
          <div className="flex gap-3">
            <Link href="/" className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/" className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Password Input ─────────────────────────────────────────────────────────────
function PasswordInput({
  id, value, onChange, placeholder, disabled, hasError, label, autoComplete
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; hasError?: boolean;
  label: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => setCapsLock(e.getModifierState("CapsLock"))}
          onKeyUp={e => setCapsLock(e.getModifierState("CapsLock"))}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={label}
          aria-invalid={hasError}
          className={[
            "w-full h-11 pl-10 pr-10 rounded-xl border text-sm font-medium placeholder-slate-400 outline-none transition-all focus:ring-4",
            disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "bg-white",
            hasError
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 text-red-700"
              : "border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800"
          ].join(" ")}
        />
        <button type="button" onClick={() => setShow(s => !s)} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <AnimatePresence>
        {capsLock && value.length > 0 && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
            <AlertTriangle className="h-3 w-3" /> Caps Lock is on
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Login Page ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [loginError, setLoginError] = useState<LoginError>(null);
  const [shakeKey, setShakeKey]   = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = useCallback(() => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Official email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [email, password]);

  // API Integration Point: POST /api/auth/login → returns { token, role, redirectUrl }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { setShakeKey(k => k + 1); return; }
    setLoginState("loading");
    setLoginError(null);
    setTimeout(() => {
      if (password === "wrong") {
        setLoginState("error"); setLoginError("invalid_credentials"); setShakeKey(k => k + 1);
      } else if (password === "locked") {
        setLoginState("error"); setLoginError("account_locked");
      } else {
        setLoginState("success");
        // On real backend: decode JWT role → router.push(roleBasedDashboardUrl)
      }
    }, 1500);
  };

  const isLoading = loginState === "loading";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <EnterprisePanel />

      {/* ── Form Side ── */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5">
          <Link href="/" className="flex items-center gap-2 group lg:hidden">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors"><Building2 className="h-4 w-4" /></div>
            <span className="font-extrabold text-sm text-secondary tracking-tight">AnveshakHub</span>
          </Link>
          <div className="lg:hidden" />
          <a href="mailto:support@anveshakhub.com" className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
            <HelpCircle className="h-4 w-4" /> Help
          </a>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/20 px-3 py-1 rounded-full mb-4">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Secure Sign-In</span>
              </div>
              <h1 className="text-2xl font-black text-secondary tracking-tight">Welcome Back</h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Sign in to your AnveshakHub organization account. Your role is automatically identified after authentication.
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {loginError && (
                <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-800">{errorMessages[loginError].title}</p>
                      <p className="text-[10px] text-red-700 mt-0.5 leading-relaxed">{errorMessages[loginError].message}</p>
                      {loginError === "account_locked" && (
                        <Link href="/auth/account-status" className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-700 hover:underline">
                          View Account Status <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                      {loginError === "not_verified" && (
                        <Link href="/auth/verification-status" className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-700 hover:underline">
                          Track Verification <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success State */}
            <AnimatePresence>
              {loginState === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 flex flex-col items-center text-center py-8 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="h-16 w-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <p className="text-sm font-extrabold text-emerald-900">Authentication Successful</p>
                  <p className="text-xs text-emerald-700 mt-1">Identifying your role and redirecting…</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                    <span className="text-[10px] text-emerald-600 font-bold">Loading your workspace…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {loginState !== "success" && (
              <motion.form key={shakeKey} variants={shakeVariants}
                animate={loginError === "invalid_credentials" ? "shake" : undefined}
                onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Official Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="login-email" type="email" value={email}
                      onChange={e => { setEmail(e.target.value); if (loginError) setLoginError(null); setFieldErrors(f => ({ ...f, email: undefined })); }}
                      placeholder="you@organization.com" disabled={isLoading} autoComplete="email"
                      aria-invalid={!!fieldErrors.email}
                      className={[
                        "w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium placeholder-slate-400 outline-none transition-all focus:ring-4",
                        isLoading ? "opacity-50 cursor-not-allowed bg-slate-50" : "bg-white",
                        fieldErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-primary focus:ring-primary/20 text-slate-800"
                      ].join(" ")}
                    />
                  </div>
                  <AnimatePresence>
                    {fieldErrors.email && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {fieldErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div>
                  <PasswordInput
                    id="login-password" label="Password" value={password}
                    onChange={v => { setPassword(v); if (loginError) setLoginError(null); setFieldErrors(f => ({ ...f, password: undefined })); }}
                    disabled={isLoading} hasError={!!fieldErrors.password}
                    autoComplete="current-password" placeholder="Enter your password"
                  />
                  <AnimatePresence>
                    {fieldErrors.password && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-red-600 font-bold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {fieldErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remember Me + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group" onClick={() => setRememberMe(r => !r)}>
                    <div role="checkbox" aria-checked={rememberMe} tabIndex={0} onKeyDown={e => e.key === " " && setRememberMe(r => !r)}
                      className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? "bg-primary border-primary" : "border-slate-300 bg-white"}`}>
                      {rememberMe && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-xs text-slate-600 font-medium group-hover:text-slate-800 transition-colors select-none">Remember this device</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-primary hover:text-blue-700 hover:underline transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button type="submit" disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/30">
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</>
                    : <><ShieldCheck className="h-4 w-4" /> Sign In to AnveshakHub</>}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* SSO Placeholder */}
                <button type="button" disabled
                  className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed opacity-60">
                  <Globe className="h-4 w-4" /> Sign in with Enterprise SSO
                  <span className="ml-1 text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500">Coming Soon</span>
                </button>
              </motion.form>
            )}

            {/* Footer links */}
            <div className="mt-7 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Not registered?{" "}
                <Link href="/auth/role-selection" className="font-bold text-primary hover:text-blue-700 hover:underline transition-colors">
                  Register your organization
                </Link>
              </p>
              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 flex-wrap">
                <Link href="/" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                <span>·</span>
                <Link href="/" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                <span>·</span>
                <Link href="/auth/verification-status" className="hover:text-slate-600 transition-colors">Track Verification</Link>
              </div>
            </div>

            {/* Demo hint */}
            <div className="mt-6 flex items-start gap-2 bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3">
              <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <span className="font-bold text-primary">Demo: </span>
                Any valid email + any password = success. Password{" "}
                <code className="bg-white border border-blue-100 px-1 rounded font-mono text-red-600">wrong</code> = invalid credentials,{" "}
                <code className="bg-white border border-blue-100 px-1 rounded font-mono text-amber-600">locked</code> = account locked.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
