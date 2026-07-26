"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Building2, LayoutDashboard, Users, UsersRound, GraduationCap, Briefcase,
  Calendar, ShoppingBag, Landmark, Wallet, HardHat,
  LineChart, FolderSearch, ShieldAlert, FileSignature, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Search, HelpCircle, FileCode2,
  CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, X, ShieldCheck, Zap,
  Menu
} from "lucide-react";

// ─── Sidebar Navigation Definition ─────────────────────────────────
const CORE_LINKS = [
  { href: "/admin/dashboard",           label: "Dashboard",          icon: LayoutDashboard },
  { href: "/admin/crm",                 label: "CRM Pipeline",       icon: Users },
  { href: "/admin/verification-center", label: "Verification",       icon: ShieldCheck },
];

const PLATFORM_LINKS = [
  { href: "/admin/industries",          label: "Industry Partners",  icon: Building2 },
  { href: "/admin/experts",             label: "Subject Experts",    icon: UsersRound },
  { href: "/admin/students",            label: "Students",           icon: GraduationCap },
  { href: "/admin/projects",            label: "Projects",           icon: Briefcase },
  { href: "/admin/meetings",            label: "Meetings",           icon: Calendar },
  { href: "/admin/marketplace",         label: "B2B Marketplace",    icon: ShoppingBag },
];

const FINANCE_LINKS = [
  { href: "/admin/grants",              label: "Grants & Funding",   icon: Landmark },
  { href: "/admin/finance",             label: "Finance",            icon: Wallet },
  { href: "/admin/hr",                  label: "HR",                 icon: UsersRound },
];

const SYSTEM_LINKS = [
  { href: "/admin/operations",          label: "Operations",         icon: HardHat },
  { href: "/admin/reports",             label: "Reports",            icon: FileCode2 },
  { href: "/admin/analytics",           label: "Analytics",          icon: LineChart },
  { href: "/admin/legal",               label: "Legal & Vault",      icon: FileSignature },
  { href: "/admin/notifications",       label: "Notifications",      icon: Bell },
  { href: "/admin/ai-insights",         label: "AI Insights",        icon: Zap },
  { href: "/admin/audit",               label: "Audit & Security",   icon: FolderSearch },
  { href: "/admin/settings",            label: "Settings",           icon: Settings },
  { href: "/admin/docs",                label: "Dev Docs",           icon: FileCode2 },
];

