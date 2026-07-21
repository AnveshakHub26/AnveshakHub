import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_PROJECTS = [
  {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    description: "Design and implement a local solar microgrid within the campus to test decentralized power sharing algorithms.",
    lifecycle: "IN_PROGRESS",
    budget: 4500000,
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-12-15T00:00:00Z",
    problemStatement: "The campus micro-grid lacks direct communication interfaces with regional loads, leading to 12% power transmission losses.",
    scopeDefinition: "1. Deploy 40kW solar panels at central building. 2. Develop serial communication controller. 3. Train student interns under supervisor.",
    industry: {
      id: "ind-001",
      orgName: "Solaris Power Pvt Ltd",
      email: "info@solarispower.in"
    },
    experts: [
      { id: "exp-001", name: "Dr. Arunima Krishnan", email: "dr.arunima@aiml.in", designation: "Professor & Head of AI Research" }
    ],
    students: [
      { id: "std-001", name: "Arpit Goel", degree: "M.Tech", branch: "CSE", cgpa: 9.4 },
      { id: "std-002", name: "Rishika Roy", degree: "B.Tech", branch: "ECE", cgpa: 8.9 }
    ],
    progress: 62,
    tasksCount: 12,
    tasksCompleted: 8,
    risksCount: 2,
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "prj-002",
    name: "Medical Imaging Diagnostic Accelerator",
    description: "Accelerate MRI analysis pipeline using hybrid convolution-transformer neural network models.",
    lifecycle: "IN_PROGRESS",
    budget: 6500000,
    startDate: "2026-02-01T00:00:00Z",
    endDate: "2026-11-30T00:00:00Z",
    problemStatement: "Current clinical MRI evaluations suffer from high latency and low boundary contrast in diagnostic segmentation.",
    scopeDefinition: "1. Gather anonymized medical dataset. 2. Design convolutional model blocks. 3. Validate safety guidelines with compliance team.",
    industry: {
      id: "ind-002",
      orgName: "BioGen Diagnostics LLP",
      email: "admin@biogen.in"
    },
    experts: [
      { id: "exp-001", name: "Dr. Arunima Krishnan", email: "dr.arunima@aiml.in", designation: "Professor & Head of AI Research" },
      { id: "exp-003", name: "Dr. Anjali Sharma", email: "anjali.sharma@biogen.in", designation: "Chief Biotech Advisor" }
    ],
    students: [
      { id: "std-002", name: "Rishika Roy", degree: "B.Tech", branch: "ECE", cgpa: 8.9 }
    ],
    progress: 50,
    tasksCount: 8,
    tasksCompleted: 4,
    risksCount: 1,
    createdAt: "2026-01-25T11:00:00Z"
  },
  {
    id: "prj-003",
    name: "Avionics Telemetry Hub for UAVs",
    description: "Establish robust, low-latency communication protocol for high-altitude UAV research projects.",
    lifecycle: "PLANNING",
    budget: 2800000,
    startDate: "2026-05-10T00:00:00Z",
    endDate: "2026-10-25T00:00:00Z",
    problemStatement: "UAV telemetry connections drop by 22% beyond line-of-sight operations, requiring robust RF serialization.",
    scopeDefinition: "1. Choose RF band matching legal guidelines. 2. Build drone transceiver prototypes. 3. Conduct test flights.",
    industry: {
      id: "ind-003",
      orgName: "Vayu Aerospace Solutions",
      email: "karan.arora@iitmadras.ac.in"
    },
    experts: [
      { id: "exp-004", name: "Rohan Das", email: "rohan.das@spaceaero.in", designation: "Lead Systems Architect" }
    ],
    students: [
      { id: "std-004", name: "Neha Gupta", degree: "B.E. (Hons)", branch: "Electrical & Electronics", cgpa: 8.2 }
    ],
    progress: 25,
    tasksCount: 5,
    tasksCompleted: 1,
    risksCount: 0,
    createdAt: "2026-04-20T09:00:00Z"
  },
  {
    id: "prj-004",
    name: "Autonomous Rover Control Module",
    description: "Develop a backup navigation controller module for exploratory search and rescue autonomous rovers.",
    lifecycle: "UNDER_REVIEW",
    budget: 3500000,
    startDate: "2026-08-01T00:00:00Z",
    endDate: "2027-02-28T00:00:00Z",
    problemStatement: "GPS shadow zones disable exploratory rovers in rubble scenarios, requiring solid-state inertial navigation fallback.",
    scopeDefinition: "1. Integrate IMU with microcontrollers. 2. Code Kalman filter loops. 3. Simulate failure bounds.",
    industry: {
      id: "ind-004",
      orgName: "Solaris Power Pvt Ltd",
      email: "info@solarispower.in"
    },
    experts: [
      { id: "exp-004", name: "Rohan Das", email: "rohan.das@spaceaero.in", designation: "Lead Systems Architect" }
    ],
    students: [
      { id: "std-005", name: "Kabir Verma", degree: "B.Tech", branch: "Mechanical Engineering", cgpa: 7.8 }
    ],
    progress: 10,
    tasksCount: 2,
    tasksCompleted: 0,
    risksCount: 1,
    createdAt: "2026-07-15T15:30:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const lifecycle = searchParams.get("lifecycle") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");
  const sortBy = searchParams.get("sortBy") || "budget";
  const sortDir = searchParams.get("sortDir") || "desc";

  // API Integration Point:
  // const [projects, total] = await Promise.all([
  //   prisma.project.findMany({ where: {...}, include: { industry: true, experts: true, students: true }, skip, take, orderBy: { [sortBy]: sortDir } }),
  //   prisma.project.count({ where: {...} })
  // ]);

  let filtered = MOCK_PROJECTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.industry.orgName.toLowerCase().includes(q)
    );
  }

  if (lifecycle && lifecycle !== "ALL") {
    filtered = filtered.filter((p) => p.lifecycle === lifecycle);
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
    total: MOCK_PROJECTS.length,
    inProgress: MOCK_PROJECTS.filter((p) => p.lifecycle === "IN_PROGRESS").length,
    planning: MOCK_PROJECTS.filter((p) => p.lifecycle === "PLANNING").length,
    underReview: MOCK_PROJECTS.filter((p) => p.lifecycle === "UNDER_REVIEW").length,
    totalBudget: MOCK_PROJECTS.reduce((acc, curr) => acc + curr.budget, 0),
    avgProgress: parseFloat((MOCK_PROJECTS.reduce((acc, curr) => acc + curr.progress, 0) / MOCK_PROJECTS.length).toFixed(1)),
    lifecycleList: Array.from(new Set(MOCK_PROJECTS.map((p) => p.lifecycle)))
  };

  return NextResponse.json({
    projects: paginated,
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
    // const newProject = await prisma.project.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `prj-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      lifecycle: "DRAFT",
      progress: 0,
      tasksCount: 0,
      tasksCompleted: 0,
      risksCount: 0
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to construct project definition" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, ids, lifecycle } = body;
  
  // API Integration Point: Bulk Stage Transition
  // if (action === "BULK_STAGE") {
  //   await prisma.project.updateMany({ where: { id: { in: ids } }, data: { lifecycle } });
  // }
  
  return NextResponse.json({
    success: true,
    action,
    affected: ids?.length || 0,
    message: `Successfully processed ${action} for ${ids?.length || 0} project(s).`,
    timestamp: new Date().toISOString()
  });
}
