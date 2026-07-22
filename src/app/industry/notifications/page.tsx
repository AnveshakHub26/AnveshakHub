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
  MEETINGS: <Calendar className="h-4 w-4 text-green-600" />,
  FINANCE:  <Wallet className="h-4 w-4 text-purple-600" />,
  LEGAL:    <Shield className="h-4 w-4 text-blue-600" />,
  PROJECTS: <Briefcase className="h-4 w-4 text-amber-600" />,
  INFO:     <Info className="h-4 w-4 text-slate-500" />
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
            <h1 className="text-xl font-bold text-slate-900">Notifications & Alerts Center</h1>
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time enterprise notifications for meetings, finance, legal agreements, and R&D milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllRead} className="h-8 px-3 inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </button>
          <button onClick={fetchNotifications} className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["ALL", "MEETINGS", "FINANCE", "LEGAL", "PROJECTS"].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`h-8 px-3.5 text-xs font-bold rounded-lg border transition-all ${
              categoryFilter === cat ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Bell className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-800">No Notifications</p>
          <p className="text-[10px] text-slate-400 mt-1">You are all caught up!</p>
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
                !n.read ? "bg-blue-50/40 border-blue-200 shadow-sm" : "bg-white border-slate-200"
              }`}
            >
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                {CATEGORY_ICONS[n.category] || CATEGORY_ICONS.INFO}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{n.category}</span>
                    <h3 className="text-xs font-bold text-slate-800">{n.title}</h3>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">{new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link href={n.link} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline pt-1">
                    View Context <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="h-7 w-7 rounded-lg border border-slate-200 hover:border-primary flex items-center justify-center text-slate-400 hover:text-primary shrink-0"
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
