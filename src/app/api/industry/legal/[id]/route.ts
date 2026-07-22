import { NextRequest, NextResponse } from "next/server";

const MOCK_LEGAL_DETAILS: Record<string, any> = {
  "leg-001": {
    id: "leg-001",
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
    projectName: "Solar Micro-Grid for IIT Madras",
    notes: "Governs collaborative R&D equipment sharing, IP co-ownership and student internship placement.",
    complianceChecklist: [
      { id: "c1", title: "Dual Signature Verification", status: "VERIFIED" },
      { id: "c2", title: "IP Clause Review", status: "VERIFIED" },
      { id: "c3", title: "DPIIT Regulatory Approval", status: "VERIFIED" },
      { id: "c4", title: "Annual Indemnity Review", status: "PENDING" }
    ],
    timeline: [
      { id: "t1", event: "Draft Initiated", performedBy: "Priya Nair", date: "2025-12-15T10:00:00Z" },
      { id: "t2", event: "Legal Review Approved", performedBy: "Legal Officer", date: "2025-12-28T16:00:00Z" },
      { id: "t3", event: "E-Signature Completed", performedBy: "Dr. Arunima & Rajesh Sharma", date: "2026-01-05T11:00:00Z" }
    ],
    createdAt: "2025-12-15T10:00:00Z"
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = MOCK_LEGAL_DETAILS[id] || {
    id,
    title: `Agreement ${id}`,
    agreementType: "NDA",
    targetEntity: "ORGANIZATION",
    entityName: "Partner Institution",
    fileUrl: "https://storage.anvesha.in/legal/sample-agreement.pdf",
    version: "1.0",
    status: "UNDER_REVIEW",
    effectiveDate: "2026-06-01T00:00:00Z",
    expiryDate: "2027-06-01T00:00:00Z",
    eSignatureStatus: "PENDING",
    signedAt: null,
    renewalReminderDays: 30,
    createdBy: "Priya Nair",
    notes: "Agreement workspace record.",
    complianceChecklist: [
      { id: "c1", title: "Legal Review", status: "VERIFIED" }
    ],
    timeline: [
      { id: "t1", event: "Agreement Created", performedBy: "Priya Nair", date: "2026-06-01T10:00:00Z" }
    ],
    createdAt: "2026-06-01T10:00:00Z"
  };

  return NextResponse.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, eSignatureStatus, status, notes } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Legal agreement record updated.",
    timestamp: new Date().toISOString(),
    eSignatureStatus: eSignatureStatus || "SIGNED",
    signedAt: eSignatureStatus === "SIGNED" ? new Date().toISOString() : undefined,
    status: status || "ACTIVE"
  });
}