// ─── NavSection component ────────────────────────────────────────────
function NavSection({
  label,
  links,
  pathname,
  collapsed,
}: {
  label: string;
  links: { href: string; label: string; icon: any }[];
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="sidebar-nav-group-label">{label}</p>
      )}
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.label}
            title={collapsed ? link.label : undefined}
            className={`sidebar-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon className="h-[1.0625rem] w-[1.0625rem] shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<"SUPER_ADMIN" | "CRM_SPECIALIST" | "STAKEHOLDER">("SUPER_ADMIN");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", title: "High CPU on OpenSearch node", desc: "Utilization hit 85% — auto-scaled 1 replica.", read: false, type: "critical" },
    { id: "2", title: "Solaris Power appeal filed", desc: "Verification appeal submitted for review.", read: false, type: "action" },
    { id: "3", title: "DB snapshot completed", desc: "MinIO backup sync successful at 02:00 UTC.", read: true, type: "info" },
  ]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionTimeoutOpen, setSessionTimeoutOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Session timeout
  useEffect(() => {
    const t = setTimeout(() => setSessionTimeoutOpen(true), 60000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sessionTimeoutOpen) return;
    if (timeLeft <= 0) { router.push("/auth/login"); return; }
    const cd = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(cd);
  }, [sessionTimeoutOpen, timeLeft, router]);

  const extendSession = () => { setSessionTimeoutOpen(false); setTimeLeft(60); };

  // RBAC guard
  const hasAccess = (() => {
    if (role === "SUPER_ADMIN") return true;
    if (role === "CRM_SPECIALIST" && (pathname.includes("/admin/crm") || pathname.includes("/admin/dashboard"))) return true;
    return false;
  })();

  const unread = notifications.filter((n) => !n.read).length;

  // Sidebar rendering (shared between desktop and mobile drawer)
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      style={{ backgroundColor: "var(--bg-sidebar)" }}
      className={[
        "flex flex-col h-full border-r transition-all duration-300",
        "border-white/5",
        isMobile ? "w-64" : collapsed ? "w-16" : "w-64",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-4 shrink-0 border-b border-white/5">
        {!collapsed || isMobile ? (
          <BrandLogo lightText size="sm" />
        ) : (
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center font-heading font-extrabold text-xs"
            style={{ backgroundColor: "var(--brand)", color: "#fff" }}
          >
            A
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        <NavSection label="Core" links={CORE_LINKS} pathname={pathname} collapsed={collapsed && !isMobile} />
        <NavSection label="Platform" links={PLATFORM_LINKS} pathname={pathname} collapsed={collapsed && !isMobile} />
        <NavSection label="Finance" links={FINANCE_LINKS} pathname={pathname} collapsed={collapsed && !isMobile} />
        <NavSection label="System" links={SYSTEM_LINKS} pathname={pathname} collapsed={collapsed && !isMobile} />
      </nav>

      {/* User Widget */}
      <div className="px-2 pb-3 pt-2 border-t border-white/5">
        <div
          className="flex items-center gap-2.5 rounded-lg p-2 overflow-hidden"
          style={{ backgroundColor: "var(--bg-sidebar-hover)" }}
        >
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0"
            style={{ backgroundColor: "var(--brand)", color: "#fff" }}
          >
            {role === "SUPER_ADMIN" ? "SA" : role === "CRM_SPECIALIST" ? "CR" : "ST"}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold truncate" style={{ color: "var(--text-inverse)" }}>
                System Admin
              </p>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-transparent border-0 text-[10px] font-medium p-0 outline-none w-full cursor-pointer"
                style={{ color: "#6B6560" }}
              >
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="CRM_SPECIALIST">CRM Specialist</option>
                <option value="STAKEHOLDER">Stakeholder</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-[4.5rem] z-20 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--bg-sidebar)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#6B6560",
          }}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-app)" }}>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex relative flex-shrink-0" style={{ position: "sticky", top: 0, height: "100vh" }}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <SidebarContent isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top Header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shrink-0"
          style={{
            height: "3.5rem",
            backgroundColor: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Left: Mobile menu + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden btn-ghost btn-sm !px-2 !min-h-[36px]"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <nav className="flex items-center gap-2 text-xs" aria-label="Breadcrumb">
              <span style={{ color: "var(--text-subtle)" }}>Admin</span>
              <span style={{ color: "var(--border-strong)" }}>/</span>
              <span className="font-semibold capitalize" style={{ color: "var(--text-heading)" }}>
                {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
              </span>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 text-xs font-medium rounded-lg px-3 py-2 transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                minHeight: "36px",
              }}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd
                className="ml-1 text-[10px] font-bold px-1 rounded"
                style={{ backgroundColor: "var(--border)", color: "var(--text-muted)" }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={`${unread} system notifications`}
                className="relative flex items-center justify-center rounded-lg transition-colors"
                style={{
                  width: "36px", height: "36px",
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span
                    className="absolute top-1 right-1 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--brand)" }}
                  />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl overflow-hidden z-50"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-4 py-3 border-b"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                      >
                        <span className="text-xs font-bold" style={{ color: "var(--text-heading)" }}>
                          System Alerts
                        </span>
                        <button
                          onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))}
                          className="text-[10px] font-semibold link-inline"
                          style={{ color: "var(--brand)" }}
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className="px-4 py-3 border-b flex gap-3"
                            style={{
                              borderColor: "var(--border)",
                              backgroundColor: !n.read ? "var(--brand-subtle)" : "transparent",
                            }}
                          >
                            <div className="mt-0.5 shrink-0">
                              {n.type === "critical" && <AlertCircle className="h-4 w-4" style={{ color: "var(--danger)" }} />}
                              {n.type === "action" && <AlertTriangle className="h-4 w-4" style={{ color: "var(--warning)" }} />}
                              {n.type === "info" && <CheckCircle2 className="h-4 w-4" style={{ color: "var(--success)" }} />}
                            </div>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: "var(--text-heading)" }}>{n.title}</p>
                              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{n.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Out */}
            <Link
              href="/auth/login"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-colors link-inline"
              style={{
                backgroundColor: "var(--danger-subtle)",
                color: "var(--danger)",
                border: "1px solid var(--danger-border)",
                minHeight: "36px",
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow flex flex-col min-w-0">
          {hasAccess ? (
            children
          ) : (
            <div
              className="flex-grow flex items-center justify-center p-8"
              style={{ backgroundColor: "var(--bg-app)" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full card-flat p-8 text-center"
              >
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "var(--danger-subtle)", color: "var(--danger)" }}
                >
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h1 className="text-xl font-extrabold" style={{ color: "var(--text-heading)" }}>
                  Access Restricted
                </h1>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Your current role (<strong style={{ color: "var(--text-heading)" }}>{role}</strong>) doesn't have permission
                  to view this section. Switch to Super Admin or contact your platform coordinator.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={() => setRole("SUPER_ADMIN")}
                    className="btn-primary btn-sm"
                  >
                    Switch to Super Admin
                  </button>
                  <Link href="/auth/login" className="btn-secondary btn-sm">
                    Sign out
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 text-[11px] font-medium shrink-0"
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-subtle)",
          }}
        >
          <span>AnveshakHub Admin — All systems operational</span>
          <div className="flex gap-4 mt-1 sm:mt-0">
            <a href="#" className="hover:underline link-inline" style={{ color: "inherit" }}>Privacy</a>
            <a href="#" className="hover:underline link-inline" style={{ color: "inherit" }}>Terms</a>
          </div>
        </footer>
      </div>

      {/* Global Search Modal */}
      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(33,31,29,0.5)", backdropFilter: "blur(4px)" }}
          />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-32 -translate-x-1/2 w-full max-w-xl px-4 focus:outline-none"
            aria-describedby="search-hint"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search organization, project, expert, or document…"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--text-heading)" }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs font-semibold link-inline"
                  style={{ color: "var(--text-muted)" }}
                >
                  Esc
                </button>
              </div>
              <div id="search-hint" className="px-4 py-5 max-h-72 overflow-y-auto">
                {searchQuery ? (
                  <div className="space-y-2">
                    {[
                      { type: "Organization", title: "Solaris Power Pvt Ltd", desc: "Energy & Infrastructure partner" },
                      { type: "Project", title: "Hypersonic Nozzle Research", desc: "Collaborative project with IIT Madras" },
                      { type: "Document", title: "Certificate of Incorporation.pdf", desc: "Pending verification" },
                    ]
                      .filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => (
                        <button
                          key={item.title}
                          className="w-full text-left p-3 rounded-xl transition-colors"
                          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                        >
                          <span className="badge-ember badge" style={{ marginBottom: "0.25rem" }}>{item.type}</span>
                          <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-heading)" }}>{item.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                        </button>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
                    Type to search across AnveshakHub
                  </p>
                )}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Session Timeout */}
      <Dialog.Root open={sessionTimeoutOpen} onOpenChange={setSessionTimeoutOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(33,31,29,0.5)", backdropFilter: "blur(4px)" }}
          />
          <Dialog.Content
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 focus:outline-none"
            aria-describedby="session-desc"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-2xl shadow-2xl p-8 text-center"
              style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "var(--warning-subtle)", color: "var(--warning)" }}
              >
                <AlertTriangle className="h-7 w-7" />
              </div>
              <Dialog.Title className="text-base font-extrabold" style={{ color: "var(--text-heading)" }}>
                Session Expiring Soon
              </Dialog.Title>
              <p id="session-desc" className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Your admin session will end in{" "}
                <span className="font-bold tabular-nums" style={{ color: "var(--danger)" }}>
                  {timeLeft}s
                </span>{" "}
                due to inactivity.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button onClick={extendSession} className="btn-primary">
                  <RefreshCw className="h-4 w-4" />
                  Stay Signed In
                </button>
                <button onClick={() => router.push("/auth/login")} className="btn-secondary">
                  Sign Out
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
