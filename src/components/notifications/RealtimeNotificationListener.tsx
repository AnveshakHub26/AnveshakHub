"use client";

import { useState, useCallback } from "react";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  category?: string;
  link?: string;
}

export function RealtimeNotificationListener({ userId }: { userId?: string }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const handleNotification = useCallback((payload: any) => {
    const newRecord = payload.new;
    if (!newRecord) return;

    const newToast: ToastNotification = {
      id: newRecord.id || String(Date.now()),
      title: newRecord.title || "New Notification",
      message: newRecord.message || "You have a new update in AnveshakHub",
      category: newRecord.category || "INFO",
      link: newRecord.link,
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  }, []);

  useSupabaseRealtime({
    table: "Notification",
    filter: userId ? `userId=eq.${userId}` : undefined,
    event: "INSERT",
    onData: handleNotification,
  });

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border border-slate-800"
          >
            <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0 mt-0.5">
              {toast.category === "CRITICAL" ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : toast.category === "SUCCESS" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Bell className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
