import { NextRequest, NextResponse } from "next/server";

const MOCK_RESEARCH_GRANTS = [
  {
    id: "grt-001",
    title: "DST-SERB Core Research Grant for Micro-Grid AI Control",
    agency: "Department of Science & Technology (DST)",
    totalGrantAmount: 7500000.00,
    disbursedAmount: 4500000.00,
    remainingAmount: 3000000.00,
    status: "ACTIVE",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2028-03-31T00:00:00Z"
  },
  {
    id: "grt-002",
    title: "CSR Sponsored R&D Grant for Clean Energy Storage",
    agency: "Solaris Power CSR Initiative",
    totalGrantAmount: 4500000.00,
    disbursedAmount: 2500000.00,
    remainingAmount: 2000000.00,
    status: "ACTIVE",
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    grants: MOCK_RESEARCH_GRANTS,
    total: MOCK_RESEARCH_GRANTS.length
  });
}
