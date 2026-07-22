import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-009 ENTERPRISE STUDENT ANALYTICS API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_ANALYTICS = {
  kpis: {
    cgpa: 9.4,
    milestonesCompleted: 12,
    tasksCompleted: 18,
    mentorshipScore: 4.85,
    attendanceRate: 96,
    stipendEarned: 100000.00
  },
  monthlyProgress: [
    { month: "Jan", score: 82 },
    { month: "Feb", score: 85 },
    { month: "Mar", score: 88 },
    { month: "Apr", score: 90 },
    { month: "May", score: 92 },
    { month: "Jun", score: 96 }
  ],
  projectMilestones: [
    { name: "SIMULINK Digital Twin HIL", progress: 100, status: "COMPLETED" },
    { name: "Node 3 ADC Sensor Calibration", progress: 85, status: "IN_PROGRESS" }
  ],
  skillMastery: [
    { skill: "C++ Embedded Systems", score: 92 },
    { skill: "SIMULINK HIL Testbed", score: 85 },
    { skill: "ADC Sensor Noise Filter", score: 88 },
    { skill: "ROS2 SLAM Navigation", score: 65 }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STUDENT_ANALYTICS);
}
