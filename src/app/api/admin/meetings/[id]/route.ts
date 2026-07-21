import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_MEETING_PROFILES: Record<string, any> = {
  "mtg-001": {
    id: "mtg-001",
    title: "Weekly Solar Sync & Inverter Calibration Review",
    agenda: "Review serial telemetry driver outcomes, Node 3 frame drop details, and finalize sensor calibration constants.",
    participants: ["dr.arunima@aiml.in", "arpit.goel@iitmadras.ac.in", "solar.lead@solaris.com"],
    startTime: "2026-07-25T10:00:00Z",
    endTime: "2026-07-25T11:00:00Z",
    platform: "GOOGLE_MEET",
    videoLink: "https://meet.google.com/abc-defg-hij",
    recordingUrl: "https://drive.google.com/rec/abc-defg-hij",
    outcomes: "Calibrated serial driver baud limits to 115200 on Node 3; outcomes saved in project docs.",
    notes: "Review next sprint deliverables on ring topology flight checks.",
    project: {
      id: "prj-001",
      name: "Solar Micro-Grid for IIT Madras"
    },
    actionItemsList: [
      { id: "act-001", title: "Apply new calibration constant", assigneeId: "Arpit Goel", status: "PENDING", dueDate: "2026-07-27" },
      { id: "act-002", title: "Upload test reports to contract repository", assigneeId: "Dr. Arunima K.", status: "COMPLETED", dueDate: "2026-07-26" }
    ],
    feedbacks: [
      { id: "fb-001", rating: 5, comment: "Crisp and outcome-oriented discussion." }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const meeting = await prisma.meeting.findUnique({
  //   where: { id },
  //   include: { project: true, actionItemsList: true, feedbacks: true }
  // });

  const detail = MOCK_MEETING_PROFILES[id] || MOCK_MEETING_PROFILES["mtg-001"];

  if (detail && detail.id !== id) {
    return NextResponse.json({ ...detail, id, title: `Meeting ${id}` });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, startTime, endTime, title, agenda, status, itemId } = body;

  // API Integration Point:
  // if (action === "RESCHEDULE") {
  //   await prisma.meeting.update({ where: { id }, data: { startTime, endTime } });
  // } else if (action === "ADD_ACTION_ITEM") {
  //   await prisma.meetingActionItem.create({ data: { meetingId: id, title, status: "PENDING" } });
  // } else if (action === "TOGGLE_ACTION_ITEM") {
  //   await prisma.meetingActionItem.update({ where: { id: itemId }, data: { status } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Meeting schedule updated successfully",
    timestamp: new Date().toISOString()
  });
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, title, dueDate, assigneeId } = body;

  return NextResponse.json({
    success: true,
    id: `act-${Date.now()}`,
    action,
    title,
    assigneeId,
    dueDate,
    status: "PENDING",
    createdAt: new Date().toISOString()
  });
}
