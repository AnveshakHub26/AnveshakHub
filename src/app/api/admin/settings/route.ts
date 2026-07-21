import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_SETTINGS = [
  { id: "set-001", key: "PASSWORD_MIN_LENGTH", value: "12", category: "SECURITY" },
  { id: "set-002", key: "SESSION_TIMEOUT_MINUTES", value: "30", category: "SECURITY" },
  { id: "set-003", key: "TWO_FACTOR_REQUIRED", value: "true", category: "AUTH" },
  { id: "set-004", key: "STORAGE_PROVIDER", value: "MinIO", category: "STORAGE" },
  { id: "set-005", key: "SMTP_HOST", value: "smtp.anveshakhub.gov.in", category: "INTEGRATIONS" }
];

export async function GET(req: NextRequest) {
  // API Integration Point:
  // const settings = await prisma.systemSetting.findMany();
  
  return NextResponse.json({
    settings: MOCK_SETTINGS,
    orgProfile: {
      name: "AnveshakHub Platform",
      domain: "anveshakhub.gov.in",
      logoUrl: "/logo.png",
      supportEmail: "support@anveshakhub.gov.in"
    }
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  
  // API Integration Point:
  // await prisma.systemSetting.update({ where: { key: body.key }, data: { value: body.value } });
  
  return NextResponse.json({
    success: true,
    message: "Settings updated successfully",
    timestamp: new Date().toISOString()
  });
}
