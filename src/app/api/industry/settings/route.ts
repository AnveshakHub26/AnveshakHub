import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_SETTINGS = {
  profile: {
    orgId: DEMO_ORG_ID,
    companyName: "Solaris Power Pvt Ltd",
    cin: "U40106TN2020PTC135890",
    gstin: "33AABCS1429B1Z8",
    logoUrl: "https://storage.anvesha.in/logos/solaris.png",
    industryDomain: "Renewable Energy & Power Systems",
    website: "https://solarispower.in",
    address: "Plot 14, Tech Park, Guindy, Chennai, Tamil Nadu 600032",
    contactEmail: "admin@solarispower.in",
    contactPhone: "+91 44 2250 8900"
  },
  teamMembers: [
    { id: "usr-01", name: "Rajesh Sharma", email: "rajesh@solarispower.in", role: "ORG_ADMIN", status: "ACTIVE", lastActive: "Just now" },
    { id: "usr-02", name: "Priya Nair", email: "priya@solarispower.in", role: "LEGAL_OFFICER", status: "ACTIVE", lastActive: "2 hours ago" },
    { id: "usr-03", name: "Nisha Patel", email: "nisha@solarispower.in", role: "FINANCE_CONTROLLER", status: "ACTIVE", lastActive: "1 day ago" },
    { id: "usr-04", name: "Kabir Verma", email: "kabir@solarispower.in", role: "PROJECT_MANAGER", status: "INVITED", lastActive: "Never" }
  ],
  security: {
    ssoEnabled: true,
    mfaRequired: true,
    allowedDomains: ["solarispower.in"],
    ipWhitelist: ["103.28.180.12", "182.72.15.98"],
    sessionTimeoutMinutes: 60
  },
  preferences: {
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
    autoRenewAlerts: true,
    emailDigestsFrequency: "DAILY"
  }
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_SETTINGS);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, profile, security, preferences, inviteEmail, inviteRole } = body;

    if (profile) Object.assign(MOCK_SETTINGS.profile, profile);
    if (security) Object.assign(MOCK_SETTINGS.security, security);
    if (preferences) Object.assign(MOCK_SETTINGS.preferences, preferences);

    if (action === "INVITE_TEAM_MEMBER" && inviteEmail) {
      MOCK_SETTINGS.teamMembers.push({
        id: `usr-${Date.now()}`,
        name: inviteEmail.split("@")[0].replace(".", " "),
        email: inviteEmail,
        role: inviteRole || "PROJECT_MANAGER",
        status: "INVITED",
        lastActive: "Never"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Organization settings updated successfully.",
      settings: MOCK_SETTINGS
    });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
