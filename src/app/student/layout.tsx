"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Calendar, Bell, Settings,
  LogOut, Search, BookOpen, FileText, TrendingUp, Menu,
  GraduationCap, CheckCircle2
} from "lucide-react";

const NAV_LINKS = [
  { href: "/student/dashboard",      label: "Dashboard",     icon: LayoutDashboard },
  { href: "/student/opportunities",   label: "Opportunities", icon: Search },
  { href: "/student/projects",        label: "My Projects",   icon: Briefcase },
  { href: "/student/meetings",        label: "Meetings",      icon: Calendar, badge: 2 },
  { href: "/student/documents",       label: "Documents",     icon: FileText },
  { href: "/student/learning",        label: "Learning",      icon: BookOpen },
  { href: "/student/progress",        label: "Progress",      icon: TrendingUp },
  { href: "/student/analytics",       label: "Analytics",     icon: TrendingUp },
  { href: "/student/notifications",   label: "Notifications", icon: Bell, badge: 3 },
  { href: "/student/profile",         label: "Profile",       icon: GraduationCap },
  { href: "/student/settings",        label: "Settings",      icon: Settings },
];

const BOTTOM_NAV = [
  { href: "/student/dashboard",      label: "Home",         icon: LayoutDashboard },
  { href: "/student/opportunities",  label: "Explore",      icon: Search },
  { href: "/student/projects",       label: "Projects",     icon: Briefcase },
  { href: "/student/notifications",  label: "Alerts",       icon: Bell },
  { href: "/student/profile",        label: "Profile",      icon: GraduationCap },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const SidebarInner = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className="flex flex-col h-full border-r"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderColor: "rgba(255,255,255,0.06)",
        width: mobile ? 240 : collapsed ? 68 : 240,
      }}
    >
      <div className="h-14 flex items-center px-4 shrink-0 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {!collapsed || mobile
          ? <BrandLogo lightText size="sm" />
          : <div className="h-7 w-7 rounded-lg flex items-center justify-center font-heading font-extrabold text-xs" style={{ backgroundColor: "var(--brand)", color: "#fff" }}>A</div>
        }
      </div>

      {/* Student Badge */}
      {(!collapsed || mobile) && (
        <div className="mx-2 mt-3 mb-1 p-2 rounded-lg" style={{ backgroundColor: "var(--bg-sidebar-hover)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-black shrink-0" style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
              AK
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold truncate" style={{ color: "var(--text-inverse)" }}>Aditya Kumar</p>
              <p className="text-[10px] flex items-center gap-1" style={{ color: "#6B6560" }}>
                <CheckCircle2 className="h-2.5 w-2.5" style={{ color: "var(--success)" }} />
                Student · RV College of Engg
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} aria-label={link.label}
              title={collapsed && !mobile ? link.label : undefined}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="h-[1.0625rem] w-[1.0625rem] shrink-0" />
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1 truncate">{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", paddingTop: "0.5rem" }}>
        <Link href="/auth/login" className="sidebar-nav-item">
          <LogOut className="h-[1.0625rem] w-[1.0625rem] shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </Link>
      </div>

      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand" : "Collapse"}
          className="absolute -right-3.5 top-[4.5rem] z-20 h-7 w-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-sidebar)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B6560" }}
        >
          {collapsed
            ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          }
        </button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-app)" }}>
      <div className="hidden md:flex relative flex-shrink-0" style={{ position: "sticky", top: 0, height: "100vh" }}>
        <SidebarInner />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 left-0 z-50 md:hidden">
              <SidebarInner mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <button onClick={() => setMobileOpen(true)} className="btn-ghost btn-sm !px-2 !min-h-[36px]" aria-label="Open menu">
            <Menu className="h-4 w-4" />
          </button>
          <BrandLogo size="sm" />
          <Link href="/student/notifications" className="btn-ghost btn-sm !px-2 !min-h-[36px]">
            <Bell className="h-4 w-4" />
          </Link>
        </div>
        <main className="flex-1">{children}</main>
      </div>

      <nav className="mobile-bottom-nav">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive ? "active" : ""}`}>
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
