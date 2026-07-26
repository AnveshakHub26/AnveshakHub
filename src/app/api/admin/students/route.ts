import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STAKEHOLDER" },
      take: 50,
      include: { studentProfile: true }
    });

    const formatted = students.map(s => ({
      id: s.id,
      name: s.fullName || s.name || s.email,
      email: s.email,
      usn: s.studentProfile?.usn || "N/A",
      institution: s.studentProfile?.institution || "Partner Institution",
      degree: s.studentProfile?.degree || "Undergraduate Degree",
      semester: 1,
      cgpa: 0.0,
      assignedProject: "None",
      assignedRole: "Student Researcher",
      overallScore: 5.0,
      attendanceRate: 100,
      completedTasksCount: 0,
      totalTasksCount: 0,
      status: "ACTIVE",
      recommendationIssued: false,
      createdAt: s.createdAt.toISOString()
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}
