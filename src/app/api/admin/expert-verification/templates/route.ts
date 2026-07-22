import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// ADMIN EXPERT VERIFICATION TEMPLATES API
// ─────────────────────────────────────────────────────────────────

const EXPERT_VERIFICATION_TEMPLATES: Record<string, any[]> = {
  "PROFESSOR": [
    { id: "chk-exp-01", label: "Verify Faculty ID Card & Institutional Employment", required: true },
    { id: "chk-exp-02", label: "Cross-check Google Scholar Profile & Citation Index", required: true },
    { id: "chk-exp-03", label: "Verify Highest PhD Doctoral Degree Certificate", required: true }
  ],
  "AI_ML_EXPERT": [
    { id: "chk-exp-11", label: "Verify GitHub Profile & Open Source Repositories", required: true },
    { id: "chk-exp-12", label: "Check Kaggle / Technical Certifications Authenticity", required: false },
    { id: "chk-exp-13", label: "Review Production AI Deployment Case Studies", required: true }
  ],
  "CYBER_SECURITY": [
    { id: "chk-exp-21", label: "Verify CEH / OSCP / CISSP Certification Number on Portal", required: true },
    { id: "chk-exp-22", label: "Inspect CVE Contributions & Security Research History", required: false }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryCode = searchParams.get("categoryCode") || "PROFESSOR";

  const checklists = EXPERT_VERIFICATION_TEMPLATES[categoryCode] || [
    { id: "chk-exp-def-1", label: "Verify Curriculum Vitae (CV) & Professional Experience", required: true },
    { id: "chk-exp-def-2", label: "Validate Identity Proof & Educational Qualifications", required: true }
  ];

  return NextResponse.json({
    categoryCode,
    checklists
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categoryCode, checklists } = body;

    if (categoryCode && Array.isArray(checklists)) {
      EXPERT_VERIFICATION_TEMPLATES[categoryCode] = checklists;
    }

    return NextResponse.json({
      success: true,
      categoryCode,
      message: `Expert verification template for ${categoryCode} updated.`
    });
  } catch {
    return NextResponse.json({ error: "Failed to update expert verification template" }, { status: 500 });
  }
}
