"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Settings, Shield, Lock, Bell, Eye, Save, Loader2,
  CheckCircle2, Globe, Moon, Sun, User, Phone, Mail, Key
} from "lucide-react";

interface StudentSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  mfaEnabled: boolean;
  privacyMode: boolean;
  theme: string;
  defaultCurrency: string;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>{label}</p>
      </div>
      <div className="relative shrink-0" style={{ width: "2.5rem", height: "1.375rem" }}>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" aria-label={label} />
        <div
          className="absolute inset-0 rounded-full transition-colors duration-200"
          style={{ backgroundColor: checked ? "var(--brand)" : "var(--border-muted)" }}
        />
        <div
          className="absolute top-0.5 left-0.5 h-[1.0625rem] w-[1.0625rem] bg-[#FBF7F0] rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(1.125rem)" : "translateX(0)" }}
        />
      </div>
    </label>
  );
}

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<StudentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const toggle = (key: keyof StudentSettings) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/student/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--bg-app)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="spinner" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading account settings…</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const SECTIONS = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      items: [
        { key: "emailAlerts", label: "Email Alerts", desc: "Receive application updates, meeting invites, and milestone alerts via email." },
        { key: "smsAlerts", label: "SMS Alerts", desc: "Get urgent application status changes via SMS." },
      ],
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      items: [
        { key: "mfaEnabled", label: "Two-Factor Authentication (2FA)", desc: "Protect your account with an authenticator app or SMS OTP." },
      ],
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Eye,
      items: [
        { key: "privacyMode", label: "Private Profile", desc: "Hide your profile from industry search results. Recruiters won't see you." },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-app)" }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-content py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand)" }}>
                Account Preferences
              </span>
              <h1 className="text-2xl font-extrabold mt-1" style={{ color: "var(--text-heading)", fontFamily: "var(--font-heading)" }}>
                Settings
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Manage your security, privacy, and alert preferences.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary btn-sm"
            >
              {saving
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                : saved
                ? <><CheckCircle2 className="h-4 w-4" /> Saved!</>
                : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-content py-8 max-w-2xl space-y-6">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="card-flat rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                <Icon className="h-4 w-4" style={{ color: "var(--brand)" }} />
                <h2 className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>{section.label}</h2>
              </div>
              <div className="divide-y divide-[#E2DCD2]">
                {section.items.map((item) => (
                  <div key={item.key} className="px-6 py-4">
                    <Toggle
                      checked={settings[item.key as keyof StudentSettings] as boolean}
                      onChange={() => toggle(item.key as keyof StudentSettings)}
                      label={item.label}
                    />
                    <p className="text-xs mt-1 ml-0" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Appearance */}
        <div className="card-flat rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
            <Globe className="h-4 w-4" style={{ color: "var(--brand)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--text-heading)" }}>Display</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="form-label">Preferred Theme</label>
              <select
                className="input-field"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="system">System Default</option>
              </select>
              <p className="form-hint">Dark mode coming soon.</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card-flat rounded-2xl overflow-hidden" style={{ border: "1px solid var(--danger-border)" }}>
          <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--danger-border)", backgroundColor: "var(--danger-subtle)" }}>
            <Lock className="h-4 w-4" style={{ color: "var(--danger)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--danger)" }}>Danger Zone</h2>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>Delete Account</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
              <button className="btn-danger btn-sm shrink-0">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
