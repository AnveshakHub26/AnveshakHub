import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_EMPLOYEES = [
  {
    id: "emp-001",
    name: "Dr. Arunima K.",
    email: "arunima@anveshakhub.gov.in",
    role: "COORDINATOR",
    department: "CRM",
    designation: "Lead Outreach Coordinator",
    status: "ACTIVE",
    joinedDate: "2026-01-15T00:00:00Z"
  },
  {
    id: "emp-002",
    name: "Rishi Raj Sen",
    email: "rishi.sen@anveshakhub.gov.in",
    role: "VERIFICATION_OFFICER",
    department: "VERIFICATION",
    designation: "Senior Verification Officer",
    status: "ACTIVE",
    joinedDate: "2026-03-01T00:00:00Z"
  },
  {
    id: "emp-003",
    name: "Amit V. Deshmukh",
    email: "amit.deshmukh@anveshakhub.gov.in",
    role: "FINANCE_OFFICER",
    department: "FINANCE",
    designation: "Ecosystem Finance Manager",
    status: "ACTIVE",
    joinedDate: "2026-02-10T00:00:00Z"
  },
  {
    id: "emp-004",
    name: "Nisha R. Patel",
    email: "nisha.patel@anveshakhub.gov.in",
    role: "OPERATIONS_LEAD",
    department: "OPERATIONS",
    designation: "Systems & SLA Operations Manager",
    status: "ACTIVE",
    joinedDate: "2026-04-05T00:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  // API Integration Point:
  // const [employees, total] = await Promise.all([
  //   prisma.employee.findMany({ where: {...}, skip, take }),
  //   prisma.employee.count({ where: {...} })
  // ]);

  let filtered = MOCK_EMPLOYEES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
    );
  }

  if (department && department !== "ALL") {
    filtered = filtered.filter((e) => e.department === department);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Workforce summary stats
  const stats = {
    total: MOCK_EMPLOYEES.length,
    activeCount: MOCK_EMPLOYEES.filter(e => e.status === "ACTIVE").length,
    leavesPending: 2,
    assetsAssigned: 5
  };

  return NextResponse.json({
    employees: paginated,
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
    // const newEmployee = await prisma.employee.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `emp-${Date.now()}`,
      ...body,
      status: "ACTIVE",
      joinedDate: new Date().toISOString()
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to onboard new employee" }, { status: 500 });
  }
}
