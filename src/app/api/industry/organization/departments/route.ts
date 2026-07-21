import { NextRequest, NextResponse } from "next/server";

const MOCK_DEPARTMENTS = [
  { id: "dep-001", orgId: "org-001", name: "Research & Development", headName: "Dr. Meera Pillai", headEmail: "meera.pillai@solarispower.in", memberCount: 28, description: "Core AI/ML and power systems R&D division.", isActive: true },
  { id: "dep-002", orgId: "org-001", name: "Engineering & Manufacturing", headName: "Arun Joshi", headEmail: "arun.joshi@solarispower.in", memberCount: 45, description: "Hardware design, prototyping, and production.", isActive: true },
  { id: "dep-003", orgId: "org-001", name: "Business Development & Sales", headName: "Kavitha Menon", headEmail: "kavitha.menon@solarispower.in", memberCount: 18, description: "Enterprise client acquisition and partnerships.", isActive: true },
  { id: "dep-004", orgId: "org-001", name: "Finance & Compliance", headName: "Deepak Patel", headEmail: "deepak.patel@solarispower.in", memberCount: 10, description: "Financial planning, grants management, and compliance.", isActive: true }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "org-001";
  return NextResponse.json({ departments: MOCK_DEPARTMENTS.filter(d => d.orgId === orgId), total: 4 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true, id: `dep-${Date.now()}`, ...body, isActive: true, createdAt: new Date().toISOString() }, { status: 201 });
}
