import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-006 STUDENT MEETINGS & COLLABORATION API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_MEETINGS = [
  {
    id: "mtg-std-001",
    title: "Sprint 2 Review – Solar Micro-Grid",
    orgName: "Solaris Power Pvt Ltd",
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    status: "SCHEDULED",
    agenda: "Review Sprint 2 Node 3 ADC sensor sampling rate calibration and SIMULINK test logs.",
    momNotes: "Meeting scheduled. Agenda pre-circulated to Dr. Arunima Krishnan.",
    actionItems: [
      { id: "act-1", text: "Upload Node 3 ADC calibration test log PDF", done: true },
      { id: "act-2", text: "Prepare 5-slide SIMULINK ring topology summary deck", done: false }
    ]
  },
  {
    id: "mtg-std-002",
    title: "Biweekly Mentorship Sync with Dr. Arunima",
    orgName: "IIT Madras Research Desk",
    startTime: "2026-08-05T15:00:00+05:30",
    endTime: "2026-08-05T16:00:00+05:30",
    platform: "MS_TEAMS",
    videoLink: "https://teams.microsoft.com/l/meetup-join/123",
    status: "SCHEDULED",
    agenda: "Discuss IEEE student paper submission draft and career goals.",
    momNotes: "",
    actionItems: []
  }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    meetings: MOCK_STUDENT_MEETINGS,
    total: MOCK_STUDENT_MEETINGS.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, startTime, agenda } = body;

    const newMeeting = {
      id: `mtg-std-${Date.now()}`,
      title: title || "Student Mentor Review Session",
      orgName: "IIT Madras Research Desk",
      startTime: startTime || new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(),
      platform: "GOOGLE_MEET",
      videoLink: "https://meet.google.com/xyz-uvw-rst",
      status: "SCHEDULED",
      agenda: agenda || "General progress review session.",
      momNotes: "Session requested by student.",
      actionItems: []
    };

    MOCK_STUDENT_MEETINGS.unshift(newMeeting);

    return NextResponse.json({
      success: true,
      meeting: newMeeting,
      message: "Review call requested with lead expert mentor."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 });
  }
}
