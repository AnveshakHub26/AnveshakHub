import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("timeRange") || "30_DAYS";

  // API Integration Point: Pull aggregate dashboard summaries
  // const totalRevenue = await prisma.financialTransaction.aggregate(...)

  const comparisonData = [
    { name: "Jan", revenue: 1500000, projects: 25 },
    { name: "Feb", revenue: 2200000, projects: 32 },
    { name: "Mar", revenue: 1900000, projects: 40 },
    { name: "Apr", revenue: 2800000, projects: 52 },
    { name: "May", revenue: 3500000, projects: 68 },
    { name: "Jun", revenue: 4280000, projects: 86 }
  ];

  const distribution = {
    industries: 1240,
    experts: 320,
    students: 1500,
    grantsCount: 3
  };

  return NextResponse.json({
    comparisonData,
    distribution,
    successMetrics: {
      grantSuccessRate: "88.2%",
      verificationSlaCompliance: "96.4%",
      marketplaceFillRate: "79.1%"
    }
  });
}
