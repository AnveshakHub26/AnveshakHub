"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight, ArrowLeft, LayoutDashboard, LogOut, UserCheck } from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  showBack?: boolean;
}

export default function Navigation({ showBack = false }: NavigationProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth State
  const [userAuth, setUserAuth] = useState<{
    authenticated: boolean;
    role?: string;
    redirectUrl?: string;
    email?: string;
  }>({ authenticated: false });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch user session status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUserAuth({
            authenticated: true,
            role: data.user?.role,
            email: data.user?.email,
            redirectUrl: data.redirectUrl || "/student/dashboard",
          });
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUserAuth({ authenticated: false });
    router.push("/auth/login");
  };

  const handleScrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FBF7F0]/95 backdrop-blur-md border-b border-[#E2DCD2] shadow-[var(--shadow-sm)]"
            : "bg-[#FBF7F0] border-b border-[#E2DCD2]/60"
        }`}
        style={{ height: "72px" }}
      >
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                href="/"
                className="inline-flex items-center justify-center p-2 rounded-xl text-[#78716A] hover:text-[#211F1D] hover:bg-[#EFE9DF] transition-all"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <Link href="/" className="flex items-center gap-2 group">
              <BrandLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="text-sm font-semibold text-[#FF5A36]"
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("how-it-works");
              }}
              className="text-sm font-medium text-[#57534E] hover:text-[#211F1D] hover:scale-105 transform inline-block transition-all"
            >
              Workflow
            </a>
            <a
              href="#ecosystem"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("ecosystem");
              }}
              className="text-sm font-medium text-[#57534E] hover:text-[#211F1D] hover:scale-105 transform inline-block transition-all"
            >
              Ecosystem
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("features");
              }}
              className="text-sm font-medium text-[#57534E] hover:text-[#211F1D] hover:scale-105 transform inline-block transition-all"
            >
              Platform
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {userAuth.authenticated ? (
              <>
                <Link
                  href={userAuth.redirectUrl || "/student/dashboard"}
                  className="px-4 py-2 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold shadow-md shadow-[#FF5A36]/30 inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-xl border border-[#E2DCD2] hover:bg-[#EFE9DF] text-[#57534E] hover:text-[#211F1D] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[#57534E] hover:text-[#211F1D] px-4 py-2 rounded-xl hover:bg-[#EFE9DF] transition-all min-h-[40px] flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/role-selection"
                  className="btn-primary text-sm min-h-[44px] shadow-lg shadow-[#FF5A36]/20 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#57534E] hover:text-[#211F1D] hover:bg-[#EFE9DF] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed top-[72px] inset-x-0 bg-[#FBF7F0] border-b border-[#E2DCD2] z-40 px-6 py-6 space-y-4 shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              {userAuth.authenticated ? (
                <>
                  <Link
                    href={userAuth.redirectUrl || "/student/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-base font-bold text-[#FF5A36] py-2 border-b border-[#E2DCD2]"
                  >
                    <LayoutDashboard className="h-5 w-5" /> Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 text-base font-bold text-[#57534E] py-2 border-b border-[#E2DCD2] text-left"
                  >
                    <LogOut className="h-5 w-5" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-semibold text-[#211F1D] hover:text-[#FF5A36] py-2 transition-colors border-b border-[#E2DCD2]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/role-selection"
                    onClick={() => setIsOpen(false)}
                    className="text-base font-bold text-[#FF5A36] py-2 transition-colors flex items-center justify-between"
                  >
                    <span>Select Your Role</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
