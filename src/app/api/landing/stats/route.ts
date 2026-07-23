import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [industriesCount, expertsCount, projectsCount, problemStatementsCount, studentsCount] = await Promise.all([
      prisma.industryProfile.count(),
      prisma.expertProfile.count(),
      prisma.project.count(),
      prisma.problemStatement.count(),
      prisma.studentProfile.count(),
    ]);

    // Exact count directly from Supabase PostgreSQL tables without artificial minimum offsets
    const stats = {
      industries: industriesCount,
      experts: expertsCount,
      projects: projectsCount,
      problemStatements: problemStatementsCount,
      students: studentsCount,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      {
        industries: 0,
        experts: 0,
        projects: 0,
        problemStatements: 0,
        students: 0,
        updatedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
