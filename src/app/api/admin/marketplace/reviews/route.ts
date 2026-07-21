import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────
// API Integration Point: Replace mock data with Prisma queries
// import { prisma } from "@/lib/prisma";
// ─────────────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  {
    id: "rev-001",
    expertId: "exp-001",
    rating: 5,
    comment: "Exceptional consulting on machine learning serial routing. The telemetry logs dropped from 12% to below 1.5% with the custom filters.",
    reviewerName: "Amit Kumar (Solaris Lead)",
    createdAt: "2026-07-20T10:00:00Z"
  },
  {
    id: "rev-002",
    expertId: "exp-001",
    rating: 4,
    comment: "Very solid technical expertise on deep learning. Communication and documentation versioning were structured and reliable.",
    reviewerName: "Nisha Sen (BioGen Diagnostics)",
    createdAt: "2026-07-18T11:00:00Z"
  }
];

const MOCK_RECOMMENDATIONS = [
  {
    expertId: "exp-001",
    name: "Dr. Arunima Krishnan",
    matchScore: 98,
    reason: "Match based on prior 'AI & Smart Grids' projects with Solaris Power and 16 years research tenure.",
    skills: ["AI/ML Research", "Deep Learning", "Signal Processing"]
  },
  {
    expertId: "exp-004",
    name: "Rohan Das",
    matchScore: 92,
    reason: "Match based on Aerospace RF experience and systems configuration background.",
    skills: ["Space Technology", "RF Telemetry", "Inertial Guidance"]
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const expertId = searchParams.get("expertId") || "";

  // API Integration Point:
  // const reviews = await prisma.marketplaceReview.findMany({ where: { expertId } });

  const filteredReviews = expertId 
    ? MOCK_REVIEWS.filter(r => r.expertId === expertId)
    : MOCK_REVIEWS;

  return NextResponse.json({
    reviews: filteredReviews,
    recommendations: MOCK_RECOMMENDATIONS,
    stats: {
      averageRating: parseFloat((MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1)),
      totalReviews: MOCK_REVIEWS.length
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // API Integration Point:
    // const newReview = await prisma.marketplaceReview.create({ data: body });

    return NextResponse.json({
      success: true,
      id: `rev-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to post review" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { action, expertId, opportunityId, status } = body;
  
  // API Integration Point: Invitation Accept/Reject
  // if (action === "INVITE_EXPERT") {
  //   await prisma.marketplaceInvitation.create({ data: { expertId, opportunityId, status: "PENDING" } });
  // }
  
  return NextResponse.json({
    success: true,
    action,
    message: `Invitation successfully processed with status: ${status || "PENDING"}`,
    timestamp: new Date().toISOString()
  });
}
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  return NextResponse.json({
    success: true,
    message: `Review or opportunity ${id} successfully removed/archived.`
  });
}
