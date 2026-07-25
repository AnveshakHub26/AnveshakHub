"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ArrowLeft, Home, Building2, UserCheck, GraduationCap, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

interface NavigationProps {
  showBack?: boolean;
}

export default function Navigation({ showBack = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Top Header Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B0D10]/95 backdrop-blur-md border-b border-[#1C1F23] shadow-lg shadow-black/20"
            : "bg-[#0B0D10] border-b border-[#1C1F23]/60"
        }`}
        style={{ height: "72px" }}
      >
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {showBack && (
              <Link
                href="/"
                className="mr-3 inline-flex items-center justify-center p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1C1F23] transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm font-medium text-[#FAF8F5]/80 hover:text-white transition-colors"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("about");
              }}
              className="text-sm font-medium text-[#6B7280] hover:text-[#FAF8F5] transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("features");
              }}
              className="text-sm font-medium text-[#6B7280] hover:text-[#FAF8F5] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("how-it-works");
              }}
              className="text-sm font-medium text-[#6B7280] hover:text-[#FAF8F5] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#ecosystem"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("ecosystem");
              }}
              className="text-sm font-medium text-[#6B7280] hover:text-[#FAF8F5] transition-colors"
            >
              Ecosystem
            </a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-[#D1D5DB] hover:text-white px-4 py-2 rounded-lg hover:bg-[#1C1F23] transition-colors active:scale-95 min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/auth/role-selection"
              className="btn-primary text-sm px-5 py-2.5 shadow-md shadow-[#4338CA]/30 min-h-[44px]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/auth/role-selection"
              className="btn-primary text-xs px-3.5 py-2 rounded-md min-h-[44px]"
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#1C1F23] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isOpen && (
          <div className="md:hidden bg-[#0B0D10] border-b border-[#1C1F23] px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#FAF8F5] hover:bg-[#1C1F23]"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("about");
              }}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#6B7280] hover:text-white hover:bg-[#1C1F23]"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection("how-it-works");
              }}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#6B7280] hover:text-white hover:bg-[#1C1F23]"
            >
              How It Works
            </a>
            <div className="pt-2 border-t border-[#1C1F23] flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-lg text-sm font-bold text-white bg-[#1C1F23] border border-[#3A3F45]"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Structural Bottom Navigation Tab Bar (Rule #3) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0D10]/95 backdrop-blur-lg border-t border-[#1C1F23] px-6 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[#4338CA] min-h-[44px] justify-center"
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link
          href="/auth/role-selection?role=INDUSTRY"
          className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#FAF8F5] min-h-[44px] justify-center"
        >
          <Building2 className="h-5 w-5" />
          <span className="text-[10px] font-medium">Industry</span>
        </Link>
        <Link
          href="/auth/role-selection?role=EXPERT"
          className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#FAF8F5] min-h-[44px] justify-center"
        >
          <UserCheck className="h-5 w-5" />
          <span className="text-[10px] font-medium">Expert</span>
        </Link>
        <Link
          href="/auth/role-selection?role=STUDENT"
          className="flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#FAF8F5] min-h-[44px] justify-center"
        >
          <GraduationCap className="h-5 w-5" />
          <span className="text-[10px] font-medium">Student</span>
        </Link>
      </div>
    </>
  );
}
