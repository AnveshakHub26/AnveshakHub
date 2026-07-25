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

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_READ", id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#57534E] font-sans pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#EFE9DF] border-b border-[#E2DCD2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
                Realtime Activity Center
              </span>
              <h1 className="font-heading text-3xl font-extrabold text-[#211F1D] mt-1">
                Notifications & Stream
              </h1>
            </div>

            <div className="flex gap-3">
              <button onClick={handleMarkAllRead} className="btn-secondary text-xs min-h-[40px]">
                <Check className="h-4 w-4" /> Mark All Read
              </button>
              <button onClick={fetchNotifications} className="btn-primary text-xs min-h-[40px]">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 text-[#FF5A36] animate-spin mx-auto" />
            <p className="text-xs text-[#78716A] mt-2">Checking realtime notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          /* Specific Empty State Copy (Rule #5) */
          <div className="card-warm p-12 text-center bg-[#EFE9DF] space-y-3">
            <Bell className="h-10 w-10 text-[#FF5A36] mx-auto" />
            <h3 className="font-heading text-lg font-bold text-[#211F1D]">
              Nothing new yet — we'll ping you the second a recruiter responds.
            </h3>
            <p className="text-xs text-[#78716A] max-w-md mx-auto">
              Application reviews, meeting invites, and milestone updates will stream here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && handleMarkRead(n.id)}
                className={`card-warm p-5 rounded-xl border flex items-start justify-between gap-4 cursor-pointer transition-all ${
                  n.read ? "bg-[#EFE9DF] border-[#E2DCD2]" : "bg-[#FFF0ED] border-[#FF5A36]/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${n.read ? "bg-[#FBF7F0] text-[#78716A]" : "bg-[#FF5A36] text-white"}`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#211F1D]">{n.title}</h4>
                    <p className="text-xs text-[#57534E] mt-1">{n.message}</p>
                    <span className="text-[11px] text-[#78716A] mt-2 block">{n.createdAt}</span>
                  </div>
                </div>

                {!n.read && (
                  <span className="h-2 w-2 rounded-full bg-[#FF5A36] shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
