"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bell, Check, RefreshCw, CheckCircle2, Clock, Calendar,
  Briefcase, DollarSign, Users, Loader2
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  read: boolean;
  createdAt: string;
}

export default function ExpertNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter });
      const res = await fetch(`/api/expert/notifications?${params}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
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
      await fetch("/api/expert/notifications", {
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
      await fetch("/api/expert/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_READ", id })
      });
      await fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#211F1D]">Notification Center</h1>
          <p className="text-xs text-[#78716A] mt-0.5">Real-time alerts for project approvals, video calls, mentee submissions & honorarium payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchNotifications} className="h-8 px-3 inline-flex items-center gap-1.5 border border-[#E2DCD2] text-[#57534E] rounded-lg text-xs font-medium hover:bg-[#EFE9DF]">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={handleMarkAllRead} className="h-8 px-3 inline-flex items-center gap-1.5 bg-[#FF5A36] text-white rounded-lg text-xs font-bold hover:bg-[#E04826]">
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E2DCD2] rounded-xl p-3 flex items-center gap-1.5">
        {[
          { key: "ALL", label: "All Alerts" },
          { key: "PROJECT", label: "Projects" },
          { key: "MEETING", label: "Meetings" },
          { key: "MENTORSHIP", label: "Mentorship" },
          { key: "FINANCE", label: "Finance" }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition-all ${
              categoryFilter === cat.key ? "bg-[#FF5A36] text-white border-[#FF5A36]" : "bg-[#FBF7F0] text-[#57534E] border-[#E2DCD2]"
            }`}
          >
            {cat.label}
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
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`border rounded-2xl p-4 flex items-start justify-between gap-4 transition-all ${
                n.read ? "bg-[#FBF7F0] border-[#E2DCD2]" : "bg-[#FFF0ED]/40 border-[#FFCFC4] shadow-[var(--shadow-sm)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  !n.read ? "bg-[#FF5A36] text-white" : "bg-[#EFE9DF] text-[#78716A]"
                }`}>
                  <Bell className="h-[1.125rem] w-[1.125rem]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFE9DF] text-[#211F1D] uppercase">{n.category}</span>
                    <h3 className="text-xs font-bold text-[#211F1D]">{n.title}</h3>
                  </div>
                  <p className="text-xs text-[#57534E] font-medium leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-[#A8A196] font-semibold pt-1">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>

              {!n.read && (
                <button onClick={() => handleMarkRead(n.id)} className="h-7 px-2.5 bg-[#EFE9DF] hover:bg-[#D8D2C7] text-[#57534E] rounded-lg text-[10px] font-bold shrink-0">
                  Mark Read
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
