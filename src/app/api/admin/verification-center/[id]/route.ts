import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_DETAIL: Record<string, object> = {
  "vr-001": {
    id: "vr-001",
    type: "INDUSTRY",
    stage: "DOCUMENT_VERIFICATION",
    priority: "HIGH",
    riskScore: 28,
    fraudFlag: false,
    duplicateFlag: false,
    complianceStatus: false,
    assignedOfficer: { id: "u-001", name: "Priya Nair", email: "priya@anveshakhub.in" },
    submittedAt: "2026-07-16T09:30:00Z",
    reviewedAt: "2026-07-16T11:00:00Z",
    organization: {
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
    },
    documents: [
      { id: "doc-001", name: "GST Certificate", category: "GST", fileUrl: "/mock/gst.pdf", fileSize: 245000, mimeType: "application/pdf", status: "APPROVED", reviewerComment: "Valid and current", reviewedAt: "2026-07-16T11:30:00Z" },
      { id: "doc-002", name: "PAN Card", category: "PAN", fileUrl: "/mock/pan.pdf", fileSize: 120000, mimeType: "application/pdf", status: "APPROVED", reviewerComment: "Matches company name", reviewedAt: "2026-07-16T11:32:00Z" },
      { id: "doc-003", name: "Certificate of Incorporation", category: "CIN", fileUrl: "/mock/cin.pdf", fileSize: 380000, mimeType: "application/pdf", status: "APPROVED", reviewerComment: "Valid CIN", reviewedAt: "2026-07-16T11:35:00Z" },
      { id: "doc-004", name: "MSME Registration", category: "MSME", fileUrl: "/mock/msme.pdf", fileSize: 190000, mimeType: "application/pdf", status: "APPROVED", reviewerComment: "MSME verified", reviewedAt: "2026-07-16T11:40:00Z" },
      { id: "doc-005", name: "NDA Draft", category: "NDA", fileUrl: "/mock/nda.pdf", fileSize: 95000, mimeType: "application/pdf", status: "PENDING", reviewerComment: null, reviewedAt: null },
      { id: "doc-006", name: "Address Proof (Utility Bill)", category: "ADDRESS_PROOF", fileUrl: "/mock/address.pdf", fileSize: 150000, mimeType: "application/pdf", status: "PENDING", reviewerComment: null, reviewedAt: null },
    ],
    reviewNotes: [
      { id: "rn-001", author: "Priya Nair", content: "Initial review completed. All primary documents valid. GST and PAN match company registration.", recommendation: "APPROVE", isInternal: true, createdAt: "2026-07-16T12:00:00Z" },
      { id: "rn-002", author: "Karan Mehta", content: "NDA needs to be countersigned before final approval.", recommendation: "HOLD", isInternal: true, createdAt: "2026-07-16T14:00:00Z" },
    ],
    actions: [
      { id: "act-001", admin: "System", action: "REQUEST_SUBMITTED", fromStage: null, toStage: "SUBMITTED", notes: "Registration submitted via onboarding", createdAt: "2026-07-16T09:30:00Z", ipAddress: "103.55.12.88" },
      { id: "act-002", admin: "Priya Nair", action: "MOVED_TO_INITIAL_REVIEW", fromStage: "SUBMITTED", toStage: "INITIAL_REVIEW", notes: "Assigned for initial review", createdAt: "2026-07-16T10:00:00Z", ipAddress: "192.168.1.12" },
      { id: "act-003", admin: "Priya Nair", action: "MOVED_TO_DOCUMENT_VERIFICATION", fromStage: "INITIAL_REVIEW", toStage: "DOCUMENT_VERIFICATION", notes: "Documents uploaded. Starting verification.", createdAt: "2026-07-16T11:00:00Z", ipAddress: "192.168.1.12" },
    ],
    meetings: [
      { id: "mtg-001", title: "Initial Screening Call", platform: "GOOGLE_MEET", startTime: "2026-07-18T10:00:00Z", endTime: "2026-07-18T11:00:00Z", participants: ["Priya Nair", "Mr. Raj Kumar (Solaris)"], videoLink: "https://meet.google.com/abc-xyz-123", agenda: "Discuss business overview and verification requirements", outcomes: null, status: "UPCOMING" },
    ],
    previousApplications: [],
    crmNotes: [
      { id: "crm-001", content: "Very responsive team. CEO personally reached out to expedite verification.", author: "Karan Mehta", createdAt: "2026-07-16T15:00:00Z" },
    ],
  },
};

// GET — full verification profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const request = await prisma.verificationRequest.findUnique({
  //   where: { id },
  //   include: { organization: true, documents: true, reviewNotes: { include: { author: true } }, actions: true, meetings: true }
  // });

  const detail = MOCK_DETAIL[id] || MOCK_DETAIL["vr-001"];
  return NextResponse.json(detail);
}

// PATCH — update stage, risk score, assignment, add note
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, toStage, riskScore, assignedOfficerId, notes, rejectionReason, rejectionComments, requiredCorrections, resubmissionDeadline } = body;

  // API Integration Point:
  // await prisma.$transaction([
  //   prisma.verificationRequest.update({ where: { id }, data: { stage: toStage, riskScore, assignedOfficerId, rejectionReason, ... } }),
  //   prisma.verificationAction.create({ data: { verReqId: id, action, fromStage: current, toStage, notes, ipAddress } }),
  //   prisma.auditLog.create({ data: { action, entityType: "VerificationRequest", entityId: id, ... } }),
  // ]);

  return NextResponse.json({
    success: true,
    id,
    action: action || "STAGE_UPDATE",
    toStage,
    riskScore,
    notes,
    message: "Verification request updated successfully",
    timestamp: new Date().toISOString(),
  });
}
