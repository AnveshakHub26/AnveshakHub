import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_INDUSTRIES = [
  {
    id: "ind-001",
    orgName: "Solaris Power Pvt Ltd",
    orgType: "Private Limited",
    email: "info@solarispower.in",
    phone: "+91 98400 11234",
    website: "https://solarispower.in",
    industryDomain: "Clean Energy",
    businessCategory: "Renewable Energy",
    state: "Tamil Nadu",
    city: "Chennai",
    verificationStatus: "APPROVED",
    lifecycle: "EXPERTS_ASSIGNED",
    engagementScore: 84,
    collaborationScore: 76,
    totalProjects: 3,
    activeProjects: 2,
    expertsAssigned: 4,
    studentsAssigned: 8,
    totalRevenue: 2400000,
    approvedAt: "2026-06-15T00:00:00Z",
    tags: ["solar", "energy", "msme"],
  },
  {
    id: "ind-002",
    orgName: "Vayu Aerospace Solutions",
    orgType: "Partnership",
    email: "contact@vayuaero.in",
    phone: "+91 98400 22345",
    website: "https://vayuaero.in",
    industryDomain: "Drone Research",
    businessCategory: "Aerospace & Defence",
    state: "Karnataka",
    city: "Bengaluru",
    verificationStatus: "APPROVED",
    lifecycle: "PROJECT_STARTED",
    engagementScore: 91,
    collaborationScore: 88,
    totalProjects: 2,
    activeProjects: 2,
    expertsAssigned: 3,
    studentsAssigned: 6,
    totalRevenue: 3500000,
    approvedAt: "2026-05-20T00:00:00Z",
    tags: ["drones", "aerospace", "defence"],
  },
  {
    id: "ind-003",
    orgName: "BioGen Diagnostics LLP",
    orgType: "LLP",
    email: "admin@biogen.in",
    phone: "+91 98400 33456",
    website: "https://biogen.in",
    industryDomain: "BioTech Research",
    businessCategory: "Life Sciences",
    state: "Telangana",
    city: "Hyderabad",
    verificationStatus: "APPROVED",
    lifecycle: "MEETING_COMPLETED",
    engagementScore: 72,
    collaborationScore: 65,
    totalProjects: 1,
    activeProjects: 1,
    expertsAssigned: 2,
    studentsAssigned: 4,
    totalRevenue: 1200000,
    approvedAt: "2026-06-28T00:00:00Z",
    tags: ["biotech", "diagnostics", "healthcare"],
  },
  {
    id: "ind-004",
    orgName: "Krypton Grid Solutions",
    orgType: "Pvt Ltd",
    email: "info@kryptongrid.in",
    phone: "+91 98400 44567",
    website: "https://kryptongrid.in",
    industryDomain: "Clean Energy",
    businessCategory: "Smart Grid",
    state: "Gujarat",
    city: "Ahmedabad",
    verificationStatus: "APPROVED",
    lifecycle: "OPPORTUNITY_CREATED",
    engagementScore: 68,
    collaborationScore: 60,
    totalProjects: 0,
    activeProjects: 0,
    expertsAssigned: 1,
    studentsAssigned: 2,
    totalRevenue: 850000,
    approvedAt: "2026-07-05T00:00:00Z",
    tags: ["grid", "smart-energy", "iot"],
  },
  {
    id: "ind-005",
    orgName: "Aether Technologies",
    orgType: "Startup (DPIIT)",
    email: "info@aethertech.in",
    phone: "+91 98400 55678",
    website: "https://aethertech.in",
    industryDomain: "Aerospace",
    businessCategory: "Space Technology",
    state: "Maharashtra",
    city: "Pune",
    verificationStatus: "APPROVED",
    lifecycle: "LONG_TERM_PARTNER",
    engagementScore: 96,
    collaborationScore: 94,
    totalProjects: 5,
    activeProjects: 3,
    expertsAssigned: 7,
    studentsAssigned: 15,
    totalRevenue: 8500000,
    approvedAt: "2025-12-01T00:00:00Z",
    tags: ["space", "satellites", "startup", "dpiit"],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const domain = searchParams.get("domain") || "";
  const lifecycle = searchParams.get("lifecycle") || "";
  const state = searchParams.get("state") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sortBy = searchParams.get("sortBy") || "engagementScore";
  const sortDir = searchParams.get("sortDir") || "desc";

  // API Integration Point:
  // const [industries, total] = await Promise.all([
  //   prisma.industryProfile.findMany({ where: {...}, include: { organization: true }, skip, take, orderBy: { [sortBy]: sortDir } }),
  //   prisma.industryProfile.count({ where: {...} })
  // ]);

  let filtered = MOCK_INDUSTRIES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((i) =>
      i.orgName.toLowerCase().includes(q) ||
      i.industryDomain.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q)
    );
  }
  if (domain) filtered = filtered.filter((i) => i.industryDomain === domain);
  if (lifecycle) filtered = filtered.filter((i) => i.lifecycle === lifecycle);
  if (state) filtered = filtered.filter((i) => i.state === state);

  const sorted = [...filtered].sort((a, b) => {
    const aVal = ((a as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    const bVal = ((b as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    return sortDir === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  const stats = {
    total: MOCK_INDUSTRIES.length,
    active: MOCK_INDUSTRIES.filter((i) => ["PROJECT_STARTED", "EXPERTS_ASSIGNED", "OPPORTUNITY_CREATED"].includes(i.lifecycle)).length,
    longTermPartners: MOCK_INDUSTRIES.filter((i) => i.lifecycle === "LONG_TERM_PARTNER").length,
    avgEngagement: Math.round(MOCK_INDUSTRIES.reduce((s, i) => s + i.engagementScore, 0) / MOCK_INDUSTRIES.length),
    domains: [...new Set(MOCK_INDUSTRIES.map((i) => i.industryDomain))],
    states: [...new Set(MOCK_INDUSTRIES.map((i) => i.state))],
  };

  return NextResponse.json({ industries: paginated, total, page, limit, stats });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // API Integration Point: prisma.industryProfile.create(...)
  return NextResponse.json({
    success: true,
    id: `ind-${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
  }, { status: 201 });
}
