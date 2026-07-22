import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-005 STUDENT MENTORSHIP & TALENT DEVELOPMENT API
// ─────────────────────────────────────────────────────────────────

const MOCK_MENTEES = [
  {
    id: "std-001",
    name: "Arpit Goel",
    email: "arpit.goel@iitm.ac.in",
    usn: "CS21B042",
    institution: "IIT Madras",
    degree: "B.Tech Computer Science",
    semester: 7,
    cgpa: 9.4,
    assignedProject: "Solar Micro-Grid for IIT Madras",
    assignedRole: "Intern Hardware Lead",
    technicalSkillScore: 4.8,
    softSkillScore: 4.6,
    overallScore: 4.7,
    attendanceRate: 96,
    completedTasksCount: 8,
    totalTasksCount: 10,
    status: "ACTIVE",
    recommendationIssued: false,
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "std-002",
    name: "Rishika Roy",
    email: "rishika.roy@iitm.ac.in",
    usn: "CS21B089",
    institution: "IIT Madras",
    degree: "B.Tech Electrical Engg",
    semester: 7,
    cgpa: 9.1,
    assignedProject: "Solar Micro-Grid for IIT Madras",
    assignedRole: "Intern Software Lead",
    technicalSkillScore: 4.6,
    softSkillScore: 4.9,
    overallScore: 4.75,
    attendanceRate: 92,
    completedTasksCount: 6,
    totalTasksCount: 8,
    status: "ACTIVE",
    recommendationIssued: false,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "std-003",
    name: "Kabir Verma",
    email: "kabir.v@iisc.ac.in",
    usn: "ME22M014",
    institution: "IISc Bangalore",
    degree: "M.Tech Autonomous Systems",
    semester: 3,
    cgpa: 9.6,
    assignedProject: "Autonomous Rover Control Module",
    assignedRole: "AI Perception Intern",
    technicalSkillScore: 4.9,
    softSkillScore: 4.7,
    overallScore: 4.8,
    attendanceRate: 98,
    completedTasksCount: 7,
    totalTasksCount: 8,
    status: "ACTIVE",
    recommendationIssued: true,
    createdAt: "2026-03-20T10:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const project = searchParams.get("project") || "ALL";

  let filtered = MOCK_MENTEES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.institution.toLowerCase().includes(q) ||
      m.assignedProject.toLowerCase().includes(q)
    );
  }

  if (project && project !== "ALL") {
    filtered = filtered.filter(m => m.assignedProject.includes(project));
  }

  return NextResponse.json({
    mentees: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, attendanceStatus, date, notes } = body;

    return NextResponse.json({
      success: true,
      attendanceId: `att-${Date.now()}`,
      studentId,
      status: attendanceStatus || "PRESENT",
      date: date || new Date().toISOString(),
      message: "Student attendance recorded successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to record attendance" }, { status: 500 });
  }
}
