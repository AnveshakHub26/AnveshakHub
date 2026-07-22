import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-008 STUDENT PROGRESS & ACHIEVEMENTS API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_PROGRESS = {
  academicSummary: {
    cgpa: 9.4,
    completedSemesters: 6,
    creditsEarned: 142,
    classRank: 3
  },
  growthMetrics: {
    milestonesCompleted: 12,
    internshipsCompleted: 1,
    mentorshipScore: 4.7,
    attendanceRate: 96
  },
  skillVelocity: [
    { skill: "C++ Embedded Systems", level: "ADVANCED", progress: 92 },
    { skill: "SIMULINK Digital Twin HIL", level: "INTERMEDIATE", progress: 85 },
    { skill: "ADC Noise Filtering", level: "ADVANCED", progress: 88 },
    { skill: "ROS2 SLAM Perception", level: "INTERMEDIATE", progress: 65 }
  ],
  achievements: [
    { id: "ach-1", title: "1st Rank in IIT Madras Hardware Hackathon 2025", category: "HACKATHON", issuer: "IIT Madras", year: 2025 },
    { id: "ach-2", title: "KVPY National Fellow", category: "FELLOWSHIP", issuer: "DST Govt of India", year: 2021 },
    { id: "ach-3", title: "NPTEL Embedded Architect Gold Medallist", category: "HONORS", issuer: "IIT Kharagpur", year: 2025 }
  ],
  timeline: [
    { date: "2026-07-18", event: "Approved Sprint 2 Node 3 Calibration Report", category: "PROJECT" },
    { date: "2026-06-30", event: "Received 4.85 Mentorship Score from Dr. Arunima Krishnan", category: "MENTORSHIP" },
    { date: "2026-01-01", event: "Joined Solaris Power Pvt Ltd R&D Internship", category: "INTERNSHIP" }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_STUDENT_PROGRESS);
}
