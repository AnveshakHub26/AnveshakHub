import { NextRequest, NextResponse } from "next/server";

const MOCK_DOC_DETAILS: Record<string, any> = {
  "doc-v01": {
    id: "doc-v01",
    name: "Solar Micro-Grid Master MoU 2026.pdf",
    docType: "MOU",
    fileUrl: "https://storage.anvesha.in/vault/mou-solar-2026.pdf",
    fileSize: 2457600,
    mimeType: "application/pdf",
    version: 2,
    previousVersionId: "doc-v00",
    uploadedBy: "Rajesh Sharma",
    description: "Tripartite memorandum between Solaris Power, IIT Madras, and DPIIT Clean Energy Cell.",
    expiresAt: "2028-12-31T00:00:00Z",
    accessLevel: "RESTRICTED",
    approvalStatus: "APPROVED",
    tags: ["MoU", "Clean Energy", "IIT Madras", "DPIIT"],
    downloadCount: 42,
    versionHistory: [
      { version: 2, name: "Solar Micro-Grid Master MoU 2026 (v2.0).pdf", uploadedBy: "Rajesh Sharma", date: "2026-06-20T14:30:00Z", changeSummary: "Updated Annexure B budget allocation." },
      { version: 1, name: "Solar Micro-Grid Master MoU 2026 (v1.0).pdf", uploadedBy: "Priya Nair", date: "2026-01-15T10:00:00Z", changeSummary: "Initial executed agreement version." }
    ],
    auditLogs: [
      { id: "log-01", action: "DOWNLOAD", performedBy: "Dr. Arunima Krishnan", timestamp: "2026-07-20T10:30:00Z" },
      { id: "log-02", action: "VERSION_UPDATE", performedBy: "Rajesh Sharma", timestamp: "2026-06-20T14:30:00Z" },
      { id: "log-03", action: "VIEW", performedBy: "Nisha Patel", timestamp: "2026-05-10T16:00:00Z" }
    ],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z"
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = MOCK_DOC_DETAILS[id] || {
    id,
    name: `Document_${id}.pdf`,
    docType: "TECHNICAL_SPEC",
    fileUrl: "https://storage.anvesha.in/vault/sample.pdf",
    fileSize: 1048576,
    version: 1,
    uploadedBy: "Rajesh Sharma",
    description: "Enterprise document asset in central repository.",
    accessLevel: "RESTRICTED",
    approvalStatus: "APPROVED",
    tags: ["Document", "Enterprise"],
    downloadCount: 12,
    versionHistory: [
      { version: 1, name: `Document_${id} (v1.0).pdf`, uploadedBy: "Rajesh Sharma", date: "2026-06-01T10:00:00Z", changeSummary: "Initial version uploaded." }
    ],
    auditLogs: [
      { id: "log-100", action: "VIEW", performedBy: "Rajesh Sharma", timestamp: new Date().toISOString() }
    ],
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z"
  };

  return NextResponse.json(doc);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, description, accessLevel, approvalStatus, changeSummary } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Document metadata and version history updated successfully.",
    updatedAt: new Date().toISOString(),
    newVersion: action === "NEW_VERSION" ? {
      version: 2,
      name: `Updated_Document_${id}.pdf`,
      uploadedBy: "Rajesh Sharma",
      date: new Date().toISOString(),
      changeSummary: changeSummary || "Updated metadata and content revision."
    } : undefined
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    id,
    message: "Document archived from enterprise repository."
  });
}
