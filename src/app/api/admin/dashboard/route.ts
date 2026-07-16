import { NextResponse } from "next/server";

// Mock database values to guarantee backend-readiness and full functionality in dev mode
const mockDashboardData = {
  kpis: {
    totalIndustries: { count: 1240, change: 12, trend: "up", progress: 84 },
    pendingIndustries: { count: 18, change: -4, trend: "down", progress: 15 },
    approvedExperts: { count: 320, change: 8, trend: "up", progress: 76 },
    pendingExperts: { count: 24, change: 2, trend: "up", progress: 20 },
    activeProjects: { count: 86, change: 5, trend: "up", progress: 68 },
    students: { count: 4230, change: 112, trend: "up", progress: 91 },
    meetingsToday: { count: 14, change: 3, trend: "up", progress: 70 },
    governmentGrants: { count: 8, change: 0, trend: "neutral", progress: 50 },
    revenue: { count: "₹42.8L", change: 8.5, trend: "up", progress: 79 },
    platformHealth: { count: "99.98%", change: 0.02, trend: "up", progress: 99 }
  },
  systemStatus: {
    cpu: 34,
    memory: 58,
    disk: 42,
    apiResponseMs: 42,
    cacheHitRate: 94,
    queueDepth: 4
  },
  services: [
    { name: "Database Cluster", status: "ONLINE", latencyMs: 2 },
    { name: "REST API Gateway", status: "ONLINE", latencyMs: 14 },
    { name: "MinIO Storage Hub", status: "ONLINE", latencyMs: 18 },
    { name: "RabbitMQ Message Broker", status: "ONLINE", latencyMs: 4 },
    { name: "OpenSearch Node", status: "ONLINE", latencyMs: 24 },
    { name: "SMTP Email Server", status: "ONLINE", latencyMs: 98 }
  ],
  recentActivities: [
    { id: "act-1", event: "New Registration", description: "Vayu Aerospace registered as Space-Tech Industry.", timestamp: "10 mins ago", category: "REGISTRATION" },
    { id: "act-2", event: "Expert Profile Verified", description: "Dr. Arisudan (AI/ML) approved by compliance team.", timestamp: "32 mins ago", category: "EXPERT" },
    { id: "act-3", event: "Industry Approved", description: "Solaris Power Pvt Ltd marked as certified partner.", timestamp: "1 hour ago", category: "INDUSTRY" },
    { id: "act-4", event: "Meeting Scheduled", description: "Kickoff Call: AI Robotics research initiative.", timestamp: "3 hours ago", category: "MEETING" },
    { id: "act-5", event: "Project Created", description: "Hypersonic Nozzle Simulation with IIT Madras.", timestamp: "5 hours ago", category: "PROJECT" }
  ],
  meetings: [
    { id: "meet-1", title: "Solaris Power Kickoff Call", time: "10:30 AM", participants: ["A. Mehta", "Dr. Sharma"], link: "https://meet.anveshakhub.com/solaris-kickoff" },
    { id: "meet-2", title: "IIT Madras Alignment Meeting", time: "02:00 PM", participants: ["P. Rao", "V. Nair"], link: "https://meet.anveshakhub.com/iitm-alignment" },
    { id: "meet-3", title: "Aether Technologies Review", time: "04:30 PM", participants: ["S. Ray", "J. Kapoor"], link: "https://meet.anveshakhub.com/aether-review" }
  ],
  notifications: [
    { id: "not-1", title: "High Memory Threshold", message: "OpenSearch memory utilization exceeds 85%.", category: "CRITICAL", read: false },
    { id: "not-2", title: "Pending Document Appeal", message: "Techno-India submitted appeals for certificate verification.", category: "ACTION", read: false },
    { id: "not-3", title: "Backup Succeeded", message: "Database backup snapshot successfully synced to MinIO.", category: "INFO", read: true }
  ]
};

export async function GET() {
  try {
    /*
     * API Integration & Security Check Point:
     * const sessionToken = request.headers.get("Authorization");
     * if (!sessionToken) return new Response("Unauthorized", { status: 401 });
     *
     * Database Action:
     * const dbKpis = await prisma.organization.findMany(...);
     * const dbServices = await prisma.systemHealth.findMany();
     */
    return NextResponse.json(mockDashboardData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
