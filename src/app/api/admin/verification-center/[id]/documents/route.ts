import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock with Prisma + MinIO signed URLs
// import { prisma } from "@/lib/prisma";
// import { generateSignedUrl } from "@/lib/storage";
// ─────────────────────────────────────────────────────────────────

// POST — document action (approve/reject/reupload request)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { documentId, action, reviewerComment } = body;

  if (!documentId || !action) {
    return NextResponse.json({ error: "documentId and action are required" }, { status: 400 });
  }

  const validActions = ["APPROVE", "REJECT", "REQUEST_REUPLOAD"];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid document action" }, { status: 400 });
  }

  // API Integration Point:
  // await prisma.verificationDocument.update({
  //   where: { id: documentId },
  //   data: {
  //     status: action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "REUPLOAD_REQUESTED",
  //     reviewerComment,
  //     reviewedBy: session.user.id,
  //     reviewedAt: new Date(),
  //   }
  // });
  // await prisma.auditLog.create({ data: { action: `DOCUMENT_${action}`, entityType: "VerificationDocument", entityId: documentId, ... } });

  const statusMap: Record<string, string> = {
    APPROVE: "APPROVED",
    REJECT: "REJECTED",
    REQUEST_REUPLOAD: "REUPLOAD_REQUESTED",
  };

  return NextResponse.json({
    success: true,
    verReqId: id,
    documentId,
    action,
    newStatus: statusMap[action],
    reviewerComment,
    timestamp: new Date().toISOString(),
  });
}

// GET — generate signed preview/download URL for a document
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");
  const mode = searchParams.get("mode") || "preview"; // preview | download

  // API Integration Point:
  // const doc = await prisma.verificationDocument.findUnique({ where: { id: documentId } });
  // const signedUrl = await generateSignedUrl(doc.fileUrl, mode === "download" ? "attachment" : "inline", 900);

  return NextResponse.json({
    success: true,
    verReqId: id,
    documentId,
    mode,
    signedUrl: `https://minio.anveshakhub.in/verification/${id}/${documentId}?token=mock-signed-token&expires=${Date.now() + 900000}`,
    expiresIn: 900,
  });
}
