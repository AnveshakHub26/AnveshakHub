import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_REQUESTS = [
  {
    id: "vr-001",
    orgName: "Solaris Power Pvt Ltd",
    orgType: "Private Limited",
    email: "info@solarispower.in",
    phone: "+91 98400 11234",
    type: "INDUSTRY",
    stage: "DOCUMENT_VERIFICATION",
    priority: "HIGH",
    assignedOfficer: "Priya Nair",
    riskScore: 28,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-16T09:30:00Z",
    domain: "Clean Energy",
    city: "Chennai",
    state: "Tamil Nadu",
    documentsCount: 6,
    documentsApproved: 4,
  },
  {
    id: "vr-002",
    orgName: "Vayu Aerospace Solutions",
    orgType: "Partnership",
    email: "contact@vayuaero.in",
    phone: "+91 98400 22345",
    type: "INDUSTRY",
    stage: "INITIAL_REVIEW",
    priority: "STANDARD",
    assignedOfficer: "Karan Mehta",
    riskScore: 45,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-15T14:00:00Z",
    domain: "Drone Research",
    city: "Bengaluru",
    state: "Karnataka",
    documentsCount: 5,
    documentsApproved: 1,
  },
  {
    id: "vr-003",
    orgName: "BioGen Diagnostics LLP",
    orgType: "LLP",
    email: "admin@biogen.in",
    phone: "+91 98400 33456",
    type: "INDUSTRY",
    stage: "COMPLIANCE_REVIEW",
    priority: "URGENT",
    assignedOfficer: "Anjali Sharma",
    riskScore: 15,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-16T11:00:00Z",
    domain: "BioTech Research",
    city: "Hyderabad",
    state: "Telangana",
    documentsCount: 8,
    documentsApproved: 7,
  },
  {
    id: "vr-004",
    orgName: "Astra Launch Systems",
    orgType: "Startup (DPIIT)",
    email: "hello@astraspace.in",
    phone: "+91 98400 44567",
    type: "INDUSTRY",
    stage: "MEETING_SCHEDULED",
    priority: "HIGH",
    assignedOfficer: "Rohan Das",
    riskScore: 22,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-14T08:00:00Z",
    domain: "Space Technology",
    city: "Pune",
    state: "Maharashtra",
    documentsCount: 7,
    documentsApproved: 6,
  },
  {
    id: "vr-005",
    orgName: "Dr. Arunima Krishnan",
    orgType: "Individual Expert",
    email: "dr.arunima@aiml.in",
    phone: "+91 98400 55678",
    type: "EXPERT",
    stage: "SUBMITTED",
    priority: "STANDARD",
    assignedOfficer: null,
    riskScore: 10,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-17T10:00:00Z",
    domain: "AI/ML Research",
    city: "Delhi",
    state: "Delhi",
    documentsCount: 4,
    documentsApproved: 0,
  },
  {
    id: "vr-006",
    orgName: "Rajiv Menon",
    orgType: "Individual Expert",
    email: "rajiv.menon@nanotech.in",
    phone: "+91 98400 66789",
    type: "EXPERT",
    stage: "DOCUMENT_VERIFICATION",
    priority: "HIGH",
    assignedOfficer: "Priya Nair",
    riskScore: 18,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-16T15:00:00Z",
    domain: "Nanotechnology",
    city: "Mumbai",
    state: "Maharashtra",
    documentsCount: 5,
    documentsApproved: 3,
  },
  {
    id: "vr-007",
    orgName: "Karan Arora",
    orgType: "Student",
    email: "karan.arora@iitmadras.ac.in",
    phone: "+91 98400 77890",
    type: "STUDENT",
    stage: "INITIAL_REVIEW",
    priority: "STANDARD",
    assignedOfficer: null,
    riskScore: 5,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-17T12:00:00Z",
    domain: "Mechanical Engineering",
    city: "Chennai",
    state: "Tamil Nadu",
    documentsCount: 3,
    documentsApproved: 0,
  },
  {
    id: "vr-008",
    orgName: "GreenBridge NGO",
    orgType: "Non-Profit",
    email: "contact@greenbridge.org",
    phone: "+91 98400 88901",
    type: "PARTNER",
    stage: "APPROVAL_COMMITTEE",
    priority: "STANDARD",
    assignedOfficer: "Anjali Sharma",
    riskScore: 20,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-13T09:00:00Z",
    domain: "Sustainability",
    city: "Ahmedabad",
    state: "Gujarat",
    documentsCount: 6,
    documentsApproved: 6,
  },
  {
    id: "vr-009",
    orgName: "TechSupply Hub",
    orgType: "Vendor",
    email: "vendor@techsupply.in",
    phone: "+91 98400 99012",
    type: "VENDOR",
    stage: "BUSINESS_VALIDATION",
    priority: "STANDARD",
    assignedOfficer: "Karan Mehta",
    riskScore: 35,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-15T16:00:00Z",
    domain: "IT Infrastructure",
    city: "Noida",
    state: "Uttar Pradesh",
    documentsCount: 4,
    documentsApproved: 2,
  },
  {
    id: "vr-010",
    orgName: "Ministry of Science & Technology",
    orgType: "Government",
    email: "collab@dst.gov.in",
    phone: "+91 11-2338-2626",
    type: "GOVERNMENT",
    stage: "COMPLIANCE_REVIEW",
    priority: "CRITICAL",
    assignedOfficer: "Rohan Das",
    riskScore: 5,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-12T09:00:00Z",
    domain: "Science & Technology",
    city: "New Delhi",
    state: "Delhi",
    documentsCount: 10,
    documentsApproved: 9,
  },
  {
    id: "vr-011",
    orgName: "Open Source Contributor: Neha Gupta",
    orgType: "Individual Contributor",
    email: "neha.gupta@opensource.dev",
    phone: "+91 98400 10234",
    type: "CONTRIBUTOR",
    stage: "SUBMITTED",
    priority: "STANDARD",
    assignedOfficer: null,
    riskScore: 12,
    fraudFlag: false,
    duplicateFlag: false,
    submittedAt: "2026-07-17T14:00:00Z",
    domain: "Open Source / DevOps",
    city: "Bengaluru",
    state: "Karnataka",
    documentsCount: 2,
    documentsApproved: 0,
  },
];

