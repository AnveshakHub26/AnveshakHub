"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Check, RefreshCw, CheckCircle2, Clock, Calendar,
  Briefcase, DollarSign, Users, Loader2, BellOff, Sparkles,
  FileText, ShieldCheck, Star, MessageSquare, Zap
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  read: boolean;
  createdAt: string;
}

const CATEGORIES = ["ALL", "PROJECT", "APPLICATION", "MEETING", "PAYMENT", "SYSTEM"];

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PROJECT:     { label: "Project",     color: "#4338CA", bg: "#EEF2FF",  icon: Briefcase },
  APPLICATION: { label: "Application", color: "#FF5A36", bg: "#FFF0ED",  icon: FileText },
  MEETING:     { label: "Meeting",     color: "#2F6B4F", bg: "#E8F2EC",  icon: Calendar },
  PAYMENT:     { label: "Payment",     color: "#92400E", bg: "#FEF3C7",  icon: DollarSign },
  SYSTEM:      { label: "System",      color: "#57534E", bg: "#F5F0E8",  icon: Zap },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter });
      const res = await fetch(`/api/student/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_READ" })
      });
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "MARK_READ" })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {unreadCount > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF5A36] text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-[#211F1D]">Notifications</h1>
          <p className="text-sm text-[#78716A] mt-1">
            Stay on top of project updates, mentor messages, and payment alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="h-9 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-xl text-xs font-semibold hover:bg-[#EFE9DF] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="h-9 px-4 bg-[#211F1D] text-white rounded-xl text-xs font-bold hover:bg-[#3a3733] flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const meta = cat === "ALL" ? null : CATEGORY_META[cat];
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`h-8 px-4 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#211F1D] text-white shadow-sm"
                  : "bg-[#EFE9DF] text-[#57534E] hover:bg-[#E2DCD2]"
              }`}
            >
              {meta && <meta.icon className="h-3 w-3" />}
              {cat === "ALL" ? "All" : meta?.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-7 w-7 text-[#FF5A36] animate-spin" />
          <p className="text-xs text-[#78716A] font-semibold">Fetching updates…</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#EFE9DF] flex items-center justify-center">
            <BellOff className="h-7 w-7 text-[#A8A196]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#211F1D]">You're all caught up</p>
            <p className="text-xs text-[#78716A] mt-1">No new notifications in this category.</p>
          </div>
        </div>
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((n, idx) => {
              const meta = CATEGORY_META[n.category] || CATEGORY_META["SYSTEM"];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all group cursor-default ${
                    !n.read
                      ? "bg-[#FBF7F0] border-[#E2DCD2] shadow-sm"
                      : "bg-[#EFE9DF]/50 border-transparent"
                  }`}
                >
                  {/* Unread Dot */}
                  {!n.read && (
                    <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#FF5A36]" />
                  )}

                  {/* Icon */}
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: meta.bg }}
                  >
                    <Icon className="h-4 w-4" style={{ color: meta.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold leading-snug ${!n.read ? "text-[#211F1D]" : "text-[#57534E]"}`}>
                        {n.title}
                      </p>
                      <span
                        className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716A] mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#A8A196] font-semibold mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Mark Read Button */}
                  {!n.read && (
                    <button
                      onClick={() => handleMarkOne(n.id)}
                      className="absolute bottom-3 right-4 text-[10px] font-bold text-[#78716A] hover:text-[#FF5A36] transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-0.5"
                    >
                      <Check className="h-3 w-3" /> Mark read
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
