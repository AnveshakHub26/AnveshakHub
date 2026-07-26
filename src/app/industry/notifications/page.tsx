"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bell, Check, RefreshCw, CheckCircle2, Shield, Calendar,
  Wallet, Briefcase, Info, Loader2, ExternalLink
} from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  read: boolean;
  link: string | null;
  channel: string;
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  MEETINGS: <Calendar className="h-4 w-4 text-[#2F6B4F]" />,
  FINANCE:  <Wallet className="h-4 w-4 text-purple-600" />,
  LEGAL:    <Shield className="h-4 w-4 text-[#FF5A36]" />,
  PROJECTS: <Briefcase className="h-4 w-4 text-amber-600" />,
  INFO:     <Info className="h-4 w-4 text-[#78716A]" />
};

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter });
      const res = await fetch(`/api/industry/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/industry/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_READ" })
      });
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/industry/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#211F1D]">Notifications & Alerts Center</h1>
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FEE2E2]0 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#78716A] mt-0.5">Real-time enterprise notifications for meetings, finance, legal agreements, and R&D milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllRead} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-semibold hover:bg-[#EFE9DF]">
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </button>
          <button onClick={fetchNotifications} className="h-8 w-8 rounded-lg border border-[#E2DCD2] flex items-center justify-center text-[#78716A] hover:text-[#211F1D]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2DCD2] pb-3">
        {["ALL", "MEETINGS", "FINANCE", "LEGAL", "PROJECTS"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`h-8 px-3.5 text-xs font-bold rounded-lg border transition-all ${
              categoryFilter === cat ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2] hover:bg-[#EFE9DF]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5A36]" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-flat rounded-2xl p-12 text-center">
          <Bell className="h-10 w-10 text-[#D8D2C7] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#211F1D]">No Notifications</p>
          <p className="text-[10px] text-[#A8A196] mt-1">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`border rounded-2xl p-4 flex items-start gap-4 transition-all ${
                !n.read ? "bg-[#FFF0ED]/40 border-[#FFCFC4] shadow-[var(--shadow-sm)]" : "bg-[#FBF7F0] border-[#E2DCD2]"
              }`}
            >
              <div className="h-9 w-9 rounded-xl bg-[#FBF7F0] border border-[#E2DCD2] flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
                {CATEGORY_ICONS[n.category] || CATEGORY_ICONS.INFO}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D]">{n.category}</span>
                    <h3 className="text-xs font-bold text-[#211F1D]">{n.title}</h3>
                  </div>
                  <span className="text-[10px] text-[#A8A196] font-semibold">{new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-[10px] text-[#57534E] font-medium leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5A36] hover:underline pt-1">
                    View Context <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="h-7 w-7 rounded-lg border border-[#E2DCD2] hover:border-[#FF5A36] flex items-center justify-center text-[#A8A196] hover:text-[#FF5A36] shrink-0"
                  title="Mark as Read"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
