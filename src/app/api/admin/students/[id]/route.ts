import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_PROFILES: Record<string, any> = {
  "std-001": {
    id: "std-001",
    userId: "usr-std-001",
    user: {
      name: "Arpit Goel",
      email: "arpit.goel@iitmadras.ac.in",
      avatarUrl: null
    },
    usn: "CS22M012",
    institution: "IIT Madras",
    degree: "M.Tech",
    branch: "Computer Science & Engineering",
    semester: 4,
    cgpa: 9.4,
    bio: "M.Tech candidate at IIT Madras specializing in Computer Vision and Transformer Architectures. Active developer with strong background in PyTorch, distributed deep learning, and REST APIs.",
    skills: ["Python", "PyTorch", "Transformers", "SQL", "Git", "C++", "Docker"],
    resumeUrl: "/mock/resume.pdf",
    portfolioUrl: "https://arpitgoel.dev",
    linkedinUrl: "linkedin.com/in/arpit-goel",
    githubUrl: "github.com/arpitgoel",
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expert: {
      id: "exp-001",
      name: "Dr. Arunima Krishnan",
      designation: "Professor & Head of AI Research",
      email: "dr.arunima@aiml.in"
    },
    industry: {
      id: "ind-001",
      orgName: "Solaris Power Pvt Ltd",
      email: "info@solarispower.in"
    },
    project: {
      id: "proj-001",
      name: "Solar Micro-Grid for IIT Madras",
      status: "ACTIVE"
    },
    documents: [
      { id: "std-doc-001", name: "Academic Resume.pdf", docType: "RESUME", fileUrl: "/mock/resume.pdf", status: "APPROVED", createdAt: "2026-05-15T09:00:00Z" },
      { id: "std-doc-002", name: "Semester 3 Marksheet.pdf", docType: "MARKS_CARD", fileUrl: "/mock/marksheet.pdf", status: "APPROVED", createdAt: "2026-05-15T09:10:00Z" },
      { id: "std-doc-003", name: "PyTorch Deep Learning Cert", docType: "CERTIFICATE", fileUrl: "/mock/cert.pdf", status: "APPROVED", createdAt: "2026-06-20T12:00:00Z" }
    ],
    applications: [
      { id: "app-001", industryName: "Solaris Power Pvt Ltd", status: "PLACED", coverLetter: "I would like to apply for the solar microgrid developer role...", createdAt: "2026-05-18T10:00:00Z" },
      { id: "app-002", industryName: "Vayu Aerospace Solutions", status: "SHORTLISTED", coverLetter: "Intrigued by drone control systems using PyTorch...", createdAt: "2026-05-20T11:00:00Z" }
    ],
    attendance: [
      { id: "att-001", date: "2026-07-15", status: "PRESENT", notes: "Working from lab." },
      { id: "att-002", date: "2026-07-16", status: "PRESENT", notes: "Completed Git sync." },
      { id: "att-003", date: "2026-07-17", status: "PRESENT", notes: "Meeting with expert guide." },
      { id: "att-004", date: "2026-07-18", status: "LEAVE", notes: "University seminar attendance approved." },
      { id: "att-005", date: "2026-07-21", status: "PRESENT", notes: "Active project session." }
    ],
    milestones: [
      { id: "ms-001", title: "Literature Review on Micro-grids", description: "Read at least 15 research papers.", status: "COMPLETED", rating: 5, dueDate: "2026-06-15", createdAt: "2026-05-20T00:00:00Z" },
      { id: "ms-002", title: "Avionics Protocol Setup", description: "Configure baseline telemetry serial interface.", status: "COMPLETED", rating: 4, dueDate: "2026-07-01", createdAt: "2026-05-20T00:00:00Z" },
      { id: "ms-003", title: "Model Deployment & Evaluation", description: "Achieve at least 92% speed diagnostics.", status: "PENDING", rating: null, dueDate: "2026-08-15", createdAt: "2026-05-20T00:00:00Z" }
    ],
    timeline: [
      { id: "tl-std-001", event: "Student Application Registered", category: "REGISTRATION", performedBy: "Arpit Goel", createdAt: "2026-05-15T09:00:00Z" },
      { id: "tl-std-002", event: "Academic Profile Approved", category: "VERIFICATION", performedBy: "Priya Nair", createdAt: "2026-05-16T12:00:00Z" },
      { id: "tl-std-003", event: "Assigned Expert Guide: Dr. Arunima Krishnan", category: "EXPERT", performedBy: "Admin", createdAt: "2026-05-25T10:00:00Z" },
      { id: "tl-std-004", event: "Placed at Solaris Power Pvt Ltd", category: "PLACEMENT", performedBy: "System", createdAt: "2026-06-01T09:00:00Z" }
    ],
    attendanceRate: 96,
    milestonesCompleted: 2,
    milestonesCount: 3
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const student = await prisma.studentProfile.findUnique({
  //   where: { id },
  //   include: { user: true, documents: true, expert: true, industry: true, project: true, attendance: true, milestones: true, timeline: true }
  // });

  const detail = MOCK_STUDENT_PROFILES[id] || MOCK_STUDENT_PROFILES["std-001"];

  if (detail && detail.id !== id) {
    return NextResponse.json({ ...detail, id, usn: `USN-${id}` });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, status, expertId, industryId, projectId, milestoneId, milestoneStatus, rating, attDate, attStatus, attNotes } = body;

  // API Integration Point:
  // if (action === "UPDATE_STATUS") {
  //   await prisma.studentProfile.update({ where: { id }, data: { status } });
  // } else if (action === "ASSIGN") {
  //   await prisma.studentProfile.update({ where: { id }, data: { expertId, industryId } });
  // } else if (action === "UPDATE_MILESTONE") {
  //   await prisma.studentMilestone.update({ where: { id: milestoneId }, data: { status: milestoneStatus, rating } });
  // } else if (action === "ADD_ATTENDANCE") {
  //   await prisma.studentAttendance.create({ data: { studentId: id, date: new Date(attDate), status: attStatus, notes: attNotes } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    status,
    message: "Student profile updated successfully",
    timestamp: new Date().toISOString()
  });
}
