import { NextRequest, NextResponse } from "next/server";

const MOCK_PROJECT_DETAILS: Record<string, any> = {
  "prj-001": {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    industryPartner: "Solaris Power Pvt Ltd",
    leadExpert: "Dr. Arunima Krishnan",
    role: "Intern Hardware Lead",
    progress: 68,
    status: "IN_PROGRESS",
    scopeDefinition: "100kW solar micro-grid deployment with HIL testbed calibration.",
    milestones: [
      { id: "m1", title: "Milestone 1 - SIMULINK Digital Twin", dueDate: "2026-03-31T00:00:00Z", status: "COMPLETED" },
      { id: "m2", title: "Milestone 2 - Hardware Inverter Testing", dueDate: "2026-07-15T00:00:00Z", status: "COMPLETED" },
      { id: "m3", title: "Milestone 3 - Grid Field Deployment", dueDate: "2026-10-31T00:00:00Z", status: "IN_PROGRESS" }
    ],
    tasks: [
      { id: "t1", title: "Calibrate Node 3 ADC sensor sampling rate", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-30" },
      { id: "t2", title: "Fix Ring Topology baud rate mismatch on Node 3", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-28" },
      { id: "t3", title: "Compile SIMULINK benchmark comparison table", status: "DONE", priority: "MEDIUM", dueDate: "2026-07-20" }
    ],
    deliverables: [
      { id: "del-std-01", title: "Node 3 Calibration Sensor Log.pdf", status: "APPROVED", submittedAt: "2026-07-18T10:00:00Z" }
    ],
    mentorNotes: [
      { author: "Dr. Arunima Krishnan", note: "Exceptional hardware debugging skills during Node 3 calibration.", date: "2026-06-30T10:00:00Z" }
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
  const { action, taskId, taskStatus, delTitle, delUrl } = body;

  const project = MOCK_PROJECT_DETAILS[id] || MOCK_PROJECT_DETAILS["prj-001"];

  if (action === "UPDATE_TASK" && taskId) {
    const task = project.tasks.find((t: any) => t.id === taskId);
    if (task) task.status = taskStatus || "DONE";
  }

  if (action === "SUBMIT_DELIVERABLE" && delTitle) {
    project.deliverables.unshift({
      id: `del-std-${Date.now()}`,
      title: delTitle,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString()
    });
  }

  return NextResponse.json({
    success: true,
    id,
    message: "Project task updated.",
    project
  });
}
