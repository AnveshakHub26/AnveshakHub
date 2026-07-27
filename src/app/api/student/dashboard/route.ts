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

    if (!userId) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true }
    });

    if (!userRecord) {
      return NextResponse.json(
        { success: false, authenticated: false, message: "User account not found" },
        { status: 404 }
      );
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

    const studentProfile = userRecord.studentProfile;
    const isProfileComplete = !!(studentProfile?.institution && studentProfile?.degree && studentProfile?.usn);

    const data = {
      success: true,
      status: "success",
      student: {
        id: userRecord.id,
        name: userRecord.name || userRecord.fullName || userRecord.email.split("@")[0],
        email: userRecord.email,
        usn: studentProfile?.usn || null,
        institution: studentProfile?.institution || null,
        degree: studentProfile?.degree || null,
        branch: studentProfile?.branch || null,
        semester: studentProfile?.semester || null,
        cgpa: studentProfile?.cgpa || null,
        verificationStatus: studentProfile?.verificationStatus || "PENDING",
        isProfileComplete
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
