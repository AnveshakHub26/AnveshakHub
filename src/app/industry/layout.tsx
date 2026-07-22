"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Building2, Briefcase, Calendar, ShoppingBag,
  Landmark, Bell, Settings, HelpCircle, LogOut, ChevronLeft,
  ChevronRight, Search, FileText, CheckCircle2
} from "lucide-react";

// ─── Sidebar Links ─────────────────────────────────────────────────
const sidebarLinks: { href: string; label: string; icon: React.ElementType; badge?: number }[] = [
  { href: "/industry/dashboard",      label: "Dashboard",           icon: LayoutDashboard },
  { href: "/industry/organization",   label: "My Organization",     icon: Building2 },
  { href: "/industry/projects",       label: "My Projects",         icon: Briefcase },
  { href: "/industry/meetings",       label: "Meetings",            icon: Calendar, badge: 3 },
  { href: "/industry/marketplace",    label: "Expert Marketplace",  icon: ShoppingBag },
  { href: "/industry/grants",         label: "Grants & Funding",    icon: Landmark },
  { href: "/industry/notifications",  label: "Notifications",       icon: Bell, badge: 5 },
  { href: "/industry/settings",       label: "Settings",            icon: Settings },
];

// ─── Industry Layout ───────────────────────────────────────────────
export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 232 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col bg-secondary border-r border-slate-700/30 shrink-0 overflow-hidden z-30 text-slate-300"
      >
        {/* Logo Block */}
        <div className="flex items-center px-4 py-0 h-16 border-b border-slate-700/30 overflow-hidden">
          <BrandLogo lightText size="sm" showText={!collapsed} />
        </div>

        {/* Org Context */}
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-3 border-b border-slate-700/30">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-2">
              <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black">SP</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-white truncate">Solaris Power Pvt Ltd</p>
                <p className="text-[8px] text-slate-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5 text-success" /> VERIFIED · DPIIT12345
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <div key={link.label} className="relative group">
                <Link
                  href={link.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-white/5 hover:text-white text-slate-400"
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate flex-1">{link.label}</span>}
                  {!collapsed && link.badge && (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[8px] font-black flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-700/30 p-3 space-y-0.5">
          <Link href="/industry/help" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Help & Support</span>}
          </Link>
          <Link href="/auth/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-error hover:bg-error-light/10 transition-all">
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-40 h-6 w-6 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-300 shadow-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Industry Portal</span>
            <span>/</span>
            <span className="capitalize font-semibold text-slate-600">
              {pathname.split("/").filter(Boolean).slice(1).join(" · ") || "Dashboard"}
            </span>
          </div>

          {/* Header right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                placeholder="Search projects, experts, grants…"
                className="pl-9 pr-3 h-8 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white w-56"
              />
            </div>

            {/* Notifications Bell */}
            <button className="relative h-8 w-8 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center">5</span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-[10px] font-black text-white">RS</span>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-slate-800">Rajesh Sharma</p>
                <p className="text-[8px] text-slate-500 font-semibold">Org Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-2 flex items-center justify-between text-[9px] text-slate-400 font-semibold shrink-0">
          <span>AnveshakHub Industry Portal · Solaris Power Pvt Ltd</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Charter</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
