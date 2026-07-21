import { NextRequest, NextResponse } from "next/server";

const MOCK_BRANCHES = [
  { id: "br-001", orgId: "org-001", name: "Pune HQ", city: "Pune", state: "Maharashtra", addressLine: "Plot 42, MIDC Hinjewadi Phase 2", pinCode: "411057", headName: "Ankit Sharma", headEmail: "ankit.sharma@solarispower.in", phone: "+91 20 6789 0001", isHeadquarters: true, status: "ACTIVE" },
  { id: "br-002", orgId: "org-001", name: "Bengaluru R&D Centre", city: "Bengaluru", state: "Karnataka", addressLine: "3rd Floor, Prestige Tech Park, Whitefield", pinCode: "560066", headName: "Priya Nair", headEmail: "priya.nair@solarispower.in", phone: "+91 80 4567 8901", isHeadquarters: false, status: "ACTIVE" },
  { id: "br-003", orgId: "org-001", name: "Delhi NCR Sales Office", city: "Gurugram", state: "Haryana", addressLine: "DLF Cyber Hub, Tower C, Level 12", pinCode: "122002", headName: "Ravi Kumar", headEmail: "ravi.kumar@solarispower.in", phone: "+91 124 456 7890", isHeadquarters: false, status: "ACTIVE" }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "org-001";
  return NextResponse.json({ branches: MOCK_BRANCHES.filter(b => b.orgId === orgId), total: 3 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ success: true, id: `br-${Date.now()}`, ...body, status: "ACTIVE", createdAt: new Date().toISOString() }, { status: 201 });
}
