import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_SAVED_REPORTS = [
  { id: "rep-001", title: "Monthly Financial Governance Report", description: "Consolidated P&L and cost center disbursement ledger details for FY-26.", module: "FINANCE", schedule: "MONTHLY", createdBy: "Amit V. Deshmukh", createdAt: "2026-07-01T10:00:00Z" },
  { id: "rep-002", title: "Verification Pipeline Compliance Report", description: "Audit trail of industry partner SLA milestones and committee reviews.", module: "CRM", schedule: "WEEKLY", createdBy: "Rishi Raj Sen", createdAt: "2026-07-10T11:00:00Z" },
  { id: "rep-003", title: "MeitY/DST Grant Utilisation Report", description: "Committed funds, disbursement checkpoints, and project feasibility outputs.", module: "GRANTS", schedule: "MONTHLY", createdBy: "Dr. Arunima K.", createdAt: "2026-07-15T09:00:00Z" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const moduleFilter = searchParams.get("module") || "";

  // API Integration Point:
  // const savedReports = await prisma.savedReport.findMany();

  let filtered = MOCK_SAVED_REPORTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.createdBy.toLowerCase().includes(q)
    );
  }

  if (moduleFilter && moduleFilter !== "ALL") {
    filtered = filtered.filter((r) => r.module === moduleFilter);
  }

  return NextResponse.json({
    reports: filtered,
    stats: {
      totalSaved: MOCK_SAVED_REPORTS.length,
      scheduledCount: MOCK_SAVED_REPORTS.filter(r => r.schedule !== "ADHOC").length,
      generatedToday: 4
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // API Integration Point: Save Report configuration
    // const newReport = await prisma.savedReport.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `rep-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate report configuration" }, { status: 500 });
  }
}
