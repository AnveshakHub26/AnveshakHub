import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC INDUSTRY REGISTRATION SUBMISSION API
// ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      industryTypeCode,
      organizationName,
      officialEmail,
      contactNumber,
      website,
      country,
      state,
      city,
      pinCode,
      typeAttributes,
      uploadedDocuments
    } = body;

    if (!organizationName || !officialEmail || !industryTypeCode) {
      return NextResponse.json({ error: "Missing required core registration fields" }, { status: 400 });
    }

    const registrationId = `IND-REG-${Date.now()}`;

    return NextResponse.json({
      success: true,
      registrationId,
      industryTypeCode,
      organizationName,
      status: "PENDING_VERIFICATION",
      message: `Registration for '${organizationName}' (${industryTypeCode}) submitted successfully. Admin verification team will inspect your statutory credentials within 24 business hours.`
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit dynamic industry registration" }, { status: 500 });
  }
}
