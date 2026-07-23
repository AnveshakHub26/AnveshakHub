import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const domain = searchParams.get("domain") || "ALL";

    const whereClause: any = {};
    if (domain !== "ALL") whereClause.domain = domain;
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const opportunities = await prisma.marketplaceOpportunity.findMany({
      where: whereClause,
      include: {
        industry: { include: { organization: { select: { orgName: true } } } },
        applications: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      industryName: o.industry?.organization?.orgName || "Enterprise Partner",
      domain: o.domain || "Technology",
      budget: Number(o.budget),
      durationWeeks: 16,
      deadline: o.updatedAt,
      status: o.status,
      isRecommended: true,
      isSaved: false,
      hasApplied: o.applications.length > 0,
      description: o.description,
      requirements: o.requirements,
      eligibilityScore: 92,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("GET Expert Opportunities Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, proposal, proposedBudget, durationWeeks } = body;

    if (!opportunityId || !proposal) {
      return NextResponse.json({ error: "opportunityId and proposal are required" }, { status: 400 });
    }

    let expert = await prisma.expertProfile.findFirst();
    if (!expert) {
      const user = await prisma.user.findFirst() || await prisma.user.create({
        data: {
          email: `expert.${Date.now()}@anveshakhub.com`,
          fullName: "Dr. Arisudan Krishnan",
          name: "Dr. Arisudan Krishnan",
          role: "STAKEHOLDER",
        }
      });
      expert = await prisma.expertProfile.create({
        data: {
          userId: user.id,
          designation: "Senior AI Specialist",
          institution: "IIT Madras",
          yearsOfExp: 12,
        }
      });
    }

    const application = await prisma.marketplaceApplication.create({
      data: {
        opportunityId: opportunityId,
        expertId: expert.id,
        proposal: proposal,
        proposedBudget: proposedBudget || 500000,
        durationWeeks: durationWeeks || 12,
        status: "APPLIED",
      }
    });

    return NextResponse.json({
      success: true,
      message: "Proposal submitted successfully",
      data: application,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Expert Application Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit proposal" }, { status: 500 });
  }
}
