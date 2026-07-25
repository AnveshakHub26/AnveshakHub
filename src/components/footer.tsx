"use client";

import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0B0D10] text-[#6B7280] border-t border-[#1C1F23] font-sans pb-16 md:pb-0">
      
      {/* Upper Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-4 flex flex-col space-y-4 text-left">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToTop();
              }}
            >
              <BrandLogo lightText size="md" />
            </Link>
            <p className="text-xs leading-relaxed text-[#6B7280] max-w-sm mt-2 text-left">
              The enterprise collaboration platform connecting corporate funding and academic R&D pipelines under NDA governance.
            </p>
            
            {/* Contact details */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <MapPin className="h-4 w-4 shrink-0 text-[#818CF8]" />
                <span>Bangalore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Mail className="h-4 w-4 shrink-0 text-[#818CF8]" />
                <span>connect@anveshakhub.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="lg:col-span-2 text-left">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Company</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#818CF8] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/auth/role-selection" className="hover:text-[#818CF8] transition-colors">Role Selection</Link>
              </li>
              <li>
                <Link href="/admin/audit" className="hover:text-[#818CF8] transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#10B981]" />
                  Trust & NDA Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="lg:col-span-2 text-left">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Portals</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/auth/register/industry" className="hover:text-[#818CF8] transition-colors">Industry Portal</Link>
              </li>
              <li>
                <Link href="/auth/register/expert" className="hover:text-[#818CF8] transition-colors">Expert Directory</Link>
              </li>
              <li>
                <Link href="/auth/register/student" className="hover:text-[#818CF8] transition-colors">Student Internships</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="lg:col-span-2 text-left">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Resources</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-[#818CF8] transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <Link href="/health" className="hover:text-[#818CF8] transition-colors flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  System Health Probe
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div className="lg:col-span-2 text-left">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Legal</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/industry/legal" className="hover:text-[#818CF8] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/industry/legal" className="hover:text-[#818CF8] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/admin/legal" className="hover:text-[#818CF8] transition-colors">IP & NDA Governance</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1C1F23] bg-[#0B0D10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {currentYear} AnveshakHub Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-semibold text-[10px]">
              NestJS Microservices v1.0 Production
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
