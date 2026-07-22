import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-011 ENTERPRISE SETTINGS API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_SETTINGS = {
  expertId: "exp-001",
  emailAlerts: true,
  smsAlerts: false,
  mfaEnabled: false,
  privacyMode: false,
  theme: "LIGHT",
  defaultCurrency: "INR",
  language: "en-IN",
  timezone: "Asia/Kolkata"
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_EXPERT_SETTINGS);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailAlerts, smsAlerts, mfaEnabled, privacyMode, theme, defaultCurrency } = body;

    if (emailAlerts !== undefined) MOCK_EXPERT_SETTINGS.emailAlerts = emailAlerts;
    if (smsAlerts !== undefined) MOCK_EXPERT_SETTINGS.smsAlerts = smsAlerts;
    if (mfaEnabled !== undefined) MOCK_EXPERT_SETTINGS.mfaEnabled = mfaEnabled;
    if (privacyMode !== undefined) MOCK_EXPERT_SETTINGS.privacyMode = privacyMode;
    if (theme !== undefined) MOCK_EXPERT_SETTINGS.theme = theme;
    if (defaultCurrency !== undefined) MOCK_EXPERT_SETTINGS.defaultCurrency = defaultCurrency;

    return NextResponse.json({
      success: true,
      settings: MOCK_EXPERT_SETTINGS,
      message: "Account settings updated successfully."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
