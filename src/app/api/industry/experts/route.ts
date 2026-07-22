import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERTS = [
  {
    id: "exp-001",
    name: "Dr. Arunima Krishnan",
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    department: "Computer Science & Engineering",
    bio: "15 years of industry experience in machine learning, distributed computing, and energy grid optimization systems.",
    domains: ["AI/ML", "Grid Technology", "Distributed Systems"],
    skills: ["Python", "TensorFlow", "MATLAB", "Power Systems", "Reinforcement Learning"],
    yearsOfExp: 15,
    rating: 4.9,
    reviewsCount: 34,
    availability: "AVAILABLE",
    activeProjectsCount: 2,
    completedProjectsCount: 7,
    publications: 28,
    linkedinUrl: "https://linkedin.com/in/dr-arunima",
    googleScholar: "https://scholar.google.com/citations?user=arunk",
    createdAt: "2025-01-10T10:00:00Z"
  },
  {
    id: "exp-002",
    name: "Dr. Rohan Das",
    designation: "Senior Researcher – Autonomous Systems",
    institution: "IISC Bangalore",
    department: "Electrical Engineering",
    bio: "Expert in embedded control systems, rover navigation firmware and autonomous sensor fusion.",
    domains: ["Robotics & Control", "Embedded Systems", "IoT"],
    skills: ["C++", "ROS", "SLAM", "OpenCV", "Hardware Design"],
    yearsOfExp: 11,
    rating: 4.7,
    reviewsCount: 22,
    availability: "AVAILABLE",
    activeProjectsCount: 1,
    completedProjectsCount: 5,
    publications: 14,
    linkedinUrl: "https://linkedin.com/in/dr-rohan-das",
    googleScholar: "https://scholar.google.com/citations?user=rohands",
    createdAt: "2025-03-15T10:00:00Z"
  },
  {
    id: "exp-003",
    name: "Prof. Sunita Mehta",
    designation: "Professor – Power Electronics",
    institution: "NIT Trichy",
    department: "Electrical Engineering",
    bio: "Leading expert in solid-state power converters, inverter design and renewable energy integration.",
    domains: ["Power Electronics", "Renewable Energy", "VLSI"],
    skills: ["SIMULINK", "PCB Design", "FPGA", "Thermal Analysis", "LTspice"],
    yearsOfExp: 18,
    rating: 4.8,
    reviewsCount: 41,
    availability: "PARTIALLY_AVAILABLE",
    activeProjectsCount: 3,
    completedProjectsCount: 11,
    publications: 47,
    linkedinUrl: "https://linkedin.com/in/prof-sunita",
    googleScholar: null,
    createdAt: "2024-11-20T10:00:00Z"
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const domain = searchParams.get("domain") || "ALL";
  const availability = searchParams.get("availability") || "ALL";

  let filtered = MOCK_EXPERTS;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.institution.toLowerCase().includes(q) ||
      e.domains.some(d => d.toLowerCase().includes(q)) ||
      e.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (domain && domain !== "ALL") {
    filtered = filtered.filter(e => e.domains.some(d => d.includes(domain)));
  }

  if (availability && availability !== "ALL") {
    filtered = filtered.filter(e => e.availability === availability);
  }

  return NextResponse.json({
    experts: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expertId, projectId, message, engagementType } = body;

    return NextResponse.json({
      success: true,
      engagementType,
      expertId,
      projectId,
      message: "Collaboration invitation sent to the expert successfully.",
      invitationId: `inv-${Date.now()}`,
      createdAt: new Date().toISOString()
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send engagement invitation" }, { status: 500 });
  }
}
