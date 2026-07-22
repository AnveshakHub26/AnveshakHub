import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-007 ENTERPRISE DOCUMENTS & CERTIFICATES API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_DOCUMENTS = [
  {
    id: "doc-std-01",
    name: "Arpit Goel CS Resume 2026.pdf",
    category: "RESUME",
    fileUrl: "https://storage.anvesha.in/resumes/arpit-goel-resume.pdf",
    fileSizeMb: 1.2,
    status: "VERIFIED",
    uploadedAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "doc-std-02",
    name: "Node 3 ADC Calibration Sensor Test Report.pdf",
    category: "PROJECT_REPORT",
    fileUrl: "https://storage.anvesha.in/reports/node3-adc-report.pdf",
    fileSizeMb: 4.8,
    status: "VERIFIED",
    uploadedAt: "2026-07-18T10:00:00Z"
  },
  {
    id: "doc-std-03",
    name: "NPTEL Certified Embedded Systems Architect.pdf",
    category: "CERTIFICATE",
    fileUrl: "https://storage.anvesha.in/certs/nptel-embedded-cert.pdf",
    fileSizeMb: 2.1,
    status: "VERIFIED",
    credentialId: "NPTEL-CS2025-9842",
    uploadedAt: "2025-11-20T10:00:00Z"
  },
  {
    id: "doc-std-04",
    name: "IIT Madras Official Grade Transcript - Sem 6.pdf",
    category: "TRANSCRIPT",
    fileUrl: "https://storage.anvesha.in/transcripts/sem6-transcript.pdf",
    fileSizeMb: 3.5,
    status: "VERIFIED",
    uploadedAt: "2026-06-15T10:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "ALL";

  let filtered = MOCK_STUDENT_DOCUMENTS;
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
    const { name, category, fileUrl } = body;

    const newDoc = {
      id: `doc-std-${Date.now()}`,
      name: name || "Uploaded Document.pdf",
      category: category || "OTHER",
      fileUrl: fileUrl || "https://storage.anvesha.in/uploads/doc.pdf",
      fileSizeMb: 2.4,
      status: "VERIFIED",
      uploadedAt: new Date().toISOString()
    };

    MOCK_STUDENT_DOCUMENTS.unshift(newDoc);

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: "Document uploaded to student vault successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
