import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_BROADCASTS = [
  {
    id: "ntf-001",
    title: "Q3 MeitY Grant Applications Now Open",
    message: "All DPIIT registered startups and partner universities are eligible to submit project feasibility proposals for the Digital India R&D Grant.",
    targetAudience: "ALL_USERS",
    channel: "ALL",
    scheduledAt: "2026-07-25T09:00:00Z",
    sentAt: "2026-07-21T08:00:00Z",
    status: "SENT",
    recipientsCount: 3060,
    readCount: 2580,
    createdBy: "Platform Communications Officer"
  },
  {
    id: "ntf-002",
    title: "System Maintenance Scheduled - July 28",
    message: "AnveshakHub core API services will undergo 30 minutes of scheduled maintenance on July 28 from 02:00 AM to 02:30 AM IST.",
    targetAudience: "ADMINS",
    channel: "IN_APP",
    scheduledAt: "2026-07-28T02:00:00Z",
    sentAt: null,
    status: "SCHEDULED",
    recipientsCount: 45,
    readCount: 0,
    createdBy: "System Operations Lead"
  },
  {
    id: "ntf-003",
    title: "Expert Marketplace AI Matcher Algorithm Upgrade",
    message: "New vector embeddings engine activated for B2B Industry-Expert matching with 94%+ precision scoring.",
    targetAudience: "EXPERTS",
    channel: "EMAIL",
    scheduledAt: null,
    sentAt: "2026-07-19T14:30:00Z",
    status: "SENT",
    recipientsCount: 320,
    readCount: 290,
    createdBy: "Lead AI Engineer"
  }
];

const MOCK_TEMPLATES = [
  { id: "tmpl-001", name: "Grant Application Submission Confirmation", channel: "EMAIL", subject: "Grant Submission Received: {{grant_title}}", body: "Dear {{applicant_name}}, your proposal for {{grant_title}} has been logged." },
  { id: "tmpl-002", name: "SLA Escalation Warning Alert", channel: "IN_APP", subject: "SLA Warning: {{workflow_name}}", body: "Verification request {{request_id}} has exceeded 20 hours SLA." }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const channel = searchParams.get("channel") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  let filtered = MOCK_BROADCASTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.message.toLowerCase().includes(q) ||
        b.targetAudience.toLowerCase().includes(q)
    );
  }

  if (channel && channel !== "ALL") {
    filtered = filtered.filter((b) => b.channel === channel);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const stats = {
    totalDispatched: 14250,
    deliverySuccessRate: "99.4%",
    readRate: "84.2%",
    activeScheduled: MOCK_BROADCASTS.filter((b) => b.status === "SCHEDULED").length,
    templatesCount: MOCK_TEMPLATES.length
  };

  return NextResponse.json({
    broadcasts: paginated,
    templates: MOCK_TEMPLATES,
    total,
    page,
    limit,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
        id: `ntf-${Date.now()}`,
        ...body,
        status: body.scheduledAt ? "SCHEDULED" : "SENT",
        sentAt: body.scheduledAt ? null : new Date().toISOString(),
        recipientsCount: 1250,
        readCount: 0,
        createdAt: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json({ error: "Failed to dispatch notification broadcast" }, { status: 500 });
  }
}
