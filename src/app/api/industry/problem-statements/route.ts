import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// const orgId = req.headers.get("x-org-id") ?? "org-001";
// ─────────────────────────────────────────────────────────────────

const DEMO_ORG_ID = "org-001";

const MOCK_PROBLEMS = [
  {
    id: "prob-001",
    orgId: DEMO_ORG_ID,
    title: "AI-Powered Decentralized Solar Micro-Grid Synchronization",
    description: "Design real-time local algorithms to balance supply/demand fluctuations in local off-grid solar generators, minimizing network line losses and storage degradation.",
    category: "Clean Energy & Grid Technology",
    priority: "HIGH",
    status: "APPROVED",
    version: 1,
    linkedProjectsCount: 1,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-15T14:30:00Z"
  },
  {
    id: "prob-002",
    orgId: DEMO_ORG_ID,
    title: "Multi-Agent Smart Inverter Mesh Protocol",
    description: "Develop a secure RF serialization mesh topology protocol allowing hardware solar inverters to exchange power sharing bounds dynamically without a centralized cloud router.",
    category: "Hardware & IoT",
    priority: "CRITICAL",
    status: "UNDER_REVIEW",
    version: 2,
    linkedProjectsCount: 0,
    createdAt: "2026-07-02T09:00:00Z",
    updatedAt: "2026-07-12T11:00:00Z"
  },
  {
    id: "prob-003",
    orgId: DEMO_ORG_ID,
    title: "Bidirectional Power Flow Solid State Controller",
    description: "Design PCB schematic and thermal mitigation bounds for sub-10ms bidirectional switching solid state power relays targeting commercial buildings.",
    category: "Power Electronics",
    priority: "MEDIUM",
    status: "DRAFT",
    version: 1,
    linkedProjectsCount: 0,
    createdAt: "2026-07-20T14:00:00Z",
    updatedAt: "2026-07-20T14:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  let filtered = MOCK_PROBLEMS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter(p => p.status === status);
  }

  return NextResponse.json({
    problems: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProblem = {
      id: `prob-${Date.now()}`,
      orgId: DEMO_ORG_ID,
      title: body.title,
      description: body.description,
      category: body.category || "General Research",
      priority: body.priority || "MEDIUM",
      status: body.submitImmediately ? "SUBMITTED" : "DRAFT",
      version: 1,
      linkedProjectsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Database fallback simulation
    return NextResponse.json({
      success: true,
      problem: newProblem,
      message: body.submitImmediately ? "Problem Statement submitted for review." : "Problem Statement draft saved."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create problem statement" }, { status: 500 });
  }
}
