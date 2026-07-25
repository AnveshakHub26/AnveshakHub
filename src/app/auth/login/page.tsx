"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Building2, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2,
  HelpCircle, ShieldCheck, Loader2, ArrowRight, Zap
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

// Rule #5 Human Error Messages
const errorMessages: Record<NonNullable<LoginError>, { title: string; message: string }> = {
  invalid_credentials: { title: "Incorrect Password or Email", message: "That email's already registered — try logging in instead or request a reset link." },
  account_locked:      { title: "Account Temporarily Locked",  message: "Too many failed attempts. We've sent a 1-click unlock link to your email." },
  not_verified:        { title: "Pending Verification",        message: "Your institution profile is being reviewed. Approval usually takes 24 hours." },
  network:             { title: "Connection Error",            message: "Unable to reach servers. Please check your internet connection." },
  server:              { title: "Server Error",                 message: "Something went wrong on our end. We're actively fixing it." }
};

// ─── Enterprise Warm Panel ─────────────────────────────────────────────────────
function EnterprisePanel() {
  return (
    <div className="hidden lg:flex flex-col w-[44%] bg-[#EFE9DF] border-r border-[#E2DCD2] min-h-screen relative overflow-hidden shrink-0">
      <div className="relative z-10 flex flex-col h-full px-10 py-10 justify-between text-left">
        <BrandLogo size="md" />

        <div className="my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF5A36] text-xs font-semibold border border-[#FF5A36]/30">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified R&D Platform
          </div>

          <h2 className="font-heading text-3xl font-extrabold text-[#211F1D] leading-tight">
            Direct Access to 1,200+ Corporate R&D Internships
          </h2>

          <p className="text-sm text-[#57534E] leading-relaxed max-w-sm">
            Sign in to review matched research proposals, check milestone statuses, or message corporate leads directly.
          </p>

          <div className="pt-4 border-t border-[#E2DCD2] space-y-3 text-xs text-[#211F1D]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2F6B4F]" />
              <span>100% NDA & IP Governed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#2F6B4F]" />
              <span>Direct Company Responses within 5-7 Days</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#78716A]">
          © {new Date().getFullYear()} AnveshakHub Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [loginError, setLoginError] = useState<LoginError>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (val: string): boolean => {
    if (!val) {
      setEmailError("Email address is required.");
      return false;
    }
    // Rule #5 Validation Error Message
    if (!val.includes("@")) {
      setEmailError("That doesn't look like a valid email — try your @university.edu address.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setLoginState("loading");
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setLoginState("success");
        setTimeout(() => {
          const role = data.user?.role || "STUDENT";
          if (role === "SUPER_ADMIN" || role === "ADMIN") router.push("/admin/dashboard");
          else if (role === "INDUSTRY") router.push("/industry/dashboard");
          else if (role === "EXPERT") router.push("/expert/dashboard");
          else router.push("/student/dashboard");
        }, 600);
      } else {
        setLoginState("error");
        setLoginError("invalid_credentials");
      }
    } catch {
      setLoginState("error");
      setLoginError("network");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex font-sans">
      <EnterprisePanel />

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-8 text-left">
          
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold text-[#211F1D]">Sign In to Your Account</h1>
            <p className="text-xs text-[#57534E]">
              Enter your corporate or institutional email to access your workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-4 bg-[#FFF0ED] border border-[#FF5A36]/30 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#FF5A36]">{errorMessages[loginError].title}</p>
                <p className="text-[#57534E]">{errorMessages[loginError].message}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#211F1D]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                  onBlur={() => validateEmail(email)}
                  placeholder="name@university.edu or name@company.com"
                  className="w-full bg-[#EFE9DF] border border-[#E2DCD2] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#211F1D] placeholder-[#78716A] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                />
              </div>
              {emailError && <p className="text-[11px] font-medium text-[#FF5A36] mt-1">{emailError}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#211F1D]">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold text-[#FF5A36] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#EFE9DF] border border-[#E2DCD2] rounded-lg pl-10 pr-10 py-2.5 text-xs text-[#211F1D] placeholder-[#78716A] focus:outline-none focus:border-[#FF5A36] min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716A] hover:text-[#211F1D]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginState === "loading"}
              className="btn-primary w-full text-xs font-bold py-3 shadow-md shadow-[#FF5A36]/20 min-h-[44px]"
            >
              {loginState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In to Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E2DCD2] text-center text-xs text-[#57534E]">
            Don't have an account yet?{" "}
            <Link href="/auth/role-selection" className="font-bold text-[#FF5A36] hover:underline">
              Select Your Role to Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
