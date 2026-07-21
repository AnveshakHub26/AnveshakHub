import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_ORG = {
  id: "org-001",
  orgName: "Solaris Power Pvt Ltd",
  orgType: "Private Limited",
  email: "contact@solarispower.in",
  phone: "+91 98765 43210",
  website: "https://www.solarispower.in",
  industryDomain: "Clean Energy & Renewable Technology",
  businessCategory: "Energy & Utilities",
  description: "Solaris Power Pvt Ltd is a DPIIT-registered startup focused on AI-powered solar grid optimization and smart energy management systems for industrial and institutional clients across India.",
  state: "Maharashtra",
  district: "Pune",
  city: "Pune",
  pin: "411001",
  addressLine: "Plot 42, MIDC Industrial Area, Hinjewadi Phase 2",
  verificationStatus: "APPROVED",
  priority: "HIGH",
  gstin: "27AABCS1429B1Z1",
  cin: "U40100MH2020PTC345678",
  panNumber: "AABCS1429B",
  dpiitNumber: "DIPP12345",
  createdAt: "2026-06-01T00:00:00Z",
  updatedAt: "2026-07-10T12:00:00Z"
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "org-001";

  // API Integration Point:
  // const org = await prisma.organization.findUnique({ where: { id: orgId }, include: { ... } });

  return NextResponse.json({ organization: MOCK_ORG });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      message: "Organization profile updated successfully.",
      updatedFields: Object.keys(body),
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ error: "Failed to update organization profile." }, { status: 500 });
  }
}
