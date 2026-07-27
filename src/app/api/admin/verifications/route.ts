import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const verifications = await prisma.verificationRequest.findMany({
      include: {
        organization: true
      },
      orderBy: { submittedAt: "desc" }
    });

    return NextResponse.json({
      verifications: verifications || [],
      total: verifications?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({ verifications: [], total: 0 });
  }
}
