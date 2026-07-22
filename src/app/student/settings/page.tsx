"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Settings, Shield, Lock, Bell, Eye, Save, Loader2,
  CheckCircle2, Globe, Moon, Sun
} from "lucide-react";

interface StudentSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  mfaEnabled: boolean;
  privacyMode: boolean;
  theme: string;
  defaultCurrency: string;
}

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<StudentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/settings");
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggleSetting = (key: keyof StudentSettings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      await fetchSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Account Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage security, two-factor authentication (2FA), directory privacy, and alert preferences</p>
        </div>
        <button onClick={handleSaveSettings} disabled={saving}
          className="h-8 px-4 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover flex items-center gap-1.5">
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Preferences
        </button>
      </div>

      <div className="space-y-6">
        {/* Security & Authentication */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" /> Security & 2FA Architecture
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                <p className="text-[10px] text-slate-400 font-semibold">Require TOTP authenticator code on student portal login</p>
              </div>
              <button
                onClick={() => handleToggleSetting("mfaEnabled")}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${settings.mfaEnabled ? "bg-primary" : "bg-slate-300"}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.mfaEnabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-bold text-slate-800">Directory Privacy Mode</p>
                <p className="text-[10px] text-slate-400 font-semibold">Hide phone & personal email from non-mentoring experts</p>
              </div>
              <button
                onClick={() => handleToggleSetting("privacyMode")}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${settings.privacyMode ? "bg-primary" : "bg-slate-300"}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.privacyMode ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Communication */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-primary" /> Notification Channels
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-bold text-slate-800">Email Notifications</p>
                <p className="text-[10px] text-slate-400 font-semibold">Receive emails for internship approvals & video meeting invites</p>
              </div>
              <button
                onClick={() => handleToggleSetting("emailAlerts")}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${settings.emailAlerts ? "bg-primary" : "bg-slate-300"}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.emailAlerts ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-bold text-slate-800">SMS Alerts</p>
                <p className="text-[10px] text-slate-400 font-semibold">Receive SMS reminders 15 minutes prior to scheduled review calls</p>
              </div>
              <button
                onClick={() => handleToggleSetting("smsAlerts")}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${settings.smsAlerts ? "bg-primary" : "bg-slate-300"}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.smsAlerts ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
