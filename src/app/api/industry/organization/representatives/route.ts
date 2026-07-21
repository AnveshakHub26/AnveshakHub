import { NextRequest, NextResponse } from "next/server";

const MOCK_REPRESENTATIVES = [
  { id: "rep-001", orgId: "org-001", name: "Rajesh Sharma", designation: "Managing Director & CEO", email: "rajesh.sharma@solarispower.in", phone: "+91 98100 00001", isAuthorizedSignatory: true, isPrimary: true, department: "Board of Directors" },
  { id: "rep-002", orgId: "org-001", name: "Nisha Patel", designation: "Chief Financial Officer", email: "nisha.patel@solarispower.in", phone: "+91 98100 00002", isAuthorizedSignatory: true, isPrimary: false, department: "Finance & Compliance" },
  { id: "rep-003", orgId: "org-001", name: "Arun Joshi", designation: "VP Engineering", email: "arun.joshi@solarispower.in", phone: "+91 98100 00003", isAuthorizedSignatory: false, isPrimary: false, department: "Engineering & Manufacturing" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "org-001";
  return NextResponse.json({ representatives: MOCK_REPRESENTATIVES.filter(r => r.orgId === orgId), total: 3 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true, id: `rep-${Date.now()}`, ...body, createdAt: new Date().toISOString() }, { status: 201 });
}
