import { NextRequest, NextResponse } from "next/server";

const MOCK_MEETING_PROFILES: Record<string, any> = {
  "mtg-001": {
    id: "mtg-001",
    title: "Sprint 2 Review – Solar Micro-Grid",
    agenda: "Review Ring Topology Communication test results; Discuss node 3 calibration issue; Plan Sprint 3 scope.",
    momNotes: "Sprint 2 Ring Topology test achieved 80% signal success. Node 3 baud rate issue identified and assigned to Arpit. Dr. Arunima to provide calibration ADC spec by Friday.",
    participants: [
      { name: "Dr. Arunima Krishnan", role: "Subject Expert", status: "ACCEPTED" },
      { name: "Rajesh Sharma", role: "Org Admin", status: "ACCEPTED" },
      { name: "Arpit Goel", role: "Student Intern", status: "ACCEPTED" },
      { name: "Rishika Roy", role: "Student Intern", status: "PENDING" }
    ],
    startTime: "2026-07-28T10:00:00+05:30",
    endTime: "2026-07-28T11:30:00+05:30",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-def-ghi",
    recordingUrl: null,
    status: "SCHEDULED",
    isRecurring: false,
    recurrenceRule: null,
    projectId: "prj-001",
    projectName: "Solar Micro-Grid for IIT Madras",
    actionItems: [
      { id: "ai-001", title: "Fix baud rate mismatch on Node 3", assignee: "Arpit Goel", dueDate: "2026-07-30T00:00:00Z", isCompleted: false, priority: "HIGH" },
      { id: "ai-002", title: "Update Sprint 3 task planning document in vault", assignee: "Rishika Roy", dueDate: "2026-07-31T00:00:00Z", isCompleted: false, priority: "MEDIUM" },
      { id: "ai-003", title: "Send calibration ADC specification sheet", assignee: "Dr. Arunima Krishnan", dueDate: "2026-07-26T00:00:00Z", isCompleted: false, priority: "CRITICAL" }
    ],
    documents: [],
    timeline: [
      { id: "tl-001", event: "Meeting Scheduled", performedBy: "Rajesh Sharma", createdAt: "2026-07-22T09:00:00Z" },
      { id: "tl-002", event: "Invite Accepted by Dr. Arunima Krishnan", performedBy: "System", createdAt: "2026-07-22T09:15:00Z" }
    ],
    createdAt: "2026-07-22T09:00:00Z"
  },
  "mtg-003": {
    id: "mtg-003",
    title: "Monthly Stakeholder Sync – Solaris Power",
    agenda: "Budget review; Milestone status update; Upcoming compliance review.",
    momNotes: "All milestones are on track. Budget utilization at 69%. Compliance audit scheduled for Aug 20. Priya to submit all audit documentation by Aug 18.",
    participants: [
      { name: "Rajesh Sharma", role: "Org Admin", status: "ACCEPTED" },
      { name: "Nisha Patel", role: "Finance Head", status: "ACCEPTED" },
      { name: "Priya Nair", role: "Compliance Officer", status: "ACCEPTED" }
    ],
    startTime: "2026-07-15T16:00:00+05:30",
    endTime: "2026-07-15T17:00:00+05:30",
    platform: "ZOOM",
    videoLink: "https://zoom.us/j/solaris-monthly",
    recordingUrl: "https://storage.anvesha.in/recordings/mtg-003.mp4",
    status: "COMPLETED",
    isRecurring: true,
    recurrenceRule: "MONTHLY_LAST_TUESDAY",
    projectId: null,
    projectName: null,
    actionItems: [
      { id: "ai-003", title: "Submit compliance audit documents", assignee: "Priya Nair", dueDate: "2026-08-18T00:00:00Z", isCompleted: true, priority: "HIGH" }
    ],
    documents: [
      { id: "doc-001", name: "July MoM Summary.pdf", fileSize: 512000, uploadedBy: "Nisha Patel", createdAt: "2026-07-15T18:00:00Z" }
    ],
    timeline: [
      { id: "tl-003", event: "Meeting Held", performedBy: "System", createdAt: "2026-07-15T17:01:00Z" },
      { id: "tl-004", event: "MoM Notes Saved", performedBy: "Nisha Patel", createdAt: "2026-07-15T17:30:00Z" },
      { id: "tl-005", event: "Recording Uploaded", performedBy: "System", createdAt: "2026-07-15T18:00:00Z" }
    ],
    createdAt: "2026-07-01T09:00:00Z"
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = MOCK_MEETING_PROFILES[id] || MOCK_MEETING_PROFILES["mtg-001"];
  if (profile.id !== id) {
    return NextResponse.json({ ...profile, id, title: `Meeting ${id}`, status: "SCHEDULED", actionItems: [], documents: [], timeline: [] });
  }
  return NextResponse.json(profile);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, momNotes, actionItemId, isCompleted, aiTitle, aiAssignee, aiDueDate, aiPriority, docName, docSize } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Meeting data updated.",
    timestamp: new Date().toISOString(),
    momNotes: momNotes ? { saved: true, content: momNotes } : undefined,
    actionItem: actionItemId
      ? { id: actionItemId, isCompleted }
      : aiTitle
      ? { id: `ai-${Date.now()}`, title: aiTitle, assignee: aiAssignee, dueDate: aiDueDate, priority: aiPriority || "MEDIUM", isCompleted: false }
      : undefined,
    document: docName
      ? { id: `doc-${Date.now()}`, name: docName, fileSize: docSize || 1024000, uploadedBy: "Rajesh Sharma", createdAt: new Date().toISOString() }
      : undefined
  });
}
