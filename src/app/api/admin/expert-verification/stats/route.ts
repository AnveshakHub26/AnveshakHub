import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// ADMIN EXPERT VERIFICATION STATS API BY EXPERT CATEGORY
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_STATS_BY_CATEGORY = [
  { categoryCode: "PROFESSOR", categoryName: "Professor / Academic", totalRegistrations: 58, verifiedCount: 52, pendingCount: 6 },
  { categoryCode: "PHD_HOLDER", categoryName: "PhD Holder / Postdoc", totalRegistrations: 42, verifiedCount: 38, pendingCount: 4 },
  { categoryCode: "AI_ML_EXPERT", categoryName: "AI / ML Expert", totalRegistrations: 64, verifiedCount: 57, pendingCount: 7 },
  { categoryCode: "CYBER_SECURITY", categoryName: "Cyber Security Expert", totalRegistrations: 31, verifiedCount: 28, pendingCount: 3 },
  { categoryCode: "INDUSTRY_PROFESSIONAL", categoryName: "Industry Professional", totalRegistrations: 89, verifiedCount: 81, pendingCount: 8 },
  { categoryCode: "FREELANCER", categoryName: "Freelancer / Consultant", totalRegistrations: 47, verifiedCount: 42, pendingCount: 5 },
  { categoryCode: "CHARTERED_ACCOUNTANT", categoryName: "Chartered Accountant", totalRegistrations: 18, verifiedCount: 16, pendingCount: 2 }
];

export async function GET(req: NextRequest) {
  const totalAll = MOCK_EXPERT_STATS_BY_CATEGORY.reduce((acc, s) => acc + s.totalRegistrations, 0);
  const verifiedAll = MOCK_EXPERT_STATS_BY_CATEGORY.reduce((acc, s) => acc + s.verifiedCount, 0);
  const pendingAll = MOCK_EXPERT_STATS_BY_CATEGORY.reduce((acc, s) => acc + s.pendingCount, 0);

  return NextResponse.json({
    summary: {
      totalRegistrations: totalAll,
      verifiedCount: verifiedAll,
      pendingCount: pendingAll
    },
    byCategory: MOCK_EXPERT_STATS_BY_CATEGORY
  });
}
