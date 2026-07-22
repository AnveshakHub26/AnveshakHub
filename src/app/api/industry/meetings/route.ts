import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_MEETINGS = [
  {
    id: "mtg-001",
    orgId: DEMO_ORG_ID,
    title: "Sprint 2 Review – Solar Micro-Grid",
    agenda: "Review Ring Topology Communication test results; Discuss node 3 calibration issue; Plan Sprint 3 scope.",
    momNotes: "Sprint 2 Ring Topology test achieved 80% signal success. Node 3 baud rate issue identified and assigned to Arpit.",
    participants: ["Dr. Arunima Krishnan", "Rajesh Sharma", "Arpit Goel", "Rishika Roy"],
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    recordingUrl: null,
    status: "SCHEDULED",
    isRecurring: false,
    recurrenceRule: null,
    projectId: "prj-001",
    actionItems: [
      { id: "ai-001", title: "Fix baud rate mismatch on Node 3", assignee: "Arpit Goel", dueDate: "2026-07-30T00:00:00Z", isCompleted: false },
      { id: "ai-002", title: "Update Sprint 3 task planning doc", assignee: "Rishika Roy", dueDate: "2026-07-31T00:00:00Z", isCompleted: false }
    ],
    documents: [],
    createdAt: "2026-07-22T09:00:00Z"
  },
  {
    id: "mtg-002",
    orgId: DEMO_ORG_ID,
    title: "Rover Control Module Kickoff",
    agenda: "Introduce project scope; Assign roles; Review software architecture proposal.",
    momNotes: null,
    participants: ["Dr. Rohan Das", "Kabir Verma", "Rajesh Sharma"],
    startTime: "2026-08-02T14:00:00+05:30",
    endTime: "2026-08-02T15:00:00+05:30",
    platform: "MICROSOFT_TEAMS",
    videoLink: "https://teams.microsoft.com/l/meetup-join/rover",
    recordingUrl: null,
    status: "SCHEDULED",
    isRecurring: true,
    recurrenceRule: "WEEKLY_FRIDAY",
    projectId: "prj-004",
    actionItems: [],
    documents: [],
    createdAt: "2026-07-22T10:00:00Z"
  },
  {
    id: "mtg-003",
    orgId: DEMO_ORG_ID,
    title: "Monthly Stakeholder Sync – Solaris Power",
    agenda: "Budget review; Milestone status update; Upcoming compliance review.",
    momNotes: "All milestones are on track. Budget utilization at 69%. Compliance audit scheduled for Aug 20.",
    participants: ["Rajesh Sharma", "Nisha Patel", "Priya Nair"],
    startTime: "2026-07-15T16:00:00+05:30",
    endTime: "2026-07-15T17:00:00+05:30",
    platform: "ZOOM",
    videoLink: "https://zoom.us/j/solaris-monthly",
    recordingUrl: "https://storage.anvesha.in/recordings/mtg-003.mp4",
    status: "COMPLETED",
    isRecurring: true,
    recurrenceRule: "MONTHLY_LAST_TUESDAY",
    projectId: null,
    actionItems: [
      { id: "ai-003", title: "Submit compliance audit documents", assignee: "Priya Nair", dueDate: "2026-08-18T00:00:00Z", isCompleted: true }
    ],
    documents: [
      { id: "doc-001", name: "July MoM Summary.pdf", fileSize: 512000, uploadedBy: "Nisha Patel", createdAt: "2026-07-15T18:00:00Z" }
    ],
    createdAt: "2026-07-01T09:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const platform = searchParams.get("platform") || "";
  const status = searchParams.get("status") || "ALL";

  let filtered = MOCK_MEETINGS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.title.toLowerCase().includes(q) || m.agenda?.toLowerCase().includes(q));
  }

  if (platform && platform !== "ALL") {
    filtered = filtered.filter(m => m.platform === platform);
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter(m => m.status === status);
  }

  // Stats for dashboard
  const total = MOCK_MEETINGS.length;
  const scheduled = MOCK_MEETINGS.filter(m => m.status === "SCHEDULED").length;
  const completed = MOCK_MEETINGS.filter(m => m.status === "COMPLETED").length;
  const upcomingToday = MOCK_MEETINGS.filter(m => {
    const meetDate = new Date(m.startTime).toDateString();
    return meetDate === new Date().toDateString() && m.status === "SCHEDULED";
  }).length;

  return NextResponse.json({
    meetings: filtered,
    total: filtered.length,
    stats: { total, scheduled, completed, upcomingToday }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, agenda, participants, startTime, endTime, platform, videoLink, isRecurring, recurrenceRule, projectId } = body;

    const newMeeting = {
      id: `mtg-${Date.now()}`,
      orgId: DEMO_ORG_ID,
      title,
      agenda,
      momNotes: null,
      participants: participants || [],
      startTime,
      endTime,
      platform: platform || "GOOGLE_MEET",
      videoLink: videoLink || null,
      recordingUrl: null,
      status: "SCHEDULED",
      isRecurring: isRecurring || false,
      recurrenceRule: recurrenceRule || null,
      projectId: projectId || null,
      actionItems: [],
      documents: [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      meeting: newMeeting,
      message: "Meeting scheduled successfully. Calendar invites sent to all participants."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 });
  }
}
