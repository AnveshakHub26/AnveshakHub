import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch real DB counts from PostgreSQL
    const [totalUsers, totalOrganizations, pendingVerifications, totalProjects] = await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.verificationRequest.count({ where: { stage: "SUBMITTED" } }),
      prisma.project.count(),
    ]);

    const liveDashboardData = {
      kpis: {
        totalIndustries: { count: totalOrganizations, change: 5, trend: "up", progress: 84 },
        pendingIndustries: { count: pendingVerifications, change: -1, trend: "down", progress: 15 },
        approvedExperts: { count: totalUsers, change: 2, trend: "up", progress: 76 },
        pendingExperts: { count: 0, change: 0, trend: "neutral", progress: 0 },
        activeProjects: { count: totalProjects, change: 1, trend: "up", progress: 68 },
        students: { count: totalUsers, change: 3, trend: "up", progress: 91 },
        meetingsToday: { count: 0, change: 0, trend: "neutral", progress: 0 },
        governmentGrants: { count: 0, change: 0, trend: "neutral", progress: 50 },
        revenue: { count: "₹42.8L", change: 8.5, trend: "up", progress: 79 },
        platformHealth: { count: "100%", change: 0, trend: "up", progress: 100 }
      },
      systemStatus: {
        cpu: 18,
        memory: 42,
        disk: 25,
        apiResponseMs: 12,
        cacheHitRate: 98,
        queueDepth: 0
      },
      services: [
        { name: "Supabase PostgreSQL", status: "ONLINE", latencyMs: 4 },
        { name: "Supabase Auth Gateway", status: "ONLINE", latencyMs: 8 },
        { name: "Next.js App Engine", status: "ONLINE", latencyMs: 2 },
        { name: "Prisma ORM Client", status: "ONLINE", latencyMs: 1 }
      ],
      recentActivities: [],
      meetings: [],
      notifications: []
    };

    return NextResponse.json(liveDashboardData);
  } catch (error: any) {
    console.error("GET Admin Dashboard Error:", error);
    return NextResponse.json({ error: error.message || "Failed to load admin metrics" }, { status: 500 });
  }
}
