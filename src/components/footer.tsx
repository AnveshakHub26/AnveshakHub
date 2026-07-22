"use client";

import Link from "next/link";
import { Activity, Mail, MapPin } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-secondary text-slate-300 border-t border-slate-800">
      
      {/* Upper Footer: Branding and Sitemap */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToTop();
              }}
            >
              <BrandLogo lightText size="md" />
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm mt-2">
              The secure, enterprise-grade collaboration platform bridging corporate funding and academic research pipelines under NDA protection.
            </p>
            
            {/* Contact details */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <span>connect@anveshakhub.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Press & News</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Trust Center</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/auth/role-selection" className="hover:text-primary transition-colors">Industries Portal</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-primary transition-colors">Expert Directories</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-primary transition-colors">Research Projects</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-primary transition-colors">Government Schemes</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">System Status</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Legal & NDA Vault</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Help Desk</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Link */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Engagement</h3>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Enterprise Sales</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Request Callback</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Partner Program</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Footer: Metadata, Social, and Copyright */}
      <div className="bg-slate-950 border-t border-slate-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright details */}
          <div className="text-[11px] text-slate-500 font-medium">
            &copy; {currentYear} Anveshak Hub Private Limited. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-350 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-350 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-350 transition-colors">Security Disclosure</Link>
            <Link href="/" className="hover:text-slate-350 transition-colors">Cookie Settings</Link>
          </div>

          {/* Social icons */}
          <div className="flex gap-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-550 hover:text-white transition-colors"
              aria-label="Twitter Profile"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-550 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-555 hover:text-white transition-colors"
              aria-label="LinkedIn Company Page"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
              </svg>
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
