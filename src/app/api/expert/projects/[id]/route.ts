import { NextRequest, NextResponse } from "next/server";

const MOCK_PROJECT_DETAILS: Record<string, any> = {
  "prj-001": {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    industryPartner: "Solaris Power Pvt Ltd",
    status: "IN_PROGRESS",
    role: "Lead Technical Advisor",
    budget: 7500000.00,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T00:00:00Z",
    progress: 68,
    scopeDefinition: "Deployment of 100kW solar micro-grid with decentralized RL frequency response algorithms and real-time monitoring.",
    milestones: [
      { id: "m1", title: "Milestone 1 - SIMULINK Digital Twin", dueDate: "2026-03-31T00:00:00Z", status: "COMPLETED", amount: 2000000.00 },
      { id: "m2", title: "Milestone 2 - Hardware Inverter Testing", dueDate: "2026-07-15T00:00:00Z", status: "COMPLETED", amount: 2500000.00 },
      { id: "m3", title: "Milestone 3 - Grid Field Deployment", dueDate: "2026-10-31T00:00:00Z", status: "IN_PROGRESS", amount: 2000000.00 },
      { id: "m4", title: "Milestone 4 - Final Audit & Sign-off", dueDate: "2026-12-15T00:00:00Z", status: "PENDING", amount: 1000000.00 }
    ],
    tasks: [
      { id: "t1", title: "Calibrate Node 3 ADC sensor sampling rate", status: "IN_PROGRESS", assignee: "Arpit Goel (Intern)", priority: "HIGH" },
      { id: "t2", title: "Fix Ring Topology baud rate mismatch on Node 3", status: "IN_PROGRESS", assignee: "Rishika Roy (Intern)", priority: "HIGH" },
      { id: "t3", title: "Compile Sprint 2 test results report for Solaris", status: "DONE", assignee: "Dr. Arunima Krishnan", priority: "MEDIUM" }
    ],
    deliverables: [
      { id: "del-01", title: "Sprint 2 Test Report - Ring Topology", fileUrl: "https://storage.anvesha.in/deliverables/sprint2-report.pdf", status: "APPROVED", submittedBy: "Dr. Arunima Krishnan", submittedAt: "2026-07-20T10:00:00Z" },
      { id: "del-02", title: "SIMULINK Model Source Code v2.0", fileUrl: "https://storage.anvesha.in/deliverables/simulink-v2.zip", status: "APPROVED", submittedBy: "Dr. Arunima Krishnan", submittedAt: "2026-04-01T11:00:00Z" }
    ],
    studentMentees: [
      { id: "std-001", name: "Arpit Goel", role: "Intern Hardware Lead", progress: 75, tasksAssigned: 4 },
      { id: "std-002", name: "Rishika Roy", role: "Intern Software Lead", progress: 60, tasksAssigned: 3 }
    ],
    risks: [
      { id: "r1", title: "Monsoon Season Delay on Field Installation", impact: "HIGH", probability: "MEDIUM", status: "OPEN", mitigation: "Pre-assemble modular inverter racks indoors." }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = MOCK_PROJECT_DETAILS[id] || {
    ...MOCK_PROJECT_DETAILS["prj-001"],
    id,
    name: `Project ${id}`
  };

  return NextResponse.json(project);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, delTitle, delUrl, delDesc, taskId, taskStatus } = body;

  const project = MOCK_PROJECT_DETAILS[id] || MOCK_PROJECT_DETAILS["prj-001"];

  if (action === "SUBMIT_DELIVERABLE" && delTitle) {
    project.deliverables.unshift({
      id: `del-${Date.now()}`,
      title: delTitle,
      fileUrl: delUrl || "https://storage.anvesha.in/deliverables/sample.pdf",
      description: delDesc || "",
      status: "SUBMITTED",
      submittedBy: "Dr. Arunima Krishnan",
      submittedAt: new Date().toISOString()
    });
  }

  if (action === "UPDATE_TASK" && taskId) {
    const task = project.tasks.find((t: any) => t.id === taskId);
    if (task) task.status = taskStatus || "DONE";
  }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Project workspace updated successfully.",
    project
  });
}
