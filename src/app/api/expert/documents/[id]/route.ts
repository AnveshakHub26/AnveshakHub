import { NextRequest, NextResponse } from "next/server";

const MOCK_DOC_DETAILS: Record<string, any> = {
  "doc-002": {
    id: "doc-002",
    name: "Sprint 2 Ring Topology Technical Review Report.pdf",
    category: "DELIVERABLE",
    docType: "DELIVERABLE_REPORT",
    fileUrl: "https://storage.anvesha.in/docs/sprint2-report.pdf",
    version: "v2.1",
    status: "APPROVED",
    fileSize: "4.8 MB",
    uploadedBy: "Dr. Arunima Krishnan",
    createdAt: "2026-07-20T14:30:00Z",
    history: [
      { version: "v2.1", date: "2026-07-20T14:30:00Z", comment: "Final approved report after Solaris review." },
      { version: "v1.0", date: "2026-07-10T10:00:00Z", comment: "Initial draft submission." }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = MOCK_DOC_DETAILS[id] || {
    ...MOCK_DOC_DETAILS["doc-002"],
    id,
    name: `Document ${id}`
  };

  return NextResponse.json(doc);
}
