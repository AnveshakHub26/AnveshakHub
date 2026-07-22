import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// DYNAMIC EXPERT REGISTRATION SUBMISSION API
// ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      expertCategoryCode,
      fullName,
      email,
      mobileNumber,
      country,
      state,
      city,
      biography,
      categoryAttributes,
      uploadedDocuments
    } = body;

    if (!fullName || !email || !expertCategoryCode) {
      return NextResponse.json({ error: "Missing required core registration fields" }, { status: 400 });
    }

    const registrationId = `EXP-REG-${Date.now()}`;

    return NextResponse.json({
      success: true,
      registrationId,
      expertCategoryCode,
      fullName,
      status: "PENDING_VERIFICATION",
      message: `Expert registration for '${fullName}' (${expertCategoryCode}) submitted successfully. The AnveshakHub Expert Verification Panel will review your academic & professional credentials within 24 business hours.`
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit dynamic expert registration" }, { status: 500 });
  }
}
