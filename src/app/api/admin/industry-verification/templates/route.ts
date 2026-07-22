import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// ADMIN INDUSTRY VERIFICATION TEMPLATES API
// ─────────────────────────────────────────────────────────────────

const VERIFICATION_TEMPLATES: Record<string, any[]> = {
  "STARTUP": [
    { id: "chk-01", label: "Verify DPIIT Recognition Number on Portal", required: true },
    { id: "chk-02", label: "Inspect Company PAN & Identity Documents", required: true },
    { id: "chk-03", label: "Validate Official Email Domain Authenticity", required: true }
  ],
  "MSME": [
    { id: "chk-11", label: "Verify UDYAM Registration Certificate on MSME Portal", required: true },
    { id: "chk-12", label: "Cross-check GSTIN Status & Active Filing Record", required: true },
    { id: "chk-13", label: "Verify Annual Turnover Threshold Category", required: false }
  ],
  "INSTITUTION": [
    { id: "chk-21", label: "Verify AICTE Approval Order Authenticity", required: true },
    { id: "chk-22", label: "Check NAAC Grade Certificate & UGC Approval Status", required: true },
    { id: "chk-23", label: "Verify Principal / Placement Officer Contact Letter", required: true }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeCode = searchParams.get("typeCode") || "STARTUP";

  const checklists = VERIFICATION_TEMPLATES[typeCode] || [
    { id: "chk-default-1", label: "Verify Incorporation Certificate / MCA Registration", required: true },
    { id: "chk-default-2", label: "Validate GSTIN & Statutory PAN Credentials", required: true }
  ];

  return NextResponse.json({
    typeCode,
    checklists
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { typeCode, checklists } = body;

    if (typeCode && Array.isArray(checklists)) {
      VERIFICATION_TEMPLATES[typeCode] = checklists;
    }

    return NextResponse.json({
      success: true,
      typeCode,
      message: `Verification template for ${typeCode} updated.`
    });
  } catch {
    return NextResponse.json({ error: "Failed to update verification template" }, { status: 500 });
  }
}
