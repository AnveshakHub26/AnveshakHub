import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-007 ENTERPRISE DOCUMENTS & DELIVERABLES API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_DOCUMENTS = [
  {
    id: "doc-001",
    name: "Non-Disclosure & Confidentiality Agreement (NDA) - Solaris Power.pdf",
    category: "AGREEMENT",
    docType: "NDA",
    fileUrl: "https://storage.anvesha.in/docs/nda-solaris.pdf",
    version: "v1.0",
    status: "APPROVED",
    fileSize: "1.4 MB",
    uploadedBy: "Dr. Arunima Krishnan",
    createdAt: "2026-01-05T10:00:00Z"
  },
  {
    id: "doc-002",
    name: "Sprint 2 Ring Topology Technical Review Report.pdf",
    category: "DELIVERABLE",
    docType: "DELIVERABLE_REPORT",
    fileUrl: "https://storage.anvesha.in/docs/sprint2-report.pdf",
    version: "v2.1",
    status: "APPROVED",
    fileSize: "4.8 MB",
    uploadedBy: "Dr. Arunima Krishnan",
    createdAt: "2026-07-20T14:30:00Z"
  },
  {
    id: "doc-003",
    name: "Decentralized Load Balancing in Smart Micro-Grids (IEEE Preprint).pdf",
    category: "RESEARCH",
    docType: "PUBLICATION",
    fileUrl: "https://storage.anvesha.in/docs/ieee-smartgrid-preprint.pdf",
    version: "v1.0",
    status: "APPROVED",
    fileSize: "2.2 MB",
    uploadedBy: "Dr. Arunima Krishnan",
    createdAt: "2026-06-15T09:00:00Z"
  },
  {
    id: "doc-004",
    name: "Adaptive Voltage Regulation Circuit Patent Specification.pdf",
    category: "IP_RECORD",
    docType: "PATENT",
    fileUrl: "https://storage.anvesha.in/docs/patent-spec.pdf",
    version: "v1.0",
    status: "APPROVED",
    fileSize: "3.1 MB",
    uploadedBy: "Dr. Arunima Krishnan",
    createdAt: "2024-11-10T11:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "ALL";

  let filtered = MOCK_EXPERT_DOCUMENTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q));
  }

  if (category && category !== "ALL") {
    filtered = filtered.filter(d => d.category === category);
  }

  return NextResponse.json({
    documents: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, docType, fileUrl } = body;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: name || "New Document.pdf",
      category: category || "DELIVERABLE",
      docType: docType || "OTHER",
      fileUrl: fileUrl || "https://storage.anvesha.in/docs/new-file.pdf",
      version: "v1.0",
      status: "APPROVED",
      fileSize: "2.0 MB",
      uploadedBy: "Dr. Arunima Krishnan",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: "Document uploaded and registered in vault successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
