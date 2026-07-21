import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_GRANTS = [
  {
    id: "gnt-001",
    title: "MeitY Digital India Research Initiative",
    description: "Grants for universities and eligible corporate partners researching low-latency wireless serial transmission drivers.",
    agency: "MeitY",
    schemeType: "SCHEME",
    amount: 15000000,
    eligibility: ["DPIIT registered startup", "Minimum 1 Ph.D. lead", "MoU with educational institute"],
    dueDate: "2026-10-15T00:00:00Z",
    status: "OPEN",
    applicationsCount: 3,
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "gnt-002",
    title: "DST Smart Grid Innovation Fund",
    description: "Funding for smart-grid pilot initiatives demonstrating 10%+ power line savings in residential zones.",
    agency: "DST",
    schemeType: "SCHEME",
    amount: 25000000,
    eligibility: ["Smart grid hardware prototype", "Commercial partner verified"],
    dueDate: "2026-09-30T00:00:00Z",
    status: "OPEN",
    applicationsCount: 1,
    createdAt: "2026-06-15T11:00:00Z"
  },
  {
    id: "gnt-003",
    title: "Solaris Green Energy CSR Fund",
    description: "Corporate social responsibility funding for decentralized village solar grids and localized microgrids.",
    agency: "Solaris Power Pvt Ltd",
    schemeType: "CSR",
    amount: 5000000,
    eligibility: ["Social impact assessment", "Implementation time < 9 months"],
    dueDate: "2026-08-25T00:00:00Z",
    status: "OPEN",
    applicationsCount: 4,
    createdAt: "2026-07-01T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const agency = searchParams.get("agency") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [grants, total] = await Promise.all([
  //   prisma.grant.findMany({ where: {...}, include: { applications: true }, skip, take }),
  //   prisma.grant.count({ where: {...} })
  // ]);

  let filtered = MOCK_GRANTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.agency.toLowerCase().includes(q)
    );
  }

  if (agency && agency !== "ALL") {
    filtered = filtered.filter((g) => g.agency === agency);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Statistics
  const stats = {
    total: MOCK_GRANTS.length,
    totalFunding: MOCK_GRANTS.reduce((acc, g) => acc + g.amount, 0),
    applicationsCount: MOCK_GRANTS.reduce((acc, g) => acc + g.applicationsCount, 0),
    openCount: MOCK_GRANTS.filter(g => g.status === "OPEN").length
  };

  return NextResponse.json({
    grants: paginated,
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
    // const newGrant = await prisma.grant.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `gnt-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "OPEN",
      applicationsCount: 0
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to publish grant opportunity" }, { status: 500 });
  }
}
