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
        include: { studentProfile: true }
      });
    }

    if (!userRecord) {
      userRecord = await prisma.user.findFirst({
        where: { role: "STAKEHOLDER" },
        include: { studentProfile: true }
      });
    }

    const projects = userId ? await prisma.project.findMany({
      take: 1,
      orderBy: { updatedAt: "desc" }
    }) : [];

    const activeProject = projects[0] ? {
      id: projects[0].id,
      name: projects[0].name,
      industryPartner: "Corporate Partner",
      role: "Student Researcher",
      leadExpert: "Assigned Advisor",
      progress: 0,
      sprintMilestone: "Milestone Phase 1"
    } : null;

    const data = {
      success: true,
      status: "success",
      student: {
        id: userRecord?.id || "std-user",
        name: userRecord?.fullName || userRecord?.name || "Student Researcher",
        usn: userRecord?.studentProfile?.usn || "N/A",
        institution: userRecord?.studentProfile?.institution || "Partner Institution",
        degree: userRecord?.studentProfile?.degree || "Undergraduate Degree",
        semester: userRecord?.studentProfile?.semester || 1,
        cgpa: userRecord?.studentProfile?.cgpa || 0.0,
        verificationStatus: "VERIFIED"
      },
      kpis: {
        activeProjectsCount: activeProject ? 1 : 0,
        completedTasksCount: 0,
        totalTasksCount: 0,
        mentorshipScore: 0,
        attendanceRate: 100,
        learningGoalsCompleted: 0,
        totalLearningGoals: 0
      },
      assignedProject: activeProject,
      assignedTasks: [],
      leadMentor: null,
      upcomingCalls: []
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Student Dashboard GET Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
