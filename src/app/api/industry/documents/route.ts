import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// IND-007 ENTERPRISE DOCUMENTS REPOSITORY API
// ─────────────────────────────────────────────────────────────────

const DEMO_ORG_ID = "org-001";

const MOCK_DOCUMENTS = [
  {
    id: "doc-v01",
    industryId: DEMO_ORG_ID,
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
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z"
  },
  {
    id: "doc-v02",
    industryId: DEMO_ORG_ID,
    name: "Autonomous Rover Control System Spec v1.4.pdf",
    docType: "TECHNICAL_SPEC",
    fileUrl: "https://storage.anvesha.in/vault/rover-control-spec.pdf",
    fileSize: 5242880,
    mimeType: "application/pdf",
    version: 4,
    previousVersionId: "doc-v01-old",
    uploadedBy: "Dr. Rohan Das",
    description: "Detailed hardware & firmware specification for ROS2 SLAM obstacle avoidance module.",
    expiresAt: null,
    accessLevel: "CONFIDENTIAL",
    approvalStatus: "APPROVED",
    tags: ["ROS2", "SLAM", "Robotics", "IISC"],
    downloadCount: 88,
    createdAt: "2026-03-10T11:00:00Z",
    updatedAt: "2026-07-02T09:15:00Z"
  },
  {
    id: "doc-v03",
    industryId: DEMO_ORG_ID,
    name: "Mutual Non-Disclosure Agreement (NDA) - IISc.pdf",
    docType: "NDA",
    fileUrl: "https://storage.anvesha.in/vault/nda-iisc-2026.pdf",
    fileSize: 1048576,
    mimeType: "application/pdf",
    version: 1,
    previousVersionId: null,
    uploadedBy: "Priya Nair",
    description: "Bilateral NDA governing joint IP development for autonomous terrain rovers.",
    expiresAt: "2027-04-01T00:00:00Z",
    accessLevel: "RESTRICTED",
    approvalStatus: "APPROVED",
    tags: ["NDA", "IP", "Legal", "IISc"],
    downloadCount: 15,
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-04-01T09:00:00Z"
  },
  {
    id: "doc-v04",
    industryId: DEMO_ORG_ID,
    name: "ISO 9001:2023 Clean Technology Audit Certificate.pdf",
    docType: "AUDIT_REPORT",
    fileUrl: "https://storage.anvesha.in/vault/iso-cert-2026.pdf",
    fileSize: 1835008,
    mimeType: "application/pdf",
    version: 1,
    previousVersionId: null,
    uploadedBy: "Nisha Patel",
    description: "Annual quality management audit compliance certificate issued by TUV Rheinland.",
    expiresAt: "2026-11-30T00:00:00Z",
    accessLevel: "INTERNAL",
    approvalStatus: "APPROVED",
    tags: ["Compliance", "Audit", "ISO", "Quality"],
    downloadCount: 31,
    createdAt: "2025-11-30T10:00:00Z",
    updatedAt: "2025-11-30T10:00:00Z"
  },
  {
    id: "doc-v05",
    industryId: DEMO_ORG_ID,
    name: "Q2 2026 Financial Grant Audit & Spending Ledger.xlsx",
    docType: "FINANCIAL",
    fileUrl: "https://storage.anvesha.in/vault/q2-grant-audit.xlsx",
    fileSize: 3145728,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    version: 3,
    previousVersionId: "doc-v05-prev",
    uploadedBy: "Nisha Patel",
    description: "Audit ledger submitted to DPIIT showing budget utilization across micro-grid nodes.",
    expiresAt: null,
    accessLevel: "CONFIDENTIAL",
    approvalStatus: "PENDING_APPROVAL",
    tags: ["Finance", "Audit", "Grant", "DPIIT"],
    downloadCount: 19,
    createdAt: "2026-07-01T16:00:00Z",
    updatedAt: "2026-07-15T11:20:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const docType = searchParams.get("docType") || "ALL";
  const accessLevel = searchParams.get("accessLevel") || "ALL";

  let filtered = MOCK_DOCUMENTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (docType && docType !== "ALL") {
    filtered = filtered.filter(d => d.docType === docType);
  }

  if (accessLevel && accessLevel !== "ALL") {
    filtered = filtered.filter(d => d.accessLevel === accessLevel);
  }

  // Calculate summary stats
  const total = MOCK_DOCUMENTS.length;
  const expiringSoon = MOCK_DOCUMENTS.filter(d => {
    if (!d.expiresAt) return false;
    const exp = new Date(d.expiresAt).getTime();
    const now = Date.now();
    const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
    return daysLeft > 0 && daysLeft <= 120;
  }).length;
  const confidential = MOCK_DOCUMENTS.filter(d => d.accessLevel === "CONFIDENTIAL").length;
  const pendingApproval = MOCK_DOCUMENTS.filter(d => d.approvalStatus === "PENDING_APPROVAL").length;

  return NextResponse.json({
    documents: filtered,
    total: filtered.length,
    stats: { total, expiringSoon, confidential, pendingApproval }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, docType, description, accessLevel, tags, fileSize, expiresAt } = body;

    const newDoc = {
      id: `doc-${Date.now()}`,
      industryId: DEMO_ORG_ID,
      name,
      docType: docType || "OTHER",
      fileUrl: `https://storage.anvesha.in/vault/${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      fileSize: fileSize || 2097152,
      mimeType: "application/pdf",
      version: 1,
      previousVersionId: null,
      uploadedBy: "Rajesh Sharma",
      description: description || "",
      expiresAt: expiresAt || null,
      accessLevel: accessLevel || "RESTRICTED",
      approvalStatus: "APPROVED",
      tags: tags || [],
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: "Document uploaded to Enterprise Vault successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}
