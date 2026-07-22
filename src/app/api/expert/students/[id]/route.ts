import { NextRequest, NextResponse } from "next/server";

const MOCK_STUDENT_DETAILS: Record<string, any> = {
  "std-001": {
    id: "std-001",
    name: "Arpit Goel",
    email: "arpit.goel@iitm.ac.in",
    usn: "CS21B042",
    institution: "IIT Madras",
    degree: "B.Tech Computer Science",
    semester: 7,
    cgpa: 9.4,
    assignedProject: "Solar Micro-Grid for IIT Madras",
    assignedRole: "Intern Hardware Lead",
    technicalSkillScore: 4.8,
    softSkillScore: 4.6,
    overallScore: 4.7,
    attendanceRate: 96,
    completedTasksCount: 8,
    totalTasksCount: 10,
    status: "ACTIVE",
    skills: ["C++", "MATLAB", "SIMULINK", "Embedded Systems", "ADC Calibration"],
    evaluations: [
      { id: "ev-01", technicalScore: 4.8, softSkillScore: 4.6, overallScore: 4.7, feedback: "Exceptional hardware debugging skills during Node 3 calibration.", date: "2026-06-30T10:00:00Z" }
    ],
    learningPlan: [
      { id: "goal-1", title: "Master SIMULINK HIL Testing Pipeline", status: "COMPLETED", targetDate: "2026-03-15T00:00:00Z" },
      { id: "goal-2", title: "Calibrate ADC Sensors for Solar Inverter Node 3", status: "IN_PROGRESS", targetDate: "2026-07-30T00:00:00Z" },
      { id: "goal-3", title: "Draft Co-Authored IEEE Paper Section on Micro-Grid Nodes", status: "PENDING", targetDate: "2026-09-15T00:00:00Z" }
    ],
    recommendation: null,
    attendanceLogs: [
      { date: "2026-07-22", status: "PRESENT", notes: "Node 3 sampling calibration session" },
      { date: "2026-07-21", status: "PRESENT", notes: "Lab hardware assembly" },
      { date: "2026-07-20", status: "PRESENT", notes: "Weekly sync meeting" }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const student = MOCK_STUDENT_DETAILS[id] || {
    ...MOCK_STUDENT_DETAILS["std-001"],
    id,
    name: `Student Mentee ${id}`
  };

  return NextResponse.json(student);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, technicalScore, softSkillScore, feedback, recTitle, recContent, goalTitle } = body;

  const student = MOCK_STUDENT_DETAILS[id] || MOCK_STUDENT_DETAILS["std-001"];

  if (action === "SUBMIT_EVALUATION") {
    student.evaluations.unshift({
      id: `ev-${Date.now()}`,
      technicalScore: parseFloat(technicalScore) || 4.8,
      softSkillScore: parseFloat(softSkillScore) || 4.6,
      overallScore: ((parseFloat(technicalScore) + parseFloat(softSkillScore)) / 2).toFixed(1),
      feedback: feedback || "Good progress.",
      date: new Date().toISOString()
    });
  }

  if (action === "ISSUE_RECOMMENDATION" && recTitle) {
    student.recommendation = {
      id: `rec-${Date.now()}`,
      title: recTitle,
      content: recContent || "",
      issuedAt: new Date().toISOString()
    };
  }

  if (action === "ADD_LEARNING_GOAL" && goalTitle) {
    student.learningPlan.push({
      id: `goal-${Date.now()}`,
      title: goalTitle,
      status: "IN_PROGRESS",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Mentee profile & evaluation records updated.",
    student
  });
}
