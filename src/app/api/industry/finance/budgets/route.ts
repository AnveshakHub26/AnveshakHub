import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_COST_CENTERS = [
  { id: "cc-01", code: "CC-RND", name: "R&D Prototyping & Equipment", budget: 6000000.00, allocated: 4400000.00, createdAt: "2026-01-01T00:00:00Z" },
  { id: "cc-02", code: "CC-STIPEND", name: "Student Intern Stipends & Grants", budget: 3500000.00, allocated: 2100000.00, createdAt: "2026-01-01T00:00:00Z" },
  { id: "cc-03", code: "CC-CSR", name: "CSR Clean Energy Deployment", budget: 4000000.00, allocated: 2800000.00, createdAt: "2026-01-01T00:00:00Z" },
  { id: "cc-04", code: "CC-OPS", name: "Compliance, Audits & Platform Ops", budget: 1500000.00, allocated: 550000.00, createdAt: "2026-01-01T00:00:00Z" }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    costCenters: MOCK_COST_CENTERS,
    totalBudget: 15000000.00,
    totalAllocated: 9850000.00
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, budget } = body;

    const newCC = {
      id: `cc-${Date.now()}`,
      name,
      code: code || `CC-${Math.floor(1000 + Math.random() * 9000)}`,
      budget: parseFloat(budget) || 1000000.00,
      allocated: 0.00,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      costCenter: newCC,
      message: "Cost center created successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create cost center" }, { status: 500 });
  }
}
