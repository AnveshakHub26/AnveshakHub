import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// EXP-003 EXPERT OPPORTUNITIES & ENGAGEMENTS API
// ─────────────────────────────────────────────────────────────────

const MOCK_OPPORTUNITIES = [
  {
    id: "opp-001",
    title: "AI-Driven Solar Micro-Grid Frequency Balancing & Load Forecasting",
    industryName: "Solaris Power Pvt Ltd",
    domain: "Clean Energy & AI",
    budget: 7500000.00,
    durationWeeks: 24,
    deadline: "2026-08-30T00:00:00Z",
    status: "OPEN",
    isRecommended: true,
    isSaved: true,
    hasApplied: false,
    description: "Looking for senior AI/ML expert to design reinforcement learning models for 100kW solar micro-grid load prediction and grid frequency stabilization.",
    requirements: ["Ph.D. or 10+ yrs in Power Systems / AI", "TensorFlow / PyTorch", "MATLAB SIMULINK"],
    eligibilityScore: 94,
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "opp-002",
    title: "Autonomous Rover SLAM Navigation Firmware for Rough Terrain",
    industryName: "Robotics Corp",
    domain: "Robotics & Embedded Systems",
    budget: 4500000.00,
    durationWeeks: 16,
    deadline: "2026-09-15T00:00:00Z",
    status: "OPEN",
    isRecommended: true,
    isSaved: false,
    hasApplied: true,
    applicationStatus: "SHORTLISTED",
    description: "Design ROS2-based SLAM obstacle avoidance algorithm for off-road planetary terrain exploration rovers.",
    requirements: ["C++", "ROS2", "OpenCV", "LiDAR Sensor Fusion"],
    eligibilityScore: 88,
    createdAt: "2026-07-10T14:00:00Z"
  },
  {
    id: "opp-003",
    title: "Real-Time Bioreactor Cell Growth AI Analytics System",
    industryName: "BioSynth Technologies",
    domain: "Biotech & AI",
    budget: 3000000.00,
    durationWeeks: 12,
    deadline: "2026-10-01T00:00:00Z",
    status: "OPEN",
    isRecommended: false,
    isSaved: false,
    hasApplied: false,
    description: "Develop computer vision pipeline to estimate cell density and metabolic rates in bioreactor fermentation tanks.",
    requirements: ["Computer Vision", "Python", "Bio-Process Engineering"],
    eligibilityScore: 78,
    createdAt: "2026-07-15T16:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const domain = searchParams.get("domain") || "ALL";
  const tab = searchParams.get("tab") || "ALL";

  let filtered = MOCK_OPPORTUNITIES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.industryName.toLowerCase().includes(q) ||
      o.domain.toLowerCase().includes(q)
    );
  }

  if (domain && domain !== "ALL") {
    filtered = filtered.filter(o => o.domain.includes(domain));
  }

  if (tab === "RECOMMENDED") {
    filtered = filtered.filter(o => o.isRecommended);
  } else if (tab === "SAVED") {
    filtered = filtered.filter(o => o.isSaved);
  } else if (tab === "APPLIED") {
    filtered = filtered.filter(o => o.hasApplied);
  }

  return NextResponse.json({
    opportunities: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, proposedBudget, durationWeeks, proposal, milestonesBreakdown } = body;

    return NextResponse.json({
      success: true,
      applicationId: `app-${Date.now()}`,
      opportunityId,
      proposedBudget: parseFloat(proposedBudget) || 5000000.00,
      durationWeeks: parseInt(durationWeeks) || 16,
      status: "APPLIED",
      message: "Expression of Interest (EOI) proposal submitted to industry partner successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit proposal" }, { status: 500 });
  }
}