// GET — list all verification requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const stage = searchParams.get("stage");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // API Integration Point: prisma.verificationRequest.findMany({ where: {...}, skip, take })
  let filtered = MOCK_REQUESTS;

  if (type && type !== "ALL") {
    filtered = filtered.filter((r) => r.type === type);
  }
  if (stage && stage !== "ALL") {
    filtered = filtered.filter((r) => r.stage === stage);
  }
  if (priority && priority !== "ALL") {
    filtered = filtered.filter((r) => r.priority === priority);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.orgName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Stats
  const stats = {
    total: MOCK_REQUESTS.length,
    byType: {
      INDUSTRY: MOCK_REQUESTS.filter((r) => r.type === "INDUSTRY").length,
      EXPERT: MOCK_REQUESTS.filter((r) => r.type === "EXPERT").length,
      STUDENT: MOCK_REQUESTS.filter((r) => r.type === "STUDENT").length,
      PARTNER: MOCK_REQUESTS.filter((r) => r.type === "PARTNER").length,
      VENDOR: MOCK_REQUESTS.filter((r) => r.type === "VENDOR").length,
      GOVERNMENT: MOCK_REQUESTS.filter((r) => r.type === "GOVERNMENT").length,
      CONTRIBUTOR: MOCK_REQUESTS.filter((r) => r.type === "CONTRIBUTOR").length,
    },
    byStage: {
      SUBMITTED: MOCK_REQUESTS.filter((r) => r.stage === "SUBMITTED").length,
      INITIAL_REVIEW: MOCK_REQUESTS.filter((r) => r.stage === "INITIAL_REVIEW").length,
      DOCUMENT_VERIFICATION: MOCK_REQUESTS.filter((r) => r.stage === "DOCUMENT_VERIFICATION").length,
      COMPLIANCE_REVIEW: MOCK_REQUESTS.filter((r) => r.stage === "COMPLIANCE_REVIEW").length,
      APPROVAL_COMMITTEE: MOCK_REQUESTS.filter((r) => r.stage === "APPROVAL_COMMITTEE").length,
    },
    avgProcessingDays: 4.2,
    approvalRate: 78,
    todayApproved: 5,
    todayRejected: 2,
  };

  return NextResponse.json({ requests: paginated, total, page, limit, stats });
}

// POST — bulk actions
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, ids, assignedOfficer, rejectionReason, notes } = body;

  // API Integration Point: prisma.verificationRequest.updateMany(...)
  // + prisma.verificationAction.createMany(...)
  // + prisma.notification.createMany(...)

  if (!action || !ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const validActions = ["APPROVE", "REJECT", "ASSIGN", "HOLD", "ESCALATE"];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    action,
    affected: ids.length,
    message: `${action} applied to ${ids.length} request(s) successfully`,
    timestamp: new Date().toISOString(),
  });
}
