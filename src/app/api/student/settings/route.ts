import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-011 ENTERPRISE STUDENT SETTINGS API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_SETTINGS = {
  studentId: "std-001",
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
  return NextResponse.json(MOCK_STUDENT_SETTINGS);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailAlerts, smsAlerts, mfaEnabled, privacyMode, theme, defaultCurrency } = body;

    if (emailAlerts !== undefined) MOCK_STUDENT_SETTINGS.emailAlerts = emailAlerts;
    if (smsAlerts !== undefined) MOCK_STUDENT_SETTINGS.smsAlerts = smsAlerts;
    if (mfaEnabled !== undefined) MOCK_STUDENT_SETTINGS.mfaEnabled = mfaEnabled;
    if (privacyMode !== undefined) MOCK_STUDENT_SETTINGS.privacyMode = privacyMode;
    if (theme !== undefined) MOCK_STUDENT_SETTINGS.theme = theme;
    if (defaultCurrency !== undefined) MOCK_STUDENT_SETTINGS.defaultCurrency = defaultCurrency;

    return NextResponse.json({
      success: true,
      settings: MOCK_STUDENT_SETTINGS,
      message: "Student account settings updated successfully."
    });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
