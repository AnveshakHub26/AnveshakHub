import { NextRequest, NextResponse } from "next/server";

const EXPERT_PROFILES: Record<string, any> = {
  "exp-001": {
    id: "exp-001",
    name: "Dr. Arunima Krishnan",
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    department: "Computer Science & Engineering",
    bio: "15 years of industry experience in machine learning, distributed computing, and energy grid optimization systems. Has led 7 successful industry-academia projects worth ₹12Cr in total.",
    domains: ["AI/ML", "Grid Technology", "Distributed Systems"],
    skills: ["Python", "TensorFlow", "MATLAB", "Power Systems", "Reinforcement Learning"],
    yearsOfExp: 15,
    rating: 4.9,
    reviewsCount: 34,
    availability: "AVAILABLE",
    activeProjectsCount: 2,
    completedProjectsCount: 7,
    publications: 28,
    citations: 892,
    hIndex: 14,
    linkedinUrl: "https://linkedin.com/in/dr-arunima",
    googleScholar: "https://scholar.google.com/citations?user=arunk",
    orcid: "0000-0001-2345-6789",
    certifications: [
      { title: "Google Cloud Professional ML Engineer", issuer: "Google", year: 2024 },
      { title: "IEEE Senior Member", issuer: "IEEE", year: 2022 }
    ],
    publications_list: [
      { title: "Decentralized Load Balancing in Smart Micro-Grids Using Reinforcement Learning", journal: "IEEE Transactions on Smart Grid", year: 2024 },
      { title: "Federated Learning for Energy Demand Prediction in Distributed Sensor Networks", journal: "Nature Energy", year: 2023 },
      { title: "Multi-Agent RL for Power Sharing in Off-Grid Solar Arrays", journal: "Applied Energy", year: 2022 }
    ],
    assignedProjects: [
      { id: "prj-001", name: "Solar Micro-Grid for IIT Madras", status: "IN_PROGRESS" }
    ],
    reviews: [
      { id: "rv-001", reviewer: "Rajesh Sharma", rating: 5, comment: "Exceptional domain knowledge and very responsive to project updates.", createdAt: "2026-06-10T10:00:00Z" },
      { id: "rv-002", reviewer: "Nisha Patel", rating: 5, comment: "Dr. Arunima's guidance on the RL algorithm significantly improved performance.", createdAt: "2026-05-20T11:00:00Z" }
    ],
    discussions: [
      { id: "disc-001", authorName: "Rajesh Sharma", content: "Dr. Arunima, can we schedule a session to review Sprint 2 results?", messageType: "QUESTION", createdAt: "2026-07-20T10:00:00Z" },
      { id: "disc-002", authorName: "Dr. Arunima Krishnan", content: "Yes, I am available Monday 10AM IST. Let's also discuss the calibration issue on node 3.", messageType: "GENERAL", createdAt: "2026-07-20T11:30:00Z" }
    ]
  },
  "exp-002": {
    id: "exp-002",
    name: "Dr. Rohan Das",
    designation: "Senior Researcher – Autonomous Systems",
    institution: "IISC Bangalore",
    department: "Electrical Engineering",
    bio: "Expert in embedded control systems, rover navigation firmware and autonomous sensor fusion for real-world terrain applications.",
    domains: ["Robotics & Control", "Embedded Systems", "IoT"],
    skills: ["C++", "ROS", "SLAM", "OpenCV", "Hardware Design"],
    yearsOfExp: 11,
    rating: 4.7,
    reviewsCount: 22,
    availability: "AVAILABLE",
    activeProjectsCount: 1,
    completedProjectsCount: 5,
    publications: 14,
    citations: 340,
    hIndex: 9,
    linkedinUrl: "https://linkedin.com/in/dr-rohan-das",
    googleScholar: "https://scholar.google.com/citations?user=rohands",
    orcid: "0000-0002-3456-7890",
    certifications: [
      { title: "ROS Certified Developer", issuer: "Open Robotics", year: 2023 }
    ],
    publications_list: [
      { title: "SLAM-based Navigation for Rescue Rovers in GPS-Denied Environments", journal: "Journal of Field Robotics", year: 2024 }
    ],
    assignedProjects: [
      { id: "prj-004", name: "Autonomous Rover Control Module", status: "UNDER_REVIEW" }
    ],
    reviews: [
      { id: "rv-003", reviewer: "Kabir Verma", rating: 5, comment: "Very thorough technical mentorship on the SLAM pipeline.", createdAt: "2026-07-01T10:00:00Z" }
    ],
    discussions: []
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = EXPERT_PROFILES[id] || { ...EXPERT_PROFILES["exp-001"], id, name: `Expert ${id}`, discussions: [] };
  return NextResponse.json(profile);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, content, authorName, messageType, rating, comment } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    message: "Expert collaboration action processed.",
    timestamp: new Date().toISOString(),
    discussion: content ? {
      id: `disc-${Date.now()}`,
      authorName: authorName || "Rajesh Sharma",
      content,
      messageType: messageType || "GENERAL",
      createdAt: new Date().toISOString()
    } : undefined,
    review: rating ? {
      id: `rv-${Date.now()}`,
      reviewer: authorName || "Rajesh Sharma",
      rating,
      comment: comment || "",
      createdAt: new Date().toISOString()
    } : undefined
  });
}
