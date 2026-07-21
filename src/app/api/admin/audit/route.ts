import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_AUDIT_LOGS = [
  { id: "aud-001", userEmail: "arunima@anveshakhub.gov.in", action: "USER_LOGIN", module: "AUTH", ipAddress: "192.168.1.50", details: "Two-factor authentication successful.", timestamp: "2026-07-21T10:00:00Z" },
  { id: "aud-002", userEmail: "rishi.sen@anveshakhub.gov.in", action: "PERMISSION_CHANGE", module: "CRM", ipAddress: "192.168.1.52", details: "Assigned CRM Specialist role to user bio.diagnostics@gmail.com.", timestamp: "2026-07-21T11:30:00Z" },
  { id: "aud-003", userEmail: "amit.deshmukh@anveshakhub.gov.in", action: "PROJECT_CREATED", module: "FINANCE", ipAddress: "192.168.1.55", details: "Created Solar Grid Cost Center with budget limit ₹85L.", timestamp: "2026-07-21T14:15:00Z" },
  { id: "aud-004", userEmail: "nisha.patel@anveshakhub.gov.in", action: "SETTINGS_UPDATE", module: "SETTINGS", ipAddress: "192.168.1.60", details: "Enabled global Two-Factor Authentication requirement.", timestamp: "2026-07-21T15:00:00Z" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const moduleFilter = searchParams.get("module") || "";

  // API Integration Point:
  // const auditLogs = await prisma.auditLog.findMany({ where: {...} });

  let filtered = MOCK_AUDIT_LOGS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (log) =>
        log.userEmail.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
    );
  }

  if (moduleFilter && moduleFilter !== "ALL") {
    filtered = filtered.filter((log) => log.module === moduleFilter);
  }

  return NextResponse.json({
    logs: filtered
  });
}
