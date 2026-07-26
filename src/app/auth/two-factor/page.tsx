"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2, ShieldCheck, Smartphone, Mail, KeyRound,
  RefreshCw, ArrowLeft, HelpCircle, Loader2, AlertCircle,
  CheckCircle2, Lock, Clock, ChevronDown, ChevronUp, Eye, EyeOff
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.26, delay: i * 0.06, ease: "easeOut" } })
};
const shakeVariants: Variants = {
  shake: { x: [-10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.45 } }
};

type TwoFAMethod = "authenticator" | "email";
type PageState = "idle" | "verifying" | "success" | "error";

const RESEND_COOLDOWN = 60;

// ─── OTP Input ─────────────────────────────────────────────────────────────────
function OtpInput({
  value, onChange, disabled, hasError
}: {
  value: string[]; onChange: (otp: string[]) => void; disabled?: boolean; hasError?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...value]; next[idx] = char;
    onChange(next);
    if (char && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace") {
      if (!value[idx] && idx > 0) { refs.current[idx - 1]?.focus(); const n = [...value]; n[idx - 1] = ""; onChange(n); }
      else { const n = [...value]; n[idx] = ""; onChange(n); }
    } else if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
    else if (e.key === "ArrowRight" && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2.5" role="group" aria-label="Two-factor authentication code">
      {value.map((digit, idx) => (
        <input key={idx}
          ref={el => { refs.current[idx] = el; }}
          type="text" inputMode="numeric" autoComplete={idx === 0 ? "one-time-code" : "off"}
          maxLength={1} value={digit}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          disabled={disabled}
          aria-label={`Digit ${idx + 1} of 6`}
          className={[
            "w-12 h-14 text-center text-xl font-black rounded-xl border-2 transition-all outline-none select-none focus:ring-4",
            disabled ? "opacity-50 cursor-not-allowed bg-[#FBF7F0]" : "bg-[#FBF7F0] cursor-text",
            hasError
              ? "border-red-300 bg-[#FEE2E2]/50 text-[#C0392B] focus:border-red-500 focus:ring-red-500/20"
              : digit
              ? "border-[#FF5A36] bg-[#FFF0ED]/40 text-[#FF5A36] focus:border-[#FF5A36] focus:ring-[#FF5A36]/20"
              : "border-[#E2DCD2] text-[#211F1D] focus:border-[#FF5A36] focus:ring-[#FF5A36]/20"
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Recovery Code Input ─────────────────────────────────────────────────────────
function RecoveryCodeInput({
  value, onChange, onSubmit, disabled
}: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#78716A] uppercase tracking-wider mb-1.5">
        Recovery Code
      </label>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A196] pointer-events-none" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value.toUpperCase())}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          disabled={disabled}
          className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#E2DCD2] text-sm font-mono font-bold placeholder-[#A8A196] outline-none transition-all focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/20 text-[#211F1D] tracking-wider bg-[#FBF7F0]"
        />
        <button type="button" tabIndex={-1} onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A196] hover:text-[#57534E] transition-colors">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || value.length < 16}
        className="mt-3 w-full h-11 flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
      >
        <KeyRound className="h-4 w-4" /> Use Recovery Code
      </button>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function TwoFactorPage() {
  const router = useRouter();

  const [method, setMethod]       = useState<TwoFAMethod>("authenticator");
  const [otp, setOtp]             = useState<string[]>(Array(6).fill(""));
  const [recoveryCode, setRecoveryCode] = useState("");
  const [useRecovery, setUseRecovery]   = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [pageState, setPageState] = useState<PageState>("idle");
  const [hasError, setHasError]   = useState(false);
  const [shakeKey, setShakeKey]   = useState(0);
  const [cooldown, setCooldown]   = useState(0);
  const [showFutureMethods, setShowFutureMethods] = useState(false);

  // Countdown
  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    const id = setInterval(() => setCooldown(p => { if (p <= 1) { clearInterval(id); return 0; } return p - 1; }), 1000);
  };

  // API Integration Point: POST /api/auth/two-factor/verify { code, method, rememberDevice }
  const handleVerify = useCallback(() => {
    const code = otp.join("");
    if (code.length !== 6) { setShakeKey(k => k + 1); return; }
    setPageState("verifying"); setHasError(false);
    setTimeout(() => {
      if (code === "123456") {
        setPageState("success");
        // router.push(roleBasedDashboardUrl)
      } else {
        setPageState("error"); setHasError(true); setShakeKey(k => k + 1); setOtp(Array(6).fill(""));
      }
    }, 1400);
  }, [otp]);

  // API Integration Point: POST /api/auth/two-factor/resend { method }
  const handleResend = () => {
    if (cooldown > 0) return;
    setOtp(Array(6).fill(""));
    setHasError(false);
    setPageState("idle");
    startCooldown();
  };

  const handleRecovery = () => {
    setPageState("verifying");
    setTimeout(() => {
      if (recoveryCode.length >= 16) {
        setPageState("success");
      } else {
        setPageState("error"); setHasError(true);
      }
    }, 1400);
  };

  const isDisabled = pageState === "verifying" || pageState === "success";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "var(--bg-app)" }}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[400px] h-[400px] bg-[#FF5A36]/5 rounded-full blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2DCD2]/80 py-3 px-6 sm:px-10 flex items-center justify-between">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#E8F2EC] border border-[#BBD9C8] px-2.5 py-1 rounded-full">
            <Lock className="h-3 w-3 text-[#2F6B4F]" />
            <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-widest">Secured</span>
          </div>
          <a href="mailto:support@anveshakhub.com"
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-[#E2DCD2] text-xs font-bold text-[#57534E] hover:bg-[#FBF7F0] hover:text-[#FF5A36] transition-colors">
            <HelpCircle className="h-4 w-4" /> Help
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 py-12 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md">
          <div className="card-flat rounded-2xl shadow-lg overflow-hidden">

            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 border-b border-[#E2DCD2]">
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#78716A] hover:text-[#FF5A36] transition-colors mb-5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#FFF0ED] border border-blue-100 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-[#FF5A36]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A8A196] uppercase tracking-widest">Step 2 of 2 — Security</p>
                  <h1 className="text-lg font-black text-[#211F1D] tracking-tight">Two-Factor Authentication</h1>
                </div>
              </div>
              <p className="text-xs text-[#78716A] leading-relaxed">
                Your account requires additional verification. Choose your preferred method below.
              </p>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {pageState === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 13 }}
                      className="h-16 w-16 rounded-full bg-[#E8F2EC] border-2 border-[#BBD9C8] flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="h-8 w-8 text-[#2F6B4F]" />
                    </motion.div>
                    <h2 className="text-sm font-extrabold text-[#211F1D] mb-2">Identity Verified</h2>
                    <p className="text-xs text-[#78716A] leading-relaxed mb-4">Two-factor authentication passed. Redirecting to your dashboard…</p>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 text-[#FF5A36] animate-spin" />
                      <span className="text-[10px] font-bold text-[#FF5A36]">Loading workspace…</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                    {/* Method Selector */}
                    {!useRecovery && (
                      <div className="grid grid-cols-2 gap-2">
                        {(["authenticator", "email"] as TwoFAMethod[]).map(m => (
                          <button key={m} type="button"
                            onClick={() => { setMethod(m); setOtp(Array(6).fill("")); setHasError(false); setPageState("idle"); }}
                            className={[
                              "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-bold transition-all",
                              method === m
                                ? "border-[#FF5A36] bg-[#FFF0ED] text-[#FF5A36]"
                                : "border-[#E2DCD2] bg-[#FBF7F0] text-[#78716A] hover:border-[#D8D2C7] hover:bg-[#EFE9DF]"
                            ].join(" ")}
                          >
                            {m === "authenticator" ? <Smartphone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                            {m === "authenticator" ? "Authenticator App" : "Email OTP"}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Error Banner */}
                    <AnimatePresence>
                      {pageState === "error" && (
                        <motion.div initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="flex items-start gap-2.5 bg-[#FEE2E2] border border-[#FECACA] rounded-xl px-4 py-3">
                            <AlertCircle className="h-4 w-4 text-[#C0392B] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-red-800">Verification Failed</p>
                              <p className="text-[10px] text-[#C0392B] mt-0.5">The code you entered is incorrect or has expired. Please try again.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Method instruction */}
                    {!useRecovery && (
                      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl px-4 py-3">
                        <p className="text-[11px] text-[#57534E] leading-relaxed">
                          {method === "authenticator"
                            ? "Open your authenticator app (Google Authenticator, Authy, etc.) and enter the 6-digit code shown for AnveshakHub."
                            : "A 6-digit verification code has been sent to your registered organization email address."}
                        </p>
                      </div>
                    )}

                    {/* OTP or Recovery */}
                    {useRecovery ? (
                      <RecoveryCodeInput
                        value={recoveryCode} onChange={setRecoveryCode}
                        onSubmit={handleRecovery} disabled={isDisabled}
                      />
                    ) : (
                      <div>
                        <p className="text-[10px] font-bold text-[#A8A196] uppercase tracking-widest text-center mb-4">
                          Enter 6-Digit Code
                        </p>
                        <motion.div key={shakeKey} variants={shakeVariants}
                          animate={hasError ? "shake" : undefined}>
                          <OtpInput value={otp} onChange={v => { setOtp(v); setHasError(false); if (pageState === "error") setPageState("idle"); }}
                            disabled={isDisabled} hasError={hasError} />
                        </motion.div>

                        {/* Verify */}
                        <button type="button" onClick={handleVerify}
                          disabled={isDisabled || otp.join("").length !== 6}
                          className="mt-5 w-full h-12 flex items-center justify-center gap-2 bg-[#FF5A36] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[#FF5A36]/30">
                          {pageState === "verifying"
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                            : <><ShieldCheck className="h-4 w-4" /> Verify Identity</>}
                        </button>

                        {/* Resend (email only) */}
                        {method === "email" && (
                          <div className="mt-4 flex items-center justify-center gap-2">
                            {cooldown > 0 ? (
                              <div className="flex items-center gap-1.5 text-[10px] text-[#78716A] font-medium">
                                <Clock className="h-3.5 w-3.5" />
                                Resend in <span className="font-black text-[#FF5A36] tabular-nums">{cooldown}s</span>
                              </div>
                            ) : (
                              <button type="button" onClick={handleResend}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A36] hover:underline transition-colors">
                                <RefreshCw className="h-3.5 w-3.5" /> Resend Code
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Remember device */}
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberDevice(r => !r)}>
                      <div role="checkbox" aria-checked={rememberDevice}
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${rememberDevice ? "bg-[#FF5A36] border-[#FF5A36]" : "border-[#D8D2C7] bg-[#FBF7F0]"}`}>
                        {rememberDevice && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-xs text-[#57534E] font-medium select-none">
                        Trust this device for 30 days
                      </span>
                    </label>

                    {/* Toggle recovery / use 2FA */}
                    <button type="button" onClick={() => { setUseRecovery(r => !r); setHasError(false); setPageState("idle"); setOtp(Array(6).fill("")); }}
                      className="w-full text-xs font-bold text-[#78716A] hover:text-[#FF5A36] transition-colors flex items-center justify-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5" />
                      {useRecovery ? "Use authenticator code instead" : "Use a recovery code instead"}
                    </button>

                    {/* Future methods — collapsed */}
                    <div className="border-t border-[#E2DCD2] pt-4">
                      <button type="button" onClick={() => setShowFutureMethods(s => !s)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-[#A8A196] hover:text-[#57534E] transition-colors">
                        <span>Other Verification Methods</span>
                        {showFutureMethods ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                      <AnimatePresence>
                        {showFutureMethods && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 space-y-2">
                            {[
                              { icon: KeyRound, label: "Hardware Security Key (FIDO2 / WebAuthn)", tag: "Coming Soon" },
                              { icon: ShieldCheck, label: "Enterprise SSO / Identity Provider", tag: "Coming Soon" },
                              { icon: Smartphone, label: "Passkey (Biometric Authentication)", tag: "Future" }
                            ].map(({ icon: Icon, label, tag }) => (
                              <div key={label} className="flex items-center justify-between px-3 py-2.5 bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl opacity-60 cursor-not-allowed">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3.5 w-3.5 text-[#A8A196]" />
                                  <span className="text-[10px] font-bold text-[#78716A]">{label}</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#A8A196] bg-[#D8D2C7] border border-[#D8D2C7] px-1.5 py-0.5 rounded-full">{tag}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 py-4 bg-[#FBF7F0] border-t border-[#E2DCD2] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-[#A8A196]" />
                <span className="text-[10px] text-[#A8A196] font-medium">Session is end-to-end encrypted</span>
              </div>
              <Link href="/auth/login" className="text-[10px] font-bold text-[#78716A] hover:text-[#FF5A36] transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Login
              </Link>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-4 flex items-start gap-2 bg-[#FFF0ED]/60 border border-blue-100 rounded-xl px-4 py-3">
            <AlertCircle className="h-3.5 w-3.5 text-[#FF5A36] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#78716A] leading-relaxed">
              <span className="font-bold text-[#FF5A36]">Demo: </span>
              Enter <code className="bg-[#FBF7F0] border border-blue-100 px-1 rounded font-mono text-[#FF5A36]">123456</code> to verify. Any other code shows error state.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
