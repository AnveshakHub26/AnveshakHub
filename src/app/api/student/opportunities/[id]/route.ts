import { NextRequest, NextResponse } from "next/server";

const MOCK_OPP_DETAILS: Record<string, any> = {
  "opp-std-001": {
    id: "opp-std-001",
    title: "Hardware Inverter Testbed Internship",
    industryName: "Solaris Power Pvt Ltd",
    domain: "Embedded Systems & Clean Energy",
    stipend: 25000.00,
    durationWeeks: 16,
    deadline: "2026-08-15T00:00:00Z",
    status: "OPEN",
    isSaved: true,
    hasApplied: true,
    applicationStatus: "SELECTED",
    description: "Hands-on internship for CS/EE undergrads to calibrate ADC sensors and debug ring topology firmware under expert guidance.",
    requirements: ["C++", "MATLAB", "SIMULINK", "Embedded Systems"],
    eligibilityScore: 96,
    scopeOfWork: "Phase 1: Calibrate Node 3 ADC sampling rate.\nPhase 2: Perform HIL simulation testing in IIT Madras energy lab.",
    createdAt: "2026-07-01T10:00:00Z"
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const opp = MOCK_OPP_DETAILS[id] || {
    ...MOCK_OPP_DETAILS["opp-std-001"],
    id,
    title: `Opportunity ${id}`
  };

  return NextResponse.json(opp);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, isSaved } = body;

  return NextResponse.json({
    success: true,
    id,
    isSaved: isSaved !== undefined ? isSaved : true,
    message: "Watchlist status updated."
  });
}
