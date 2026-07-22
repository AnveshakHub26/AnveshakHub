import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-009 ENTERPRISE ANALYTICS API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_ANALYTICS = {
  kpis: {
    projectCompletionRate: 92,
    mentorshipScore: 4.85,
    citationsCount: 892,
    hIndex: 14,
    totalConsultancyEarnings: 385000.00,
    totalConsultationHours: 142
  },
  monthlyEarnings: [
    { month: "Jan", earnings: 45000 },
    { month: "Feb", earnings: 60000 },
    { month: "Mar", earnings: 55000 },
    { month: "Apr", earnings: 70000 },
    { month: "May", earnings: 65000 },
    { month: "Jun", earnings: 90000 }
  ],
  projectPerformance: [
    { name: "Solar Micro-Grid for IIT Madras", progress: 68, status: "ON_TRACK" },
    { name: "Autonomous Rover Control Module", progress: 45, status: "ON_TRACK" }
  ],
  mentorshipBreakdown: [
    { student: "Arpit Goel", score: 4.7, tasksCompleted: 8 },
    { student: "Rishika Roy", score: 4.75, tasksCompleted: 6 },
    { student: "Kabir Verma", score: 4.8, tasksCompleted: 7 }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_EXPERT_ANALYTICS);
}
