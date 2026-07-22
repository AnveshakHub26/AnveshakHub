import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_GRANTS = [
  {
    id: "gnt-001",
    industryId: DEMO_ORG_ID,
    title: "DPIIT Clean Energy Scaleup Grant 2026",
    agency: "DPIIT",
    schemeType: "CSR",
    amount: 5000000.00,
    disbursedAmount: 3500000.00,
    remainingAmount: 1500000.00,
    eligibility: ["Clean Tech", "TRL 6+", "Industry-Academia Consortium"],
    dueDate: "2026-10-31T00:00:00Z",
    status: "OPEN",
    milestones: [
      { milestone: "Tranche 1 - Prototype Demonstration", amount: 2000000.00, status: "DISBURSED", date: "2026-02-10T10:00:00Z" },
      { milestone: "Tranche 2 - Micro-Grid Pilot Installation", amount: 1500000.00, status: "DISBURSED", date: "2026-06-15T14:00:00Z" },
      { milestone: "Tranche 3 - Final Audited Scaling Report", amount: 1500000.00, status: "PENDING", date: "2026-11-15T10:00:00Z" }
    ],
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "gnt-002",
    industryId: DEMO_ORG_ID,
    title: "DST Autonomous Robotics R&D Seed Fund",
    agency: "DST",
    schemeType: "RESEARCH",
    amount: 3000000.00,
    disbursedAmount: 1800000.00,
    remainingAmount: 1200000.00,
    eligibility: ["Robotics", "AI/ML", "IISc Partner"],
    dueDate: "2026-12-15T00:00:00Z",
    status: "OPEN",
    milestones: [
      { milestone: "Tranche 1 - Sensor Hardware Procurement", amount: 1800000.00, status: "DISBURSED", date: "2026-04-01T10:00:00Z" },
      { milestone: "Tranche 2 - Field Navigation Trials", amount: 1200000.00, status: "PENDING", date: "2026-10-01T10:00:00Z" }
    ],
    createdAt: "2026-03-01T11:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const agency = searchParams.get("agency") || "ALL";

  let filtered = MOCK_GRANTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(g => g.title.toLowerCase().includes(q) || g.agency.toLowerCase().includes(q));
  }

  if (agency && agency !== "ALL") {
    filtered = filtered.filter(g => g.agency === agency);
  }

  return NextResponse.json({
    grants: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, agency, schemeType, amount, dueDate } = body;

    const newGrant = {
      id: `gnt-${Date.now()}`,
      industryId: DEMO_ORG_ID,
      title,
      agency: agency || "CSR",
      schemeType: schemeType || "CSR",
      amount: parseFloat(amount) || 2500000.00,
      disbursedAmount: 0.00,
      remainingAmount: parseFloat(amount) || 2500000.00,
      eligibility: ["Registered Startup", "DPIIT Recognized"],
      dueDate: dueDate || "2026-12-31T00:00:00Z",
      status: "OPEN",
      milestones: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      grant: newGrant,
      message: "Grant allocation registered successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create grant" }, { status: 500 });
  }
}
