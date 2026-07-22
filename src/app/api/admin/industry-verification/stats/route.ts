import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// ADMIN INDUSTRY VERIFICATION STATS API BY INDUSTRY TYPE
// ─────────────────────────────────────────────────────────────────

const MOCK_STATS_BY_TYPE = [
  { typeCode: "STARTUP", typeName: "Startup", totalRegistrations: 45, verifiedCount: 38, pendingCount: 7 },
  { typeCode: "MSME", typeName: "MSME", totalRegistrations: 62, verifiedCount: 54, pendingCount: 8 },
  { typeCode: "ENTERPRISE", typeName: "Enterprise", totalRegistrations: 28, verifiedCount: 25, pendingCount: 3 },
  { typeCode: "INSTITUTION", typeName: "Academic Institution", totalRegistrations: 34, verifiedCount: 30, pendingCount: 4 },
  { typeCode: "RESEARCH", typeName: "Research Org", totalRegistrations: 14, verifiedCount: 12, pendingCount: 2 },
  { typeCode: "NGO", typeName: "NGO / Non-Profit", totalRegistrations: 9, verifiedCount: 8, pendingCount: 1 }
];

export async function GET(req: NextRequest) {
  const totalAll = MOCK_STATS_BY_TYPE.reduce((acc, s) => acc + s.totalRegistrations, 0);
  const verifiedAll = MOCK_STATS_BY_TYPE.reduce((acc, s) => acc + s.verifiedCount, 0);
  const pendingAll = MOCK_STATS_BY_TYPE.reduce((acc, s) => acc + s.pendingCount, 0);

  return NextResponse.json({
    summary: {
      totalRegistrations: totalAll,
      verifiedCount: verifiedAll,
      pendingCount: pendingAll
    },
    byType: MOCK_STATS_BY_TYPE
  });
}
