import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-005 STUDENT LEARNING, MENTORSHIP & SKILL DEVELOPMENT API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_LEARNING = {
  overallProgressPct: 78,
  skillScores: [
    { skill: "C++ Embedded Development", score: 92, target: 100 },
    { skill: "SIMULINK Digital Twin HIL", score: 85, target: 100 },
    { skill: "ADC Sampling Rate Calibration", score: 88, target: 100 },
    { skill: "ROS2 SLAM Navigation", score: 65, target: 100 }
  ],
  learningGoals: [
    { id: "lg-01", title: "Complete SIMULINK Ring Topology HIL Benchmark", status: "COMPLETED", dueDate: "2026-07-15" },
    { id: "lg-02", title: "Master Node 3 10kHz ADC Sensor Calibration", status: "IN_PROGRESS", dueDate: "2026-07-30" },
    { id: "lg-03", title: "Submit Sprint 2 Hardware Review Report", status: "IN_PROGRESS", dueDate: "2026-08-10" }
  ],
  learningResources: [
    { id: "res-01", title: "SIMULINK HIL Solar Inverter Testbed Guide", category: "SIMULINK", url: "https://docs.anvesha.in/simulink-hil-guide.pdf", description: "Comprehensive hardware-in-the-loop simulation handbook for 100kW solar micro-grids." },
    { id: "res-02", title: "ADC Sensor Sampling & Noise Filtering in C++", category: "EMBEDDED_SYSTEMS", url: "https://docs.anvesha.in/adc-noise-filter.pdf", description: "Low-pass digital filtering algorithms for 10kHz ADC micro-controller sampling." },
    { id: "res-03", title: "ROS2 Nav2 Obstacle Avoidance Pipeline", category: "ROS2", url: "https://docs.anvesha.in/ros2-nav2-pipeline.pdf", description: "Step-by-step ROS2 point cloud processing tutorial for rough-terrain rovers." }
  ],
  leadMentor: {
    id: "exp-001",
    name: "Dr. Arunima Krishnan",
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    totalSessionsCompleted: 6,
    latestNote: "Exceptional hardware debugging skills during Node 3 calibration."
  }
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STUDENT_LEARNING);
}
