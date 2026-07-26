"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Calendar, Bell, Settings,
  LogOut, ChevronLeft, ChevronRight, Search, Users,
  BookOpen, FileText, TrendingUp, Menu, Star
} from "lucide-react";

const NAV_LINKS = [
  { href: "/expert/dashboard",      label: "Dashboard",    icon: LayoutDashboard },
  { href: "/expert/opportunities",  label: "Opportunities", icon: Search },
  { href: "/expert/projects",       label: "My Projects",  icon: Briefcase },
  { href: "/expert/students",       label: "My Students",  icon: Users },
  { href: "/expert/meetings",       label: "Meetings",     icon: Calendar, badge: 2 },
  { href: "/expert/documents",      label: "Documents",    icon: FileText },
  { href: "/expert/finance",        label: "Finance",      icon: TrendingUp },
  { href: "/expert/analytics",      label: "Analytics",    icon: TrendingUp },
  { href: "/expert/notifications",  label: "Notifications", icon: Bell, badge: 4 },
  { href: "/expert/profile",        label: "Profile",      icon: Star },
  { href: "/expert/settings",       label: "Settings",     icon: Settings },
];

const BOTTOM_NAV = [
  { href: "/expert/dashboard",     label: "Home",     icon: LayoutDashboard },
  { href: "/expert/projects",      label: "Projects", icon: Briefcase },
  { href: "/expert/students",      label: "Students", icon: Users },
  { href: "/expert/notifications", label: "Alerts",   icon: Bell },
  { href: "/expert/profile",       label: "Profile",  icon: Star },
];

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
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
        <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand" : "Collapse"}
          className="absolute -right-3.5 top-[4.5rem] z-20 h-7 w-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-sidebar)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B6560" }}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
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
          <Link href="/expert/notifications" className="btn-ghost btn-sm !px-2 !min-h-[36px]">
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
