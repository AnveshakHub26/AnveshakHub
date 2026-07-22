import { NextRequest, NextResponse } from "next/server";

const MOCK_OPPORTUNITY_DETAILS: Record<string, any> = {
  "opp-001": {
    id: "opp-001",
    title: "AI-Driven Solar Micro-Grid Frequency Balancing & Load Forecasting",
    industryName: "Solaris Power Pvt Ltd",
    industryId: "org-001",
    domain: "Clean Energy & AI",
    budget: 7500000.00,
    durationWeeks: 24,
    deadline: "2026-08-30T00:00:00Z",
    status: "OPEN",
    isSaved: true,
    hasApplied: false,
    description: "Looking for senior AI/ML expert to design reinforcement learning models for 100kW solar micro-grid load prediction and grid frequency stabilization.",
    requirements: [
      "Ph.D. or 10+ yrs in Power Systems / AI",
      "Hands-on expertise with TensorFlow / PyTorch for time-series forecasting",
      "Experience with MATLAB SIMULINK hardware-in-the-loop (HIL) simulation",
      "Prior track record of R&D industry collaborations"
    ],
    scopeOfWork: "Phase 1: High-fidelity SIMULINK solar array digital twin.\nPhase 2: Multi-agent RL agent training for frequency response.\nPhase 3: Hardware-in-the-loop testbed deployment at IIT Madras.",
    eligibilityScore: 94,
    matchingSkills: ["Python", "TensorFlow", "MATLAB", "Power Systems", "Reinforcement Learning"],
    application: null,
    createdAt: "2026-07-01T10:00:00Z"
  },
  "opp-002": {
    id: "opp-002",
    title: "Autonomous Rover SLAM Navigation Firmware for Rough Terrain",
    industryName: "Robotics Corp",
    industryId: "org-002",
    domain: "Robotics & Embedded Systems",
    budget: 4500000.00,
    durationWeeks: 16,
    deadline: "2026-09-15T00:00:00Z",
    status: "OPEN",
    isSaved: false,
    hasApplied: true,
    applicationStatus: "SHORTLISTED",
    description: "Design ROS2-based SLAM obstacle avoidance algorithm for off-road planetary terrain exploration rovers.",
    requirements: ["C++", "ROS2", "OpenCV", "LiDAR Sensor Fusion"],
    scopeOfWork: "Deliver production ROS2 C++ package with real-time point cloud mapping.",
    eligibilityScore: 88,
    matchingSkills: ["C++", "ROS", "SLAM", "OpenCV"],
    application: {
      id: "app-002",
      proposedBudget: 4200000.00,
      durationWeeks: 14,
      status: "SHORTLISTED",
      proposal: "We propose a graph-based LiDAR SLAM pipeline integrated with ROS2 Nav2 stack.",
      createdAt: "2026-07-12T10:00:00Z"
    },
    createdAt: "2026-07-10T14:00:00Z"
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const opp = MOCK_OPPORTUNITY_DETAILS[id] || {
    ...MOCK_OPPORTUNITY_DETAILS["opp-001"],
    id,
    title: `Opportunity ${id}`
  };

  return NextResponse.json(opp);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, isSaved } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    isSaved: isSaved !== undefined ? isSaved : true,
    message: action === "TOGGLE_SAVE"
      ? (isSaved ? "Added to watchlist" : "Removed from watchlist")
      : "Opportunity record updated."
  });
}
