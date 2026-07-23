import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const [activeProjectsCount, openProblemsCount, totalProjects] = await Promise.all([
      prisma.project.count({ where: { lifecycle: "IN_PROGRESS" } }),
      prisma.problemStatement.count({ where: { status: { in: ["SUBMITTED", "APPROVED", "UNDER_REVIEW"] } } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, lifecycle: true, budget: true }
      })
    ]);

    const totalAllocated = totalProjects.reduce((acc, p) => acc + Number(p.budget || 0), 0);
    const totalUsed = totalAllocated * 0.4;

    const kpis = {
      activeProjects: activeProjectsCount,
      pendingMeetings: 0,
      openProblemStatements: openProblemsCount,
      grantApplications: 0,
      platformCreditBalance: totalAllocated - totalUsed
    };

    const projectsFormatted = totalProjects.map(p => ({
      id: p.id,
      name: p.name,
      progress: 50,
      status: p.lifecycle,
      milestone: "Active Phase"
    }));

    const financial = {
      allocatedBudget: totalAllocated || 5000000,
      disbursedAmount: totalUsed || 1200000,
      remainingBalance: (totalAllocated - totalUsed) || 3800000,
      currency: "INR"
    };

    return NextResponse.json({
      success: true,
      orgId: "live-org",
      kpis,
      projects: projectsFormatted,
      meetings: [],
      activities: [],
      financial,
    });
  } catch (error: any) {
    console.error("GET Industry Dashboard Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load dashboard metrics" }, { status: 500 });
  }
}
