import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_PROFILES: Record<string, object> = {
  "ind-001": {
    id: "ind-001",
    orgName: "Solaris Power Pvt Ltd",
    orgType: "Private Limited",
    email: "info@solarispower.in",
    phone: "+91 98400 11234",
    website: "https://solarispower.in",
    industryDomain: "Clean Energy",
    businessCategory: "Renewable Energy",
    description: "Solaris Power is a leading solar panel manufacturer and EPC contractor serving residential and commercial sectors across South India.",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    pin: "600001",
    addressLine: "45, Solar Street, Nungambakkam",
    gstNumber: "33ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    cinNumber: "U40100TN2018PTC123456",
    foundedYear: 2018,
    employeeCount: "51-200",
    annualTurnover: "₹5–25 Cr",
    verificationStatus: "APPROVED",
    approvedAt: "2026-06-15T00:00:00Z",
    lifecycle: "EXPERTS_ASSIGNED",
    engagementScore: 84,
    collaborationScore: 76,
    avgResponseTime: 4,
    totalProjects: 3,
    activeProjects: 2,
    expertsAssigned: 4,
    studentsAssigned: 8,
    totalRevenue: 2400000,
    tags: ["solar", "energy", "msme"],
    contacts: [
      { id: "c-001", role: "PRIMARY", name: "Rajesh Kumar", email: "rajesh@solarispower.in", phone: "+91 98400 11235", designation: "CEO & Founder", department: "Executive", linkedIn: "linkedin.com/in/rajesh-kumar" },
      { id: "c-002", role: "FINANCE", name: "Meena Iyer", email: "meena@solarispower.in", phone: "+91 98400 11236", designation: "CFO", department: "Finance", linkedIn: null },
      { id: "c-003", role: "TECHNICAL", name: "Dr. Arun Prasad", email: "arun@solarispower.in", phone: "+91 98400 11237", designation: "CTO", department: "Engineering", linkedIn: "linkedin.com/in/arun-prasad" },
      { id: "c-004", role: "HR", name: "Sunita Rajan", email: "sunita@solarispower.in", phone: "+91 98400 11238", designation: "HR Manager", department: "Human Resources", linkedIn: null },
      { id: "c-005", role: "LEGAL", name: "Advocate Ramu Krishnan", email: "legal@solarispower.in", phone: "+91 98400 11239", designation: "Legal Counsel", department: "Legal", linkedIn: null },
    ],
    projects: [
      { id: "proj-001", name: "Solar Micro-Grid for IIT Madras", status: "ACTIVE", experts: ["Dr. Arunima K.", "Prof. Sharma"], students: 4, budget: "₹45L", timeline: "Jan 2026 – Dec 2026", progress: 62 },
      { id: "proj-002", name: "Community Solar Initiative – Rural TN", status: "ACTIVE", experts: ["Dr. Venkat R."], students: 2, budget: "₹22L", timeline: "Mar 2026 – Sep 2026", progress: 38 },
      { id: "proj-003", name: "Solar Water Pump Feasibility Study", status: "COMPLETED", experts: ["Prof. Arjun M."], students: 2, budget: "₹8L", timeline: "Jan 2026 – Apr 2026", progress: 100 },
    ],
    vaultDocuments: [
      { id: "vd-001", name: "Master NDA 2026", docType: "NDA", fileUrl: "/vault/nda-2026.pdf", fileSize: 245000, version: 2, uploadedBy: "Priya Nair", createdAt: "2026-06-16T00:00:00Z", expiresAt: "2027-06-16T00:00:00Z" },
      { id: "vd-002", name: "Collaboration MoU – IIT Madras", docType: "MOU", fileUrl: "/vault/mou-iitm.pdf", fileSize: 380000, version: 1, uploadedBy: "Priya Nair", createdAt: "2026-06-20T00:00:00Z", expiresAt: null },
      { id: "vd-003", name: "Service Contract Q2 2026", docType: "CONTRACT", fileUrl: "/vault/contract-q2.pdf", fileSize: 520000, version: 3, uploadedBy: "Meena Iyer", createdAt: "2026-04-01T00:00:00Z", expiresAt: "2026-09-30T00:00:00Z" },
      { id: "vd-004", name: "Invoice INV-2026-0042", docType: "INVOICE", fileUrl: "/vault/inv-0042.pdf", fileSize: 95000, version: 1, uploadedBy: "Meena Iyer", createdAt: "2026-07-01T00:00:00Z", expiresAt: null },
    ],
    communications: [
      { id: "comm-001", type: "MEETING", title: "Project Kickoff – Solar Micro-Grid", date: "2026-06-22T10:00:00Z", description: "Kickoff meeting with IIT Madras and Solaris team.", author: "Karan Mehta" },
      { id: "comm-002", type: "EMAIL", title: "Welcome Onboarding Email", date: "2026-06-15T09:00:00Z", description: "Sent welcome email with platform guidelines and next steps.", author: "System" },
      { id: "comm-003", type: "CRM_NOTE", title: "CEO Follow-up Call", date: "2026-07-10T15:00:00Z", description: "CEO Rajesh Kumar confirmed second project proposal is being drafted.", author: "Karan Mehta" },
      { id: "comm-004", type: "CALL", title: "Finance Clarification Call", date: "2026-07-05T14:30:00Z", description: "Discussed payment terms and invoice procedures with CFO Meena Iyer.", author: "Priya Nair" },
    ],
    timeline: [
      { id: "tl-001", event: "Registration Submitted", category: "REGISTRATION", performedBy: "Rajesh Kumar", createdAt: "2026-06-10T09:30:00Z" },
      { id: "tl-002", event: "Documents Uploaded", category: "VERIFICATION", performedBy: "Rajesh Kumar", createdAt: "2026-06-11T11:00:00Z" },
      { id: "tl-003", event: "Verification Approved", category: "APPROVAL", performedBy: "Priya Nair", createdAt: "2026-06-15T14:00:00Z" },
      { id: "tl-004", event: "Expert Assigned: Dr. Arunima K.", category: "EXPERT", performedBy: "Admin", createdAt: "2026-06-22T10:00:00Z" },
      { id: "tl-005", event: "Project Initiated: Solar Micro-Grid", category: "PROJECT", performedBy: "Admin", createdAt: "2026-06-25T09:00:00Z" },
    ],
    analytics: {
      engagementTrend: [60, 65, 70, 76, 80, 84],
      months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      projectCompletion: [0, 0, 30, 55, 80, 100],
      meetingCount: [1, 2, 3, 4, 4, 5],
      responseTimeAvg: [8, 6, 5, 4, 4, 3],
    },
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const profile = await prisma.industryProfile.findUnique({
  //   where: { id },
  //   include: { organization: true, contacts: true, vaultDocuments: true, timeline: { orderBy: { createdAt: "desc" } } }
  // });

  const profile = MOCK_PROFILES[id] || MOCK_PROFILES["ind-001"];
  return NextResponse.json(profile);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // API Integration Point:
  // await prisma.industryProfile.update({ where: { id }, data: body });
  // await prisma.industryTimeline.create({ data: { industryId: id, event: "Profile Updated", ... } });
  // await prisma.auditLog.create({ data: { action: "INDUSTRY_UPDATED", entityType: "IndustryProfile", entityId: id, ... } });

  return NextResponse.json({
    success: true,
    id,
    updated: body,
    timestamp: new Date().toISOString(),
  });
}
