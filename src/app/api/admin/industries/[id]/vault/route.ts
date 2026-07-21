import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock with Prisma + MinIO
// import { prisma } from "@/lib/prisma";
// import { generateSignedUrl } from "@/lib/storage";
// ─────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const docType = searchParams.get("docType") || "";

  // API Integration Point:
  // const docs = await prisma.documentVault.findMany({
  //   where: { industryId: id, ...(docType ? { docType } : {}) },
  //   orderBy: { createdAt: "desc" }
  // });

  const mockDocs = [
    { id: "vd-001", name: "Master NDA 2026", docType: "NDA", fileSize: 245000, version: 2, uploadedBy: "Priya Nair", createdAt: "2026-06-16T00:00:00Z", expiresAt: "2027-06-16T00:00:00Z", description: "Non-disclosure agreement signed by both parties" },
    { id: "vd-002", name: "Collaboration MoU – IIT Madras", docType: "MOU", fileSize: 380000, version: 1, uploadedBy: "Priya Nair", createdAt: "2026-06-20T00:00:00Z", expiresAt: null, description: "MoU for joint research collaboration" },
    { id: "vd-003", name: "Service Contract Q2 2026", docType: "CONTRACT", fileSize: 520000, version: 3, uploadedBy: "Meena Iyer", createdAt: "2026-04-01T00:00:00Z", expiresAt: "2026-09-30T00:00:00Z", description: "Service agreement for Q2 deliverables" },
    { id: "vd-004", name: "Invoice INV-2026-0042", docType: "INVOICE", fileSize: 95000, version: 1, uploadedBy: "Meena Iyer", createdAt: "2026-07-01T00:00:00Z", expiresAt: null, description: "Invoice for July milestone" },
    { id: "vd-005", name: "IP Agreement – Solar Grid Project", docType: "IP_AGREEMENT", fileSize: 310000, version: 1, uploadedBy: "Admin", createdAt: "2026-06-25T00:00:00Z", expiresAt: null, description: "Intellectual property rights agreement for research outputs" },
    { id: "vd-006", name: "Q2 Progress Report", docType: "REPORT", fileSize: 1240000, version: 1, uploadedBy: "Dr. Arun Prasad", createdAt: "2026-07-05T00:00:00Z", expiresAt: null, description: "Quarterly progress report for all active projects" },
  ];

  const filtered = docType ? mockDocs.filter((d) => d.docType === docType) : mockDocs;

  return NextResponse.json({ documents: filtered, total: filtered.length, industryId: id });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, docType, description, expiresAt } = body;

  if (!name || !docType) {
    return NextResponse.json({ error: "name and docType are required" }, { status: 400 });
  }

  // API Integration Point:
  // const doc = await prisma.documentVault.create({
  //   data: { industryId: id, name, docType, description, expiresAt, fileUrl: body.fileUrl, fileSize: body.fileSize, uploadedBy: session.user.id }
  // });
  // await prisma.industryTimeline.create({ data: { industryId: id, event: `Document Uploaded: ${name}`, category: "DOCUMENT" } });

  return NextResponse.json({
    success: true,
    id: `vd-${Date.now()}`,
    industryId: id,
    name,
    docType,
    description,
    expiresAt,
    version: 1,
    createdAt: new Date().toISOString(),
  }, { status: 201 });
}
