import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_WORKFLOWS = [
  {
    id: "wf-001",
    name: "Ecosystem Partner Verification SLA Flow",
    description: "SLA track for verified industry registrations from onboarding to approval within 24 hours.",
    status: "ACTIVE",
    steps: ["Partner Onboarded", "DPIIT Auto Check", "Documents Verification", "Committee Review", "Approval Released"],
    slaHours: 24,
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "wf-002",
    name: "Grant Application Committee Allocation Flow",
    description: "Workflow to route incoming DST/MeitY applications to assigned subject matter experts within 48 hours.",
    status: "ACTIVE",
    steps: ["Application Received", "Eligibility Screen", "Experts Assigned", "Scoring Complete", "Minutes Recorded"],
    slaHours: 48,
    createdAt: "2026-06-15T11:00:00Z"
  }
];

const MOCK_INCIDENTS = [
  {
    id: "inc-001",
    workflowName: "Ecosystem Partner Verification SLA Flow",
    title: "Document Vault Verification Delayed",
    description: "Partner Solaris Power doc vault audit did not conclude within 24 hours SLA.",
    severity: "HIGH",
    status: "OPEN",
    createdAt: "2026-07-20T14:30:00Z"
  },
  {
    id: "inc-002",
    workflowName: "Grant Application Committee Allocation Flow",
    title: "Expert Scoring Threshold Warning",
    description: "Clinical Diagnostic application expert score not loaded before 48 hours deadline.",
    severity: "CRITICAL",
    status: "OPEN",
    createdAt: "2026-07-21T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [workflows, incidents] = await Promise.all([
  //   prisma.operationWorkflow.findMany({ skip, take }),
  //   prisma.operationIncident.findMany()
  // ]);

  let filteredIncidents = MOCK_INCIDENTS;

  if (search) {
    const q = search.toLowerCase();
    filteredIncidents = filteredIncidents.filter(
      (inc) =>
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.workflowName.toLowerCase().includes(q)
    );
  }

  const total = filteredIncidents.length;
  const paginatedIncidents = filteredIncidents.slice((page - 1) * limit, page * limit);

  // SLA Operational KPIs
  const stats = {
    activeWorkflows: MOCK_WORKFLOWS.length,
    activeIncidents: MOCK_INCIDENTS.filter(i => i.status === "OPEN").length,
    slaCompliance: "96.4%",
    resolvedIncidents: 12
  };

  return NextResponse.json({
    workflows: MOCK_WORKFLOWS,
    incidents: paginatedIncidents,
    total,
    page,
    limit,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // API Integration Point:
    // const newWorkflow = await prisma.operationWorkflow.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `wf-${Date.now()}`,
      ...body,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to schedule operational workflow" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, incidentId, status } = body;

  // API Integration Point: Reconcile Incidents
  // if (action === "RESOLVE_INCIDENT") {
  //   await prisma.operationIncident.update({ where: { id: incidentId }, data: { status: "RESOLVED" } });
  // }

  return NextResponse.json({
    success: true,
    action,
    message: `Incident ${incidentId} resolved successfully.`,
    timestamp: new Date().toISOString()
  });
}
