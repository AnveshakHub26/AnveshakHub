import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const student = await prisma.user.findUnique({
      where: { id },
      include: { studentProfile: true }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: student.id,
      name: student.fullName || student.name || student.email,
      email: student.email,
      usn: student.studentProfile?.usn || "N/A",
      institution: student.studentProfile?.institution || "Partner Institution",
      degree: student.studentProfile?.degree || "Undergraduate Degree",
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
      createdAt: student.createdAt.toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Student not found" }, { status: 404 });
  }
}
