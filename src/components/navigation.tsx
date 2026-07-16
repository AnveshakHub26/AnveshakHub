"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Activity, ArrowLeft } from "lucide-react";

interface NavigationProps {
  showBack?: boolean;
}

export default function Navigation({ showBack = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar plus some buffer
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
          : "bg-white border-b border-transparent"
      }`}
      style={{ height: "72px" }}
    >
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          {showBack && (
            <Link
              href="/"
              className="mr-3 inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Back to landing page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <Link
            href="/"
            onClick={(e) => {
              if (!showBack) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-secondary group-hover:text-primary transition-colors">
              Anveshak<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("about");
            }}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            About
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("how-it-works");
            }}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("features");
            }}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Solutions
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right Side: Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg bg-transparent hover:bg-primary hover:text-white transition-all duration-200"
          >
            Login
          </Link>
          <Link
            href="/auth/role-selection"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:scale-[1.03] hover:shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 gap-1.5"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hamburger Menu Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-primary hover:bg-slate-50 focus:outline-none transition-colors"
            aria-expanded={isOpen}
            aria-label="Toggle main menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-slate-200/80 shadow-lg py-4 px-6 flex flex-col space-y-4 animate-fade-in-up">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-base font-medium text-slate-700 hover:text-primary py-1 border-b border-slate-100 transition-colors"
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("about");
            }}
            className="text-base font-medium text-slate-700 hover:text-primary py-1 border-b border-slate-100 transition-colors"
          >
            About
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("how-it-works");
            }}
            className="text-base font-medium text-slate-700 hover:text-primary py-1 border-b border-slate-100 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("features");
            }}
            className="text-base font-medium text-slate-700 hover:text-primary py-1 border-b border-slate-100 transition-colors"
          >
            Solutions
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToSection("contact");
            }}
            className="text-base font-medium text-slate-700 hover:text-primary py-1 border-b border-slate-100 transition-colors"
          >
            Contact
          </a>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Login
            </Link>
            <Link
              href="/auth/role-selection"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
