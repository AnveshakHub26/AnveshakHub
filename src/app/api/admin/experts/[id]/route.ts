import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_EXPERT_PROFILES: Record<string, any> = {
  "exp-001": {
    id: "exp-001",
    userId: "usr-exp-001",
    user: {
      name: "Dr. Arunima Krishnan",
      email: "dr.arunima@aiml.in",
      avatarUrl: null
    },
    designation: "Professor & Head of AI Research",
    institution: "IIT Madras",
    department: "Computer Science & Engineering",
    yearsOfExp: 16,
    bio: "Dr. Arunima Krishnan is a leading researcher in Deep Learning and Natural Language Processing. Over the past 15 years, she has guided multiple industrial research projects and has over 50 publications in high-impact journals.",
    rating: 4.9,
    availability: "AVAILABLE",
    linkedinUrl: "linkedin.com/in/arunima-krishnan-ai",
    googleScholar: "scholar.google.com/citations?user=arunima",
    orcid: "orcid.org/0000-0002-1823-7462",
    skills: ["Deep Learning", "NLP", "Reinforcement Learning", "PyTorch", "Transformers", "Python", "TensorFlow"],
    domains: ["AI/ML Research", "Healthcare Diagnostics", "Autonomous Systems"],
    certifications: [
      { name: "NVIDIA DLI Certified Instructor", issuer: "NVIDIA", year: 2022 },
      { name: "Google Cloud Professional ML Engineer", issuer: "Google", year: 2023 }
    ],
    employmentHistory: [
      { role: "Associate Professor", org: "IISc Bangalore", period: "2015 - 2020" },
      { role: "Research Scientist", org: "Microsoft Research", period: "2011 - 2015" }
    ],
    status: "ACTIVE",
    projects: [
      { id: "proj-001", name: "Solar Micro-Grid for IIT Madras", status: "ACTIVE", budget: "₹45L", timeline: "Jan 2026 – Dec 2026", progress: 62 },
      { id: "proj-002", name: "Community Solar Initiative – Rural TN", status: "ACTIVE", budget: "₹22L", timeline: "Mar 2026 – Sep 2026", progress: 38 },
      { id: "proj-005", name: "Medical Imaging Diagnostic Accelerator", status: "ACTIVE", budget: "₹65L", timeline: "Feb 2026 – Nov 2026", progress: 50 }
    ],
    students: [
      { id: "std-001", name: "Arpit Goel", degree: "M.Tech", branch: "CSE", cgpa: 9.4, status: "ACTIVE" },
      { id: "std-002", name: "Rishika Roy", degree: "B.Tech", branch: "ECE", cgpa: 8.9, status: "ACTIVE" },
      { id: "std-003", name: "Siddharth Sen", degree: "Ph.D.", branch: "Computational Biology", cgpa: 9.6, status: "ACTIVE" }
    ],
    documents: [
      { id: "exp-doc-001", name: "IIT Madras NOC Certificate", docType: "NOC", fileUrl: "/mock/noc.pdf", status: "APPROVED", reviewerComment: "Verified directly from university portal.", createdAt: "2026-05-11T12:00:00Z" },
      { id: "exp-doc-002", name: "Non-Disclosure Agreement (NDA)", docType: "NDA", fileUrl: "/mock/nda.pdf", status: "APPROVED", reviewerComment: "Signed version matches guidelines.", createdAt: "2026-05-12T14:30:00Z" },
      { id: "exp-doc-003", name: "Framework Collaboration MoU", docType: "MOU", fileUrl: "/mock/mou.pdf", status: "PENDING", reviewerComment: null, createdAt: "2026-07-15T09:00:00Z" }
    ],
    resourceRequests: [
      { id: "rr-001", title: "NVIDIA H100 GPU Instance Access", description: "Required for LLM fine-tuning on medical records.", quantity: 1, status: "APPROVED", createdAt: "2026-06-18T10:00:00Z" },
      { id: "rr-002", title: "Matlab Signal Toolbox License", description: "Required for processing sensor arrays.", quantity: 2, status: "PENDING", createdAt: "2026-07-16T15:30:00Z" }
    ],
    meetings: [
      { id: "mtg-exp-001", title: "Medical Accelerator Review Meeting", platform: "GOOGLE_MEET", startTime: "2026-07-25T11:00:00Z", endTime: "2026-07-25T12:00:00Z", participants: ["Dr. Arunima K.", "Priya Nair", "BioGen Lead"], videoLink: "https://meet.google.com/abc-xyz-123", agenda: "Discuss progress on convolutional layers matching speed metrics.", outcomes: null, status: "UPCOMING" }
    ],
    timeline: [
      { id: "tl-exp-001", event: "Expert Profile Verified & Activated", category: "VERIFICATION", performedBy: "Priya Nair", createdAt: "2026-05-12T10:00:00Z" },
      { id: "tl-exp-002", event: "Assigned Project: Medical Imaging Accelerator", category: "PROJECT", performedBy: "System", createdAt: "2026-06-01T09:00:00Z" },
      { id: "tl-exp-003", event: "NOC Document Uploaded", category: "DOCUMENT", performedBy: "Dr. Arunima K.", createdAt: "2026-07-15T09:00:00Z" }
    ],
    analytics: {
      months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      scoreTrend: [85, 87, 88, 92, 95, 98],
      responseTime: [12, 10, 8, 6, 5, 4],
      meetingHours: [4, 6, 8, 12, 14, 18],
      deliverablesCompleted: [2, 3, 5, 8, 11, 14]
    }
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // API Integration Point:
  // const expert = await prisma.expertProfile.findUnique({
  //   where: { id },
  //   include: { user: true, documents: true, resourceRequests: true, projects: true, students: true, timeline: true }
  // });

  const detail = MOCK_EXPERT_PROFILES[id] || MOCK_EXPERT_PROFILES["exp-001"];
  
  if (detail && detail.id !== id) {
    // Return custom mock structure mapped to requested ID if different
    return NextResponse.json({ ...detail, id, orgName: `Expert ${id}` });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, status, availability, notes, documentId, docStatus, reviewerComment, requestId, requestStatus } = body;

  // API Integration Point:
  // if (action === "UPDATE_STATUS") {
  //   await prisma.expertProfile.update({ where: { id }, data: { status } });
  //   await prisma.expertTimeline.create({ data: { expertId: id, event: `Status updated: ${status}`, performedBy: "Admin" } });
  // } else if (action === "UPDATE_DOCUMENT") {
  //   await prisma.expertDocument.update({ where: { id: documentId }, data: { status: docStatus, reviewerComment } });
  // } else if (action === "UPDATE_RESOURCE") {
  //   await prisma.resourceRequest.update({ where: { id: requestId }, data: { status: requestStatus } });
  // }

  return NextResponse.json({
    success: true,
    id,
    action,
    status,
    availability,
    message: "Expert profile updated successfully",
    timestamp: new Date().toISOString()
  });
}
