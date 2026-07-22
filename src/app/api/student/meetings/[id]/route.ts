import { NextRequest, NextResponse } from "next/server";

const MOCK_MEETING_DETAILS: Record<string, any> = {
  "mtg-std-001": {
    id: "mtg-std-001",
    title: "Sprint 2 Review – Solar Micro-Grid",
    orgName: "Solaris Power Pvt Ltd",
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    status: "SCHEDULED",
    agenda: "Review Sprint 2 Node 3 ADC sensor sampling rate calibration and SIMULINK test logs.",
    momNotes: "Pre-meeting alignment with Dr. Arunima Krishnan complete. Node 3 ADC noise filter specs verified.",
    actionItems: [
      { id: "act-1", text: "Upload Node 3 ADC calibration test log PDF", done: true },
      { id: "act-2", text: "Prepare 5-slide SIMULINK ring topology summary deck", done: false }
    ],
    participants: [
      { name: "Dr. Arunima Krishnan", role: "Lead Expert Mentor" },
      { name: "Arpit Goel", role: "Student Hardware Intern" },
      { name: "Solaris Engineering Desk", role: "Industry Host" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mtg = MOCK_MEETING_DETAILS[id] || {
    ...MOCK_MEETING_DETAILS["mtg-std-001"],
    id,
    title: `Meeting ${id}`
  };

  return NextResponse.json(mtg);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, actId, done, momNotes } = body;

  const mtg = MOCK_MEETING_DETAILS[id] || MOCK_MEETING_DETAILS["mtg-std-001"];

  if (action === "TOGGLE_ACTION" && actId) {
    const item = mtg.actionItems.find((a: any) => a.id === actId);
    if (item) item.done = done !== undefined ? done : !item.done;
  }

  if (momNotes !== undefined) {
    mtg.momNotes = momNotes;
  }

  return NextResponse.json({
    success: true,
    id,
    meeting: mtg,
    message: "Meeting details updated."
  });
}
