import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// IND-009 ENTERPRISE ANALYTICS & EXECUTIVE KPI API
// ─────────────────────────────────────────────────────────────────

const DEMO_ORG_ID = "org-001";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    orgId: DEMO_ORG_ID,
    orgName: "Solaris Power Pvt Ltd",
    executiveKpi: {
      problemStatementConversionRate: 83.3, // 5 of 6 translated to projects
      activeProjectsCount: 4,
      completedProjectsCount: 2,
      totalBudgetSpent: 9850000.00,
      totalGrantsDisbursed: 7500000.00,
      expertConsultationsCount: 14,
      placedInternsCount: 18,
      avgProjectSuccessScore: 4.8
    },
    domainBreakdown: [
      { domain: "Clean Energy & Solar", percentage: 45, projectsCount: 3 },
      { domain: "Autonomous Robotics", percentage: 30, projectsCount: 2 },
      { domain: "AI/ML & Bio-Sensors", percentage: 25, projectsCount: 1 }
    ],
    milestoneProgress: [
      { status: "COMPLETED", count: 12 },
      { status: "IN_PROGRESS", count: 7 },
      { status: "PENDING", count: 3 }
    ],
    expertEngagementTrend: [
      { month: "Jan", sessions: 2, rating: 4.9 },
      { month: "Feb", sessions: 3, rating: 4.8 },
      { month: "Mar", sessions: 1, rating: 5.0 },
      { month: "Apr", sessions: 4, rating: 4.7 },
      { month: "May", sessions: 2, rating: 4.9 },
      { month: "Jun", sessions: 2, rating: 4.8 }
    ]
  });
}
