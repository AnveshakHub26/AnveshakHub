import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-004 STUDENT PROJECTS & TASK MANAGEMENT API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_PROJECTS = [
  {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    industryPartner: "Solaris Power Pvt Ltd",
    leadExpert: "Dr. Arunima Krishnan",
    role: "Intern Hardware Lead",
    progress: 68,
    status: "IN_PROGRESS",
    milestonesCount: 4,
    completedMilestonesCount: 2,
    assignedTasksCount: 4,
    completedTasksCount: 3,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    projects: MOCK_STUDENT_PROJECTS,
    total: MOCK_STUDENT_PROJECTS.length
  });
}
