import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_GRANT_PROFILES: Record<string, any> = {
  "gnt-001": {
    id: "gnt-001",
    title: "MeitY Digital India Research Initiative",
    description: "Grants for universities and eligible corporate partners researching low-latency wireless serial transmission drivers.",
    agency: "MeitY",
    schemeType: "SCHEME",
    amount: 15000000,
    eligibility: ["DPIIT registered startup", "Minimum 1 Ph.D. lead", "MoU with educational institute"],
    dueDate: "2026-10-15T00:00:00Z",
    status: "OPEN",
    createdAt: "2026-06-01T10:00:00Z",
    applications: [
      {
        id: "gap-001",
        applicantName: "Solaris Power Pvt Ltd",
        title: "Grid Synced Embedded Serial Telemetry Driver",
        proposalUrl: "/mock/proposal_solaris.pdf",
        status: "UNDER_REVIEW",
        reviewScore: 88,
        createdAt: "2026-07-10T14:30:00Z",
        reviews: [
          { id: "grv-001", reviewerId: "usr-admin", score: 9, comments: "Meets all criteria. Solid commercial implementation potential.", decision: "APPROVED" },
          { id: "grv-002", reviewerId: "usr-expert", score: 8, comments: "Telemetry driver structure is robust, though RF testing parameters require verification.", decision: "PENDING" }
        ]
      },
      {
        id: "gap-002",
        applicantName: "BioGen Diagnostics LLP",
        title: "Clinical Convolutional Image Accelerator Proposal",
        proposalUrl: "/mock/proposal_biogen.pdf",
        status: "APPROVED",
        reviewScore: 94,
        createdAt: "2026-07-12T11:00:00Z",
        reviews: [
          { id: "grv-003", reviewerId: "usr-admin", score: 10, comments: "Outstanding scope definition. Clear healthcare impact.", decision: "APPROVED" }
        ]
      }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const grant = await prisma.grant.findUnique({
  //   where: { id },
  //   include: { applications: { include: { reviews: true } } }
  // });

  const detail = MOCK_GRANT_PROFILES[id] || MOCK_GRANT_PROFILES["gnt-001"];

  if (detail && detail.id !== id) {
    return NextResponse.json({ ...detail, id, title: `Grant ${id}` });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, status, applicationId, reviewerScore, reviewerComments } = body;

  // API Integration Point:
  // if (action === "UPDATE_APPLICATION_STATUS") {
  //   await prisma.grantApplication.update({ where: { id: applicationId }, data: { status } });
  // } else if (action === "SUBMIT_REVIEW") {
  //   await prisma.grantReview.create({ data: { applicationId, reviewerId: "System Admin", score: reviewerScore, comments: reviewerComments } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Grant application ledger status updated successfully",
    timestamp: new Date().toISOString()
  });
}
