import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_OPPORTUNITIES = [
  {
    id: "opp-001",
    title: "AI Optimization Consultant for Solar Grids",
    description: "Looking for an expert with 10+ years experience in power routing models to consult on deep learning synchronization.",
    domain: "AI & Smart Grids",
    budget: 350000,
    requirements: ["10+ Yrs Exp", "Ph.D in CSE or EE", "Prior smart grid deployments"],
    status: "OPEN",
    createdAt: "2026-07-15T10:00:00Z",
    industry: {
      orgName: "Solaris Power Pvt Ltd",
      orgType: "DPIIT Certified"
    },
    applicationsCount: 4
  },
  {
    id: "opp-002",
    title: "Bioinformatics Pipeline Lead Architect",
    description: "Design custom convolutional transformers for diagnostic MRI and DNA sequencing boundary alignments.",
    domain: "BioTech",
    budget: 600000,
    requirements: ["Deep learning modeling", "PyTorch expertise", "5+ years clinical pipeline build"],
    status: "OPEN",
    createdAt: "2026-07-18T14:30:00Z",
    industry: {
      orgName: "BioGen Diagnostics LLP",
      orgType: "Enterprise Partner"
    },
    applicationsCount: 2
  },
  {
    id: "opp-003",
    title: "Aerospace RF Transceiver Designer",
    description: "Design low-latency communication module for exploratory search and rescue drone telemetry hubs.",
    domain: "Aerospace",
    budget: 450000,
    requirements: ["RF hardware engineering", "Transceiver sweeps", "Aviation rule compliance"],
    status: "OPEN",
    createdAt: "2026-07-20T09:00:00Z",
    industry: {
      orgName: "Vayu Aerospace Solutions",
      orgType: "StartUp"
    },
    applicationsCount: 1
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const domain = searchParams.get("domain") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [opportunities, total] = await Promise.all([
  //   prisma.marketplaceOpportunity.findMany({ where: {...}, include: { industry: true, applications: true }, skip, take }),
  //   prisma.marketplaceOpportunity.count({ where: {...} })
  // ]);

  let filtered = MOCK_OPPORTUNITIES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.industry.orgName.toLowerCase().includes(q)
    );
  }

  if (domain && domain !== "ALL") {
    filtered = filtered.filter((o) => o.domain === domain);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // stats summaries
  const stats = {
    total: MOCK_OPPORTUNITIES.length,
    active: MOCK_OPPORTUNITIES.filter((o) => o.status === "OPEN").length,
    filled: MOCK_OPPORTUNITIES.filter((o) => o.status === "FILLED").length,
    domainsList: Array.from(new Set(MOCK_OPPORTUNITIES.map((o) => o.domain)))
  };

  return NextResponse.json({
    opportunities: paginated,
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
    // const newOpportunity = await prisma.marketplaceOpportunity.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `opp-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "OPEN",
      applicationsCount: 0
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to publish opportunity" }, { status: 500 });
  }
}
