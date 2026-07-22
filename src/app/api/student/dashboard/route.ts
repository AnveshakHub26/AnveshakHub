import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-001 ENTERPRISE STUDENT DASHBOARD API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_DASHBOARD = {
  student: {
    id: "std-001",
    name: "Arpit Goel",
    usn: "CS21B042",
    institution: "IIT Madras",
    degree: "B.Tech Computer Science",
    semester: 7,
    cgpa: 9.4,
    verificationStatus: "VERIFIED"
  },
  kpis: {
    activeProjectsCount: 1,
    completedTasksCount: 8,
    totalTasksCount: 10,
    mentorshipScore: 4.7,
    attendanceRate: 96,
    learningGoalsCompleted: 2,
    totalLearningGoals: 3
  },
  assignedProject: {
    id: "prj-001",
    name: "Solar Micro-Grid for IIT Madras",
    industryPartner: "Solaris Power Pvt Ltd",
    role: "Intern Hardware Lead",
    leadExpert: "Dr. Arunima Krishnan",
    progress: 68,
    sprintMilestone: "Sprint 2 - Ring Topology Test"
  },
  assignedTasks: [
    { id: "t1", title: "Calibrate Node 3 ADC sensor sampling rate", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-30" },
    { id: "t2", title: "Fix Ring Topology baud rate mismatch on Node 3", status: "IN_PROGRESS", priority: "HIGH", dueDate: "2026-07-28" },
    { id: "t3", title: "Compile SIMULINK benchmark comparison table", status: "DONE", priority: "MEDIUM", dueDate: "2026-07-20" }
  ],
  leadMentor: {
    id: "exp-001",
    name: "Dr. Arunima Krishnan",
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    lastFeedback: "Exceptional hardware debugging skills during Node 3 calibration.",
    lastFeedbackDate: "2026-06-30T10:00:00Z"
  },
  upcomingCalls: [
    {
      id: "mtg-001",
      title: "Sprint 2 Review – Solar Micro-Grid",
      orgName: "Solaris Power Pvt Ltd",
      startTime: "2026-07-28T10:00:00+05:30",
      endTime: "2026-07-28T11:30:00+05:30",
      videoLink: "https://meet.google.com/abc-def-ghi"
    }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STUDENT_DASHBOARD);
}
