import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const lifecycle = searchParams.get("lifecycle") || "";

    const whereClause: any = {};
    if (lifecycle && lifecycle !== "ALL") {
      whereClause.lifecycle = lifecycle;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        milestones: true,
        meetings: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      lifecycle: p.lifecycle,
      budget: Number(p.budget),
      budgetUsed: Number(p.budget) * 0.4,
      startDate: p.startDate,
      endDate: p.endDate,
      progress: 50,
      tasksCount: p.milestones.length,
      tasksCompleted: p.milestones.filter(m => m.status === "COMPLETED").length,
      risksCount: 0,
      issuesCount: 0,
      changeRequestsCount: 0,
      experts: [],
      students: []
    }));

    return NextResponse.json({
      success: true,
      data: formatted
    });
  } catch (error: any) {
    console.error("GET Projects API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, budget, startDate, endDate, problemStatementId } = body;

    if (!name || !budget) {
      return NextResponse.json({ error: "Project name and budget are required" }, { status: 400 });
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

    const project = await prisma.project.create({
      data: {
        industryId: industry.id,
        name: name,
        description: description || "",
        budget: budget,
        lifecycle: "INITIATED",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      }
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully in database",
      data: project
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST Project API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}
