import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-001 ENTERPRISE EXPERT DASHBOARD API
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_DASHBOARD = {
  expert: {
    id: "exp-001",
    name: "Dr. Arunima Krishnan",
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    department: "Computer Science & Engineering",
    availabilityStatus: "AVAILABLE",
    rating: 4.9,
    reviewsCount: 34,
    verificationStatus: "VERIFIED"
  },
  kpis: {
    activeEngagementsCount: 2,
    completedEngagementsCount: 7,
    studentsMentoredCount: 6,
    totalConsultationHours: 142,
    hIndex: 14,
    citationsCount: 892,
    totalPublications: 28
  },
  activeProjects: [
    {
      id: "prj-001",
      name: "Solar Micro-Grid for IIT Madras",
      industryPartner: "Solaris Power Pvt Ltd",
      status: "IN_PROGRESS",
      role: "Lead Technical Advisor",
      sprintMilestone: "Sprint 2 - Ring Topology Test",
      progress: 68,
      nextDeliverable: "Calibration ADC spec review",
      dueDate: "2026-07-30T00:00:00Z"
    },
    {
      id: "prj-004",
      name: "Autonomous Rover Control Module",
      industryPartner: "Robotics Corp",
      status: "UNDER_REVIEW",
      role: "AI Consultant",
      sprintMilestone: "Sprint 1 - SLAM Integration",
      progress: 45,
      nextDeliverable: "ROS2 node architecture audit",
      dueDate: "2026-08-05T00:00:00Z"
    }
  ],
  studentMentees: [
    { id: "std-001", name: "Arpit Goel", project: "Solar Micro-Grid", institution: "IIT Madras", progress: 75, attendance: "PRESENT" },
    { id: "std-002", name: "Rishika Roy", project: "Solar Micro-Grid", institution: "IIT Madras", progress: 60, attendance: "PRESENT" },
    { id: "std-003", name: "Kabir Verma", project: "Autonomous Rover", institution: "IISc Bangalore", progress: 80, attendance: "PRESENT" }
  ],
  upcomingCalls: [
    {
      id: "mtg-001",
      title: "Sprint 2 Review – Solar Micro-Grid",
      orgName: "Solaris Power Pvt Ltd",
      startTime: "2026-07-28T10:00:00+05:30",
      endTime: "2026-07-28T11:30:00+05:30",
      platform: "GOOGLE_MEET",
      videoLink: "https://meet.google.com/abc-def-ghi",
      status: "SCHEDULED"
    },
    {
      id: "mtg-002",
      title: "Rover Control Module Architecture Sync",
      orgName: "Robotics Corp",
      startTime: "2026-08-02T14:00:00+05:30",
      endTime: "2026-08-02T15:30:00+05:30",
      platform: "MICROSOFT_TEAMS",
      videoLink: "https://teams.microsoft.com/l/meetup-join/rover",
      status: "SCHEDULED"
    }
  ],
  recentActivities: [
    { id: "act-01", event: "Submitted Sprint 2 Technical Review Notes", target: "Solar Micro-Grid", date: "2026-07-20T14:30:00Z" },
    { id: "act-02", event: "Accepted Collaboration Invitation", target: "Robotics Corp", date: "2026-07-15T11:00:00Z" },
    { id: "act-03", event: "Published Journal Paper in IEEE Smart Grid", target: "Research Portfolio", date: "2026-06-25T09:00:00Z" }
  ]
};

export async function GET(req: NextRequest) {
  return NextResponse.json(MOCK_EXPERT_DASHBOARD);
}
