import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-006 EXPERT MEETINGS & COLLABORATION API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_MEETINGS = [
  {
    id: "mtg-001",
    title: "Sprint 2 Review – Solar Micro-Grid",
    orgName: "Solaris Power Pvt Ltd",
    projectId: "prj-001",
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    status: "SCHEDULED",
    agenda: "Review Node 3 ADC calibration test results & ring topology latency benchmark.",
    participantsCount: 5,
    isRecurring: true,
    hasMom: true,
    createdAt: "2026-07-20T10:00:00Z"
  },
  {
    id: "mtg-002",
    title: "Rover Control Module Architecture Sync",
    orgName: "Robotics Corp",
    projectId: "prj-004",
    startTime: "2026-08-02T14:00:00+05:30",
    endTime: "2026-08-02T15:30:00+05:30",
    platform: "MICROSOFT_TEAMS",
    videoLink: "https://teams.microsoft.com/l/meetup-join/rover",
    status: "SCHEDULED",
    agenda: "ROS2 SLAM package integration & point cloud sensor fusion review.",
    participantsCount: 4,
    isRecurring: false,
    hasMom: false,
    createdAt: "2026-07-15T11:00:00Z"
  },
  {
    id: "mtg-003",
    title: "Student Intern Progress & Mid-Term Review",
    orgName: "IIT Madras R&D Cell",
    projectId: "prj-001",
    startTime: "2026-07-15T16:00:00+05:30",
    endTime: "2026-07-15T17:00:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/xyz-uvw-rst",
    status: "COMPLETED",
    agenda: "Review Arpit & Rishika mid-term internship progress and learning goal completion.",
    participantsCount: 3,
    isRecurring: false,
    hasMom: true,
    createdAt: "2026-07-10T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  let filtered = MOCK_EXPERT_MEETINGS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.title.toLowerCase().includes(q) || m.orgName.toLowerCase().includes(q));
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter(m => m.status === status);
  }

  return NextResponse.json({
    meetings: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, orgName, startTime, endTime, platform, agenda } = body;

    const newMtg = {
      id: `mtg-${Date.now()}`,
      title,
      orgName: orgName || "Industry Partner",
      projectId: null,
      startTime: startTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: endTime || new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      platform: platform || "GOOGLE_MEET",
      videoLink: "https://meet.google.com/new-session",
      status: "SCHEDULED",
      agenda: agenda || "",
      participantsCount: 4,
      isRecurring: false,
      hasMom: false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      meeting: newMtg,
      message: "Meeting scheduled and calendar invitations dispatched."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 });
  }
}
