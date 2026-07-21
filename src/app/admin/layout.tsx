"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2, LayoutDashboard, Users, UsersRound, GraduationCap, Briefcase,
  Calendar, ShoppingBag, Landmark, Wallet, HardHat,
  LineChart, FolderSearch, ShieldAlert, FileSignature, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Search, HelpCircle, FileCode2,
  CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, X, ShieldCheck
} from "lucide-react";


// Sidebar Links
const sidebarLinks = [
  { href: "/admin/dashboard",            label: "Dashboard",           icon: LayoutDashboard },
  { href: "/admin/crm",                  label: "CRM Pipeline",        icon: Users },
  { href: "/admin/verification-center",  label: "Verification Center", icon: ShieldCheck },
  { href: "/admin/industries",           label: "Industry Partners",   icon: Building2 },
  { href: "/admin/experts",              label: "Subject Experts",     icon: UsersRound },
  { href: "/admin/students",             label: "Students Portal",     icon: GraduationCap },
  { href: "/admin/projects",             label: "Projects Control",    icon: Briefcase },
  { href: "/admin/meetings",             label: "Meeting Manager",     icon: Calendar },
  { href: "/admin/marketplace",          label: "B2B Marketplace",     icon: ShoppingBag },


  { href: "/admin/grants",               label: "Grants & Funding",    icon: Landmark },
  { href: "/admin/finance",              label: "Financial Mgmt",      icon: Wallet },


  { href: "/admin/hr",                  label: "HR Management",       icon: UsersRound },
  { href: "/admin/operations",           label: "System Operations",   icon: HardHat },
  { href: "/admin/reports",              label: "Reports & Center",    icon: LineChart },
  { href: "/admin/audit",                label: "Audit & Security",    icon: FolderSearch, comingSoon: true },
  { href: "/admin/settings",             label: "System Settings",     icon: Settings,     comingSoon: true },
  { href: "/admin/docs",                 label: "Developer Docs",      icon: FileCode2 },

];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Settings / State
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<"SUPER_ADMIN" | "CRM_SPECIALIST" | "STAKEHOLDER">("SUPER_ADMIN");
  
  // Notification menu state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Brute Force Warning", desc: "OpenSearch server utilization exceeded 85%.", read: false, type: "critical" },
    { id: "2", title: "Appeal Submitted", desc: "Solaris Power submitted a Verification appeal.", read: false, type: "action" },
    { id: "3", title: "Backup Sync Complete", desc: "Database snapshot synced with MinIO.", read: true, type: "info" }
  ]);

  // Global Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated Session Timeout State (Prompt warning after 30 seconds of load to make it interactive, in production it would be 15 mins)
  const [sessionTimeoutOpen, setSessionTimeoutOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60s warning countdown

  useEffect(() => {
    // Show Session Warning after 60 seconds
    const warningTimer = setTimeout(() => {
      setSessionTimeoutOpen(true);
    }, 60000);

    return () => clearTimeout(warningTimer);
  }, []);

  useEffect(() => {
    if (!sessionTimeoutOpen) return;
    if (timeLeft <= 0) {
      setSessionTimeoutOpen(false);
      router.push("/auth/login"); // Redirect to login on timeout
      return;
    }
    const cd = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(cd);
  }, [sessionTimeoutOpen, timeLeft, router]);

  const extendSession = () => {
    setSessionTimeoutOpen(false);
    setTimeLeft(60);
  };

  // RBAC Permission Guard Simulation
  // STAKEHOLDER role cannot view Admin sections
  const hasAccess = (() => {
    if (role === "SUPER_ADMIN") return true;
    if (role === "CRM_SPECIALIST" && pathname.includes("/admin/crm")) return true;
    if (role === "CRM_SPECIALIST" && pathname.includes("/admin/dashboard")) return true;
    return false;
  })();

  const handleRoleChange = (newRole: "SUPER_ADMIN" | "CRM_SPECIALIST" | "STAKEHOLDER") => {
    setRole(newRole);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* ── Collapsible Left Sidebar ── */}
      <aside className={[
        "bg-secondary border-r border-slate-700/30 flex flex-col transition-all duration-300 relative text-slate-300",
        collapsed ? "w-16" : "w-64"
      ].join(" ")}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700/30 gap-2 overflow-hidden shrink-0">
          <div className="bg-primary text-white p-1.5 rounded-lg shrink-0">
            <Building2 className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
              <span className="font-extrabold text-sm text-white tracking-tight leading-none block">AnveshakHub</span>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Control Center</span>
            </motion.div>
          )}
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <div key={link.label} className="relative group">
                <Link
                  href={link.comingSoon ? "#" : link.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-white/5 hover:text-white text-slate-400",
                    link.comingSoon ? "opacity-45 cursor-not-allowed" : ""
                  ].join(" ")}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </Link>
                {link.comingSoon && !collapsed && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] bg-slate-800 text-slate-400 border border-slate-700/40 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Soon
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapser controller button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 rounded-full h-6.5 w-6.5 flex items-center justify-center shadow-md z-20 outline-none"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* User profile widget at bottom */}
        <div className="p-3 border-t border-slate-700/30">
          <div className="flex items-center gap-3 overflow-hidden bg-white/5 border border-white/10 rounded-xl p-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
              {role === "SUPER_ADMIN" ? "SA" : role === "CRM_SPECIALIST" ? "CR" : "ST"}
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-white truncate leading-none">System Admin</p>
                <select
                  value={role}
                  onChange={e => handleRoleChange(e.target.value as any)}
                  className="bg-transparent border-0 text-[9px] text-slate-400 font-bold p-0 mt-1 outline-none select-none w-full block cursor-pointer hover:text-white"
                >
                  <option value="SUPER_ADMIN" className="bg-secondary text-slate-300 text-xs">Super Admin</option>
                  <option value="CRM_SPECIALIST" className="bg-secondary text-slate-300 text-xs">CRM Expert</option>
                  <option value="STAKEHOLDER" className="bg-secondary text-slate-300 text-xs">Stakeholder</option>
                </select>
              </motion.div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between shrink-0 shadow-sm">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Control Center</span>
            <span className="text-slate-300 text-xs">/</span>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </span>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-3">
            {/* Search Box Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="h-9 w-48 hidden md:flex items-center gap-2 px-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Universal Search…</span>
            </button>

            {/* Notification Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 relative"
                aria-label="System Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="text-xs font-extrabold text-secondary">System Alerts</span>
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          className="text-[9px] font-bold text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.map(n => (
                          <div key={n.id} className={["px-5 py-3.5", !n.read ? "bg-blue-50/20" : ""].join(" ")}>
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                {n.type === "critical" && <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                                {n.type === "action" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                {n.type === "info" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                {n.title}
                              </p>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Help Button */}
            <a
              href="mailto:support@anveshakhub.com"
              className="h-9 px-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </a>

            {/* Logout button */}
            <Link
              href="/auth/login"
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-red-55 border border-red-200 text-xs font-bold text-red-650 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Link>
          </div>
        </header>

        {/* ── Main Children Content Guarded by RBAC ── */}
        <main className="flex-grow flex flex-col min-w-0 relative">
          {hasAccess ? (
            children
          ) : (
            /* ── 403 Forbidden Screen ── */
            <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5 text-red-600">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h1 className="text-xl font-black text-secondary tracking-tight">403 — Unauthorized Access</h1>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your current profile role (<span className="font-bold text-slate-700">{role}</span>) lacks permissions to view this admin panel. 
                  Please request access authorization from your organization coordinator or switch your simulated role at the bottom-left profile block.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => handleRoleChange("SUPER_ADMIN")}
                    className="h-10 px-4 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Switch to Super Admin
                  </button>
                  <Link
                    href="/auth/login"
                    className="h-10 px-4 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center"
                  >
                    Go back
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-3.5 px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-450 shrink-0">
          <span>AnveshakHub Administration Interface. All systems operational.</span>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Charter</a>
            <span>·</span>
            <a href="#" className="hover:text-primary transition-colors">Acceptable Use Terms</a>
          </div>
        </footer>
      </div>

      {/* ── Global Search Modal ── */}
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-40 -translate-x-1/2 w-full max-w-lg focus:outline-none px-4"
            aria-describedby="global-search-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Search className="h-4.5 w-4.5 text-slate-400" />
                <input
                  id="global-search-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search organization, project, expert profile, or documents..."
                  className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Esc
                </button>
              </div>
              <div id="global-search-desc" className="px-5 py-4 max-h-60 overflow-y-auto bg-slate-50/50">
                {searchQuery ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</p>
                    {[
                      { type: "Organization", title: "Solaris Power Pvt Ltd", desc: "Energy & Infrastructure partner" },
                      { type: "Project", title: "Hypersonic Nozzle Research", desc: "Collaborative project with IIT Madras" },
                      { type: "Document", title: "Certificate of Incorporation.pdf", desc: "Pending verification check" }
                    ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                      <div key={item.title} className="p-3 bg-white border border-slate-200 rounded-xl hover:border-primary cursor-pointer transition-colors">
                        <span className="text-[9px] font-black uppercase text-primary tracking-wider">{item.type}</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">{item.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Type to search for assets across AnveshakHub...</p>
                )}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Session Timeout Warning Modal ── */}
      <Dialog.Root open={sessionTimeoutOpen} onOpenChange={setSessionTimeoutOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none px-4"
            aria-describedby="session-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <Dialog.Title className="text-sm font-extrabold text-secondary">Session Security Timeout</Dialog.Title>
              <p id="session-desc" className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                You have been inactive for a while. For secure access compliance, your administrator session will terminate automatically in{" "}
                <span className="font-black text-red-600 tabular-nums">{timeLeft} seconds</span>.
              </p>
              <div className="mt-5 flex gap-3 justify-center">
                <button
                  onClick={extendSession}
                  className="h-10 px-5 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Extend Session
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="h-10 px-5 border border-slate-205 text-slate-600 hover:bg-slate-55 rounded-lg text-xs font-bold transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
