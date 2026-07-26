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

    const projects = await prisma.project.findMany({
      take: 1,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, lifecycle: true }
    });

    const activeProject = projects[0] ? {
      id: projects[0].id,
      name: projects[0].name,
      industryPartner: "Corporate Partner",
      role: "Student Researcher",
      leadExpert: "Assigned Advisor",
      progress: 50,
      sprintMilestone: "Active Phase"
    } : null;

    const data = {
      success: true,
      status: "success",
      student: {
        id: userRecord?.id || "std-user",
        name: userRecord?.fullName || userRecord?.name || "Student Researcher",
        usn: userRecord?.studentProfile?.usn || "N/A",
        institution: userRecord?.studentProfile?.university || "Partner University",
        degree: userRecord?.studentProfile?.department || "Undergraduate Degree",
        semester: 6,
        cgpa: 9.0,
        verificationStatus: "VERIFIED"
      },
      kpis: {
        activeProjectsCount: activeProject ? 1 : 0,
        completedTasksCount: 0,
        totalTasksCount: 0,
        mentorshipScore: 5.0,
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
    console.error("GET Student Dashboard Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load student dashboard" }, { status: 500 });
  }
}
