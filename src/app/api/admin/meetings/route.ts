import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_MEETINGS = [
  {
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
  },
  {
    id: "mtg-002",
    title: "MIDA MRI Architecture Setup & Compliance",
    agenda: "Approve convolution-transformer dataset formatting guidelines and review ethical clearance protocols.",
    participants: ["dr.arunima@aiml.in", "rishika.roy@iisc.ac.in", "compliance@biogen.in"],
    startTime: "2026-07-26T14:30:00Z",
    endTime: "2026-07-26T16:00:00Z",
    platform: "ZOOM",
    videoLink: "https://zoom.us/j/9876543210",
    recordingUrl: null,
    outcomes: "Approved boundary segmentation guidelines for primary validation datasets.",
    notes: "Ensure final HIPAA compliance document is uploaded by end of month.",
    project: {
      id: "prj-002",
      name: "Medical Imaging Diagnostic Accelerator"
    },
    actionItemsList: [
      { id: "act-003", title: "Submit dataset compliance signs", assigneeId: "Rishika Roy", status: "PENDING", dueDate: "2026-07-29" }
    ],
    feedbacks: []
  },
  {
    id: "mtg-003",
    title: "Avionics RF Spectrum Coordination Flight Check",
    agenda: "Finalize transceiver frequency bounds matching local aviation safety rules.",
    participants: ["rohan.das@spaceaero.in", "neha.gupta@bits.ac.in"],
    startTime: "2026-07-27T09:00:00Z",
    endTime: "2026-07-27T10:30:00Z",
    platform: "PHYSICAL",
    videoLink: null,
    recordingUrl: null,
    outcomes: "Agreed to limit test frequencies to the standard ISM 2.4GHz band to avoid interference.",
    notes: "Physical test scheduled at IIT Madras research hangar.",
    project: {
      id: "prj-003",
      name: "Avionics Telemetry Hub for UAVs"
    },
    actionItemsList: [],
    feedbacks: []
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const platform = searchParams.get("platform") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [meetings, total] = await Promise.all([
  //   prisma.meeting.findMany({ where: {...}, include: { project: true, actionItemsList: true, feedbacks: true }, skip, take }),
  //   prisma.meeting.count({ where: {...} })
  // ]);

  let filtered = MOCK_MEETINGS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.agenda.toLowerCase().includes(q) ||
        (m.project?.name && m.project.name.toLowerCase().includes(q))
    );
  }

  if (platform && platform !== "ALL") {
    filtered = filtered.filter((m) => m.platform === platform);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Stats summaries
  const stats = {
    total: MOCK_MEETINGS.length,
    upcoming: MOCK_MEETINGS.filter((m) => new Date(m.startTime) > new Date()).length,
    completed: MOCK_MEETINGS.filter((m) => new Date(m.endTime) <= new Date()).length,
    thisWeek: MOCK_MEETINGS.length // simplifies mock UI
  };

  return NextResponse.json({
    meetings: paginated,
    total,
    page,
    limit,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // API Integration Point:
    // const newMeeting = await prisma.meeting.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `mtg-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      actionItemsList: [],
      feedbacks: []
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to schedule meeting" }, { status: 500 });
  }
}
