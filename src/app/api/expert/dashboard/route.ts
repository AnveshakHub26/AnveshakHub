import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("anveshakhub-auth")?.value;
    let userId: string | undefined = undefined;

    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie);
        userId = parsed.userId;
      } catch {}
    }

    let userRecord: any = null;
    if (userId) {
      userRecord = await prisma.user.findUnique({
        where: { id: userId },
        include: { expertProfile: true }
      });
    }

    if (!userRecord) {
      userRecord = await prisma.user.findFirst({
        where: { role: "STAKEHOLDER" },
        include: { expertProfile: true }
      });
    }

    const projects = await prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, lifecycle: true, budget: true }
    });

    const activeEngagementsCount = projects.filter(p => p.lifecycle === "IN_PROGRESS").length;

    const data = {
      success: true,
      status: "success",
      expert: {
        id: userRecord?.id || "exp-user",
        name: userRecord?.fullName || userRecord?.name || "Verified Expert Researcher",
        designation: userRecord?.expertProfile?.designation || "Subject Matter Expert",
        institution: userRecord?.expertProfile?.institution || "Partner University",
        department: userRecord?.expertProfile?.department || "R&D Department",
        availabilityStatus: "AVAILABLE",
        rating: 5.0,
        reviewsCount: 0,
        verificationStatus: "VERIFIED"
      },
      kpis: {
        activeEngagementsCount: activeEngagementsCount,
        completedEngagementsCount: projects.filter(p => p.lifecycle === "COMPLETED").length,
        studentsMentoredCount: 0,
        totalConsultationHours: 0,
        hIndex: 0,
        citationsCount: 0,
        totalPublications: 0
      },
      activeProjects: projects.map(p => ({
        id: p.id,
        name: p.name,
        industryPartner: "Corporate Partner",
        status: p.lifecycle,
        role: "Research Advisor",
        sprintMilestone: "Active Phase",
        progress: 50,
        nextDeliverable: "Milestone Deliverable Audit",
        dueDate: new Date().toISOString()
      })),
      studentMentees: [],
      upcomingCalls: []
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Expert Dashboard Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load expert dashboard" }, { status: 500 });
  }
}
