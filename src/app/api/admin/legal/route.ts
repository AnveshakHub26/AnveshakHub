import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_AGREEMENTS = [
  {
    id: "leg-001",
    title: "Solaris Power Master R&D NDA",
    agreementType: "NDA",
    targetEntity: "INDUSTRY",
    entityId: "ind-001",
    entityName: "Solaris Power Pvt Ltd",
    fileUrl: "/mock/solaris_nda_v1.pdf",
    version: "1.2",
    status: "ACTIVE",
    effectiveDate: "2026-06-01T00:00:00Z",
    expiryDate: "2027-06-01T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-06-02T14:20:00Z",
    createdBy: "System Legal Counsel"
  },
  {
    id: "leg-002",
    title: "BioGen Clinical Data Access MoU",
    agreementType: "MOU",
    targetEntity: "INDUSTRY",
    entityId: "ind-002",
    entityName: "BioGen Diagnostics LLP",
    fileUrl: "/mock/biogen_mou_v1.pdf",
    version: "1.0",
    status: "UNDER_REVIEW",
    effectiveDate: "2026-07-01T00:00:00Z",
    expiryDate: "2028-07-01T00:00:00Z",
    eSignatureStatus: "PENDING",
    signedAt: null,
    createdBy: "System Legal Counsel"
  },
  {
    id: "leg-003",
    title: "Dr. Arisudan AI Advisor Retainer Contract",
    agreementType: "CONTRACT",
    targetEntity: "EXPERT",
    entityId: "exp-001",
    entityName: "Dr. Arisudan (AI/ML Lead)",
    fileUrl: "/mock/arisudan_contract.pdf",
    version: "2.0",
    status: "ACTIVE",
    effectiveDate: "2026-05-15T00:00:00Z",
    expiryDate: "2026-11-15T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-05-16T09:10:00Z",
    createdBy: "System Legal Counsel"
  },
  {
    id: "leg-004",
    title: "Student Internship IP Assignment Agreement",
    agreementType: "IP_AGREEMENT",
    targetEntity: "STUDENT",
    entityId: "stu-001",
    entityName: "Aarav Sharma (IIT Madras)",
    fileUrl: "/mock/student_ip_agreement.pdf",
    version: "1.0",
    status: "ACTIVE",
    effectiveDate: "2026-07-10T00:00:00Z",
    expiryDate: "2026-12-31T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-07-11T16:45:00Z",
    createdBy: "System Legal Counsel"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const agreementType = searchParams.get("agreementType") || "";
  const targetEntity = searchParams.get("targetEntity") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "15");

  let filtered = MOCK_AGREEMENTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.entityName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }

  if (agreementType && agreementType !== "ALL") {
    filtered = filtered.filter((a) => a.agreementType === agreementType);
  }

  if (targetEntity && targetEntity !== "ALL") {
    filtered = filtered.filter((a) => a.targetEntity === targetEntity);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const stats = {
    totalAgreements: MOCK_AGREEMENTS.length,
    activeCount: MOCK_AGREEMENTS.filter((a) => a.status === "ACTIVE").length,
    pendingSignatures: MOCK_AGREEMENTS.filter((a) => a.eSignatureStatus === "PENDING").length,
    expiringIn30Days: 1,
    complianceScore: "98.5%"
  };

  return NextResponse.json({
    agreements: paginated,
    total,
    page,
    limit,
    stats
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
        id: `leg-${Date.now()}`,
        ...body,
        version: "1.0",
        status: "DRAFT",
        eSignatureStatus: "PENDING",
        createdAt: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json({ error: "Failed to create legal agreement" }, { status: 500 });
  }
}
