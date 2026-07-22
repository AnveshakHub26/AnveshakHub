import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// STU-003 STUDENT OPPORTUNITIES & APPLICATIONS API
// ─────────────────────────────────────────────────────────────────

const MOCK_STUDENT_OPPORTUNITIES = [
  {
    id: "opp-std-001",
    title: "Hardware Inverter Testbed Internship",
    industryName: "Solaris Power Pvt Ltd",
    domain: "Embedded Systems & Clean Energy",
    stipend: 25000.00,
    durationWeeks: 16,
    deadline: "2026-08-15T00:00:00Z",
    status: "OPEN",
    isRecommended: true,
    isSaved: true,
    hasApplied: true,
    applicationStatus: "SELECTED",
    description: "Hands-on internship for CS/EE undergrads to calibrate ADC sensors and debug ring topology firmware under expert guidance.",
    requirements: ["C++", "MATLAB", "SIMULINK", "Embedded Systems"],
    eligibilityScore: 96,
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "opp-std-002",
    title: "ROS2 SLAM Perception Intern",
    industryName: "Robotics Corp",
    domain: "Robotics & AI",
    stipend: 30000.00,
    durationWeeks: 12,
    deadline: "2026-09-01T00:00:00Z",
    status: "OPEN",
    isRecommended: true,
    isSaved: false,
    hasApplied: false,
    description: "Assist AI team in integrating ROS2 C++ Nav2 point cloud processing pipelines for rough-terrain rovers.",
    requirements: ["C++", "ROS2", "OpenCV"],
    eligibilityScore: 89,
    createdAt: "2026-07-10T10:00:00Z"
  },
  {
    id: "opp-std-003",
    title: "Bioreactor Sensor Data Analytics Trainee",
    industryName: "BioSynth Technologies",
    domain: "Biotech & AI",
    stipend: 20000.00,
    durationWeeks: 10,
    deadline: "2026-09-30T00:00:00Z",
    status: "OPEN",
    isRecommended: false,
    isSaved: false,
    hasApplied: false,
    description: "Develop Python computer vision scripts to monitor fermentation cell growth rates.",
    requirements: ["Python", "OpenCV"],
    eligibilityScore: 75,
    createdAt: "2026-07-15T10:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const tab = searchParams.get("tab") || "ALL";

  let filtered = MOCK_STUDENT_OPPORTUNITIES;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.title.toLowerCase().includes(q) ||
      o.industryName.toLowerCase().includes(q) ||
      o.domain.toLowerCase().includes(q)
    );
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
    const { opportunityId, coverLetter, resumeUrl } = body;

    return NextResponse.json({
      success: true,
      applicationId: `app-std-${Date.now()}`,
      opportunityId,
      status: "APPLIED",
      message: "Internship application submitted successfully."
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
