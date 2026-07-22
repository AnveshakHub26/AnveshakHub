import { NextRequest, NextResponse } from "next/server";

const DEMO_ORG_ID = "org-001";

const MOCK_AGREEMENTS = [
  {
    id: "leg-001",
    industryId: DEMO_ORG_ID,
    title: "Master Research & Development MoU – IIT Madras",
    agreementType: "MOU",
    targetEntity: "ORGANIZATION",
    entityId: "org-iit-madras",
    entityName: "IIT Madras - Electrical Engg Dept",
    fileUrl: "https://storage.anvesha.in/legal/mou-iit-madras.pdf",
    version: "2.1",
    status: "ACTIVE",
    effectiveDate: "2026-01-01T00:00:00Z",
    expiryDate: "2028-12-31T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-01-05T11:00:00Z",
    renewalReminderDays: 60,
    createdBy: "Priya Nair",
    projectId: "prj-001",
    createdAt: "2025-12-15T10:00:00Z"
  },
  {
    id: "leg-002",
    industryId: DEMO_ORG_ID,
    title: "Bilateral Non-Disclosure Agreement (NDA) – IISC",
    agreementType: "NDA",
    targetEntity: "ORGANIZATION",
    entityId: "org-iisc",
    entityName: "IISc Autonomous Systems Lab",
    fileUrl: "https://storage.anvesha.in/legal/nda-iisc.pdf",
    version: "1.0",
    status: "ACTIVE",
    effectiveDate: "2026-03-01T00:00:00Z",
    expiryDate: "2027-03-01T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-03-04T15:30:00Z",
    renewalReminderDays: 30,
    createdBy: "Priya Nair",
    projectId: "prj-004",
    createdAt: "2026-02-20T14:00:00Z"
  },
  {
    id: "leg-003",
    industryId: DEMO_ORG_ID,
    title: "Expert Senior Advisor Agreement – Dr. Arunima Krishnan",
    agreementType: "CONTRACT",
    targetEntity: "EXPERT",
    entityId: "exp-001",
    entityName: "Dr. Arunima Krishnan",
    fileUrl: "https://storage.anvesha.in/legal/contract-arunima.pdf",
    version: "1.0",
    status: "ACTIVE",
    effectiveDate: "2026-05-01T00:00:00Z",
    expiryDate: "2026-11-01T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-05-02T09:00:00Z",
    renewalReminderDays: 30,
    createdBy: "Rajesh Sharma",
    projectId: "prj-001",
    createdAt: "2026-04-25T11:00:00Z"
  },
  {
    id: "leg-004",
    industryId: DEMO_ORG_ID,
    title: "IP Assignment & Commercial License Framework",
    agreementType: "IP_AGREEMENT",
    targetEntity: "ORGANIZATION",
    entityId: "org-dpiit",
    entityName: "DPIIT Innovation Council",
    fileUrl: "https://storage.anvesha.in/legal/ip-agreement-dpiit.pdf",
    version: "1.2",
    status: "UNDER_REVIEW",
    effectiveDate: null,
    expiryDate: null,
    eSignatureStatus: "PENDING",
    signedAt: null,
    renewalReminderDays: 45,
    createdBy: "Priya Nair",
    projectId: null,
    createdAt: "2026-07-10T16:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const agreementType = searchParams.get("agreementType") || "ALL";
  const status = searchParams.get("status") || "ALL";

  let filtered = MOCK_AGREEMENTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.entityName.toLowerCase().includes(q)
    );
  }

  if (agreementType && agreementType !== "ALL") {
    filtered = filtered.filter(a => a.agreementType === agreementType);
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter(a => a.status === status);
  }

  const total = MOCK_AGREEMENTS.length;
  const active = MOCK_AGREEMENTS.filter(a => a.status === "ACTIVE").length;
  const underReview = MOCK_AGREEMENTS.filter(a => a.status === "UNDER_REVIEW").length;
  const pendingESign = MOCK_AGREEMENTS.filter(a => a.eSignatureStatus === "PENDING").length;

  return NextResponse.json({
    agreements: filtered,
    total: filtered.length,
    stats: { total, active, underReview, pendingESign }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, agreementType, targetEntity, entityName, projectId, notes } = body;

    const newAgreement = {
      id: `leg-${Date.now()}`,
      industryId: DEMO_ORG_ID,
      title,
      agreementType: agreementType || "MOU",
      targetEntity: targetEntity || "ORGANIZATION",
      entityId: `ent-${Date.now()}`,
      entityName,
      fileUrl: `https://storage.anvesha.in/legal/${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`,
      version: "1.0",
      status: "DRAFT",
      effectiveDate: null,
      expiryDate: null,
      eSignatureStatus: "PENDING",
      signedAt: null,
      renewalReminderDays: 30,
      notes: notes || "",
      createdBy: "Rajesh Sharma",
      projectId: projectId || null,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      agreement: newAgreement,
      message: "Legal agreement draft initiated successfully. Shared with compliance review team."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to initiate legal agreement" }, { status: 500 });
  }
}
