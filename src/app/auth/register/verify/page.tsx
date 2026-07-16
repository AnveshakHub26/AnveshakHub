"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Pencil
} from "lucide-react";


interface IndustryOnboardingData {
  orgName?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export default function OTPVerificationPage() {
  const router = useRouter();
  
  const [draft, setDraft] = useState<IndustryOnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(119); // 1:59
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Load draft data
  useEffect(() => {
    const saved = localStorage.getItem("anveshakhub_industry_onboarding");
    if (saved) {
      try {
        setDraft(JSON.parse(saved));
      } catch (_) {}
    }
    setLoading(false);
  }, []);

  // Redirect if no draft
  useEffect(() => {
    if (!loading && (!draft || (!draft.email && !draft.phone))) {
      router.push("/auth/register/industry");
    }
  }, [loading, draft, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isSuccess) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isSuccess]);

  // Masking helpers
  const maskEmail = (email?: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}*****${name[name.length - 1]}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "";
    const str = phone.replace(/[^0-9+]/g, "");
    if (str.length < 10) return phone;
    const last2 = str.slice(-2);
    const first5 = str.slice(0, Math.min(5, str.length - 2));
    return `${first5}${"*".repeat(str.length - first5.length - 2)}${last2}`;
  };

  const contactValue = draft?.email ? maskEmail(draft.email) : maskPhone(draft?.phone);
  const contactType = draft?.email ? "email address" : "phone number";

  // Format timer
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // OTP Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    
    setIsError(false);
    
    const newOtp = [...otp];
    // Take the last character in case they type fast
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      setIsError(false);
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;
    
    setIsError(false);
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(119);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
    setIsError(false);
  };

  const verifyOTP = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setIsError(true);
      return;
    }

    setIsVerifying(true);
    setIsError(false);
    
    // Simulate API verification
    setTimeout(() => {
      setIsVerifying(false);
      // Simulate: 123456 or 000000 = success for demo purposes
      if (code === "123456" || code === "000000") {
        // Clear the draft now that registration is complete
        localStorage.removeItem("anveshakhub_industry_onboarding");
        setIsSuccess(true);
        // Dashboard redirect will be implemented in future screens
      } else {
        setIsError(true);
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  // Loading state
  if (loading || !draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Lightweight Navigation */}
      <header className="absolute top-0 w-full z-40 bg-transparent py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group outline-none">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-sm text-secondary tracking-tight">AnveshakHub Secure</span>
          </Link>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">256-bit Encrypted</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-20 px-4 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Area */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-slate-50 relative">
              <button
                onClick={() => router.push("/auth/register/industry")}
                className="absolute left-6 top-6 h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 border border-blue-100 mb-5 mx-auto">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-black text-secondary tracking-tight">Identity Verification</h1>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[16rem] mx-auto">
                Enter the 6-digit security code sent to your organization's {contactType}.
              </p>
            </div>

            {/* Context Area */}
            <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sent to</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{contactValue}</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/auth/register/industry")}
                className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
              >
                <Pencil className="h-3 w-3" /> Change
              </button>
            </div>

            {/* OTP Form Area */}
            <div className="p-8">
              {!isSuccess ? (
                <>
                  <motion.div
                    animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex justify-between gap-2 mb-8"
                  >
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onPaste={handlePaste}
                        autoFocus={idx === 0}
                        className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 transition-all outline-none ${
                          isError 
                            ? "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                            : digit
                            ? "border-primary bg-blue-50/30 text-primary"
                            : "border-slate-200 bg-white text-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/20"
                        }`}
                      />
                    ))}
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 mb-6"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Incorrect security code. Please try again.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={verifyOTP}
                    disabled={isVerifying || otp.join("").length !== 6}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Identity...
                      </>
                    ) : (
                      "Verify Security Code"
                    )}
                  </button>

                  <div className="mt-6 text-center space-y-2">
                    <p className="text-xs text-slate-500 font-medium">Didn't receive the code?</p>
                    <button
                      onClick={handleResend}
                      disabled={timeLeft > 0}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        timeLeft > 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-primary hover:text-blue-700 hover:underline"
                      }`}
                    >
                      <RefreshCw className={`h-3 w-3 ${timeLeft > 0 ? "opacity-50" : ""}`} />
                      {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : "Resend OTP"}
                    </button>
                  </div>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-100 mb-6"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-lg font-black text-secondary tracking-tight">Identity Verified</h2>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[16rem] mx-auto">
                    Your {contactType} has been successfully verified. 
                    <br/><br/>
                    <span className="font-semibold text-slate-700">Ready for final registration processing.</span>
                  </p>
                  
                  {/* Note: Prompt states "Do NOT redirect to dashboard. Those screens will be implemented separately." */}
                </motion.div>
              )}
            </div>
            
            {/* Security Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <Lock className="h-3 w-3" /> Secure Gateway
              </div>
              <Link href="/" className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                <HelpCircle className="h-3 w-3" /> Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
