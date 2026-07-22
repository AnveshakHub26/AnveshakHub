import { NextRequest, NextResponse } from "next/server";

const MOCK_MEETING_DETAILS: Record<string, any> = {
  "mtg-001": {
    id: "mtg-001",
    title: "Sprint 2 Review – Solar Micro-Grid",
    orgName: "Solaris Power Pvt Ltd",
    projectId: "prj-001",
    projectName: "Solar Micro-Grid for IIT Madras",
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    status: "SCHEDULED",
    agenda: "Review Node 3 ADC calibration test results & ring topology latency benchmark.",
    momNotes: "1. Node 3 ADC sampling rate verified at 10kHz.\n2. Ring topology baud rate mismatch resolved by software patch.\n3. Next steps: Deploy on physical solar panel inverter testbed.",
    actionItems: [
      { id: "act-1", title: "Flash updated firmware to Node 3 board", assignee: "Arpit Goel", status: "IN_PROGRESS", dueDate: "2026-07-29" },
      { id: "act-2", title: "Submit SIMULINK benchmark comparison table", assignee: "Rishika Roy", status: "DONE", dueDate: "2026-07-25" }
    ],
    participants: [
      { name: "Dr. Arunima Krishnan", role: "Expert Advisor" },
      { name: "Rajesh Sharma", role: "Solaris Industry Lead" },
      { name: "Arpit Goel", role: "Intern Hardware Lead" },
      { name: "Rishika Roy", role: "Intern Software Lead" }
    ],
    documents: [
      { id: "doc-m1", name: "Sprint 2 Agenda & Inverter Spec.pdf", url: "https://storage.anvesha.in/docs/agenda-sprint2.pdf" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mtg = MOCK_MEETING_DETAILS[id] || {
    ...MOCK_MEETING_DETAILS["mtg-001"],
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
  const { action, momNotes, actionItemId, actionItemStatus, newActionTitle, assignee } = body;

  const mtg = MOCK_MEETING_DETAILS[id] || MOCK_MEETING_DETAILS["mtg-001"];

  if (action === "SAVE_MOM" && momNotes !== undefined) {
    mtg.momNotes = momNotes;
  }

  if (action === "TOGGLE_ACTION" && actionItemId) {
    const item = mtg.actionItems.find((a: any) => a.id === actionItemId);
    if (item) item.status = actionItemStatus || (item.status === "DONE" ? "IN_PROGRESS" : "DONE");
  }

  if (action === "ADD_ACTION" && newActionTitle) {
    mtg.actionItems.push({
      id: `act-${Date.now()}`,
      title: newActionTitle,
      assignee: assignee || "Dr. Arunima Krishnan",
      status: "IN_PROGRESS",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
  }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Meeting workspace updated successfully.",
    meeting: mtg
  });
}
