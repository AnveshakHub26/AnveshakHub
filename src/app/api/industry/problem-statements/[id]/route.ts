import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_AI_ANALYSIS: Record<string, any> = {
  "prob-001": {
    feasibilityScore: 88,
    difficulty: "HARD",
    recommendedDomains: ["Grid Automation", "Dynamic Load Balancing", "Reinforcement Learning"],
    estimatedDevelopmentDays: 180,
    academicReadiness: "HIGH (Several IEEE frameworks available)",
    complianceRisk: "LOW (Operates on private campus grid limits)",
    keyTechnicalObstacles: [
      "Sub-second frequency drift calibration in micro-controllers",
      "Network packet loss over wireless mesh nodes under heavy load"
    ]
  },
  "prob-002": {
    feasibilityScore: 72,
    difficulty: "CRITICAL",
    recommendedDomains: ["Multi-Agent IoT Mesh", "RF Hardware Serialization", "Embedded Security"],
    estimatedDevelopmentDays: 240,
    academicReadiness: "MEDIUM (Requires custom RF firmware customization)",
    complianceRisk: "MEDIUM (Requires WPC certification for custom wireless frequencies)",
    keyTechnicalObstacles: [
      "Power consumption limits for off-grid battery modules during active broadcasting",
      "Robust packet synchronization without a central cloud server"
    ]
  }
};

const MOCK_PROBLEM_PROFILES: Record<string, any> = {
  "prob-001": {
    id: "prob-001",
    title: "AI-Powered Decentralized Solar Micro-Grid Synchronization",
    description: "Design real-time local algorithms to balance supply/demand fluctuations in local off-grid solar generators, minimizing network line losses and storage degradation.",
    category: "Clean Energy & Grid Technology",
    priority: "HIGH",
    status: "APPROVED",
    version: 1,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-15T14:30:00Z",
    aiAnalysis: MOCK_AI_ANALYSIS["prob-001"],
    documents: [
      { id: "doc-001", name: "IIT Madras MicroGrid Survey Report.pdf", fileSize: 1024300, uploadedBy: "Ankit Sharma", createdAt: "2026-06-10T10:30:00Z" },
      { id: "doc-002", name: "Decentralized Load Spec.pdf", fileSize: 512000, uploadedBy: "Dr. Arunima K.", createdAt: "2026-06-12T11:00:00Z" }
    ],
    comments: [
      { id: "cmt-001", authorName: "Rajesh Sharma", content: "We need to ensure this is deployable on IIT campus buildings before the monsoons start.", createdAt: "2026-06-11T12:00:00Z" },
      { id: "cmt-002", authorName: "Dr. Arunima Krishnan", content: "IEEE standard 1547.4 provides dynamic balancing limits we can borrow for our algorithm bounds.", createdAt: "2026-06-13T16:00:00Z" }
    ],
    timeline: [
      { id: "tl-001", event: "Problem Statement Draft Created", description: "Created by Rajesh Sharma (Org Admin)", performedBy: "Rajesh Sharma", createdAt: "2026-06-10T10:00:00Z" },
      { id: "tl-002", event: "Problem Submitted for Review", description: "Sent to AnveshakHub verification center.", performedBy: "Rajesh Sharma", createdAt: "2026-06-10T10:15:00Z" },
      { id: "tl-003", event: "Compliance Check Passed", description: "Vetted by compliance committee.", performedBy: "Compliance Officer", createdAt: "2026-06-12T09:00:00Z" },
      { id: "tl-004", event: "Problem Statement Approved", description: "Status changed to Approved. AI-Analysis completed.", performedBy: "Super Admin", createdAt: "2026-06-15T14:30:00Z" }
    ]
  },
  "prob-002": {
    id: "prob-002",
    title: "Multi-Agent Smart Inverter Mesh Protocol",
    description: "Develop a secure RF serialization mesh topology protocol allowing hardware solar inverters to exchange power sharing bounds dynamically without a centralized cloud router.",
    category: "Hardware & IoT",
    priority: "CRITICAL",
    status: "UNDER_REVIEW",
    version: 2,
    createdAt: "2026-07-02T09:00:00Z",
    updatedAt: "2026-07-12T11:00:00Z",
    aiAnalysis: MOCK_AI_ANALYSIS["prob-002"],
    documents: [
      { id: "doc-003", name: "Mesh Hardware Specs.pdf", fileSize: 2048500, uploadedBy: "Ankit Sharma", createdAt: "2026-07-02T09:30:00Z" }
    ],
    comments: [
      { id: "cmt-003", authorName: "Nisha Patel", content: "Reviewing hardware bill of materials to check if transceiver modules fit budget.", createdAt: "2026-07-05T14:00:00Z" }
    ],
    timeline: [
      { id: "tl-005", event: "Draft v1 Saved", description: "Initial setup.", performedBy: "Ankit Sharma", createdAt: "2026-07-02T09:00:00Z" },
      { id: "tl-006", event: "Version 2 Draft Saved", description: "Updated security bounds details.", performedBy: "Ankit Sharma", createdAt: "2026-07-10T15:30:00Z" },
      { id: "tl-007", event: "Submitted for Vetting", description: "Entered Under Review lifecycle.", performedBy: "Rajesh Sharma", createdAt: "2026-07-12T11:00:00Z" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const detail = MOCK_PROBLEM_PROFILES[id] || MOCK_PROBLEM_PROFILES["prob-001"];

  if (detail && detail.id !== id) {
    return NextResponse.json({ ...detail, id, title: `Problem Statement ${id}`, status: "DRAFT", aiAnalysis: null, documents: [], comments: [], timeline: [] });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, commentContent, authorName, docName, docSize, status } = body;

  // Simulate comment addition, document uploads, or status changes
  return NextResponse.json({
    success: true,
    id,
    action,
    message: `Problem parameters updated successfully for action: ${action || "UPDATE"}`,
    timestamp: new Date().toISOString(),
    comment: commentContent ? { id: `cmt-${Date.now()}`, authorName: authorName || "Rajesh Sharma", content: commentContent, createdAt: new Date().toISOString() } : undefined,
    document: docName ? { id: `doc-${Date.now()}`, name: docName, fileSize: docSize || 1024000, uploadedBy: authorName || "Rajesh Sharma", createdAt: new Date().toISOString() } : undefined,
    status: status || undefined
  });
}
