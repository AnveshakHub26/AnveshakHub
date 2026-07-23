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
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const opportunities = await prisma.marketplaceOpportunity.findMany({
      where: whereClause,
      include: {
        industry: { include: { organization: { select: { orgName: true } } } },
        studentApplications: true,
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      industryName: o.industry?.organization?.orgName || "Enterprise Partner",
      domain: o.domain || "Technology",
      stipend: 25000.00,
      durationWeeks: 12,
      deadline: o.updatedAt,
      status: o.status,
      isRecommended: true,
      isSaved: false,
      hasApplied: o.studentApplications.length > 0,
      applicationStatus: o.studentApplications[0]?.status || "OPEN",
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
    console.error("GET Student Opportunities Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch student opportunities" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, coverLetter, resumeUrl } = body;

    if (!opportunityId) {
      return NextResponse.json({ error: "opportunityId is required" }, { status: 400 });
    }

    let student = await prisma.studentProfile.findFirst();
    if (!student) {
      const user = await prisma.user.findFirst() || await prisma.user.create({
        data: {
          email: `student.${Date.now()}@anveshakhub.com`,
          fullName: "Rishika Roy",
          name: "Rishika Roy",
          role: "STAKEHOLDER",
        }
      });
      student = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          institution: "IIT Bombay",
          degree: "B.Tech",
          branch: "Computer Science",
          semester: 6,
          cgpa: 8.8,
        }
      });
    }

    const application = await prisma.studentApplication.create({
      data: {
        opportunityId: opportunityId,
        studentId: student.id,
        coverLetter: coverLetter || "Excited to apply for this research internship opportunity.",
        resumeUrl: resumeUrl || null,
        status: "APPLIED",
      }
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Student Application Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit application" }, { status: 500 });
  }
}
