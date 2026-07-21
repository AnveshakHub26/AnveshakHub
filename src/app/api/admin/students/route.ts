import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENTS = [
  {
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
    skills: ["Python", "PyTorch", "Transformers", "SQL", "Git"],
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expertName: "Dr. Arunima Krishnan",
    industryName: "Solaris Power Pvt Ltd",
    projectName: "Solar Micro-Grid for IIT Madras",
    attendanceRate: 96,
    milestonesCount: 5,
    milestonesCompleted: 4,
    createdAt: "2026-05-15T09:00:00Z"
  },
  {
    id: "std-002",
    userId: "usr-std-002",
    user: {
      name: "Rishika Roy",
      email: "rishika.roy@iisc.ac.in",
      avatarUrl: null
    },
    usn: "ME23B045",
    institution: "IISc Bangalore",
    degree: "B.Tech",
    branch: "Materials Science",
    semester: 6,
    cgpa: 8.9,
    skills: ["Nanomaterials", "Matlab", "Python", "Spectroscopy"],
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expertName: "Dr. Arunima Krishnan",
    industryName: "BioGen Diagnostics LLP",
    projectName: "Medical Imaging Diagnostic Accelerator",
    attendanceRate: 98,
    milestonesCount: 4,
    milestonesCompleted: 2,
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "std-003",
    userId: "usr-std-003",
    user: {
      name: "Siddharth Sen",
      email: "siddharth.sen@iiith.ac.in",
      avatarUrl: null
    },
    usn: "PHD22SEC01",
    institution: "IIIT Hyderabad",
    degree: "Ph.D.",
    branch: "Information Security",
    semester: 6,
    cgpa: 9.6,
    skills: ["Rust", "Security Audit", "Cryptography", "Network Protocols"],
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expertName: "Dr. Arunima Krishnan",
    industryName: "Astra Launch Systems",
    projectName: "Embedded Launch Security Module",
    attendanceRate: 94,
    milestonesCount: 6,
    milestonesCompleted: 5,
    createdAt: "2026-06-10T14:30:00Z"
  },
  {
    id: "std-004",
    userId: "usr-std-004",
    user: {
      name: "Neha Gupta",
      email: "neha.gupta@bits-pilani.ac.in",
      avatarUrl: null
    },
    usn: "2023A7PS0042P",
    institution: "BITS Pilani",
    degree: "B.E. (Hons)",
    branch: "Electrical & Electronics",
    semester: 4,
    cgpa: 8.2,
    skills: ["Embedded C", "Microcontrollers", "Verilog", "Git"],
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expertName: "Rohan Das",
    industryName: "Vayu Aerospace Solutions",
    projectName: "Avionics Telemetry Hub",
    attendanceRate: 92,
    milestonesCount: 3,
    milestonesCompleted: 1,
    createdAt: "2026-07-01T11:00:00Z"
  },
  {
    id: "std-005",
    userId: "usr-std-005",
    user: {
      name: "Kabir Verma",
      email: "kabir.verma@iitb.ac.in",
      avatarUrl: null
    },
    usn: "22310004",
    institution: "IIT Bombay",
    degree: "B.Tech",
    branch: "Mechanical Engineering",
    semester: 6,
    cgpa: 7.8,
    skills: ["CAD/CAM", "SolidWorks", "ANSYS", "Finite Element Analysis"],
    status: "ACTIVE",
    verificationStatus: "APPROVED",
    expertName: "Rohan Das",
    industryName: null,
    projectName: null,
    attendanceRate: 90,
    milestonesCount: 0,
    milestonesCompleted: 0,
    createdAt: "2026-07-05T09:00:00Z"
  },
  {
    id: "std-006",
    userId: "usr-std-006",
    user: {
      name: "Pooja Hegde",
      email: "pooja.hegde@rvce.edu.in",
      avatarUrl: null
    },
    usn: "1RV22CS102",
    institution: "RV College of Engineering",
    degree: "B.E.",
    branch: "Computer Science",
    semester: 6,
    cgpa: 8.7,
    skills: ["Java", "Spring Boot", "React", "Docker", "REST APIs"],
    status: "PENDING",
    verificationStatus: "PENDING",
    expertName: null,
    industryName: null,
    projectName: null,
    attendanceRate: 0,
    milestonesCount: 0,
    milestonesCompleted: 0,
    createdAt: "2026-07-18T16:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const branch = searchParams.get("branch") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const sortBy = searchParams.get("sortBy") || "cgpa";
  const sortDir = searchParams.get("sortDir") || "desc";

  // API Integration Point:
  // const [students, total] = await Promise.all([
  //   prisma.studentProfile.findMany({ where: {...}, include: { user: true }, skip, take, orderBy: { [sortBy]: sortDir } }),
  //   prisma.studentProfile.count({ where: {...} })
  // ]);

  let filtered = MOCK_STUDENTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.user.name.toLowerCase().includes(q) ||
        s.user.email.toLowerCase().includes(q) ||
        s.institution.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.toLowerCase().includes(q))
    );
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (branch && branch !== "ALL") {
    filtered = filtered.filter((s) => s.branch.includes(branch));
  }

  const sorted = [...filtered].sort((a, b) => {
    const aVal = ((a as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    const bVal = ((b as unknown) as Record<string, number | string>)[sortBy] ?? 0;
    return sortDir === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  // Statistics
  const stats = {
    total: MOCK_STUDENTS.length,
    active: MOCK_STUDENTS.filter((s) => s.status === "ACTIVE").length,
    pending: MOCK_STUDENTS.filter((s) => s.status === "PENDING").length,
    avgCgpa: parseFloat((MOCK_STUDENTS.reduce((acc, curr) => acc + curr.cgpa, 0) / MOCK_STUDENTS.length).toFixed(2)),
    matchingRate: 80, // percentage of students with linked project/industry
    branchesList: Array.from(new Set(MOCK_STUDENTS.map((s) => s.branch))),
    institutionsList: Array.from(new Set(MOCK_STUDENTS.map((s) => s.institution)))
  };

  return NextResponse.json({
    students: paginated,
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
    // const newStudent = await prisma.studentProfile.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `std-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "PENDING",
      attendanceRate: 0,
      milestonesCount: 0,
      milestonesCompleted: 0
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to register student profile" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, ids, expertId, industryId, projectId } = body;
  
  // API Integration Point: Bulk Actions
  // if (action === "ASSIGN_EXPERT") {
  //   await prisma.studentProfile.updateMany({ where: { id: { in: ids } }, data: { expertId } });
  // }
  
  return NextResponse.json({
    success: true,
    action,
    affected: ids?.length || 0,
    message: `Successfully processed ${action} for ${ids?.length || 0} student(s).`,
    timestamp: new Date().toISOString()
  });
}
