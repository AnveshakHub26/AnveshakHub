import { NextRequest, NextResponse } from "next/server";

const MOCK_ORG_USERS = [
  { id: "ou-001", orgId: "org-001", name: "Rajesh Sharma", email: "rajesh.sharma@solarispower.in", role: "ORG_ADMIN", department: "Board of Directors", isActive: true, invitedAt: "2026-06-01T00:00:00Z", lastLoginAt: "2026-07-21T09:00:00Z" },
  { id: "ou-002", orgId: "org-001", name: "Nisha Patel", email: "nisha.patel@solarispower.in", role: "FINANCE_HEAD", department: "Finance & Compliance", isActive: true, invitedAt: "2026-06-01T00:00:00Z", lastLoginAt: "2026-07-21T10:30:00Z" },
  { id: "ou-003", orgId: "org-001", name: "Dr. Meera Pillai", email: "meera.pillai@solarispower.in", role: "PROJECT_LEAD", department: "Research & Development", isActive: true, invitedAt: "2026-06-05T00:00:00Z", lastLoginAt: "2026-07-20T15:45:00Z" },
  { id: "ou-004", orgId: "org-001", name: "Arun Joshi", email: "arun.joshi@solarispower.in", role: "PROJECT_LEAD", department: "Engineering & Manufacturing", isActive: true, invitedAt: "2026-06-05T00:00:00Z", lastLoginAt: "2026-07-19T11:00:00Z" },
  { id: "ou-005", orgId: "org-001", name: "Kavitha Menon", email: "kavitha.menon@solarispower.in", role: "HR_COORDINATOR", department: "Business Development", isActive: true, invitedAt: "2026-06-10T00:00:00Z", lastLoginAt: "2026-07-18T14:20:00Z" }
];

const ROLE_COLORS: Record<string, string> = {
  ORG_ADMIN: "bg-purple-50 text-purple-700 border-purple-150",
  PROJECT_LEAD: "bg-blue-50 text-blue-700 border-blue-150",
  FINANCE_HEAD: "bg-green-50 text-green-700 border-green-150",
  HR_COORDINATOR: "bg-amber-50 text-amber-700 border-amber-150",
  VIEWER: "bg-slate-100 text-slate-600 border-slate-200"
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "org-001";
  return NextResponse.json({ users: MOCK_ORG_USERS.filter(u => u.orgId === orgId), total: 5, roleColors: ROLE_COLORS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true, id: `ou-${Date.now()}`, ...body, isActive: true, invitedAt: new Date().toISOString() }, { status: 201 });
}
