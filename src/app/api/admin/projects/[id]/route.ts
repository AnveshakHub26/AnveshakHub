import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_PROJECT_PROFILES: Record<string, any> = {
  "prj-001": {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    description: "Design and implement a local solar microgrid within the campus to test decentralized power sharing algorithms.",
    lifecycle: "IN_PROGRESS",
    budget: 4500000,
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-12-15T00:00:00Z",
    problemStatement: "The campus micro-grid lacks direct communication interfaces with regional loads, leading to 12% power transmission losses.",
    scopeDefinition: "1. Deploy 40kW solar panels at central building. 2. Develop serial communication controller. 3. Train student interns under supervisor.",
    industry: {
      id: "ind-001",
      orgName: "Solaris Power Pvt Ltd",
      email: "info@solarispower.in"
    },
    experts: [
      { id: "exp-001", name: "Dr. Arunima Krishnan", email: "dr.arunima@aiml.in", designation: "Professor & Head of AI Research" }
    ],
    students: [
      { id: "std-001", name: "Arpit Goel", degree: "M.Tech", branch: "CSE", cgpa: 9.4 },
      { id: "std-002", name: "Rishika Roy", degree: "B.Tech", branch: "ECE", cgpa: 8.9 }
    ],
    progress: 62,
    milestones: [
      { id: "ms-001", title: "Feasibility Audit & Initial Design", description: "Completed structural validation.", status: "COMPLETED", completionPct: 100, dueDate: "2026-03-01T00:00:00Z" },
      { id: "ms-002", title: "Hardware Procurement", description: "Sourced panels and microinverters.", status: "COMPLETED", completionPct: 100, dueDate: "2026-06-15T00:00:00Z" },
      { id: "ms-003", title: "Controller Commissioning", description: "Deploy local embedded firmware.", status: "IN_PROGRESS", completionPct: 40, dueDate: "2026-09-30T00:00:00Z" },
      { id: "ms-004", title: "Grid Sync & Final Evaluation", description: "Perform direct power sharing test.", status: "PENDING", completionPct: 0, dueDate: "2026-12-10T00:00:00Z" }
    ],
    sprints: [
      { id: "sp-001", name: "Sprint 1: Serial Driver Setup", startDate: "2026-07-01T00:00:00Z", endDate: "2026-07-15T00:00:00Z", status: "COMPLETED" },
      { id: "sp-002", name: "Sprint 2: Mesh Protocol Test", startDate: "2026-07-16T00:00:00Z", endDate: "2026-07-31T00:00:00Z", status: "ACTIVE" }
    ],
    tasks: [
      { id: "tsk-001", sprintId: "sp-001", title: "Configure Serial Transceiver Baud", description: "Set standard 115200 baud.", status: "DONE", priority: "HIGH", dueDate: "2026-07-10T00:00:00Z", estimatedHours: 8, loggedHours: 8, assigneeName: "Arpit Goel" },
      { id: "tsk-002", sprintId: "sp-001", title: "Write Hardware Interrupt Handler", description: "Handle packet arrivals.", status: "DONE", priority: "CRITICAL", dueDate: "2026-07-14T00:00:00Z", estimatedHours: 12, loggedHours: 14, assigneeName: "Rishika Roy" },
      { id: "tsk-003", sprintId: "sp-002", title: "Test Ring Topology Communication", description: "Conduct signal sweep across 4 nodes.", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-28T00:00:00Z", estimatedHours: 16, loggedHours: 8, assigneeName: "Arpit Goel" },
      { id: "tsk-004", sprintId: "sp-002", title: "Document Power Sharing Boundary API", description: "Save markdown files in vault.", status: "TODO", priority: "LOW", dueDate: "2026-07-30T00:00:00Z", estimatedHours: 6, loggedHours: 0, assigneeName: "Rishika Roy" },
      { id: "tsk-005", sprintId: "sp-002", title: "Calibrate Solar Output Sensor", description: "Calibrate ADC values matching multimeters.", status: "BLOCKED", priority: "MEDIUM", dueDate: "2026-07-31T00:00:00Z", estimatedHours: 10, loggedHours: 2, assigneeName: "Arpit Goel" }
    ],
    documents: [
      { id: "doc-001", name: "Project Proposal v1.pdf", docType: "PROPOSAL", fileUrl: "/mock/proposal.pdf", fileSize: 1024300, version: 1, status: "APPROVED", uploadedBy: "Dr. Arunima K.", createdAt: "2026-01-12T10:00:00Z" },
      { id: "doc-002", name: "System Architecture SRS.pdf", docType: "SRS", fileUrl: "/mock/srs.pdf", fileSize: 2048500, version: 2, status: "APPROVED", uploadedBy: "Dr. Arunima K.", createdAt: "2026-02-15T14:30:00Z" },
      { id: "doc-003", name: "Digital Signed MoU Solaris.pdf", docType: "MOU", fileUrl: "/mock/mou.pdf", fileSize: 512000, version: 1, status: "APPROVED", uploadedBy: "System", createdAt: "2026-02-28T11:00:00Z" }
    ],
    risks: [
      { id: "rsk-001", title: "Inverter Component Lag", description: "Lead time for spare solid-state components exceeded 45 days.", impact: "HIGH", probability: "HIGH", mitigation: "Pre-order parts or use regional substitutes.", status: "ACTIVE" },
      { id: "rsk-002", title: "Rainy Season Output Reduction", description: "Monsoons limit total power yield for test runs.", impact: "MEDIUM", probability: "HIGH", mitigation: "Utilize pre-charged batteries to model standard days.", status: "ACTIVE" }
    ],
    issues: [
      { id: "iss-001", title: "Baud rate mismatch on node 3", description: "Node 3 drops frames due to transceiver frequency drifts.", severity: "HIGH", priority: "HIGH", status: "OPEN", assigneeName: "Arpit Goel" }
    ],
    changeRequests: [
      { id: "cr-001", title: "Increase Solar Panel Capacity to 45kW", description: "Add 10 extra modular panel assemblies to match test limits.", justification: "Requirement from local grid integration engineers.", impact: "Budget increase by ₹2.5L", status: "PENDING", requestedBy: "Dr. Arunima K.", createdAt: "2026-07-18T10:00:00Z" }
    ],
    comments: [
      { id: "cmt-001", authorName: "Dr. Arunima Krishnan", content: "We need to calibrate the sensor limits before running the full telemetry tests on Sprint 2.", isInternal: true, createdAt: "2026-07-20T10:00:00Z" }
    ],
    timeline: [
      { id: "act-001", event: "Project Init & Proposal Approved", description: "Proposal signed off by compliance team.", performedBy: "Priya Nair", createdAt: "2026-01-15T10:00:00Z" },
      { id: "act-002", event: "Sprint 2 Activated", description: "Mesh Protocol testing phase launched.", performedBy: "System", createdAt: "2026-07-16T09:00:00Z" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const project = await prisma.project.findUnique({
  //   where: { id },
  //   include: { industry: true, experts: true, students: true, milestones: true, sprints: true, tasks: true, documents: true, risks: true, issues: true, changeRequests: true, comments: true, activities: true }
  // });

  const detail = MOCK_PROJECT_PROFILES[id] || MOCK_PROJECT_PROFILES["prj-001"];

  if (detail && detail.id !== id) {
    return NextResponse.json({ ...detail, id, name: `Project ${id}` });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    action, lifecycle,
    milestoneId, milestoneStatus, milestonePct,
    taskId, taskStatus, taskPriority, taskAssignee,
    riskId, riskStatus, riskMitigation,
    docId, docStatus,
    crId, crStatus,
    commentContent, commentAuthor
  } = body;

  // API Integration Point:
  // if (action === "UPDATE_LIFECYCLE") {
  //   await prisma.project.update({ where: { id }, data: { lifecycle } });
  // } else if (action === "ADD_TASK") {
  //   await prisma.projectTask.create({ data: { projectId: id, ... } });
  // } else if (action === "UPDATE_TASK") {
  //   await prisma.projectTask.update({ where: { id: taskId }, data: { status: taskStatus } });
  // } else if (action === "ADD_COMMENT") {
  //   await prisma.projectComment.create({ data: { projectId: id, content: commentContent, ... } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    lifecycle,
    message: "Project parameters updated successfully",
    timestamp: new Date().toISOString()
  });
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, title, description, priority, dueDate, assigneeName } = body;

  return NextResponse.json({
    success: true,
    id: `tsk-${Date.now()}`,
    action,
    title,
    description,
    status: "TODO",
    priority,
    dueDate,
    assigneeName,
    createdAt: new Date().toISOString()
  });
}
