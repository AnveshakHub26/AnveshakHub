"use client";

import Link from "next/link";
import { Mail, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
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
                <MapPin className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <span>connect@anveshakhub.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-blue-400 transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-blue-400 transition-colors">Press & News</Link>
              </li>
              <li>
                <Link href="/admin/audit" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Trust Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/auth/register/industry" className="hover:text-blue-400 transition-colors">Industries Portal</Link>
              </li>
              <li>
                <Link href="/auth/register/expert" className="hover:text-blue-400 transition-colors">Expert Directories</Link>
              </li>
              <li>
                <Link href="/industry/problem-statements" className="hover:text-blue-400 transition-colors">Research Projects</Link>
              </li>
              <li>
                <Link href="/admin/grants" className="hover:text-blue-400 transition-colors">Government Schemes</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/admin/docs" className="hover:text-blue-400 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/admin/operations" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/admin/legal" className="hover:text-blue-400 transition-colors">Legal & NDA Vault</Link>
              </li>
              <li>
                <Link href="/industry/support" className="hover:text-blue-400 transition-colors">Help Desk</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Engagement */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Engagement</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/auth/login" className="hover:text-blue-400 transition-colors">Enterprise Login</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-blue-400 transition-colors">Request Callback</Link>
              </li>
              <li>
                <Link href="/auth/register/industry" className="hover:text-blue-400 transition-colors">Partner Program</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Footer: Copyright & Legal */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} AnveshakHub Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/admin/legal" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/admin/legal" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/admin/legal" className="hover:text-slate-300 transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
