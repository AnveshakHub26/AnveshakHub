import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_AI_INSIGHTS = [
  {
    id: "ai-001",
    title: "Project Health Risk Alert: MRI Accelerator",
    module: "PROJECT",
    insightType: "HEALTH_PREDICTION",
    confidenceScore: 0.94,
    summary: "Predictive model flags 78% probability of milestone deadline delay for Milestone #3 due to hardware component shipment lag.",
    details: {
      riskFactor: "Supply Chain Bottleneck",
      suggestedAction: "Reallocate hardware testing buffer or grant 14-day sprint extension.",
      affectedProject: "MRI Diagnostic Accelerator",
      impactLevel: "MEDIUM"
    },
    status: "ACTIVE",
    createdAt: "2026-07-21T11:00:00Z"
  },
  {
    id: "ai-002",
    title: "High Precision Match: Dr. Arisudan & Solaris Power",
    module: "EXPERT",
    insightType: "MATCH_RECOMMENDATION",
    confidenceScore: 0.98,
    summary: "Vector similarity analysis yields a 98% compatibility index for Solaris Wireless Telemetry RFP based on 14 published patents.",
    details: {
      matchedExpert: "Dr. Arisudan (AI/ML Lead)",
      matchedOpportunity: "Solaris Telemetry Driver RFP",
      keySkills: ["Wireless Telemetry", "Embedded Drivers", "RF Signal Processing"]
    },
    status: "ACTIVE",
    createdAt: "2026-07-21T09:30:00Z"
  },
  {
    id: "ai-003",
    title: "Verification Anomaly Flag: Vayu Aerospace",
    module: "VERIFICATION",
    insightType: "ANOMALY_DETECTION",
    confidenceScore: 0.89,
    summary: "Pattern match audit highlights cross-reference mismatch between submitted GSTIN address and Ministry of Corporate Affairs records.",
    details: {
      organization: "Vayu Aerospace Solutions",
      flaggedField: "State Tax Region Mismatch",
      recommendation: "Request secondary address proof before final verification approval."
    },
    status: "ACTIVE",
    createdAt: "2026-07-20T16:45:00Z"
  },
  {
    id: "ai-004",
    title: "DST Smart Grid Grant Funding Allocation Forecast",
    module: "GRANT",
    insightType: "TREND_FORECAST",
    confidenceScore: 0.92,
    summary: "Budget utilization forecasting models project 94% fund absorption rate prior to Q4 closing based on historical submission velocity.",
    details: {
      grantScheme: "DST Smart Grid Innovation Fund",
      allocatedPool: 25000000,
      predictedDisbursement: 23500000
    },
    status: "ACTIVE",
    createdAt: "2026-07-18T14:00:00Z"
  }
];

const MOCK_MODELS = [
  { id: "mdl-001", modelName: "Anveshak-MatchVector-v3", version: "3.2.0", moduleTarget: "EXPERT_MARKETPLACE", accuracyScore: 0.96, status: "ONLINE", lastTrained: "2026-07-20T04:00:00Z" },
  { id: "mdl-002", modelName: "Anveshak-RiskPredictor-v2", version: "2.1.4", moduleTarget: "PROJECT_HEALTH", accuracyScore: 0.93, status: "ONLINE", lastTrained: "2026-07-19T02:30:00Z" },
  { id: "mdl-003", modelName: "Anveshak-FraudShield-v1", version: "1.0.8", moduleTarget: "VERIFICATION_COMPLIANCE", accuracyScore: 0.91, status: "ONLINE", lastTrained: "2026-07-15T00:00:00Z" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const moduleFilter = searchParams.get("module") || "";

  let filtered = MOCK_AI_INSIGHTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.insightType.toLowerCase().includes(q)
    );
  }

  if (moduleFilter && moduleFilter !== "ALL") {
    filtered = filtered.filter((i) => i.module === moduleFilter);
  }

  const stats = {
    totalInsights: MOCK_AI_INSIGHTS.length,
    activeRisksCount: MOCK_AI_INSIGHTS.filter((i) => i.insightType === "HEALTH_PREDICTION" || i.insightType === "ANOMALY_DETECTION").length,
    avgConfidence: "94.8%",
    modelsOnlineCount: MOCK_MODELS.length
  };

  return NextResponse.json({
    insights: filtered,
    models: MOCK_MODELS,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
        id: `ai-${Date.now()}`,
        title: body.title || "Real-Time AI Diagnostic Insight",
        module: body.module || "PROJECT",
        insightType: body.insightType || "HEALTH_PREDICTION",
        confidenceScore: 0.96,
        summary: body.summary || "Real-time vector audit completed. All risk metrics within safe parameters.",
        details: body.details || { auditStatus: "PASSED" },
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json({ error: "Failed to trigger AI insight evaluation" }, { status: 500 });
  }
}
