import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    id,
    title: "Solaris Power Master R&D NDA",
    agreementType: "NDA",
    targetEntity: "INDUSTRY",
    entityName: "Solaris Power Pvt Ltd",
    fileUrl: "/mock/solaris_nda_v1.pdf",
    version: "1.2",
    status: "ACTIVE",
    effectiveDate: "2026-06-01T00:00:00Z",
    expiryDate: "2027-06-01T00:00:00Z",
    eSignatureStatus: "SIGNED",
    signedAt: "2026-06-02T14:20:00Z",
    createdBy: "System Legal Counsel",
    versions: [
      { version: "1.2", date: "2026-06-02", changeLog: "Updated IP clause section 4.2" },
      { version: "1.0", date: "2026-06-01", changeLog: "Initial draft release" }
    ]
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, status, eSignatureStatus } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    status: status || "ACTIVE",
    eSignatureStatus: eSignatureStatus || "SIGNED",
    message: `Legal agreement ${id} updated successfully.`,
    timestamp: new Date().toISOString()
  });
}
