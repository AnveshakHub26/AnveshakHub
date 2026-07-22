import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-004 EXPERT PROJECTS DIRECTORY API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_PROJECTS = [
  {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    industryPartner: "Solaris Power Pvt Ltd",
    status: "IN_PROGRESS",
    role: "Lead Technical Advisor",
    budget: 7500000.00,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z",
    progress: 68,
    milestonesCount: 4,
    completedMilestonesCount: 2,
    tasksCount: 18,
    completedTasksCount: 12,
    studentMenteesCount: 2,
    deliverablesCount: 3,
    createdAt: "2026-01-01T10:00:00Z"
  },
  {
    id: "prj-004",
    name: "Autonomous Rover Control Module",
    industryPartner: "Robotics Corp",
    status: "UNDER_REVIEW",
    role: "AI Consultant",
    budget: 4500000.00,
    startDate: "2026-03-15T00:00:00Z",
    endDate: "2026-09-15T00:00:00Z",
    progress: 45,
    milestonesCount: 3,
    completedMilestonesCount: 1,
    tasksCount: 12,
    completedTasksCount: 5,
    studentMenteesCount: 1,
    deliverablesCount: 1,
    createdAt: "2026-03-15T10:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  let filtered = MOCK_EXPERT_PROJECTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.industryPartner.toLowerCase().includes(q));
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter(p => p.status === status);
  }

  return NextResponse.json({
    projects: filtered,
    total: filtered.length
  });
}
