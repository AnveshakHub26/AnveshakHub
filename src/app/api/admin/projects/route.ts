import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      take: 50,
      orderBy: { updatedAt: "desc" }
    });

    const formatted = projects.map(p => ({
      id: p.id,
      name: p.name,
      lifecycle: p.lifecycle,
      budget: p.budget,
      createdAt: p.createdAt.toISOString()
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}
