import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: project.id,
      name: project.name,
      lifecycle: project.lifecycle,
      budget: project.budget,
      createdAt: project.createdAt.toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Project not found" }, { status: 404 });
  }
}
