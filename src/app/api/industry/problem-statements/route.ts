import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let organizationId: string | undefined = undefined;
    if (authUser) {
      const dbUser = await prisma.user.findFirst({
        where: { OR: [{ supabaseId: authUser.id }, { email: authUser.email }] },
        select: { organizationId: true }
      });
      organizationId = dbUser?.organizationId || undefined;
    }

    const whereClause: any = {};
    if (status !== "ALL") {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const problemStatements = await prisma.problemStatement.findMany({
      where: whereClause,
      include: {
        industry: { include: { organization: { select: { orgName: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = problemStatements.map(p => ({
      id: p.id,
      orgId: p.industryId,
      orgName: p.industry?.organization?.orgName || "Enterprise Partner",
      title: p.title,
      description: p.description,
      category: p.category || "General Technology",
      priority: p.priority || "MEDIUM",
      status: p.status,
      version: p.version || 1,
      linkedProjectsCount: 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("GET Problem Statements Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch problem statements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const body = await req.json();
    const { title, description, category, priority } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    let industry = await prisma.industryProfile.findFirst();
    if (!industry) {
      let org = await prisma.organization.findFirst();
      if (!org) {
        org = await prisma.organization.create({
          data: {
            orgName: "Anveshak Enterprise Partner",
            orgType: "PRIVATE_LIMITED",
            email: "industry@anveshakhub.com",
            phone: "+91 9876543210",
            industryDomain: "Technology",
            businessCategory: "COMMERCIAL",
            state: "Maharashtra",
            district: "Mumbai",
            city: "Mumbai",
            pin: "400001",
            addressLine: "Tech Park",
          }
        });
      }
      industry = await prisma.industryProfile.create({
        data: {
          orgId: org.id,
          lifecycle: "VERIFIED",
        }
      });
    }

    const newProblem = await prisma.problemStatement.create({
      data: {
        industryId: industry.id,
        title: title,
        description: description,
        category: category || "Technology & Software",
        priority: priority || "HIGH",
        status: "SUBMITTED",
      }
    });

    return NextResponse.json({
      success: true,
      message: "Problem statement submitted to verification queue",
      data: newProblem
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Problem Statement Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create problem statement" }, { status: 500 });
  }
}
